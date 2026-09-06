import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import Tape from "./Tape";

const LINES = [
  "WE DIDN'T CHOOSE THE HOOD.",
  "THE HOOD CHOSE US.",
  "WE DON'T FOLLOW THE HOOD.",
  "WE MAXX IT.",
];

export default function Manifesto() {
  const wrap = useRef(null);
  const lines = useRef([]);
  const marks = useRef([]);
  const copies = useRef([]);
  const bar = useRef(null);
  const word = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      lines.current.forEach((el, i) => {
        if (!el) return;
        const mark = marks.current[i];
        const copy = copies.current[i];

        gsap.set(mark, { scaleX: 0 });
        gsap.fromTo(
          el,
          { x: -40 },
          {
            x: 0,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              end: "top 48%",
              scrub: 1,
            },
          }
        );

        gsap.fromTo(
          mark,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 78%",
              end: "top 38%",
              scrub: 0.6,
            },
          }
        );

        gsap.fromTo(
          copy,
          { color: "#ffffff" },
          {
            color: "#050505",
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 72%",
              end: "top 40%",
              scrub: 0.6,
            },
          }
        );
      });

      gsap.fromTo(
        bar.current,
        { scaleX: 0, rotate: -18 },
        {
          scaleX: 1,
          rotate: -8,
          ease: "none",
          scrollTrigger: {
            trigger: word.current,
            start: "top 80%",
            end: "center center",
            scrub: 1,
          },
        }
      );
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <section id="manifesto" ref={wrap} className="relative bg-black py-28 sm:py-40 overflow-hidden grain">
      <div className="max-w-5xl mx-auto px-4">
        <p className="mb-12 font-mono-hood text-xs uppercase tracking-wide-hood text-hood-green text-center">
          // the.hood.manifesto
        </p>
        <div className="flex flex-col gap-8 sm:gap-12">
          {LINES.map((l, i) => (
            <h3
              key={i}
              ref={(el) => { lines.current[i] = el; }}
              className="manifesto-line font-anton uppercase tracking-tightest leading-[0.9] will-change-transform"
              style={{ fontSize: "clamp(2.2rem, 8vw, 6.5rem)" }}
            >
              <span
                ref={(el) => { marks.current[i] = el; }}
                className="manifesto-mark"
                aria-hidden
              />
              <span ref={(el) => { copies.current[i] = el; }} className="manifesto-copy">
                {l}
              </span>
            </h3>
          ))}
        </div>

        <div ref={word} className="relative mt-16 sm:mt-24 text-center">
          <h2
            className="font-anton uppercase tracking-tightest text-white leading-none"
            style={{ fontSize: "clamp(3rem, 16vw, 15rem)" }}
          >
            HOODMAXXING
          </h2>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              ref={bar}
              className="tape tape-edge w-[125%] h-[28%] sm:h-[36%] flex items-center justify-center origin-center"
              style={{ transform: "rotate(-8deg) scaleX(0)" }}
            >
              <span className="font-anton uppercase tracking-wide-hood text-black text-4xl sm:text-7xl leading-none">
                MAXXED
              </span>
            </div>
          </div>
        </div>

        <div className="mt-16 flex justify-center">
          <Tape rotate={-2} variant="white" className="text-base sm:text-xl text-black px-8 py-4">END OF TRANSMISSION</Tape>
        </div>
      </div>
    </section>
  );
}
