import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Google Antigravity",
  description:
    "Experience liftoff with the next-gen agent platform.",
  keywords: ["Google Antigravity", "AI platform", "agents", "IDE"],
};

export default function RootLayout({
  children,
  }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${outfit.variable} ${inter.variable} font-outfit antialiased bg-[#FFFFFF] text-black overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
