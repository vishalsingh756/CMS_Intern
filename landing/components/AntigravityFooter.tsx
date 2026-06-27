"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const col1 = ["Download", "Product", "Docs", "Changelog", "Press", "Releases"];
const col2 = ["Blog", "Pricing", "Use Cases"];

export default function AntigravityFooter() {
  return (
    <section id="footer" className="relative bg-[#FFFFFF] text-black pt-[120px] overflow-hidden select-none border-t border-black/[0.05]">


      <div className="max-w-[1280px] mx-auto px-8 relative z-10">
        
        {/* Main Content Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start pb-20">
          {/* Left Heading */}
          <div className="md:col-span-6 space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-grotesk font-bold text-[clamp(28px,4vw,44px)] tracking-tight text-black leading-tight"
            >
              Experience liftoff
            </motion.h2>
            <p className="font-inter text-[14px] text-black/40 max-w-[320px]">
              Deploy your workflows directly into orbit. Step into the next generation of intelligent product creation.
            </p>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-3 grid grid-cols-2 gap-8 md:col-start-8">
            <div className="space-y-4">
              <h4 className="text-[11px] font-grotesk font-bold text-black/30 uppercase tracking-wider">
                Product
              </h4>
              <ul className="space-y-3">
                {col1.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="font-inter text-[13px] text-black/50 hover:text-black transition-colors flex items-center gap-1 group"
                    >
                      {item}
                      <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] font-grotesk font-bold text-black/30 uppercase tracking-wider">
                Resources
              </h4>
              <ul className="space-y-3">
                {col2.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="font-inter text-[13px] text-black/50 hover:text-black transition-colors flex items-center gap-1 group"
                    >
                      {item}
                      <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Huge bold "Antigravity" Brand text */}
        <div className="pt-10 border-t border-black/[0.05] overflow-hidden">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-grotesk font-black text-[clamp(60px,14vw,200px)] text-center text-black leading-none tracking-tighter"
          >
            Antigravity
          </motion.h1>
        </div>

        {/* Absolute Bottom Google branding credit bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 border-t border-black/[0.05] mt-10">
          {/* Google Logo */}
          <div className="flex items-center gap-1 select-none">
            <span className="font-grotesk font-semibold text-[15px] tracking-tight text-black/80">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </span>
          </div>

          {/* Bottom right links */}
          <div className="flex items-center gap-6 text-[11px] font-inter text-black/40">
            <a href="#" className="hover:text-black transition-colors">About Google</a>
            <a href="#" className="hover:text-black transition-colors">Google Products</a>
            <a href="#" className="hover:text-black transition-colors">Privacy</a>
            <a href="#" className="hover:text-black transition-colors">Terms</a>
          </div>
        </div>

      </div>
    </section>
  );
}
