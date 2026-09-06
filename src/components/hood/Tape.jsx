import React from "react";
import { cn } from "@/lib/utils";

/**
 * HOODMAXXING tape — physical strip of duct/evidence tape.
 * variant: green | white | red
 */
export default function Tape({
  children,
  variant = "green",
  rotate = -2,
  className,
  style,
  as: Tag = "div",
}) {
  const variantClass =
    variant === "white" ? "tape-white" : variant === "red" ? "tape-red" : "";
  return (
    <Tag
      className={cn("tape tape-edge px-8 py-3.5 text-base sm:text-lg font-anton uppercase tracking-wide-hood", variantClass, className)}
      style={{ transform: `rotate(${rotate}deg)`, ...style }}
    >
      <span className="relative z-10 block text-center leading-none">{children}</span>
    </Tag>
  );
}