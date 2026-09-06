import { processHoodmaxx } from "../lib/hoodmaxx-core.js";

export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST only" });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = body ? JSON.parse(body) : {};
    } catch {
      res.status(400).json({ error: "invalid json" });
      return;
    }
  }

  try {
    const { status, payload } = await processHoodmaxx(body, process.env);
    res.status(status).json(payload);
  } catch (err) {
    console.error("hoodmaxx failed", err);
    res.status(500).json({ error: err.message || "hoodmaxx failed" });
  }
}
