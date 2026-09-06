import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IMG } from "./assets";
import Tape from "./Tape";

const COMMANDMENTS = [
  { n: "I", text: "THOU SHALT MAXX THE HOOD", img: IMG.STOCK_FLOOR, tape: "CMD.01" },
  { n: "II", text: "THOU SHALT NOT SELL THE MEME", img: IMG.CULT2, tape: "CMD.02" },
  { n: "III", text: "THOU SHALT RESPECT THE GREEN", img: IMG.DAVID_BUST, tape: "CMD.03" },
  { n: "IV", text: "THOU SHALT HOODMAXX", img: IMG.CCTV, tape: "CMD.04" },
  { n: "V", text: "THERE IS NO UNMAXXED STATE", img: IMG.CROWD, tape: "CMD.05" },
];

export default function Commandments() {
  const wrap = useRef(null);
  const panels = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = panels.current.filter(Boolean);
      els.forEach((panel, i) => {
        if (i === els.length - 1) return;
        ScrollTrigger.create({
          trigger: panel,
          start: "top top",
          endTrigger: els[els.length - 1],
          end: "bottom bottom",
          pin: true,
          pinSpacing: false,
          pinType: "transform",
          anticipatePin: 1,
        });
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <section id="commandments" ref={wrap} className="relative bg-hood-cream">
      <div className="px-4 sm:px-8 py-16 text-center">
        <Tape rotate={-2} variant="red" className="text-base sm:text-2xl text-white">SACRED ARTIFACTS</Tape>
        <h2 className="mt-6 font-anton uppercase tracking-tightest text-hood-black leading-none" style={{ fontSize: "clamp(2.5rem, 9vw, 8rem)" }}>
          THE COMMANDMENTS
        </h2>
      </div>

      {COMMANDMENTS.map((c, i) => (
        <article
          key={c.n}
          ref={(el) => { panels.current[i] = el; }}
          className="relative h-screen overflow-hidden border-y-2 border-hood-black"
        >
          <img src={c.img} alt="" className="absolute inset-0 h-full w-full object-cover brightness-75" />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute top-6 left-6">
            <Tape rotate={-3} className="text-sm sm:text-base">{c.tape}</Tape>
          </div>
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">
            <span className="font-anton text-hood-green leading-none opacity-90" style={{ fontSize: "clamp(5rem, 18vw, 14rem)" }}>
              {c.n}
            </span>
            <h3 className="mt-2 font-anton uppercase tracking-tightest text-white leading-[0.9]" style={{ fontSize: "clamp(1.8rem, 6vw, 4.5rem)" }}>
              {c.text}
            </h3>
          </div>
        </article>
      ))}
    </section>
  );
}
