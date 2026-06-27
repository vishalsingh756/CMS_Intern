import AntigravityHero from "@/components/AntigravityHero";
import AntigravityIntro from "@/components/AntigravityIntro";
import AntigravityFeatures from "@/components/AntigravityFeatures";
import AntigravityDevelopers from "@/components/AntigravityDevelopers";
import AntigravitySplitCTA from "@/components/AntigravitySplitCTA";
import AntigravityBlogs from "@/components/AntigravityBlogs";
import AntigravityBottomDownload from "@/components/AntigravityBottomDownload";
import AntigravityFooter from "@/components/AntigravityFooter";

export default function Home() {
  return (
    <main className="relative bg-white min-h-screen text-black select-none overflow-x-hidden">
      {/* Root layout wrapper with the exact Antigravity components sequence */}
      <AntigravityHero />
      <AntigravityIntro />
      <AntigravityFeatures />
      <AntigravityDevelopers />
      <AntigravitySplitCTA />
      <AntigravityBlogs />
      <AntigravityBottomDownload />
      <AntigravityFooter />
    </main>
  );
}
