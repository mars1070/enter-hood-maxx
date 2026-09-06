const PLACEMENTS = {
  mouth: "Cover the mouth with one wide horizontal strip of tape. The rest of the face stays fully visible.",
  eyes: "Cover the eyes with one wide horizontal strip of tape, like a censor bar on a magazine cover. The mouth and the rest of the face stay visible.",
  slash: "One long diagonal strip of tape across the face, from upper left to lower right, like a sticker slapped on a poster. Keep the person recognizable.",
};

const RETRYABLE_STATUS = new Set([408, 409, 429, 500, 502, 503, 504]);
const MAX_ATTEMPTS = 3;
const ATTEMPT_TIMEOUT_MS = 22000;
const TOTAL_BUDGET_MS = 50000;
const MAX_IMAGE_BASE64 = 10 * 1024 * 1024;
const DEFAULT_MODEL = "gemini-3.1-flash-image";
const FALLBACK_MODEL = "gemini-2.5-flash-image";

function hoodPrompt(placement) {
  const place = PLACEMENTS[placement] || PLACEMENTS.mouth;
  return [
    "Edit this photograph. Keep the exact same person, face, identity, pose, clothing, background, and camera angle. Photorealistic. Do not cartoonize. Do not add extra people. Do not change age, gender, or facial structure.",
    place,
    "The tape is physical neon Robinhood / money-green duct tape (bright #00C853, glossy, wrinkled, slightly translucent at torn jagged edges). It looks stuck onto a real photo, not a digital sticker or UI overlay.",
    "Print bold condensed black uppercase letters on the tape, Anton / Impact style, slightly imperfect like a label maker: HOODMAXXING",
    "Optional second smaller strip somewhere on the photo with FULLY MAXXED.",
    "Add light analog film grain and a bright flash-photography street-poster energy. High contrast. No watermarks. No extra logos besides the tape lettering.",
  ].join(" ");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Gemini sometimes answers with a text refusal instead of an image. Surface it. */
function textFromParts(parts) {
  return parts
    .map((p) => (typeof p.text === "string" ? p.text.trim() : ""))
    .filter(Boolean)
    .join(" ")
    .slice(0, 240);
}

async function callGemini({ apiKey, model, prompt, mime, image, timeoutMs }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              { inlineData: { mimeType: mime, data: image } },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
          imageConfig: { aspectRatio: "1:1" },
        },
      }),
    });
    const data = await res.json().catch(() => ({}));
    return { res, data };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Server-only Gemini image edit. Never call from the browser.
 * Reads GEMINI_API_KEY from env — never VITE_ prefixed.
 *
 * Gemini drops the image on roughly one call in five (soft refusal, transient
 * 5xx, or overload), so every attempt is retried with backoff and the run falls
 * back to a second model before giving up.
 */
export async function processHoodmaxx(body, env) {
  const apiKey = env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return { status: 503, payload: { error: "GEMINI_API_KEY missing on the server" } };
  }

  const { image, mimeType, placement } = body || {};
  if (!image || typeof image !== "string") {
    return { status: 400, payload: { error: "image required" } };
  }
  if (image.length > MAX_IMAGE_BASE64) {
    return { status: 413, payload: { error: "image too large — use a photo under 7 MB" } };
  }

  const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
  const mime = allowed.has(mimeType) ? mimeType : "image/jpeg";
  const prompt = hoodPrompt(placement);

  const primary = env.GEMINI_IMAGE_MODEL?.trim() || DEFAULT_MODEL;
  const fallback = env.GEMINI_IMAGE_MODEL_FALLBACK?.trim() || FALLBACK_MODEL;
  const models = primary === fallback ? [primary] : [primary, fallback];

  const startedAt = Date.now();
  const remaining = () => TOTAL_BUDGET_MS - (Date.now() - startedAt);
  let lastError = "Gemini returned no image";
  let lastStatus = 422;

  for (const model of models) {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      const budget = remaining();
      if (budget < 4000) {
        return { status: 504, payload: { error: "Gemini took too long — try again" } };
      }

      let res;
      let data;
      try {
        ({ res, data } = await callGemini({
          apiKey,
          model,
          prompt,
          mime,
          image,
          timeoutMs: Math.min(ATTEMPT_TIMEOUT_MS, budget - 1000),
        }));
      } catch (err) {
        lastStatus = err.name === "AbortError" ? 504 : 502;
        lastError = err.name === "AbortError" ? "Gemini timed out" : `network error: ${err.message}`;
        await sleep(400 * attempt);
        continue;
      }

      if (!res.ok) {
        lastStatus = res.status;
        lastError = data?.error?.message || data?.error?.status || `Gemini ${res.status}`;
        if (!RETRYABLE_STATUS.has(res.status)) break;
        await sleep(500 * attempt);
        continue;
      }

      const parts = data?.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find((p) => p.inlineData?.data);
      if (imagePart) {
        return {
          status: 200,
          payload: {
            mimeType: imagePart.inlineData.mimeType || "image/png",
            image: imagePart.inlineData.data,
          },
        };
      }

      // 200 OK with no image: a soft refusal or an empty candidate. Retryable.
      const block = data?.promptFeedback?.blockReason || data?.candidates?.[0]?.finishReason;
      const refusal = textFromParts(parts);
      lastStatus = 422;
      lastError = refusal || (block ? `blocked: ${block}` : "Gemini returned no image");
      await sleep(500 * attempt);
    }
  }

  return { status: lastStatus, payload: { error: lastError } };
}
