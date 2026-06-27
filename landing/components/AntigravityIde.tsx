"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Search, Mail, Settings, MessageSquare, Plus, ArrowRight, Play, Check } from "lucide-react";

export default function AntigravityIde() {
  const [activeTab, setActiveTab] = useState("Parallel Agents");
  const [toggleState, setToggleState] = useState(true);

  return (
    <section id="ide" className="py-[120px] bg-[#FFFFFF] text-black relative z-10">
      <div className="max-w-[1280px] mx-auto px-8 flex flex-col items-center">
        
        {/* Left Column Text details */}
        <div className="text-center max-w-[620px] mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.04] border border-black/[0.08] text-[11px] font-grotesk font-semibold uppercase tracking-wider text-black/60"
          >
            Antigravity IDE
          </motion.div>

          <h2 className="font-grotesk font-semibold text-[clamp(28px,4vw,42px)] tracking-tight leading-[1.1] text-black">
            The fully-featured, agentic IDE
          </h2>

          <p className="font-inter text-[15px] text-black/45 leading-relaxed max-w-[480px] mx-auto">
            Complete with the agent manager, artifacts, and a deep understanding of your codebase.
          </p>
        </div>

        {/* Premium Mockup Card from Screenshot 3 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-[1000px] bg-[#000000] p-6 sm:p-10 rounded-[32px] shadow-2xl relative overflow-hidden"
        >
          {/* Subtle reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] via-transparent to-white/[0.03] pointer-events-none" />

          {/* Top Pill Tab Header */}
          <div className="flex justify-center mb-8">
            <button className="px-5 py-2.5 rounded-full bg-white text-black font-grotesk font-semibold text-[13px] border border-black/[0.1] shadow-md flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#34A853]" />
              Parallel Agents
            </button>
          </div>

          {/* Light-themed IDE interior mockup card */}
          <div className="bg-[#FFFFFF] rounded-2xl border border-white/[0.1] shadow-xl overflow-hidden text-black min-h-[380px] flex flex-col">
            {/* Inner Header */}
            <div className="px-6 py-4.5 border-b border-black/[0.05] flex items-center justify-between bg-[#FCFCFC]">
              <div className="flex items-center gap-3">
                <span className="font-grotesk font-semibold text-[15px] text-black">
                  Inbox
                </span>
                <div className="relative w-[180px] sm:w-[240px]">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    disabled
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/[0.03] border border-black/[0.05] text-[11px] font-inter text-black/50 focus:outline-none"
                  />
                </div>
              </div>

              {/* Toggle Pending Button */}
              <div className="flex items-center gap-2.5">
                <span className="text-[12px] font-inter font-medium text-black/45">
                  Pending
                </span>
                <button
                  onClick={() => setToggleState(!toggleState)}
                  className={`relative w-8 h-4.5 rounded-full transition-colors cursor-pointer ${toggleState ? "bg-[#34A853]" : "bg-black/10"}`}
                >
                  <motion.div
                    className="absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-sm"
                    animate={{ left: toggleState ? "16px" : "2px" }}
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                </button>
              </div>
            </div>

            {/* Inner Content Area */}
            <div className="p-6 flex-1 bg-[#FFFFFF] flex flex-col justify-between">
              
              {/* Agent card status block with colorful rainbow border/shadow */}
              <motion.div
                whileHover={{ y: -2 }}
                className="relative p-5 rounded-xl bg-white border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden"
              >
                {/* Rainbow glow indicator */}
                <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#A062FC]" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-1">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-grotesk font-bold text-black">
                        Deploy Flight Tracker API
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[9px] font-bold text-[#4285F4] uppercase tracking-wider">
                        Active Agent
                      </span>
                    </div>
                    <p className="text-[12px] font-inter text-black/45">
                      Task: Implement automatic route failure failover check script and deploy to edge server.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] font-inter text-black/35">PROGRESS</div>
                      <div className="text-[12px] font-mono font-semibold text-[#34A853]">94.8% Complete</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#34A853]/10 flex items-center justify-center text-[#34A853]">
                      <Check size={14} className="stroke-[3]" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Code execution pipeline nodes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                {[
                  { title: "Planning Phase", status: "Success", desc: "Agent formulated path using code layout", color: "#34A853" },
                  { title: "Testing Scripts", status: "Running", desc: "Executing unit tests in sandbox container", color: "#4285F4" },
                  { title: "Verify Artifacts", status: "Waiting", desc: "Ready for manual layout check", color: "rgba(0,0,0,0.3)" }
                ].map((node, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-black/[0.02] border border-black/[0.04] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-grotesk font-bold text-black/75">{node.title}</span>
                      <span 
                        className="text-[9px] font-inter font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: `${node.color}12`, color: node.color }}
                      >
                        {node.status}
                      </span>
                    </div>
                    <p className="text-[10px] font-inter text-black/40 leading-snug">{node.desc}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
