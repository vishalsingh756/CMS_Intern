"use client";

import { motion } from "framer-motion";
import { Play, Code, Folder, FileCode, Terminal, GitBranch, Monitor, Upload, Braces, Check, Search, Grid, ArrowLeft, Copy, ChevronRight } from "lucide-react";

const dockIcons = [
  { icon: ArrowLeft, label: "Back" },
  { icon: Code, label: "Editor" },
  { icon: Folder, label: "Explorer" },
  { icon: FileCode, label: "Files" },
  { icon: Terminal, label: "Terminal" },
  { icon: GitBranch, label: "Source Control" },
  { icon: Monitor, label: "Devices" },
  { icon: Upload, label: "Deploy" },
  { icon: Braces, label: "JSON" },
  { icon: Check, label: "Verify" },
  { icon: Search, label: "Search" },
  { icon: Grid, label: "Dashboard" },
  { icon: Copy, label: "Clipboard" }
];

export default function AntigravityHero() {
  return (
    <section className="relative min-h-screen bg-black flex flex-col items-center justify-between py-10 overflow-hidden select-none">
      {/* Stardust Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: "24px 24px"
        }}
      />

      {/* Header / Logo */}
      <div className="w-full max-w-[1280px] px-8 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-3">
          {/* Stylized Multi-Colored Gradient 'A' Logo */}
          <div className="relative w-9 h-9 flex items-center justify-center font-grotesk font-black text-[26px] select-none">
            <span className="absolute inset-0 bg-gradient-to-tr from-[#FF5F57] via-[#FEBC2E] to-[#28C840] bg-clip-text text-transparent transform -skew-x-12">
              A
            </span>
            <span className="absolute inset-0 bg-gradient-to-br from-[#5B8CFF] via-[#7A5CFF] to-[#57E3FF] bg-clip-text text-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 transform -skew-x-12">
              A
            </span>
          </div>
          <span className="font-grotesk font-medium text-[16px] text-white/90 tracking-tight">
            Google Antigravity
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#ide" className="text-[13px] font-inter text-white/60 hover:text-white transition-colors">
            Product
          </a>
          <a href="#footer" className="text-[13px] font-inter text-white/60 hover:text-white transition-colors">
            About
          </a>
        </div>
      </div>

      {/* Main Center Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-[640px] px-6 my-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          {/* Subtle logo mark */}
          <div className="w-20 h-20 mx-auto rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center shadow-2xl">
            <span className="font-grotesk font-black text-[44px] bg-gradient-to-r from-[#FF5F57] via-[#FEBC2E] via-[#28C840] via-[#5B8CFF] to-[#7A5CFF] bg-clip-text text-transparent">
              A
            </span>
          </div>

          <h1 className="font-grotesk font-bold text-[clamp(36px,6vw,64px)] text-white leading-[1.1] tracking-tight">
            Coding at the speed of thought.
          </h1>

          <p className="font-inter text-[16px] text-white/50 leading-relaxed max-w-[480px] mx-auto">
            Experience the agentic development environment designed for creators, pioneers, and builders of tomorrow.
          </p>

          <div className="pt-4">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#f3f3f3" }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-black font-grotesk font-medium text-[14px] shadow-xl transition-all cursor-pointer"
            >
              <Play size={12} fill="black" />
              Play intro
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Floating Bottom Dock */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="w-full max-w-[1280px] px-8 flex justify-center pb-6 z-20"
      >
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.06] backdrop-blur-md shadow-2xl overflow-x-auto max-w-full scrollbar-none">
          {dockIcons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.2, y: -4 }}
                className="group relative w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg cursor-pointer shrink-0 transition-all duration-200"
              >
                <Icon size={16} className="text-black/85" />
                
                {/* Tooltip */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-black border border-white/10 text-white text-[10px] font-inter opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap shadow-xl">
                  {item.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
