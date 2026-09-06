import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useLenis } from "@/lib/LenisContext";

const NAV = [
  { label: "WHAT IS THIS", href: "#what" },
  { label: "THE LORE", href: "#lore" },
  { label: "THE CULT", href: "#cult" },
  { label: "COMMANDMENTS", href: "#commandments" },
  { label: "GET TAPED", href: "#taped" },
  { label: "IN THE WILD", href: "#wild" },
  { label: "MANIFESTO", href: "#manifesto" },
  { label: "JOIN", href: "#join" },
];

export default function FileFolderMenu() {
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  const go = (e, href) => {
    e.preventDefault();
    setOpen(false);
    const target = document.querySelector(href);
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.2 });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed top-0 right-4 sm:right-8 z-[100]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative block"
        aria-label={open ? "Close hood archive menu" : "Open hood archive menu"}
      >
        <span
          className={cn(
            "flex items-center justify-center gap-2 bg-hood-green text-black font-anton uppercase tracking-wide-hood px-5 py-2 text-sm sm:text-base",
            "rounded-b-md shadow-[0_6px_14px_rgba(0,0,0,0.4)] border-x border-b border-black/30",
            "hover:brightness-110 transition"
          )}
          style={{ clipPath: "polygon(0 0, 100% 0, 92% 100%, 8% 100%)" }}
        >
          <span className={cn("hood-burger", open && "is-open")} aria-hidden>
            <span />
            <span />
            <span />
          </span>
          {open ? "CLOSE FILE" : "HOOD FILE"}
        </span>
      </button>

      <div
        className={cn(
          "absolute right-0 top-full origin-top overflow-hidden transition-all duration-300",
          open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="bg-hood-black border-2 border-hood-green px-5 py-6 mt-2 w-56 shadow-2xl">
          <p className="font-mono-hood text-[10px] uppercase tracking-wide-hood text-hood-green mb-4">
            // archived.contents
          </p>
          <nav className="flex flex-col gap-3">
            {NAV.map((n, i) => (
              <a
                key={n.href}
                href={n.href}
                onClick={(e) => go(e, n.href)}
                className="group flex items-center gap-2"
              >
                <span className="tape tape-edge px-3 py-1.5 font-anton uppercase tracking-wide-hood text-sm text-black -rotate-1 group-hover:rotate-0 transition-transform">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-anton uppercase tracking-wide-hood text-white text-lg group-hover:text-hood-green transition-colors">
                  {n.label}
                </span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
