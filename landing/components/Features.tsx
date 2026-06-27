"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Cpu, Globe, BarChart3, GitBranch, Lock, Layers } from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "Adaptive AI Orchestration",
    desc: "Route requests intelligently across 40+ model providers with automatic fallbacks, load balancing, and cost optimization built in.",
    color: "#5B8CFF",
    glow: "rgba(91,140,255,0.15)",
    size: "large",
  },
  {
    icon: Zap,
    title: "Sub-50ms Inference",
    desc: "Global edge deployment with optimized routing ensures near-instant response times regardless of user location.",
    color: "#57E3FF",
    glow: "rgba(87,227,255,0.12)",
    size: "small",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    desc: "SOC 2 Type II, GDPR, HIPAA compliant. Private deployments, end-to-end encryption, and audit logs.",
    color: "#43D17B",
    glow: "rgba(67,209,123,0.12)",
    size: "small",
  },
  {
    icon: Globe,
    title: "Global Infrastructure",
    desc: "30+ edge regions worldwide. Your models run where your users are, with zero configuration required.",
    color: "#7A5CFF",
    glow: "rgba(122,92,255,0.12)",
    size: "small",
  },
  {
    icon: BarChart3,
    title: "Observability Suite",
    desc: "Real-time dashboards, token tracking, latency analytics, cost breakdowns, and anomaly detection.",
    color: "#5B8CFF",
    glow: "rgba(91,140,255,0.12)",
    size: "small",
  },
  {
    icon: GitBranch,
    title: "Workflow Automation",
    desc: "Visual pipeline builder for complex AI chains. Connect models, tools, and data sources with drag-and-drop simplicity.",
    color: "#57E3FF",
    glow: "rgba(87,227,255,0.15)",
    size: "large",
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const Icon = feature.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      className={`group relative p-8 rounded-[28px] glass border border-white/[0.06] hover:border-white/[0.12] transition-all duration-400 overflow-hidden cursor-default ${
        feature.size === "large" ? "md:row-span-2" : ""
      }`}
    >
      {/* Background glow on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 30% 30%, ${feature.glow} 0%, transparent 70%)` }}
      />

      {/* Gradient border on hover */}
      <div
        className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${feature.color}22, transparent, ${feature.color}11)`,
          padding: "1px",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${feature.color}18`, boxShadow: `0 0 20px ${feature.glow}` }}
      >
        <Icon size={22} style={{ color: feature.color }} />
      </div>

      <h3 className="font-grotesk font-semibold text-[20px] text-white mb-3 tracking-tight leading-tight">
        {feature.title}
      </h3>
      <p className="font-inter text-[15px] text-[#777777] leading-relaxed">
        {feature.desc}
      </p>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-8 right-8 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(to right, transparent, ${feature.color}60, transparent)` }}
      />
    </motion.div>
  );
}

export default function Features() {
  return (
    <section id="features" className="py-[120px] max-w-[1280px] mx-auto px-6 md:px-10">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-[#5B8CFF]/20 text-[12px] font-inter text-[#5B8CFF] uppercase tracking-widest mb-6"
        >
          Platform capabilities
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-grotesk font-bold text-[clamp(36px,4vw,56px)] tracking-tight leading-tight text-white mb-5"
        >
          Everything you need to{" "}
          <span className="text-gradient-blue">build with AI</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-[480px] mx-auto font-inter text-[16px] text-[#777] leading-relaxed"
        >
          A complete AI infrastructure platform with enterprise-grade reliability, developer-first APIs, and zero operational overhead.
        </motion.p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr">
        {features.map((f, i) => (
          <FeatureCard key={f.title} feature={f} index={i} />
        ))}
      </div>
    </section>
  );
}
