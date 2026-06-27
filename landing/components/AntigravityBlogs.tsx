"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const blogs = [
  {
    title: "Android Studio Agent integration",
    desc: "Deploying code agents inside Android Studio builds.",
    label: "INTEGRATIONS",
    visual: (
      <div className="absolute inset-0 flex items-center justify-center bg-emerald-950/20">
        <span className="text-[44px] font-bold text-[#34A853]">Android</span>
        {/* Cursor indicator */}
        <div className="absolute w-4 h-4 bg-blue-500 rounded-full animate-ping" style={{ top: "35%", right: "25%" }} />
      </div>
    )
  },
  {
    title: "Orchestration & Parallel Execution",
    desc: "How Antigravity scales agent concurrency locally.",
    label: "ARCHITECT",
    visual: (
      <div className="absolute inset-0 flex flex-col justify-end p-4 bg-blue-950/20">
        <div className="border border-white/[0.08] rounded bg-black/40 p-2 text-[9px] font-mono text-white/50 space-y-1">
          <div>$ antigravity run --concurrency=8</div>
          <div className="text-emerald-400">✓ Running 8 parallel workspaces</div>
        </div>
      </div>
    )
  },
  {
    title: "Multi-Agent Teams workflow",
    desc: "Designing communication topologies for collaborative agents.",
    label: "ENGINEERING",
    visual: (
      <div className="absolute inset-0 flex items-center justify-center bg-purple-950/20 text-white/80 font-grotesk font-black text-[20px] tracking-tight">
        Agent Teams
      </div>
    )
  },
  {
    title: "Inside the Python SDK harness",
    desc: "Iterate, execute, and evaluate custom agents with ease.",
    label: "GUIDES",
    visual: (
      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
        <span className="font-grotesk font-black text-[72px] bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#A062FC] bg-clip-text text-transparent transform -skew-x-12 select-none opacity-40">
          A
        </span>
      </div>
    )
  }
];

export default function AntigravityBlogs() {
  return (
    <section className="py-20 bg-white text-black relative z-10 border-t border-black/[0.03]">
      <div className="max-w-[1280px] mx-auto px-8 space-y-10">
        
        {/* Header row */}
        <div className="flex items-center justify-between">
          <h2 className="font-grotesk font-semibold text-[32px] tracking-tight">
            Latest Blogs
          </h2>
          <a href="#" className="font-grotesk font-semibold text-[13px] text-black hover:opacity-85 transition-all flex items-center gap-1 group">
            View blog
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Grid cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogs.map((blog, idx) => (
            <motion.a
              key={idx}
              href="#"
              whileHover={{ y: -4 }}
              className="group rounded-2xl bg-[#0F0F0F] border border-white/[0.08] text-white overflow-hidden shadow-lg flex flex-col justify-between min-h-[300px] relative cursor-pointer"
            >
              {/* Graphic visual container */}
              <div className="h-36 relative border-b border-white/[0.04]">
                {blog.visual}
              </div>

              {/* Detail section */}
              <div className="p-5 space-y-2 relative z-10 bg-[#0F0F0F] flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-inter uppercase tracking-wider font-bold text-white/35">
                    {blog.label}
                  </span>
                  <h4 className="font-grotesk font-bold text-[14px] group-hover:text-blue-400 transition-colors">
                    {blog.title}
                  </h4>
                </div>
                <p className="text-[11px] font-inter text-white/40 leading-snug">
                  {blog.desc}
                </p>
              </div>
            </motion.a>
          ))}
        </div>

      </div>
    </section>
  );
}
