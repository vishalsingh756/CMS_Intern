"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";

function AnimatedGlow() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Central glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-gradient-radial from-[#5B8CFF]/[0.12] via-[#7A5CFF]/[0.06] to-transparent blur-3xl" />
      {/* Top-left purple blob */}
      <motion.div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-radial from-[#7A5CFF]/[0.10] to-transparent blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Bottom-right cyan blob */}
      <motion.div
        className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-gradient-radial from-[#57E3FF]/[0.08] to-transparent blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>
  );
}

const floatingVariants: any = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, delay: i * 0.12, ease: "easeOut" },
  }),
};

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center pt-[72px] overflow-hidden bg-grid"
    >
      <AnimatedGlow />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-10 text-center flex flex-col items-center"
      >
        {/* Badge */}
        <motion.div
          custom={0}
          variants={floatingVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass border border-[#5B8CFF]/20 text-[13px] font-inter text-[#B5B5B5]"
        >
          <Sparkles size={13} className="text-[#5B8CFF]" />
          <span>Introducing Nexus AI — <span className="text-white font-medium">Redefining enterprise intelligence</span></span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          custom={1}
          variants={floatingVariants}
          initial="hidden"
          animate="visible"
          className="font-grotesk font-bold leading-[1.05] tracking-tight mb-6"
          style={{ fontSize: "clamp(48px, 7vw, 96px)", letterSpacing: "-0.03em" }}
        >
          <span className="text-white">Build smarter.</span>
          <br />
          <span className="text-gradient-full">Scale faster.</span>
          <br />
          <span className="text-white">Ship with confidence.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          custom={2}
          variants={floatingVariants}
          initial="hidden"
          animate="visible"
          className="max-w-[580px] text-[18px] font-inter text-[#777777] leading-relaxed mb-10"
        >
          The AI-native platform that transforms how modern teams build, deploy, and scale intelligent workflows — from idea to production in minutes.
        </motion.p>

        {/* CTAs */}
        <motion.div
          custom={3}
          variants={floatingVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <motion.a
            href="#"
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white text-[#050505] text-[15px] font-grotesk font-semibold group"
            whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(255,255,255,0.20), 0 20px 40px rgba(0,0,0,0.4)" }}
            whileTap={{ scale: 0.97 }}
          >
            Start building free
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </motion.a>
          <motion.a
            href="#"
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl glass border border-white/[0.12] text-white text-[15px] font-grotesk font-medium group hover:border-white/20 transition-all"
            whileHover={{ scale: 1.02, backdropFilter: "blur(32px)" }}
            whileTap={{ scale: 0.98 }}
          >
            <Play size={14} className="text-[#5B8CFF] group-hover:scale-110 transition-transform" fill="#5B8CFF" />
            Watch demo
          </motion.a>
        </motion.div>

        {/* Social proof */}
        <motion.div
          custom={4}
          variants={floatingVariants}
          initial="hidden"
          animate="visible"
          className="mt-10 flex items-center gap-3 text-[13px] font-inter text-[#777777]"
        >
          <div className="flex -space-x-2">
            {["#5B8CFF","#7A5CFF","#57E3FF","#43D17B","#FF6B6B"].map((c, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full border-2 border-[#050505] flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${c} 0%, ${c}88 100%)` }}
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <span>Trusted by <strong className="text-white">12,000+</strong> engineers & product teams</span>
        </motion.div>

        {/* Hero dashboard mockup */}
        <motion.div
          custom={5}
          variants={floatingVariants}
          initial="hidden"
          animate="visible"
          className="mt-20 w-full max-w-[900px] relative"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Dashboard mock */}
            <div className="relative rounded-[28px] glass-strong gradient-border overflow-hidden shadow-2xl shadow-black/50">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                <div className="flex-1 mx-4 h-7 rounded-lg bg-white/[0.04] border border-white/[0.05] flex items-center px-3">
                  <span className="text-[11px] text-[#555] font-inter">nexus.ai/dashboard</span>
                </div>
              </div>
              {/* Dashboard content */}
              <div className="p-5 grid grid-cols-3 gap-3">
                {/* Stat cards */}
                {[
                  { label: "API Requests", value: "2.4M", change: "+18%", color: "#5B8CFF" },
                  { label: "Active Workflows", value: "847", change: "+7%", color: "#7A5CFF" },
                  { label: "Tokens Processed", value: "98.2B", change: "+34%", color: "#57E3FF" },
                ].map((stat) => (
                  <div key={stat.label} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="text-[11px] text-[#777] font-inter mb-2">{stat.label}</div>
                    <div className="text-[22px] font-grotesk font-bold" style={{ color: stat.color }}>{stat.value}</div>
                    <div className="text-[11px] text-[#43D17B] mt-1">{stat.change} this week</div>
                  </div>
                ))}
                {/* Chart area */}
                <div className="col-span-2 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                  <div className="text-[11px] text-[#777] font-inter mb-3">Performance overview</div>
                  <div className="flex items-end gap-1.5 h-24">
                    {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100].map((h, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 rounded-t-md"
                        style={{ background: `linear-gradient(to top, #5B8CFF, #7A5CFF)`, opacity: 0.7 + (h / 400) }}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 1, delay: 0.8 + i * 0.05, ease: "easeOut" }}
                      />
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                  <div className="text-[11px] text-[#777] font-inter mb-3">Status</div>
                  {[
                    { name: "Model API", status: "Healthy", color: "#43D17B" },
                    { name: "Pipeline", status: "Active", color: "#43D17B" },
                    { name: "Storage", status: "98.9%", color: "#5B8CFF" },
                  ].map((s) => (
                    <div key={s.name} className="flex items-center justify-between mb-2">
                      <span className="text-[11px] text-[#999] font-inter">{s.name}</span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.05]" style={{ color: s.color }}>{s.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Glow under dashboard */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-gradient-to-r from-[#5B8CFF]/20 via-[#7A5CFF]/20 to-[#57E3FF]/20 blur-3xl rounded-full" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      </motion.div>
    </section>
  );
}
