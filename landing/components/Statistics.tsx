"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const stats = [
  { value: 2400, suffix: "M+", label: "API requests daily", color: "#5B8CFF" },
  { value: 99.99, suffix: "%", label: "Platform uptime SLA", color: "#43D17B" },
  { value: 48, suffix: "ms", label: "Median response time", color: "#57E3FF" },
  { value: 12, suffix: "K+", label: "Teams worldwide", color: "#7A5CFF" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = value / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(parseFloat(start.toFixed(value % 1 !== 0 ? 2 : 0)));
    }, step);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {typeof display === "number" && display % 1 !== 0 ? display.toFixed(2) : Math.floor(display)}
      {suffix}
    </span>
  );
}

export default function Statistics() {
  return (
    <section className="py-[120px] border-t border-white/[0.04]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="font-grotesk font-bold text-[clamp(32px,4vw,52px)] tracking-tight text-white leading-tight">
            Powering AI at{" "}
            <span className="text-gradient-purple">massive scale</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="group relative p-8 rounded-[28px] glass border border-white/[0.06] hover:border-white/[0.12] transition-all text-center overflow-hidden"
            >
              {/* Glow bg */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 50%, ${stat.color}12 0%, transparent 70%)` }}
              />
              <div
                className="text-[clamp(36px,4vw,52px)] font-grotesk font-bold leading-none mb-3 tracking-tight"
                style={{ color: stat.color }}
              >
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="font-inter text-[14px] text-[#777] leading-snug">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
