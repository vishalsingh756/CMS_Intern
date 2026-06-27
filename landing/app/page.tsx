import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustedBy from "@/components/TrustedBy";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Statistics from "@/components/Statistics";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative bg-[#050505] min-h-screen text-white select-none overflow-x-hidden">
      {/* Decorative top grid background */}
      <div className="absolute top-0 left-0 right-0 h-[100vh] bg-grid bg-repeat opacity-40 pointer-events-none z-0" />

      {/* Dynamic ambient background blobs */}
      <div className="absolute top-[-10%] left-[-20%] w-[80vw] h-[80vw] max-w-[1000px] rounded-full bg-[#5B8CFF]/5 blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-[30%] right-[-20%] w-[70vw] h-[70vw] max-w-[900px] rounded-full bg-[#7A5CFF]/3 blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] rounded-full bg-[#57E3FF]/3 blur-[140px] pointer-events-none z-0" />

      {/* Sticky Premium Navbar */}
      <Navbar />

      {/* Pages components */}
      <div className="relative z-10">
        <Hero />
        <TrustedBy />
        <Features />
        <HowItWorks />
        <Statistics />
        <Testimonials />
        <Pricing />
        <Faq />
        <Cta />
      </div>

      {/* Sticky Premium Footer */}
      <Footer />
    </main>
  );
}
