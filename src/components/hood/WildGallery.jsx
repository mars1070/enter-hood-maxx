import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { IMG } from "./assets";
import Tape from "./Tape";

const ITEMS = [
  { img: IMG.KITCHEN_CANDID, cap: "SPOTTED MAXXING", tape: "HOODMAXXING", tv: "green", r: -2, ar: "aspect-[4/5]" },
  { img: IMG.STOCK_FLOOR, cap: "HOOD ACTIVITY DETECTED", r: 3, ar: "aspect-[4/5]" },
  { img: IMG.BULL_ILLUSTRATION, cap: "UNREASONABLE LEVELS OF HOOD", tape: "100% HOOD", tv: "white", r: -1, ar: "aspect-square" },
  { img: IMG.CCTV, cap: "HOOD DETECTED 03:14", r: 2, ar: "aspect-[4/3]" },
  { img: IMG.CULT1, cap: "HE UNDERSTANDS", tape: "FULLY MAXXED", tv: "green", r: -3, ar: "aspect-square" },
  { img: IMG.PAPARAZZI, cap: "SHE HAS SEEN THE HOOD", r: 1, ar: "aspect-[3/2]" },
  { img: IMG.CZ_PORTRAIT, cap: "THE MAXXING NEVER STOPS", r: -2, ar: "aspect-square" },
  { img: IMG.CROWD, cap: "WE ARE ALL HOOD", tape: "JOIN THE CULT", tv: "white", r: 1, ar: "aspect-[16/9]" },
  { img: IMG.OLD_SCAN, cap: "ARCHIVED // 2004", r: -1, ar: "aspect-square" },
  { img: IMG.PURPLE_SHAPE, cap: "MAXX SYMBOL", r: -2, ar: "aspect-square" },
  { img: IMG.P_CHROME, cap: "HOODMARK", r: 1, ar: "aspect-square" },
  { img: IMG.CULT2, cap: "HOOD DISCIPLE #004", tape: "CERTIFIED", tv: "green", r: -1, ar: "aspect-square" },
  { img: IMG.ROBOT_YELLOW, cap: "UNIT H-00D // TAPED", tape: "MAXX BOT", tv: "green", r: 3, ar: "aspect-[4/5]" },
  { img: IMG.ICE_CAT, cap: "FROZEN. STILL MAXXED.", tape: "COLD HOOD", tv: "white", r: -2, ar: "aspect-square" },
  { img: IMG.HOUSE_3D, cap: "RECOVERED FOOTAGE", tape: "LEAKED", tv: "red", r: 2, ar: "aspect-[4/3]" },
  { img: IMG.HOUSE_CARTOON, cap: "HOME IS WHERE THE HOOD IS", r: -1, ar: "aspect-square" },
  { img: IMG.HOODED_CAT, cap: "EYES TAPED. VISION MAXXED.", tape: "SEES NOTHING. KNOWS ALL.", tv: "green", r: 1, ar: "aspect-[4/5]" },
  { img: IMG.IRIDESCENT, cap: "GOO FORM: MAXXED", tape: "TOO MUCH HOOD", tv: "green", r: -3, ar: "aspect-square" },
  { img: IMG.PROPELLER_CAT, cap: "MAXX ALTITUDE ACHIEVED", tape: "AIRBORNE HOOD", tv: "white", r: 2, ar: "aspect-square" },
];

export default function WildGallery() {
  const wrap = useRef(null);
  const cards = useRef([]);
  const [notify, setNotify] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setNotify(true);
      setTimeout(() => setNotify(false), 2200);
    }, 9000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cards.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { clipPath: "inset(100% 0 0 0)", y: 60 },
          {
            clipPath: "inset(0% 0 0 0)",
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              end: "top 55%",
              scrub: 0.8,
            },
          }
        );
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <section id="wild" ref={wrap} className="relative bg-hood-black py-24 sm:py-32 overflow-hidden grain">
      <div className="px-4 sm:px-8 mb-12">
        <Tape rotate={-2} className="text-base sm:text-2xl">MEME MUSEUM // OPEN 24/7</Tape>
        <h2 className="mt-6 font-anton uppercase tracking-tightest text-white leading-none" style={{ fontSize: "clamp(2.5rem, 10vw, 9rem)" }}>
          IN THE WILD
        </h2>
        <p className="mt-3 font-mono-hood text-xs sm:text-sm uppercase tracking-wide-hood text-hood-green">
          // 19 exhibits — some recovered, some leaked, all maxxed
        </p>
      </div>

      <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 px-4 sm:px-8 [column-fill:_balance]">
        {ITEMS.map((it, i) => (
          <div
            key={i}
            ref={(el) => { cards.current[i] = el; }}
            className={`mb-4 break-inside-avoid relative overflow-hidden border-2 border-white/10 shadow-xl group ${it.ar}`}
            style={{ transform: `rotate(${it.r}deg)` }}
          >
            <img src={it.img} alt="" className="w-full h-full object-cover" />
            {it.tape && (
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none">
                <Tape rotate={it.r > 0 ? -3 : 3} variant={it.tv} className={it.tv === "white" ? "text-sm sm:text-lg text-black px-7 py-3" : "text-sm sm:text-lg px-7 py-3"}>
                  {it.tape}
                </Tape>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black/75 px-2 py-1 opacity-0 group-hover:opacity-100 transition">
              <span className="font-mono-hood text-[10px] uppercase tracking-wide-hood text-hood-green">
                {it.cap}
              </span>
            </div>
          </div>
        ))}
      </div>

      {notify && (
        <div className="fixed bottom-6 left-6 z-[75] tape tape-edge px-7 py-3 font-anton uppercase tracking-wide-hood text-base text-black flicker" style={{ transform: "rotate(-2deg)" }}>
          ⚠ HOODMAXXING DETECTED
        </div>
      )}
    </section>
  );
}
