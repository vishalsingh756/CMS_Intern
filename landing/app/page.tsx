import AntigravityHero from "@/components/AntigravityHero";
import AntigravityIde from "@/components/AntigravityIde";
import AntigravityFooter from "@/components/AntigravityFooter";

export default function Home() {
  return (
    <main className="relative bg-black min-h-screen text-white select-none overflow-x-hidden">
      {/* Root layout wrapper */}
      <AntigravityHero />
      <AntigravityIde />
      <AntigravityFooter />
    </main>
  );
}
