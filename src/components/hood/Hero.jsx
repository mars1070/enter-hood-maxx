import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { IMG } from "./assets";
import Tape from "./Tape";

const TICKER = "HOODMAXXING · MAX THE HOOD · HOOD OR NOTHING · WELCOME TO THE HOOD · BELIEVE IN THE HOOD · MAXIMUM HOOD · HOOD APPROVED · JOIN THE CULT · TRADE HOLD MAXX REPEAT";

const FLOATS = [
  { src: IMG.CCTV, className: "top-[6%] left-[2%] w-[32%] sm:w-[20%] aspect-[4/3]", rotate: -8, tape: "LEAKED", dx: -180, dy: -80 },
  { src: IMG.STOCK_FLOOR, className: "top-[8%] right-[3%] w-[34%] sm:w-[22%] aspect-[4/5]", rotate: 7, tape: "HOOD ACTIVITY", dx: 200, dy: -60 },
  { src: IMG.HOOD_PORTRAIT, className: "bottom-[12%] left-[5%] w-[30%] sm:w-[19%] aspect-square", rotate: 5, dx: -160, dy: 140 },
  { src: IMG.PAPARAZZI, className: "bottom-[12%] right-[6%] w-[32%] sm:w-[21%] aspect-[3/2]", rotate: -6, tape: "SPOTTED", white: true, dx: 180, dy: 120 },
  { src: IMG.DAVID_BUST, className: "top-[36%] left-[0.5%] w-[22%] sm:w-[15%] aspect-square hidden sm:block", rotate: 10, dx: -220, dy: 40 },
  { src: IMG.CULT1, className: "top-[40%] right-[0.5%] w-[22%] sm:w-[15%] aspect-square hidden sm:block", rotate: -9, dx: 220, dy: 50 },
  { src: IMG.DAVID_BUST_CLEAN, className: "top-[20%] left-[36%] w-[18%] aspect-square hidden lg:block", rotate: -4, dx: 0, dy: -160 },
];

export default function Hero() {
  const wrap = useRef(null);
  const pin = useRef(null);
  const title = useRef(null);
  const bg = useRef(null);
  const veil = useRef(null);
  const meta = useRef(null);
  const photos = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: "+=220%",
          pin: pin.current,
          pinSpacing: true,
          pinType: "transform",
          scrub: 1,
          anticipatePin: 1,
        },
      });

      tl.fromTo(bg.current, { scale: 1.28, filter: "brightness(0.4)" }, { scale: 1, filter: "brightness(1)", ease: "none" }, 0);
      tl.fromTo(veil.current, { opacity: 0.42 }, { opacity: 0, ease: "none" }, 0);
      tl.fromTo(
        title.current,
        {
          scale: 1,
          color: "#ffffff",
          webkitTextFillColor: "#ffffff",
        },
        {
          scale: 9,
          color: "rgba(255,255,255,0)",
          webkitTextFillColor: "rgba(255,255,255,0)",
          ease: "none",
          transformOrigin: "50% 48%",
        },
        0
      );
      tl.to(meta.current, { opacity: 0, y: -24, ease: "none" }, 0);

      photos.current.forEach((el, i) => {
        if (!el) return;
        const f = FLOATS[i];
        tl.to(el, { x: f.dx, y: f.dy, rotate: f.rotate * 2.2, opacity: 0, ease: "none" }, 0);
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrap} className="relative z-[1] bg-hood-black">
      <div ref={pin} className="relative h-screen w-full overflow-hidden">
        <img
          ref={bg}
          src={IMG.HERO_BANNER}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div ref={veil} className="absolute inset-0 bg-black" />

        {FLOATS.map((f, i) => (
          <div
            key={i}
            ref={(el) => { photos.current[i] = el; }}
            className={`absolute z-10 overflow-hidden border-2 border-black/70 shadow-2xl ${f.className}`}
            style={{ transform: `rotate(${f.rotate}deg)` }}
          >
            <img src={f.src} alt="" className="h-full w-full object-cover" />
            {f.tape && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Tape rotate={f.rotate > 0 ? -3 : 3} variant={f.white ? "white" : "green"} className={f.white ? "text-sm sm:text-base text-black" : "text-sm sm:text-base"}>
                  {f.tape}
                </Tape>
              </div>
            )}
          </div>
        ))}

        <div className="relative z-20 flex h-full flex-col items-center justify-center px-4 text-center">
          <div ref={meta} className="relative z-20 flex flex-col items-center">
            <Tape rotate={-2} className="text-sm sm:text-xl">THE HOOD CULT // EST. NOW</Tape>
            <p className="mt-3 font-anton uppercase tracking-wide-hood text-hood-green text-xl sm:text-3xl">
              THE HOOD CULT
            </p>
            <p className="mt-3 font-mono-hood text-[11px] sm:text-sm uppercase tracking-wide-hood text-white/70">
              MAXIMUM HOOD. MINIMUM EXPLANATION.
            </p>
          </div>
          <h1
            ref={title}
            className="hero-title pointer-events-none absolute inset-0 z-30 flex items-center justify-center font-anton uppercase leading-[0.78] will-change-transform"
            style={{ fontSize: "clamp(3.2rem, 14vw, 14rem)" }}
          >
            HOODMAXXING
          </h1>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-40 bg-hood-green text-black border-t-2 border-black overflow-hidden">
          <div className="marquee py-2 font-anton uppercase tracking-wide-hood text-sm sm:text-base">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} className="inline-flex shrink-0" aria-hidden={i === 1}>
                {Array.from({ length: 3 }).map((__, j) => (
                  <span key={j} className="px-5">
                    {TICKER}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
