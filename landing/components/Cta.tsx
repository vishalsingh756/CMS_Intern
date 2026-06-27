"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Cta() {
  return (
    <section className="py-[160px] relative overflow-hidden bg-grid border-t border-white/[0.04]">
      {/* Dynamic Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-gradient-radial from-[#7A5CFF]/[0.10] via-transparent to-transparent blur-3xl" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-10 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-[#7A5CFF]/20 text-[12px] font-inter text-[#7A5CFF] uppercase tracking-widest"
        >
          <Sparkles size={11} />
          <span>Ready to deploy?</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-grotesk font-bold text-[clamp(36px,5vw,72px)] tracking-tight leading-[1.1] text-white mb-6 max-w-[800px]"
        >
          Build the future of intelligence{" "}
          <span className="text-gradient-purple">today.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-[480px] font-inter text-[16px] text-[#777] leading-relaxed mb-10"
        >
          Sign up now for your free developer account. Get 1 million tokens, API endpoints, and global edge routing instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <motion.a
            href="#"
            className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white text-[#050505] text-[15px] font-grotesk font-semibold group"
            whileHover={{ scale: 1.03, boxShadow: "0 0 45px rgba(255,255,255,0.22)" }}
            whileTap={{ scale: 0.97 }}
          >
            Get started free
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </motion.a>
          <motion.a
            href="#"
            className="flex items-center gap-2.5 px-8 py-4 rounded-2xl glass border border-white/[0.12] text-white text-[15px] font-grotesk font-medium hover:border-white/20 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Talk to an expert
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
