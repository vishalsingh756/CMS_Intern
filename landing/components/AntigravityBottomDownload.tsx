"use client";

import { motion } from "framer-motion";
import { Download } from "lucide-react";

export default function AntigravityBottomDownload() {
  return (
    <section className="relative py-28 bg-black text-white overflow-hidden select-none">
      {/* Blue stardust points background in bottom CTA */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(rgba(66, 133, 244, 0.4) 1px, transparent 1px)`,
          backgroundSize: "24px 24px"
        }}
      />

      <div className="max-w-[1280px] mx-auto px-8 relative z-10 text-center space-y-8">
        
        <div className="space-y-4 max-w-[600px] mx-auto">
          <span className="text-[11px] font-inter uppercase tracking-wider font-bold text-white/35">
            Cross Platform Support
          </span>
          <h2 className="font-grotesk font-semibold text-[clamp(28px,5vw,48px)] tracking-tight leading-tight text-white">
            Download Google Antigravity
          </h2>
          <p className="font-inter text-[14px] text-white/45 max-w-[360px] mx-auto leading-relaxed">
            Get started today on Windows, Linux, or macOS. Deploy autonomous coding workspaces locally.
          </p>
        </div>

        {/* Buttons row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <button className="flex items-center gap-1.5 px-6 py-3 rounded-full bg-white text-black font-grotesk font-semibold text-[13px] hover:bg-white/90 transition-all cursor-pointer shadow-lg shadow-white/5">
            <Download size={14} />
            Download for x64
          </button>
          <button className="flex items-center gap-1.5 px-6 py-3 rounded-full bg-transparent text-white border border-white/15 font-grotesk font-semibold text-[13px] hover:bg-white/[0.03] transition-all cursor-pointer">
            <Download size={14} />
            Download for ARM64
          </button>
        </div>

      </div>
    </section>
  );
}
