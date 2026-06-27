"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Files, Search, GitBranch, Play, Settings, Terminal, FileCode, CheckCircle, Sparkles } from "lucide-react";

const autocompleteOptions = [
  { value: "implements", type: "Keyword", desc: "class contract implementation" },
  { value: "import", type: "Keyword", desc: "import external dependency" },
  { value: "importScripts", type: "Function", desc: "worker script loading" },
  { value: "import Statement", type: "Snippet", desc: "ES6 module template" },
  { value: "ImageCapture", type: "Interface", desc: "media recording api" },
  { value: "ImageBitmap", type: "Class", desc: "canvas bitmap image container" },
  { value: "ImageBitmapRenderingContext", type: "Interface", desc: "canvas render target" },
  { value: "createImageBitmap", type: "Method", desc: "factory for bitmaps" }
];

export default function AntigravityIde() {
  const [typedCode, setTypedCode] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [activeItem, setActiveItem] = useState(0);

  useEffect(() => {
    let index = 0;
    const word = "implements";
    const typeInterval = setInterval(() => {
      if (index < word.length) {
        setTypedCode(prev => prev + word[index]);
        index++;
      } else {
        clearInterval(typeInterval);
        setShowAutocomplete(true);
      }
    }, 200);

    return () => clearInterval(typeInterval);
  }, []);

  useEffect(() => {
    if (!showAutocomplete) return;
    const cycleInterval = setInterval(() => {
      setActiveItem(prev => (prev + 1) % autocompleteOptions.length);
    }, 1500);
    return () => clearInterval(cycleInterval);
  }, [showAutocomplete]);

  return (
    <section id="ide" className="py-[120px] bg-[#FFFFFF] text-black relative z-10">
      <div className="max-w-[1280px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Column Text details */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.04] border border-black/[0.08] text-[11px] font-grotesk font-semibold uppercase tracking-wider text-black/60"
          >
            <Sparkles size={10} />
            Agentic Workspace
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-grotesk font-bold text-[clamp(32px,4vw,48px)] tracking-tight leading-[1.1] text-black"
          >
            Antigravity IDE
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-inter text-[15px] text-black/50 leading-relaxed max-w-[420px]"
          >
            The fully-featured, agentic IDE. Complete with the agent manager, artifacts, and a deep understanding of your codebase.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="pt-2"
          >
            <button className="px-6 py-3 rounded-full bg-black/[0.05] hover:bg-black/[0.08] text-black font-grotesk font-semibold text-[13px] transition-all cursor-pointer">
              Explore Product
            </button>
          </motion.div>
        </div>

        {/* Right Column Window Mockup */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative rounded-[20px] bg-[#FAF9F9] border border-black/[0.08] shadow-[0_24px_64px_rgba(0,0,0,0.06)] overflow-hidden"
          >
            {/* Window Top Chrome bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-black/[0.06] bg-[#F3F2F2]">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-black/15" />
                <div className="w-2.5 h-2.5 rounded-full bg-black/15" />
                <div className="w-2.5 h-2.5 rounded-full bg-black/15" />
              </div>
              <div className="text-[11px] font-inter text-black/40 font-medium">
                LoginButton.tsx
              </div>
              <div className="w-6" /> {/* Spacer */}
            </div>

            {/* IDE Interface Layout */}
            <div className="flex min-h-[400px]">
              {/* Sidebar */}
              <div className="w-12 border-r border-black/[0.06] bg-[#F7F6F6] py-4 flex flex-col items-center justify-between">
                <div className="flex flex-col gap-5 items-center text-black/45">
                  <Files size={16} className="text-black/85" />
                  <Search size={16} />
                  <GitBranch size={16} />
                  <Play size={16} />
                </div>
                <div className="text-black/45">
                  <Settings size={16} />
                </div>
              </div>

              {/* Editor Workspace */}
              <div className="flex-1 bg-[#FFFFFF] flex flex-col">
                {/* File tab bar */}
                <div className="flex border-b border-black/[0.06] bg-[#F7F6F6] text-[11px] font-inter">
                  <div className="px-4 py-2 border-r border-black/[0.06] bg-[#FFFFFF] text-black/85 font-medium flex items-center gap-1.5">
                    <FileCode size={12} className="text-blue-500" />
                    LoginButton.tsx
                  </div>
                  <div className="px-4 py-2 text-black/40 hover:bg-black/[0.02] cursor-pointer">
                    Implementation plan
                  </div>
                </div>

                {/* Path breadcrumbs */}
                <div className="px-5 py-2 text-[10px] font-inter text-black/35 border-b border-black/[0.03] bg-[#FAF9F9]">
                  app &gt; components &gt; LoginButton.tsx
                </div>

                {/* Code editor body */}
                <div className="p-6 font-mono text-[13px] leading-relaxed relative flex-1">
                  <div className="flex gap-4">
                    <div className="text-black/25 text-right select-none w-4">1</div>
                    <div className="flex items-center relative">
                      <span className="text-[#3279F9] font-medium">{typedCode}</span>
                      {/* Blinking typing cursor */}
                      <span className="w-1.5 h-4 bg-[#3279F9] ml-0.5 animate-pulse" />

                      {/* Autocomplete dropdown dropdown */}
                      {showAutocomplete && (
                        <div className="absolute top-6 left-0 w-[300px] rounded-xl bg-white border border-black/[0.08] shadow-[0_12px_36px_rgba(0,0,0,0.12)] py-1.5 z-25">
                          {autocompleteOptions.map((opt, oIdx) => (
                            <div
                              key={opt.value}
                              className={`px-4 py-2 flex items-center justify-between text-[11px] cursor-pointer transition-colors ${
                                oIdx === activeItem ? "bg-[#3279F9]/5 text-black font-medium" : "text-black/75 hover:bg-black/[0.02]"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[8px] font-bold ${
                                  opt.type === "Keyword" ? "bg-[#3279F9]/10 text-[#3279F9]" :
                                  opt.type === "Function" ? "bg-amber-100 text-amber-600" :
                                  "bg-emerald-100 text-emerald-600"
                                }`}>
                                  {opt.type[0]}
                                </div>
                                <span className="font-mono">{opt.value}</span>
                              </div>
                              <span className="text-black/35 text-[9px] font-inter">{opt.type}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4 text-black/25">
                    <div className="text-right select-none w-4">2</div>
                    <div></div>
                  </div>
                  <div className="flex gap-4 text-black/25">
                    <div className="text-right select-none w-4">3</div>
                    <div></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
