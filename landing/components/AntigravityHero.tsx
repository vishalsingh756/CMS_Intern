"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Download, ChevronDown, Compass } from "lucide-react";

// Particle definition for the canvas stardust background
interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  color: string;
  speed: number;
  angle: number;
  distance: number;
}

export default function AntigravityHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Particle[] = [];
    const particleCount = 280;

    // Helper to generate the exact color grading based on the position
    const getParticleColor = (x: number, totalWidth: number) => {
      const ratio = x / totalWidth;
      if (ratio < 0.38) {
        return "#4285F4"; // Google Blue
      } else if (ratio < 0.48) {
        return "#FBBC05"; // Google Yellow/Orange
      } else if (ratio < 0.58) {
        return "#EA4335"; // Google Red
      } else {
        return "#A062FC"; // Antigravity Purple
      }
    };

    // Initialize particles in a large circular dispersion pattern
    const init = () => {
      particles.length = 0;
      const centerX = width / 2;
      const centerY = height / 2 + 50;

      for (let i = 0; i < particleCount; i++) {
        // Distribute particles in concentric orbits/curves
        const angle = Math.random() * Math.PI * 2;
        const distance = 80 + Math.random() * (Math.min(width, height) * 0.45);
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance * 0.8; // Flatten slightly for perspective

        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          radius: 1 + Math.random() * 1.5,
          color: getParticleColor(x, width),
          speed: 0.2 + Math.random() * 0.4,
          angle: Math.random() * Math.PI * 2,
          distance: 2 + Math.random() * 5,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint background grid
      ctx.strokeStyle = "rgba(0, 0, 0, 0.02)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and draw particles
      particles.forEach((p) => {
        p.angle += p.speed * 0.02;
        
        // Sway particles gently around their base position
        const offsetX = Math.cos(p.angle) * p.distance;
        const offsetY = Math.sin(p.angle) * p.distance;
        p.x = p.baseX + offsetX;
        p.y = p.baseY + offsetY;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      init();
    };

    init();
    animate();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative min-h-screen bg-white flex flex-col items-center justify-between overflow-hidden select-none">
      {/* Interactive Stardust Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Top Header Navigation */}
      <div className="w-full max-w-[1280px] px-8 py-5 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-3">
          {/* Multi-Colored Google 'A' logo */}
          <div className="relative w-8 h-8 flex items-center justify-center font-grotesk font-black text-[22px] select-none">
            <span className="absolute inset-0 bg-gradient-to-tr from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853] bg-clip-text text-transparent transform -skew-x-12">
              A
            </span>
          </div>
          <span className="font-grotesk font-semibold text-[15px] text-black tracking-tight flex items-center gap-1">
            <span className="font-medium text-black/60">Google</span> Antigravity
          </span>
        </div>

        {/* Center menu dropdowns */}
        <div className="hidden md:flex items-center gap-7">
          {[
            { label: "Products", hasDropdown: true },
            { label: "Use Cases", hasDropdown: true },
            { label: "Pricing", hasDropdown: false },
            { label: "Blog", hasDropdown: false },
            { label: "Resources", hasDropdown: true },
          ].map((item) => (
            <a
              key={item.label}
              href="#"
              className="text-[13px] font-inter font-medium text-black/65 hover:text-black flex items-center gap-1 transition-colors"
            >
              {item.label}
              {item.hasDropdown && <ChevronDown size={12} className="text-black/30" />}
            </a>
          ))}
        </div>

        {/* Right download button */}
        <div>
          <button className="flex items-center gap-1.5 px-4.5 py-2 rounded-full bg-black text-white text-[12px] font-grotesk font-semibold hover:bg-black/95 transition-all shadow-md">
            Download
            <Download size={13} />
          </button>
        </div>
      </div>

      {/* Main Center Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-[720px] px-6 my-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-6"
        >
          {/* Antigravity Micro Badge */}
          <div className="flex items-center gap-1.5 justify-center">
            <div className="w-5 h-5 flex items-center justify-center font-grotesk font-black text-[13px] select-none">
              <span className="bg-gradient-to-r from-[#4285F4] to-[#EA4335] bg-clip-text text-transparent transform -skew-x-12">
                A
              </span>
            </div>
            <span className="text-[12px] font-inter font-semibold text-black tracking-tight">
              <span className="text-black/60 font-medium">Google</span> Antigravity
            </span>
          </div>

          <h1 
            className="font-grotesk font-semibold text-[clamp(36px,5.5vw,58px)] text-black leading-[1.08] tracking-tight max-w-[620px] mx-auto"
            style={{ letterSpacing: "-0.03em" }}
          >
            Experience liftoff with the next-gen agent platform
          </h1>

          <p className="font-inter text-[15px] text-black/45 max-w-[440px] mx-auto leading-relaxed">
            Build, run, and scale autonomous developer agents that integrate seamlessly with your existing toolchains.
          </p>

          {/* Action buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white font-grotesk font-semibold text-[13px] shadow-lg shadow-black/10 hover:bg-black/90 transition-all cursor-pointer">
              <Compass size={14} />
              Download for Windows
            </button>
            <button className="px-6 py-3 rounded-full bg-black/[0.04] hover:bg-black/[0.07] text-black font-grotesk font-semibold text-[13px] transition-all cursor-pointer border border-black/[0.02]">
              Explore use cases
            </button>
          </div>
        </motion.div>
      </div>

      {/* Decorative Spacer */}
      <div className="h-10 w-full" />
    </section>
  );
}
