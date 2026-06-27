"use client";

import { motion } from "framer-motion";
import { Code2, Workflow, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Code2,
    title: "Connect your models",
    desc: "Integrate any LLM — GPT-4, Claude, Gemini, Llama, or your own fine-tuned models — via a single unified API. Zero vendor lock-in.",
    color: "#5B8CFF",
    code: `const nexus = new Nexus({ apiKey: process.env.NEXUS_KEY });\n\nconst response = await nexus.generate({\n  model: "auto", // Smart routing\n  prompt: "Explain quantum computing",\n  maxTokens: 1024,\n});`,
  },
  {
    number: "02",
    icon: Workflow,
    title: "Build intelligent workflows",
    desc: "Chain models, tools, and data sources with our visual pipeline editor or code-first SDK. Complex orchestration made simple.",
    color: "#7A5CFF",
    code: `const pipeline = nexus.pipeline([\n  { step: "retrieve", source: "docs" },\n  { step: "augment", model: "embeddings-v3" },\n  { step: "generate", model: "gpt-4o" },\n  { step: "validate", rules: schema },\n]);`,
  },
  {
    number: "03",
    icon: Rocket,
    title: "Deploy globally in seconds",
    desc: "One command deploys to 30+ edge regions. Automatic scaling, zero cold starts, and real-time observability from day one.",
    color: "#57E3FF",
    code: `$ nexus deploy --env production\n\n✓ Optimizing model routes...\n✓ Deploying to 30 regions...\n✓ Health checks passed\n✓ Live at nexus.ai/your-app`,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-[120px] border-t border-white/[0.04]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-[#7A5CFF]/20 text-[12px] font-inter text-[#7A5CFF] uppercase tracking-widest mb-6"
          >
            How it works
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-grotesk font-bold text-[clamp(36px,4vw,56px)] tracking-tight text-white leading-tight"
          >
            From zero to production{" "}
            <span className="text-gradient-purple">in three steps</span>
          </motion.h2>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isEven = i % 2 === 1;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`flex flex-col ${isEven ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-10 p-8 md:p-12 rounded-[28px] glass border border-white/[0.06] hover:border-white/[0.10] transition-all group`}
              >
                {/* Text side */}
                <div className="flex-1 space-y-5">
                  <div className="flex items-center gap-4">
                    <span
                      className="font-grotesk font-bold text-[48px] leading-none"
                      style={{ color: `${step.color}33` }}
                    >
                      {step.number}
                    </span>
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center"
                      style={{ background: `${step.color}18` }}
                    >
                      <Icon size={20} style={{ color: step.color }} />
                    </div>
                  </div>
                  <h3 className="font-grotesk font-semibold text-[28px] text-white tracking-tight leading-tight">
                    {step.title}
                  </h3>
                  <p className="font-inter text-[16px] text-[#777] leading-relaxed max-w-[400px]">
                    {step.desc}
                  </p>
                </div>

                {/* Code panel */}
                <div className="flex-1 w-full">
                  <div className="rounded-2xl bg-[#0D0D0D] border border-white/[0.06] overflow-hidden shadow-xl">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.04]">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                      <span className="ml-2 text-[11px] text-[#444] font-inter">example.ts</span>
                    </div>
                    <pre className="p-5 text-[13px] font-mono leading-relaxed overflow-x-auto">
                      {step.code.split("\n").map((line, li) => (
                        <div key={li} className="flex">
                          <span className="mr-4 text-[#333] select-none w-4 text-right shrink-0">{li + 1}</span>
                          <span
                            className="text-[#CDD4DC]"
                            dangerouslySetInnerHTML={{
                              __html: line
                                .replace(/(const|await|new|process|env)/g, `<span style="color:#7A5CFF">$1</span>`)
                                .replace(/(".*?")/g, `<span style="color:#57E3FF">$1</span>`)
                                .replace(/(\/\/.+)/g, `<span style="color:#444">$1</span>`)
                                .replace(/(\$\s.+)/g, `<span style="color:#43D17B">$1</span>`)
                                .replace(/(✓.+)/g, `<span style="color:#43D17B">$1</span>`),
                            }}
                          />
                        </div>
                      ))}
                    </pre>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
