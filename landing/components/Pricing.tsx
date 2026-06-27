"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    name: "Starter",
    monthly: 0,
    annual: 0,
    desc: "Perfect for developers exploring AI capabilities.",
    color: "#5B8CFF",
    features: [
      "1M tokens / month",
      "5 model providers",
      "Community support",
      "Basic analytics",
      "REST API access",
    ],
    cta: "Start for free",
    highlight: false,
  },
  {
    name: "Pro",
    monthly: 49,
    annual: 39,
    desc: "For production teams shipping AI-powered products.",
    color: "#7A5CFF",
    features: [
      "50M tokens / month",
      "All 40+ model providers",
      "Priority support (< 4h)",
      "Advanced analytics & logs",
      "Custom model routing",
      "99.9% SLA uptime",
      "Webhook integrations",
    ],
    cta: "Start Pro trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    monthly: null,
    annual: null,
    desc: "Unlimited scale with full enterprise compliance.",
    color: "#57E3FF",
    features: [
      "Unlimited tokens",
      "Private model deployment",
      "SOC 2, HIPAA, GDPR",
      "Dedicated infrastructure",
      "Custom SLA & contracts",
      "24/7 dedicated support",
      "SAML SSO & SCIM",
    ],
    cta: "Contact sales",
    highlight: false,
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="py-[120px] border-t border-white/[0.04]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-[#43D17B]/20 text-[12px] font-inter text-[#43D17B] uppercase tracking-widest mb-6"
          >
            Simple pricing
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-grotesk font-bold text-[clamp(36px,4vw,56px)] tracking-tight text-white leading-tight mb-5"
          >
            Pay for what you{" "}
            <span className="text-gradient-blue">actually use</span>
          </motion.h2>

          {/* Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 mt-4"
          >
            <span className={`text-[14px] font-inter ${!annual ? "text-white" : "text-[#555]"}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-6 rounded-full transition-colors ${annual ? "bg-[#5B8CFF]" : "bg-white/10"}`}
            >
              <motion.div
                className="absolute top-1 w-4 h-4 rounded-full bg-white"
                animate={{ left: annual ? "calc(100% - 20px)" : "4px" }}
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            </button>
            <span className={`text-[14px] font-inter ${annual ? "text-white" : "text-[#555]"}`}>
              Annual <span className="text-[#43D17B] font-medium">–20%</span>
            </span>
          </motion.div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className={`relative p-8 rounded-[28px] flex flex-col gap-6 transition-all duration-300 ${
                plan.highlight
                  ? "glass-strong border border-[#7A5CFF]/30 shadow-[0_0_60px_rgba(122,92,255,0.12)]"
                  : "glass border border-white/[0.06] hover:border-white/[0.12]"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#7A5CFF] to-[#5B8CFF] text-[11px] font-grotesk font-semibold text-white tracking-wide">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="font-grotesk font-semibold text-[20px] text-white mb-1">{plan.name}</h3>
                <p className="text-[14px] font-inter text-[#777]">{plan.desc}</p>
              </div>

              <div className="flex items-end gap-1">
                {plan.monthly === null ? (
                  <span className="font-grotesk font-bold text-[36px] text-white">Custom</span>
                ) : (
                  <>
                    <span className="font-grotesk font-bold text-[48px] leading-none text-white">
                      ${annual ? plan.annual : plan.monthly}
                    </span>
                    <span className="text-[14px] font-inter text-[#555] mb-2">/mo</span>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-3">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: `${plan.color}20` }}
                    >
                      <Check size={11} style={{ color: plan.color }} />
                    </div>
                    <span className="text-[14px] font-inter text-[#B5B5B5]">{f}</span>
                  </div>
                ))}
              </div>

              <motion.a
                href="#"
                className={`mt-auto flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[15px] font-grotesk font-semibold transition-all ${
                  plan.highlight
                    ? "bg-gradient-to-r from-[#7A5CFF] to-[#5B8CFF] text-white hover:shadow-lg hover:shadow-purple-500/25"
                    : "glass border border-white/[0.10] text-white hover:border-white/20"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                {plan.cta}
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
