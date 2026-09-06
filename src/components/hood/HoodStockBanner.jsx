import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
import Tape from "./Tape";

export default function HoodStockBanner() {
  const wrap = useRef(null);
  const headline = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headline.current,
        { scale: 0.86, y: 40 },
        {
          scale: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: wrap.current,
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
          },
        }
      );
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrap} className="relative bg-hood-green overflow-hidden border-y-4 border-black py-14 sm:py-20 grain">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <Tape rotate={-2} variant="white" className="text-base sm:text-2xl text-black">HOOD STOCK NOTICE</Tape>
        <h2
          ref={headline}
          className="mt-8 font-anton uppercase tracking-tightest text-black leading-[0.9] will-change-transform"
          style={{ fontSize: "clamp(2rem, 7.5vw, 5.5rem)" }}
        >
          HOODMAXXING IS PAIRED WITH <span className="underline decoration-4">HOOD STOCK</span>
          <br />
          AND REWARDS IN HOOD STOCK ..
        </h2>
        <p className="mt-6 font-anton uppercase tracking-wide-hood text-black text-3xl sm:text-6xl flicker">
          ABSOLUTELY HOODMAXXING
        </p>
      </div>
      <div className="mt-12 bg-black text-hood-green overflow-hidden">
        <div className="marquee py-1.5 font-anton uppercase tracking-wide-hood text-sm">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="px-4">
              HOOD STOCK · PAIRED WITH HOODMAXXING · REWARDS IN HOOD STOCK · ABSOLUTELY HOODMAXXING ·&nbsp;
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
