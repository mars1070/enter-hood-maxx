import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { IMG } from "./assets";
import Tape from "./Tape";

const MEMBERS = [
  { id: "001", img: IMG.HOOD_PORTRAIT, title: "FULLY MAXXED", quote: "saw the hood. never looked back." },
  { id: "002", img: IMG.CZ_PORTRAIT, title: "CERTIFIED HOOD", quote: "the hood doesn't sleep. neither do i." },
  { id: "003", img: IMG.CULT1, title: "HOOD DISCIPLE", quote: "i was normal once. it was boring." },
  { id: "004", img: IMG.CULT2, title: "HOOD MAXXER", quote: "green is not a color. it's a state." },
  { id: "005", img: IMG.KITCHEN_CANDID, title: "HOOD APPROVED", quote: "spotted maxxing at the family table." },
  { id: "006", img: IMG.PAPARAZZI, title: "CULT MEMBER", quote: "they tried to hide. the hood found them." },
];

export default function CultArchive() {
  const [active, setActive] = useState(null);
  const current = MEMBERS.find((m) => m.id === active);
  const wrap = useRef(null);
  const cards = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cards.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { y: 80, rotate: 8 },
          {
            y: 0,
            rotate: 0,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              end: "top 55%",
              scrub: 1,
            },
          }
        );
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <section id="cult" ref={wrap} className="relative bg-hood-black py-24 sm:py-32 overflow-hidden grain">
      <div className="px-4 sm:px-8 mb-12 text-center">
        <Tape rotate={-2} className="text-base sm:text-2xl">CLASSIFIED // MEMBER ARCHIVE</Tape>
        <h2 className="mt-6 font-anton uppercase tracking-tightest text-white leading-none" style={{ fontSize: "clamp(2.5rem, 9vw, 8rem)" }}>
          THE HOOD CULT
        </h2>
        <p className="mt-3 font-mono-hood text-xs sm:text-sm uppercase tracking-wide-hood text-hood-green">
          // tap a file to read the back
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 sm:gap-10 px-3 sm:px-6 max-w-7xl mx-auto">
        {MEMBERS.map((m, i) => (
          <motion.button
            key={m.id}
            ref={(el) => { cards.current[i] = el; }}
            onClick={() => setActive(m.id)}
            whileHover={{ y: -6 }}
            className="polaroid p-3 pb-12 text-left block w-full"
            style={{ transform: `rotate(${i % 2 === 0 ? -3 : 3}deg)` }}
          >
            <div className="relative aspect-square overflow-hidden bg-black">
              <img src={m.img} alt="" className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 font-mono-hood text-[10px] text-white bg-black/70 px-1.5 py-0.5">
                #{m.id}
              </span>
            </div>
            <div className="mt-3 flex justify-center">
              <Tape rotate={i % 2 === 0 ? -2 : 2} className="text-sm sm:text-base">{m.title}</Tape>
            </div>
            <p className="mt-3 text-center font-archivo italic text-hood-black/70 text-xs">
              "file open me"
            </p>
          </motion.button>
        ))}
      </div>

      {/* zoom modal */}
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[80] bg-black/85 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.7, rotate: -8 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.7, rotate: 8 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="polaroid p-4 pb-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-square overflow-hidden bg-black">
                <img src={current.img} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Tape rotate={-3} className="text-lg sm:text-xl px-8 py-4">HOOD MAXXER #{current.id}</Tape>
                </div>
              </div>
              <p className="mt-4 text-center font-archivo italic text-hood-black text-lg leading-snug">
                "{current.quote}"
              </p>
              <p className="mt-2 text-center font-mono-hood text-[10px] uppercase tracking-wide-hood text-hood-black/50">
                — back of file #{current.id}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}