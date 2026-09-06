import React from "react";

export default function ScanningLine() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      <div
        className="scanline absolute left-0 right-0 h-[3px]"
        style={{ animation: "scan-move 7s linear infinite" }}
      />
      <style>{`
        @keyframes scan-move {
          0% { top: -5%; opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { top: 105%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}