"use client";

import { motion } from "framer-motion";

const companies = [
  "Anthropic", "Mistral", "Cohere", "Perplexity", "Hugging Face",
  "Together AI", "Stability AI", "Replicate",
];

export default function TrustedBy() {
  return (
    <section className="py-20 border-t border-b border-white/[0.04] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-[13px] font-inter text-[#555] uppercase tracking-[0.18em] mb-10"
        >
          Powering the world's most innovative teams
        </motion.p>

        {/* Marquee row */}
        <div className="relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]">
          <motion.div
            className="flex shrink-0 gap-12 items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            {[...companies, ...companies].map((name, i) => (
              <div
                key={i}
                className="shrink-0 px-6 py-3 rounded-2xl glass border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 group"
              >
                <span className="font-grotesk font-semibold text-[14px] text-[#555] group-hover:text-[#999] transition-colors whitespace-nowrap">
                  {name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
