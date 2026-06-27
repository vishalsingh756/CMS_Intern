"use client";

import { motion as m } from "framer-motion";
import { useState, useEffect } from "react";
import { Plus, ChevronDown, Terminal as TermIcon, Check, Copy, ChevronRight, FileCode, Play, Code } from "lucide-react";

export default function AntigravityFeatures() {
  // States for Feature 1 (Antigravity 2.0 dropdown)
  const [feature1DropdownOpen, setFeature1DropdownOpen] = useState(true);
  
  // States for Feature 4 (IDE typing)
  const [typedCode, setTypedCode] = useState("");
  const [showIDEAutocomplete, setShowIDEAutocomplete] = useState(false);
  const [activeIDEItem, setActiveIDEItem] = useState(0);

  useEffect(() => {
    let index = 0;
    const word = "implements";
    const typeInterval = setInterval(() => {
      if (index < word.length) {
        setTypedCode(word.slice(0, index + 1));
        index++;
      } else {
        setShowIDEAutocomplete(true);
      }
    }, 250);

    return () => clearInterval(typeInterval);
  }, []);

  useEffect(() => {
    if (!showIDEAutocomplete) return;
    const cycle = setInterval(() => {
      setActiveIDEItem(prev => (prev + 1) % 4);
    }, 1500);
    return () => clearInterval(cycle);
  }, [showIDEAutocomplete]);

  return (
    <section className="bg-white text-black py-16 space-y-[120px] relative z-10 border-t border-black/[0.03]">
      
      {/* ---------------- FEATURE 1: ANTIGRAVITY 2.0 ---------------- */}
      <div className="max-w-[1280px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-5 space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.04] text-[11px] font-grotesk font-bold uppercase tracking-wider text-black/55">
            Command Center
          </div>
          <h3 className="font-grotesk font-semibold text-[32px] tracking-tight leading-none text-black">
            Antigravity 2.0
          </h3>
          <p className="font-inter text-[15px] text-black/45 leading-relaxed">
            Your command center to manage multiple local agents in parallel. Group conversations into Projects, operate across multiple workspaces, and automate routine tasks with scheduled messages.
          </p>
        </div>

        <div className="lg:col-span-7">
          <m.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-black/[0.06] bg-[#FCFCFC] shadow-[0_16px_40px_rgba(0,0,0,0.03)] overflow-hidden"
          >
            {/* Window bar */}
            <div className="px-5 py-3 border-b border-black/[0.05] flex items-center justify-between bg-[#F4F4F4]">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-black/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-black/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-black/10" />
              </div>
              <div className="text-[11px] font-inter text-black/40 font-medium">Antigravity Manager</div>
              <div className="w-8" />
            </div>

            {/* App Layout */}
            <div className="p-6 space-y-6">
              {/* Selectors row */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black text-white text-[11px] font-grotesk font-semibold">
                  <Plus size={12} />
                  New Project
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setFeature1DropdownOpen(!feature1DropdownOpen)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black/[0.03] border border-black/[0.06] text-[11px] font-inter font-medium text-black/75 cursor-pointer"
                  >
                    Local
                    <ChevronDown size={11} className="text-black/30" />
                  </button>
                  {feature1DropdownOpen && (
                    <div className="absolute top-8 left-0 w-32 rounded-lg bg-white border border-black/[0.08] shadow-lg py-1 z-20">
                      <div className="px-3 py-1.5 text-[11px] font-inter text-black font-semibold bg-black/[0.02]">Local</div>
                      <div className="px-3 py-1.5 text-[11px] font-inter text-black/55 hover:bg-black/[0.02] cursor-pointer">New Worktree</div>
                    </div>
                  )}
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-black/[0.03] text-[11px] font-mono text-black/55">
                  branch: main
                </div>
              </div>

              {/* Chat panel */}
              <div className="border border-black/[0.05] rounded-xl bg-white p-4 space-y-4">
                <div className="flex items-center justify-between text-[11px] text-black/40 font-inter">
                  <span>MODEL STATUS</span>
                  <span className="text-[#34A853] font-medium">Gemini 3.5 Flash (Active)</span>
                </div>
                <div className="h-20 bg-black/[0.01] border border-dashed border-black/[0.05] rounded-lg flex items-center justify-center text-[12px] font-inter text-black/35">
                  Chat conversation with agent workspace...
                </div>
              </div>

              {/* Prompt box */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Ask anything, @ to mention, / for actions"
                  disabled
                  className="w-full px-4 py-3.5 rounded-xl bg-black/[0.02] border border-black/[0.06] text-[12px] font-inter placeholder-black/30 focus:outline-none"
                />
              </div>
            </div>
          </m.div>
        </div>
      </div>

      {/* ---------------- FEATURE 2: ANTIGRAVITY CLI ---------------- */}
      <div className="max-w-[1280px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-5 lg:order-2 space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.04] text-[11px] font-grotesk font-bold uppercase tracking-wider text-black/55">
            Terminal Surface
          </div>
          <h3 className="font-grotesk font-semibold text-[32px] tracking-tight leading-none text-black">
            Antigravity CLI
          </h3>
          <p className="font-inter text-[15px] text-black/45 leading-relaxed">
            The lightweight, fast, terminal-first surface to work with Antigravity agents. Run autonomous coding agents, execute shell commands directly, and manage background subagents all from your keyboard.
          </p>
        </div>

        <div className="lg:col-span-7 lg:order-1">
          <m.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-[#0F0F0F] border border-white/[0.08] shadow-2xl overflow-hidden"
          >
            {/* Terminal Top bar */}
            <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between bg-[#181818]">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              </div>
              <div className="text-[11px] font-mono text-white/35">antigravity@cli: ~</div>
              <div className="w-8" />
            </div>

            {/* Terminal split panel mockup */}
            <div className="grid grid-cols-1 md:grid-cols-2 min-h-[280px] font-mono text-[12px] text-white/80">
              {/* Left Selector pane */}
              <div className="p-5 border-r border-white/[0.06] space-y-4 bg-[#141414]">
                <div className="text-white/40">// Terminal Theme Selector</div>
                <div className="space-y-2">
                  <div className="text-white/50">&gt; Choose your color scheme:</div>
                  <div className="pl-4 space-y-1.5 text-white/60">
                    <div>1. light</div>
                    <div>2. solarized light</div>
                    <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <span>3. dark</span>
                      <Check size={12} />
                    </div>
                    <div>4. monolith</div>
                  </div>
                </div>
              </div>

              {/* Right Diff Chat pane */}
              <div className="p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start gap-1.5">
                    <span className="text-blue-400">you:</span>
                    <span className="text-white/90">add a greeting function</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-purple-400">A&amp;t:</span>
                    <span className="text-white/70">Here's the changes:</span>
                  </div>
                </div>

                {/* Diff box */}
                <div className="border border-white/[0.08] rounded-lg bg-[#000000] p-3 text-[11px] space-y-1 overflow-x-auto">
                  <div className="text-red-400/90 bg-red-950/20 px-1.5">- helloWorld()</div>
                  <div className="text-emerald-400/90 bg-emerald-950/20 px-1.5">+ greetUser(name: string) &#123;</div>
                  <div className="text-emerald-400/90 bg-emerald-950/20 px-1.5">+   return `Welcome, $&#123;name&#125;!`;</div>
                  <div className="text-emerald-400/90 bg-emerald-950/20 px-1.5">+ &#125;</div>
                </div>
              </div>
            </div>
          </m.div>
        </div>
      </div>

      {/* ---------------- FEATURE 3: ANTIGRAVITY SDK ---------------- */}
      <div className="max-w-[1280px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-5 space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.04] text-[11px] font-grotesk font-bold uppercase tracking-wider text-black/55">
            Developer harness
          </div>
          <h3 className="font-grotesk font-semibold text-[32px] tracking-tight leading-none text-black">
            Antigravity SDK
          </h3>
          <p className="font-inter text-[15px] text-black/45 leading-relaxed">
            Prototype custom agents leveraging Antigravity's harness with minimal code. Simple Python scripts to iterate on agentic applications, automate software engineering tasks, and run evaluations on top of the Antigravity agent harness.
          </p>
        </div>

        <div className="lg:col-span-7">
          <m.div 
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-black border border-white/[0.08] aspect-video flex items-center justify-center relative overflow-hidden shadow-2xl"
          >
            {/* Glowing concentric circles Visual animation */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <m.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[240px] h-[240px] rounded-full border border-blue-500/30"
              />
              <m.div 
                animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute w-[180px] h-[180px] rounded-full border border-purple-500/20"
              />
              <m.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute w-[120px] h-[120px] rounded-full border border-emerald-500/20"
              />
            </div>

            <div className="relative z-10 text-center space-y-2">
              <div className="text-[12px] font-mono text-white/40">import antigravity</div>
              <div className="font-grotesk font-black text-[22px] text-white tracking-tight">Antigravity SDK</div>
            </div>
          </m.div>
        </div>
      </div>

      {/* ---------------- FEATURE 4: ANTIGRAVITY IDE ---------------- */}
      <div className="max-w-[1280px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-5 lg:order-2 space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.04] text-[11px] font-grotesk font-bold uppercase tracking-wider text-black/55">
            Agentic IDE Workspace
          </div>
          <h3 className="font-grotesk font-semibold text-[32px] tracking-tight leading-none text-black">
            Antigravity IDE
          </h3>
          <p className="font-inter text-[15px] text-black/45 leading-relaxed">
            The fully-featured, agentic IDE. Complete with the agent manager, artifacts, and a deep understanding of your codebase.
          </p>
          <div className="pt-2">
            <a href="#" className="font-grotesk font-semibold text-[13px] text-black hover:opacity-80 transition-opacity flex items-center gap-1">
              Explore Product
              <ChevronRight size={14} />
            </a>
          </div>
        </div>

        <div className="lg:col-span-7 lg:order-1">
          <m.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-[#0F0F0F] border border-white/[0.08] shadow-2xl overflow-hidden"
          >
            {/* Window bar */}
            <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between bg-[#181818]">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
              </div>
              <div className="text-[11px] font-inter text-white/35 font-medium">LoginButton.tsx</div>
              <div className="w-8" />
            </div>

            {/* Inner IDE Layout */}
            <div className="flex min-h-[300px]">
              {/* Left tab sidebar */}
              <div className="w-10 border-r border-white/[0.04] bg-[#121212] py-4 flex flex-col items-center gap-4 text-white/35">
                <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              </div>

              {/* Editor area */}
              <div className="flex-1 bg-[#161616] flex flex-col">
                <div className="flex border-b border-white/[0.04] bg-[#121212] text-[11px] font-inter text-white/40">
                  <div className="px-4 py-2 border-r border-white/[0.04] bg-[#161616] text-white/80 flex items-center gap-1.5">
                    <FileCode size={12} className="text-blue-400" />
                    LoginButton.tsx
                  </div>
                  <div className="px-4 py-2 hover:bg-white/[0.02] cursor-pointer">
                    Implementation plan
                  </div>
                </div>

                {/* Editor content typing code */}
                <div className="p-6 font-mono text-[12px] leading-relaxed relative flex-1 text-white/95">
                  <div className="flex gap-4">
                    <span className="text-white/20 select-none w-4 text-right">1</span>
                    <div className="flex items-center relative">
                      <span className="text-[#3279F9] font-medium">{typedCode}</span>
                      <span className="w-1.5 h-4 bg-[#3279F9] ml-0.5 animate-pulse" />

                      {/* Autocomplete list dropdown */}
                      {showIDEAutocomplete && (
                        <div className="absolute top-6 left-0 w-[240px] rounded-xl bg-[#1A1A1A] border border-white/[0.08] shadow-2xl py-1.5 z-20 text-[10px] text-white/85">
                          {[
                            { val: "implements", type: "keyword" },
                            { val: "import", type: "keyword" },
                            { val: "importScripts", type: "method" },
                            { val: "importStatement", type: "snippet" }
                          ].map((item, idx) => (
                            <div 
                              key={item.val}
                              className={`px-3.5 py-1.5 flex items-center justify-between ${idx === activeIDEItem ? "bg-[#3279F9]/10 text-white font-medium" : "text-white/60"}`}
                            >
                              <span>{item.val}</span>
                              <span className="text-white/30 text-[9px] uppercase">{item.type}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </m.div>
        </div>
      </div>

    </section>
  );
}
