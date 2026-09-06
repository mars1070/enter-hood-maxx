import React from "react";
import { cn } from "@/lib/utils";
import { Image } from "@/components/ui/image";

/**
 * A photograph "taped" to the page.
 * Props: src, alt, rotate, className, imgClassName, tape (node), caption, grayscale
 */
export default function PhotoCard({
  src,
  alt = "",
  rotate = 0,
  className,
  imgClassName,
  tape,
  caption,
  grayscale = true,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-transform duration-300 will-change-transform",
        onClick && "cursor-pointer",
        className
      )}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <Image
        src={src}
        alt={alt}
        fittingType="fill"
        className={cn(
          "w-full h-full object-cover block transition-all duration-500 group-hover:brightness-110 group-hover:contrast-110",
          imgClassName
        )}
      />
      {tape && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {tape}
        </div>
      )}
      {caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1">
          <span className="font-mono-hood text-[10px] uppercase tracking-wide-hood text-white">
            {caption}
          </span>
        </div>
      )}
    </div>
  );
}