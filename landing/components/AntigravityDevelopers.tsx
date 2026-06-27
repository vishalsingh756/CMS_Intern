"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Play, ArrowLeft, ArrowRight, Video } from "lucide-react";

const developers = [
  {
    role: "Full Stack Developer",
    quote: "Building production-ready applications with collaborative code agents is now second-nature.",
    author: "Elena Rostova",
    company: "Veloce Security",
    bgGradient: "from-[#4285F4] to-[#7A5CFF]"
  },
  {
    role: "AI Researcher",
    quote: "Antigravity SDK allows us to validate multi-agent interactions in simulated dev worktrees safely.",
    author: "Liam Vance",
    company: "CoreIntelligence",
    bgGradient: "from-[#FBBC05] to-[#EA4335]"
  },
  {
    role: "DevOps Engineer",
    quote: "Automating background testing pipelines directly through the CLI harness saved us hours weekly.",
    author: "Marcus Chen",
    company: "NextFlow",
    bgGradient: "from-[#A062FC] to-[#57E3FF]"
  }
];

export default function AntigravityDevelopers() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 340;
    const container = scrollRef.current;
    
    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 bg-white text-black relative z-10 border-t border-black/[0.03]">
      <div className="max-w-[1280px] mx-auto px-8 space-y-12">
        
        {/* Header row split */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-6">
            <h2 className="font-grotesk font-semibold text-[32px] tracking-tight leading-tight max-w-[400px]">
              Built for developers for the agent-first era
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="font-inter text-[15px] text-black/45 leading-relaxed max-w-[440px]">
              Google Antigravity is built for user trust, whether you're a professional developer working in a large enterprise codebase, a hobbyist vibe-coding in their spare time, or anyone in between.
            </p>
          </div>
        </div>

        {/* Carousel cards wrapper */}
        <div className="relative">
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-8 pt-4 scrollbar-none snap-x snap-mandatory"
          >
            {developers.map((dev, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="w-[300px] sm:w-[360px] p-6 rounded-[24px] bg-[#FCFCFC] border border-black/[0.05] shadow-[0_12px_32px_rgba(0,0,0,0.02)] shrink-0 snap-start flex flex-col justify-between min-h-[340px]"
              >
                {/* Visual card header representation */}
                <div className={`w-full h-32 rounded-xl bg-gradient-to-br ${dev.bgGradient} opacity-90 p-4 flex flex-col justify-between text-white relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
                  <div className="relative z-10 text-[10px] font-inter uppercase tracking-wider font-bold bg-white/20 px-2 py-0.5 rounded-full w-max">
                    {dev.role}
                  </div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <h4 className="font-grotesk font-bold text-[13px]">{dev.author}</h4>
                      <p className="text-[10px] font-inter opacity-75">{dev.company}</p>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                      <Play size={12} fill="black" />
                    </button>
                  </div>
                </div>

                {/* Quote body */}
                <div className="space-y-4 pt-4">
                  <p className="font-inter text-[14px] text-black/75 leading-relaxed italic">
                    "{dev.quote}"
                  </p>
                  
                  <div>
                    <a href="#" className="font-grotesk font-bold text-[12px] text-black/55 hover:text-black transition-colors">
                      View case &gt;
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-2 justify-end pt-4">
            <button 
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-black/[0.08] flex items-center justify-center hover:bg-black/[0.03] transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
            </button>
            <button 
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-black/[0.08] flex items-center justify-center hover:bg-black/[0.03] transition-colors cursor-pointer"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
