"use client";

import { motion } from "framer-motion";
import { Star, MessageSquare } from "lucide-react";

const testimonials = [
  {
    quote: "Nexus has completely transformed our AI product cycle. We went from struggling with API latency and model reliability to 99.99% uptime and sub-50ms responses. It's a game-changer.",
    author: "Sarah Jenkins",
    role: "VP of Engineering at Cohere-Link",
    avatar: "S",
    color: "#5B8CFF"
  },
  {
    quote: "The visual workflow builder is incredibly intuitive. Our non-technical product managers can now customize LLM routing rules without writing code, allowing our developers to focus on core platform engineering.",
    author: "Marcus Chen",
    role: "Lead Architect at NextFlow",
    avatar: "M",
    color: "#7A5CFF"
  },
  {
    quote: "Private model deployments and security compliance were critical for our enterprise clients. Nexus delivered both, plus cost analytics that saved us over 40% on inference fees last month.",
    author: "Elena Rostova",
    role: "Chief Technology Officer at Veloce Security",
    avatar: "E",
    color: "#57E3FF"
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-[120px] border-t border-white/[0.04]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-[#57E3FF]/20 text-[12px] font-inter text-[#57E3FF] uppercase tracking-widest mb-6"
          >
            Testimonials
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-grotesk font-bold text-[clamp(36px,4vw,56px)] tracking-tight text-white leading-tight"
          >
            Trusted by top <span className="text-gradient-blue">innovators</span>
          </motion.h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              whileHover={{ y: -6 }}
              className="p-8 rounded-[28px] glass border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} size={15} className="text-[#5B8CFF]" fill="#5B8CFF" />
                  ))}
                </div>
                <p className="font-inter text-[16px] text-[#B5B5B5] leading-relaxed italic mb-8">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-4 border-t border-white/[0.06] pt-6">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-grotesk font-bold text-white text-[15px]"
                  style={{ background: `linear-gradient(135deg, ${t.color} 0%, ${t.color}88 100%)` }}
                >
                  {t.avatar}
                </div>
                <div>
                  <h4 className="font-grotesk font-semibold text-[15px] text-white">{t.author}</h4>
                  <p className="font-inter text-[12px] text-[#777]">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
