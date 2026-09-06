import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Copy, Check } from "lucide-react";
import { IMG } from "./assets";
import Tape from "./Tape";
import PhotoCard from "./PhotoCard";
import { BUY_URL, CHART_URL, CONTRACT, SOCIALS } from "./links";

export default function WhatIs() {
  const wrap = useRef(null);
  const photo = useRef(null);
  const copy = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        photo.current,
        { scale: 1.18 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrap.current,
            start: "top 75%",
            end: "center center",
            scrub: 1,
          },
        }
      );
      gsap.from(copy.current, {
        y: 80,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: wrap.current,
          start: "top 70%",
          end: "top 30%",
          scrub: 1,
        },
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <section id="what" ref={wrap} className="relative z-[1] bg-hood-black py-28 sm:py-40 grain">
      <div ref={copy} className="relative px-6 text-center will-change-transform">
        <p className="font-anton uppercase text-white text-2xl sm:text-5xl tracking-tightest leading-tight">
          HOODMAXXING IS THE ART OF TAKING THE HOOD TOO SERIOUSLY.
        </p>
        <p className="mt-4 font-mono-hood uppercase tracking-wide-hood text-hood-green text-xs sm:text-base">
          STOCKS. CRYPTO. MEMES. CULTURE. EVERYTHING GETS MAXXED.
        </p>
      </div>

      <div className="relative mt-20 sm:mt-28 mx-auto max-w-5xl px-4 pb-16">
        <div className="relative w-full max-w-lg mx-auto">
          <div ref={photo} className="relative will-change-transform overflow-visible">
            <PhotoCard
              src={IMG.TAPED_MOUTH}
              rotate={-1.5}
              className="aspect-[4/5] w-full overflow-visible"
              imgClassName="object-cover object-center"
            />
          </div>
          <div className="absolute inset-x-[-20%] sm:inset-x-[-28%] top-[58%] z-20 -translate-y-1/2 flex justify-center pointer-events-none">
            <Tape rotate={-3} className="text-xl sm:text-3xl px-12 py-5 whitespace-nowrap">
              THE HOOD FOUND US.
            </Tape>
          </div>
        </div>
        <div className="mt-16 flex justify-center px-2">
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(CONTRACT);
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1800);
              } catch {
                setCopied(false);
              }
            }}
            className="group flex max-w-full items-center gap-3 border-2 border-hood-green bg-black px-5 py-4 sm:px-8"
          >
            <span className="font-mono-hood text-xs uppercase tracking-wide-hood text-hood-green shrink-0">
              CA
            </span>
            <span className="font-mono-hood text-sm sm:text-base text-white truncate">
              {CONTRACT}
            </span>
            {copied ? (
              <Check className="h-6 w-6 shrink-0 text-hood-green" />
            ) : (
              <Copy className="h-6 w-6 shrink-0 text-hood-green group-hover:text-white" />
            )}
            <span className="hidden sm:inline font-anton uppercase tracking-wide-hood text-hood-green text-base">
              {copied ? "COPIED" : "COPY"}
            </span>
          </button>
        </div>

        <p className="mt-8 text-center font-anton uppercase text-white tracking-tightest" style={{ fontSize: "clamp(1.8rem, 6vw, 4.5rem)" }}>
          WE DIDN'T LOOK FOR THE HOOD.
        </p>
        <p className="mt-2 text-center font-anton uppercase text-hood-green tracking-tightest" style={{ fontSize: "clamp(1.8rem, 6vw, 4.5rem)" }}>
          IT WAS ALREADY INSIDE.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-stretch justify-center gap-3 px-2 max-w-xl mx-auto">
          <a
            href={CHART_URL}
            target={CHART_URL.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="tape-white tape-edge flex-1 text-center px-6 py-3 font-anton uppercase tracking-wide-hood text-lg sm:text-xl text-black"
          >
            CHART
          </a>
          <a
            href={BUY_URL}
            target={BUY_URL.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="tape tape-edge flex-1 text-center px-6 py-3 font-anton uppercase tracking-wide-hood text-lg sm:text-xl text-black"
          >
            BUY
          </a>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="border-2 border-hood-green px-5 py-2 font-anton uppercase tracking-wide-hood text-sm text-white hover:bg-hood-green hover:text-black transition"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
