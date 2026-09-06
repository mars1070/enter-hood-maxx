import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { IMG } from "./assets";
import Tape from "./Tape";

const FRAMES = [
  { n: "01", title: "THE DISCOVERY", img: IMG.CCTV, tape: "WE FOUND THE HOOD.", line: "A hooded figure. A green glow. A feeling we couldn't explain." },
  { n: "02", title: "THE CONVERSION", img: IMG.CULT1, tape: "NORMAL WAS NEVER AN OPTION.", line: "One look at the hood and the old life stopped making sense." },
  { n: "03", title: "THE MAXXING", img: IMG.STOCK_FLOOR, tape: "MAXIMUM HOOD ACHIEVED.", line: "Stocks, charts, memes, animals — everything maxxed at once." },
  { n: "04", title: "THE CULT", img: IMG.CROWD, tape: "YOU ARE ONE OF US NOW.", line: "There was never a choice. Only the hood." },
];

export default function Lore() {
  const wrap = useRef(null);
  const pin = useRef(null);
  const track = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const getX = () => {
        const el = track.current;
        if (!el) return 0;
        return -(el.scrollWidth - window.innerWidth);
      };

      gsap.to(track.current, {
        x: getX,
        ease: "none",
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: () => `+=${Math.max(track.current.scrollWidth - window.innerWidth, window.innerHeight)}`,
          pin: wrap.current,
          pinSpacing: true,
          pinType: "transform",
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <section id="lore" ref={wrap} className="relative z-0 bg-hood-cream overflow-hidden">
      <div ref={pin} className="relative z-0 h-screen overflow-hidden">
        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <h2 className="font-anton uppercase tracking-tightest text-hood-black leading-none" style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)" }}>
            THE LORE
          </h2>
          <span className="font-mono-hood text-xs uppercase tracking-wide-hood text-hood-black/60">
            // evidence.file — drag the scroll
          </span>
        </div>

        <div ref={track} className="flex h-full items-end gap-8 px-8 pb-10 will-change-transform" style={{ width: "max-content" }}>
          {FRAMES.map((f) => (
            <article key={f.n} className="relative h-[72vh] w-[82vw] sm:w-[56vw] lg:w-[38vw] shrink-0">
              <div className="relative h-[78%] overflow-hidden border-2 border-hood-black shadow-2xl">
                <img src={f.img} alt="" className="h-full w-full object-cover scale-110" />
                <div className="absolute inset-0 bg-black/30" />
                <span className="absolute top-3 left-3 font-mono-hood text-xs uppercase tracking-wide-hood text-hood-green bg-black/70 px-2 py-1">
                  FRAME {f.n}
                </span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Tape rotate={-3} className="text-2xl sm:text-4xl px-10 py-5">{f.tape}</Tape>
                </div>
              </div>
              <div className="mt-4 flex items-start gap-3">
                <span className="font-anton text-hood-green text-4xl leading-none">{f.n}</span>
                <div>
                  <h3 className="font-anton uppercase tracking-tightest text-hood-black text-2xl leading-none">{f.title}</h3>
                  <p className="mt-2 font-mono-hood text-sm text-hood-black/70 leading-relaxed max-w-sm">{f.line}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
