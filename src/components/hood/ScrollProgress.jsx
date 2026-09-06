import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollProgress() {
  const bar = useRef(null);

  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        gsap.set(el, { scaleX: self.progress });
      },
    });
    return () => st.kill();
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[90] h-[5px] pointer-events-none">
      <div
        ref={bar}
        className="h-full origin-left bg-hood-green"
        style={{ transform: "scaleX(0)", boxShadow: "0 0 8px hsl(var(--hood-green) / 0.7)" }}
      />
    </div>
  );
}
