import { loadEnv } from "vite";

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

function readJsonBody(req, limitBytes) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limitBytes) {
        reject(Object.assign(new Error("payload too large"), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(Object.assign(new Error("invalid json"), { status: 400 }));
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

async function handleHoodmaxx(req, res, env) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "POST only" });
    return;
  }

  const apiKey = env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    sendJson(res, 503, {
      error: "GEMINI_API_KEY missing in .env.local",
    });
    return;
  }

  let body;
  try {
    body = await readJsonBody(req, 8 * 1024 * 1024);
  } catch (err) {
    sendJson(res, err.status || 400, { error: err.message });
    return;
  }

  const { image, mimeType, placement } = body;
  if (!image || typeof image !== "string") {
    sendJson(res, 400, { error: "image required" });
    return;
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
    sendJson(res, geminiRes.status, { error: msg });
    return;
  }

  const parts = data?.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p) => p.inlineData?.data);
  if (!imagePart) {
    const block = data?.promptFeedback?.blockReason;
    sendJson(res, 422, {
      error: block
        ? `blocked: ${block}`
        : "Gemini returned no image",
    });
    return;
  }

  sendJson(res, 200, {
    mimeType: imagePart.inlineData.mimeType || "image/png",
    image: imagePart.inlineData.data,
  });
}

export default function hoodmaxxApi() {
  return {
    name: "hoodmaxx-api",
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), "");
      server.middlewares.use(async (req, res, next) => {
        const path = req.url?.split("?")[0];
        if (path !== "/api/hoodmaxx") return next();
        try {
          await handleHoodmaxx(req, res, env);
        } catch (err) {
          sendJson(res, 500, { error: err.message || "hoodmaxx failed" });
        }
      });
    },
    configurePreviewServer(server) {
      const env = loadEnv("production", process.cwd(), "");
      server.middlewares.use(async (req, res, next) => {
        const path = req.url?.split("?")[0];
        if (path !== "/api/hoodmaxx") return next();
        try {
          await handleHoodmaxx(req, res, env);
        } catch (err) {
          sendJson(res, 500, { error: err.message || "hoodmaxx failed" });
        }
      });
    },
  };
}
