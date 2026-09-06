const PLACEMENTS = {
  mouth:
    "Cover the mouth with one wide horizontal strip of tape. The rest of the face stays fully visible.",
  eyes:
    "Cover the eyes with one wide horizontal strip of tape, like a censored identity photo. The mouth and the rest of the face stay visible.",
  slash:
    "One long diagonal strip of tape across the face, from upper left to lower right, like evidence tape on a mugshot. Keep the person recognizable.",
};

function hoodPrompt(placement) {
  const place = PLACEMENTS[placement] || PLACEMENTS.mouth;
  return [
    "Edit this photograph. Keep the exact same person, face, identity, pose, clothing, background, and camera angle. Photorealistic. Do not cartoonize. Do not add extra people. Do not change age, gender, or facial structure.",
    place,
    "The tape is physical neon Robinhood / money-green duct tape (bright #00C853, glossy, wrinkled, slightly translucent at torn jagged edges). It looks stuck onto a real photo, not a digital sticker or UI overlay.",
    "Print bold condensed black uppercase letters on the tape, Anton / Impact style, slightly imperfect like a label maker: HOODMAXXING",
    "Optional second smaller strip somewhere on the photo with FULLY MAXXED.",
    "Add light analog grain and a paparazzi / leaked-file energy. High contrast. No watermarks. No extra logos besides the tape lettering.",
  ].join(" ");
}

/**
 * Server-only Gemini image edit. Never call from the browser.
 * Reads GEMINI_API_KEY from env — never VITE_ prefixed.
 */
export async function processHoodmaxx(body, env) {
  const apiKey = env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return {
      status: 503,
      payload: { error: "GEMINI_API_KEY missing on the server" },
    };
  }

  const { image, mimeType, placement } = body || {};
  if (!image || typeof image !== "string") {
    return { status: 400, payload: { error: "image required" } };
  }

  const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
  const mime = allowed.has(mimeType) ? mimeType : "image/jpeg";
  const model = env.GEMINI_IMAGE_MODEL?.trim() || "gemini-3.1-flash-image";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

  const geminiRes = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: hoodPrompt(placement) },
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

  const data = await geminiRes.json().catch(() => ({}));
  if (!geminiRes.ok) {
    const msg =
      data?.error?.message ||
      data?.error?.status ||
      `Gemini ${geminiRes.status}`;
    return { status: geminiRes.status, payload: { error: msg } };
  }

  const parts = data?.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p) => p.inlineData?.data);
  if (!imagePart) {
    const block = data?.promptFeedback?.blockReason;
    return {
      status: 422,
      payload: {
        error: block ? `blocked: ${block}` : "Gemini returned no image",
      },
    };
  }

  return {
    status: 200,
    payload: {
      mimeType: imagePart.inlineData.mimeType || "image/png",
      image: imagePart.inlineData.data,
    },
  };
}
