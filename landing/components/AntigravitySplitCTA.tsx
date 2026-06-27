"use client";

import { motion } from "framer-motion";
import { Download, ArrowRight } from "lucide-react";

export default function AntigravitySplitCTA() {
  return (
    <section className="py-20 bg-white text-black relative z-10 border-t border-black/[0.03] overflow-hidden">
      {/* Subtle stardust points background in CTA */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.4) 1px, transparent 1px)`,
          backgroundSize: "20px 20px"
        }}
      />

      <div className="max-w-[1280px] mx-auto px-8 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left card: Individual Developers */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-8 rounded-[24px] bg-[#FCFCFC] border border-black/[0.05] shadow-[0_12px_32px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[260px]"
        >
          <div className="space-y-4">
            <span className="text-[11px] font-inter uppercase tracking-wider font-bold text-black/35">
              Available at no charge
            </span>
            <h3 className="font-grotesk font-semibold text-[26px] tracking-tight leading-tight max-w-[280px]">
              For developers Achieve new heights
            </h3>
          </div>
          <div className="pt-6">
            <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white font-grotesk font-semibold text-[13px] shadow-md hover:bg-black/90 transition-all cursor-pointer">
              <Download size={14} />
              Download
            </button>
          </div>
        </motion.div>

        {/* Right card: Organizations/Enterprise */}
        <motion.div
          whileHover={{ y: -3 }}
          className="p-8 rounded-[24px] bg-[#FCFCFC] border border-black/[0.05] shadow-[0_12px_32px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[260px]"
        >
          <div className="space-y-4">
            <span className="text-[11px] font-inter uppercase tracking-wider font-bold text-black/35">
              Now Available!
            </span>
            <h3 className="font-grotesk font-semibold text-[26px] tracking-tight leading-tight max-w-[280px]">
              For organizations Level up your entire team
            </h3>
          </div>
          <div className="pt-6">
            <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black border border-black/[0.1] font-grotesk font-semibold text-[13px] shadow-sm hover:bg-black/[0.02] transition-all cursor-pointer">
              Read More
              <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
