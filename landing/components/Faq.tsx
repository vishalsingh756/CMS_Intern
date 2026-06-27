"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "How does the adaptive routing system work?",
    a: "Our routing system measures latency, cost, and output quality across 40+ model providers in real-time. If a provider experiences latency spikes or outages, requests are dynamically rerouted within milliseconds with zero user impact."
  },
  {
    q: "Is my data secure and compliant?",
    a: "Yes. Nexus is SOC 2 Type II certified. All traffic is encrypted in transit and at rest. We support private instances where your data never leaves your VPC, complying fully with HIPAA, GDPR, and standard data privacy acts."
  },
  {
    q: "Can I use my own fine-tuned models?",
    a: "Absolutely. You can import weights or point Nexus to your private hosting endpoint. Nexus will wrap your model, auto-scale it dynamically, and integrate it into your pipelines."
  },
  {
    q: "What is your uptime SLA guarantee?",
    a: "Our Pro plan offers a 99.9% uptime SLA, while the Enterprise plan guarantees 99.99% uptime with dedicated server isolation and multi-region failovers."
  }
];

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/[0.06] py-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left py-2 group cursor-pointer"
      >
        <span className="font-grotesk font-semibold text-[18px] text-[#B5B5B5] group-hover:text-white transition-colors duration-200">
          {q}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#777] group-hover:text-white"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="font-inter text-[15px] text-[#777] leading-relaxed pt-2 pb-4 max-w-[90%]">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  return (
    <section id="faq" className="py-[120px] border-t border-white/[0.04]">
      <div className="max-w-[800px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-[#5B8CFF]/20 text-[12px] font-inter text-[#5B8CFF] uppercase tracking-widest mb-6"
          >
            Frequently asked questions
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-grotesk font-bold text-[clamp(32px,4vw,48px)] tracking-tight text-white leading-tight"
          >
            Got questions? We have <span className="text-gradient-blue">answers</span>
          </motion.h2>
        </div>

        {/* List */}
        <div className="mt-8">
          {faqs.map((faq, i) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
