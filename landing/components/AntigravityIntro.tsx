"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export default function AntigravityIntro() {
  const text = "Google Antigravity is our agentic development platform, allowing anyone to build in the agent-first era.";
  const [displayedText, setDisplayedText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [startTypewriter, setStartTypewriter] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartTypewriter(true);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!startTypewriter) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [startTypewriter]);

  return (
    <section ref={containerRef} className="py-[100px] bg-white text-black flex items-center justify-center border-t border-black/[0.03]">
      <div className="max-w-[1000px] mx-auto px-8 text-center">
        <h2 className="font-grotesk font-medium text-[clamp(24px,4.5vw,46px)] leading-[1.15] tracking-tight text-black">
          {displayedText}
          <span className="inline-block w-[3px] h-[34px] sm:h-[46px] bg-black/85 ml-1.5 align-middle animate-pulse" />
        </h2>
      </div>
    </section>
  );
}
