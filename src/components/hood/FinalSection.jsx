import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { IMG } from "./assets";
import Tape from "./Tape";

export default function FinalSection() {
  const wrap = useRef(null);
  const img = useRef(null);
  const copy = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        img.current,
        { scale: 1.35, filter: "grayscale(1) brightness(0.5)" },
        {
          scale: 1,
          filter: "grayscale(0.4) brightness(0.85)",
          ease: "none",
          scrollTrigger: {
            trigger: wrap.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
      gsap.fromTo(
        copy.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrap.current,
            start: "top 70%",
            end: "top 25%",
            scrub: 1,
          },
        }
      );
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <section id="join" ref={wrap} className="relative bg-hood-black overflow-hidden">
      <div className="relative h-[90vh] sm:h-screen w-full overflow-hidden">
        <img ref={img} src={IMG.FINAL_HOOD} alt="" className="w-full h-full object-cover will-change-transform" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />

        <div className="absolute top-[12%] left-0 right-0 flex justify-center px-4">
          <Tape rotate={-2} className="text-2xl sm:text-5xl px-12 py-6">WELCOME TO THE HOOD.</Tape>
        </div>

        <div ref={copy} className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 will-change-transform">
          <h2
            className="font-anton uppercase tracking-tightest text-white leading-[0.85] text-glow-green"
            style={{ fontSize: "clamp(3rem, 13vw, 12rem)" }}
          >
            MAXX OR BE
            <br />
            <span className="text-hood-green">MAXXED.</span>
          </h2>
          <a
            href="#taped"
            className="mt-10 tape tape-edge px-10 py-5 font-anton uppercase tracking-wide-hood text-xl sm:text-3xl text-black flicker"
            style={{ transform: "rotate(-1.5deg)" }}
          >
            GET TAPED →
          </a>
        </div>
      </div>

      <footer className="relative bg-black border-t-2 border-hood-green py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-anton uppercase tracking-wide-hood text-white text-xl">
            HOODMAXXING<span className="text-hood-green">.</span>
          </span>
          <div className="flex flex-wrap items-center justify-center gap-4 font-mono-hood text-[10px] uppercase tracking-wide-hood text-white/50">
            <span>THE HOOD CULT</span>
            <span className="text-hood-green">·</span>
            <span>MAX THE HOOD</span>
            <span className="text-hood-green">·</span>
            <span>HOOD OR NOTHING</span>
            <span className="text-hood-green">·</span>
            <span>NO ROADMAP. ONLY HOOD.</span>
          </div>
          <span className="font-mono-hood text-[10px] uppercase tracking-wide-hood text-white/30">
            © {new Date().getFullYear()} // not financial advice. barely advice.
          </span>
        </div>
      </footer>
    </section>
  );
}
