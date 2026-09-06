import React, { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import Tape from "./Tape";

const PLACEMENTS = [
  { id: "mouth", label: "MOUTH" },
  { id: "eyes", label: "EYES" },
  { id: "slash", label: "SLASH" },
];

const MAX_EDGE = 1280;
const REQUEST_TIMEOUT_MS = 75000;

async function decodeImage(file) {
  // createImageBitmap honours EXIF orientation, so phone photos stay upright.
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      /* Safari < 17 and HEIC fall through to the <img> path below. */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("unreadable image"));
      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function fileToPayload(file) {
  const bitmap = await decodeImage(file);
  const sw = bitmap.width;
  const sh = bitmap.height;
  if (!sw || !sh) throw new Error("unreadable image");

  const scale = Math.min(1, MAX_EDGE / Math.max(sw, sh));
  const w = Math.max(1, Math.round(sw * scale));
  const h = Math.max(1, Math.round(sh * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  // JPEG has no alpha: paint white first so transparent PNGs don't go black.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();

  const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
  const image = dataUrl.split(",")[1];
  if (!image) throw new Error("could not read that photo");
  return { preview: dataUrl, image, mimeType: "image/jpeg" };
}

/** Vercel returns HTML on gateway errors, so never trust the body to be JSON. */
async function readJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { error: res.ok ? "bad response from the tape machine" : `server error ${res.status}` };
  }
}

export default function HoodmaxxStudio() {
  const inputRef = useRef(null);
  const [placement, setPlacement] = useState("mouth");
  const [source, setSource] = useState(null);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);

  const onFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("DROP A PHOTO, NOT A PDF.");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError("PHOTO TOO HEAVY. UNDER 25 MB.");
      return;
    }
    setError("");
    setResult(null);
    try {
      setSource(await fileToPayload(file));
    } catch (err) {
      setSource(null);
      const heic = /\.hei[cf]$/i.test(file.name) || /hei[cf]/i.test(file.type);
      setError(heic ? "HEIC NOT SUPPORTED. EXPORT AS JPG OR PNG." : String(err.message || err).toUpperCase());
    }
  }, []);

  const generate = async () => {
    if (!source || busy) return;
    setBusy(true);
    setError("");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch("/api/hoodmaxx", {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: source.image,
          mimeType: source.mimeType,
          placement,
        }),
      });
      const data = await readJson(res);
      if (!res.ok) throw new Error(data.error || "tape jammed");
      if (!data.image) throw new Error("no image came back — hit maxx again");
      setResult(`data:${data.mimeType || "image/png"};base64,${data.image}`);
    } catch (err) {
      const msg = err.name === "AbortError" ? "took too long — hit maxx again" : err.message || err;
      setError(String(msg).toUpperCase());
    } finally {
      clearTimeout(timer);
      setBusy(false);
    }
  };

  const download = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = "hoodmaxxed.jpg";
    a.click();
  };

  return (
    <section id="taped" className="relative bg-hood-black py-24 sm:py-32 overflow-hidden grain">
      <div className="px-4 sm:px-8 mb-12">
        <Tape rotate={-2} className="text-base sm:text-2xl">PFP LAB // NANO BANANA 3.1</Tape>
        <h2
          className="mt-6 font-anton uppercase tracking-tightest text-white leading-none"
          style={{ fontSize: "clamp(2.5rem, 10vw, 9rem)" }}
        >
          GET TAPED
        </h2>
        <p className="mt-3 font-mono-hood text-xs sm:text-sm uppercase tracking-wide-hood text-hood-green max-w-xl">
          // drop your face. we add the green. you leave maxxed.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {PLACEMENTS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlacement(p.id)}
              className={
                placement === p.id
                  ? "tape tape-edge px-6 py-3 font-anton uppercase tracking-wide-hood text-black text-base"
                  : "border-2 border-hood-green/40 px-5 py-2 font-anton uppercase tracking-wide-hood text-white/70 text-sm hover:text-hood-green hover:border-hood-green"
              }
              style={placement === p.id ? { transform: "rotate(-1deg)" } : undefined}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2 items-start">
          <DropPolaroid
            label="EVIDENCE IN"
            src={source?.preview}
            drag={drag}
            onDrag={(v) => setDrag(v)}
            onFile={onFile}
            onClick={() => inputRef.current?.click()}
          />
          <ResultPolaroid src={result} busy={busy} />
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
        />

        {error && (
          <p className="mt-6 font-mono-hood text-xs uppercase tracking-wide-hood text-hood-red">
            ⚠ {error}
          </p>
        )}

        <div className="mt-10 flex flex-wrap gap-4">
          <motion.button
            type="button"
            disabled={!source || busy}
            onClick={generate}
            whileHover={{ scale: source && !busy ? 1.04 : 1 }}
            whileTap={{ scale: source && !busy ? 0.97 : 1 }}
            className="tape tape-edge px-8 py-4 font-anton uppercase tracking-wide-hood text-xl sm:text-2xl text-black disabled:opacity-40"
            style={{ transform: "rotate(-1.5deg)" }}
          >
            {busy ? "MAXXING…" : "MAXX THIS FACE"}
          </motion.button>
          {result && (
            <button
              type="button"
              onClick={download}
              className="border-2 border-hood-green px-8 py-4 font-anton uppercase tracking-wide-hood text-xl text-hood-green hover:bg-hood-green hover:text-black transition"
            >
              SAVE FILE
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function DropPolaroid({ label, src, drag, onDrag, onFile, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      onDragOver={(e) => {
        e.preventDefault();
        onDrag(true);
      }}
      onDragLeave={() => onDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        onDrag(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onFile(file);
      }}
      className={`relative aspect-square w-full overflow-hidden border-2 text-left ${
        drag ? "border-hood-green bg-hood-green/10" : "border-white/20 bg-black"
      } shadow-[0_18px_40px_rgba(0,0,0,0.5)]`}
      style={{ transform: "rotate(-1.5deg)" }}
    >
      {src ? (
        <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <Tape rotate={2} className="text-sm sm:text-base mb-6">DROP PFP</Tape>
          <p className="font-anton uppercase tracking-tightest text-white text-3xl sm:text-5xl leading-none">
            YOUR FACE
          </p>
          <p className="mt-3 font-mono-hood text-[10px] uppercase tracking-wide-hood text-hood-green">
            click or drop a photo
          </p>
        </div>
      )}
      <span className="absolute bottom-0 left-0 right-0 bg-black/75 px-3 py-2 font-mono-hood text-[10px] uppercase tracking-wide-hood text-hood-green">
        {label}
      </span>
    </button>
  );
}

function ResultPolaroid({ src, busy }) {
  return (
    <div
      className="relative aspect-square w-full overflow-hidden border-2 border-white/20 bg-black shadow-[0_18px_40px_rgba(0,0,0,0.5)]"
      style={{ transform: "rotate(1.8deg)" }}
    >
      {src ? (
        <img src={src} alt="Hoodmaxxed" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p className="font-anton uppercase tracking-tightest text-white/40 text-3xl sm:text-5xl leading-none">
            OUTPUT
          </p>
          <p className="mt-3 font-mono-hood text-[10px] uppercase tracking-wide-hood text-white/40">
            waiting for tape
          </p>
        </div>
      )}
      {busy && (
        <div className="absolute inset-0 z-10 bg-black/55 flex flex-col items-center justify-center">
          <div className="absolute inset-x-0 h-10 scanline animate-pulse" style={{ top: "40%" }} />
          <Tape rotate={-2} className="text-base flicker">APPLYING GREEN</Tape>
        </div>
      )}
      <span className="absolute bottom-0 left-0 right-0 bg-black/75 px-3 py-2 font-mono-hood text-[10px] uppercase tracking-wide-hood text-hood-green">
        {src ? "HOODMAXXED" : "EVIDENCE OUT"}
      </span>
    </div>
  );
}
