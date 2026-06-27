"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { label: "Product", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#050505]/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#"
            className="flex items-center gap-2.5 group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5B8CFF] to-[#7A5CFF] flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <span className="font-grotesk font-700 text-[18px] tracking-tight text-white">
              Nexus
            </span>
          </motion.a>

          {/* Center Links — Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="relative px-4 py-2 text-[14px] font-inter text-[#B5B5B5] hover:text-white transition-colors duration-200 group"
                whileHover={{ y: -1 }}
              >
                {link.label}
                <span className="absolute bottom-1 left-4 right-4 h-[1px] bg-gradient-to-r from-[#5B8CFF] to-[#57E3FF] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </motion.a>
            ))}
          </div>

          {/* Right CTA — Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <motion.a
              href="#"
              className="text-[14px] font-inter text-[#B5B5B5] hover:text-white transition-colors px-4 py-2"
              whileHover={{ y: -1 }}
            >
              Sign in
            </motion.a>
            <motion.a
              href="#"
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-[#050505] text-[14px] font-grotesk font-semibold hover:bg-white/90 transition-all duration-200"
              whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(255,255,255,0.2)" }}
              whileTap={{ scale: 0.97 }}
            >
              Get started
              <ArrowRight size={14} />
            </motion.a>
          </div>

          {/* Mobile Hamburger */}
          <motion.button
            className="md:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[72px] z-40 bg-[#0B0B0B]/95 backdrop-blur-2xl border-b border-white/[0.06] px-6 py-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-[16px] font-inter text-[#B5B5B5] hover:text-white transition-colors py-2 border-b border-white/[0.04]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#"
              className="mt-2 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-[#050505] text-[15px] font-grotesk font-semibold"
            >
              Get started free <ArrowRight size={15} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
