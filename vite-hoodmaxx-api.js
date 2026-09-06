import { loadEnv } from "vite";
import { processHoodmaxx } from "./lib/hoodmaxx-core.js";

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

  let body;
  try {
    body = await readJsonBody(req, 8 * 1024 * 1024);
  } catch (err) {
    sendJson(res, err.status || 400, { error: err.message });
    return;
  }

  const { status, payload } = await processHoodmaxx(body, env);
  sendJson(res, status, payload);
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
