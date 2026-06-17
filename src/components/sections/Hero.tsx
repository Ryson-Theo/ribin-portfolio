"use client";

import Image from "next/image";
import DotGrid from "@/components/effects/DotGrid";
import { portfolio } from "@/data/portfolio";
import { Button } from "@/components/ui/button";
import DecryptedText from "@/components/ui/DecryptedText";

export default function Hero() {
  // Fix: Pad out strings so length-based array index decryption transitions seamlessly
  const primaryText = "FULL STACK DEVELOPER";
  const targetHoverName = portfolio.name.toUpperCase();
  const normalizedHoverText = targetHoverName.padEnd(primaryText.length, " ");

  return (
    <section 
      id="hero" 
      className="relative min-h-screen w-full bg-linear-to-b from-black via-[#040404] to-[#050305] text-white flex flex-col justify-center overflow-hidden"
    >
      {/* Tailwind handles visibility via 'hidden lg:block', making server/client markup matching perfect. */}
      <div className="hidden lg:block absolute inset-0 opacity-60 pointer-events-none z-0">
        <DotGrid
          dotSize={1.8}
          gap={22}
          baseColor="#262626"
          activeColor="#ffffff"
          proximity={150}
        />
      </div>

      {/* Modern Radial Overlays */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.03),transparent_30%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent)] mix-blend-overlay" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-20 container mx-auto px-4 sm:px-8 lg:px-16 pt-24 pb-16 sm:pt-28 lg:pt-32 lg:pb-20 w-full">
        <div className="grid lg:grid-cols-[1.7fr_0.5fr] gap-10 lg:gap-12 items-center w-full">
          
          {/* LEFT COLUMN: Main Typography & CTA Blocks */}
          <div className="text-left order-1 lg:order-0">
            <p className="uppercase tracking-[0.4em] text-[10px] sm:text-[11px] text-zinc-500 mb-4 md:mb-6">
              Based in Kerala, India
            </p>

            {/* Typography Wrapper (Added tracking tweaks and min-height boundary) */}
            <div className="inline-block w-full select-none cursor-default min-h-[1.1em]">
              <DecryptedText
                text={primaryText}
                hoverText={normalizedHoverText}
                animateOn="hover"
                speed={35}
                maxIterations={12}
                sequential
                revealDirection="center"
                className="text-white font-medium"
                encryptedClassName="text-zinc-600 font-normal opacity-80"
                parentClassName="block text-3xl sm:text-5xl md:text-[75px] lg:text-[95px] xl:text-[115px] font-heading uppercase leading-[0.9] tracking-tighter whitespace-pre-wrap break-words transition-all duration-300"
              />
            </div>

            <div className="mt-6 md:mt-8 text-lg sm:text-xl md:text-3xl text-zinc-300 font-medium opacity-95">
              Interfaces ✦ Systems ✦ Intelligence
            </div>

            <blockquote className="mt-6 md:mt-8 border-l-2 border-white/10 pl-4 md:pl-6 text-sm sm:text-lg text-zinc-400 italic max-w-2xl">
              Creating modern digital products through design, engineering, and AI exploration.
            </blockquote>

            <div className="flex flex-wrap gap-4 mt-8 md:mt-12 justify-start">
              <Button asChild className="rounded-full bg-white text-black px-8 h-12 hover:scale-[1.02] shadow-lg transition-transform cursor-pointer text-sm font-semibold">
                <a href="https://github.com/Ryson-Theo" target="_blank" rel="noreferrer">
                  View Work
                </a>
              </Button>

              <Button asChild variant="outline" className="rounded-full px-8 h-12 border-white/10 bg-white/5 backdrop-blur-xl hover:scale-[1.02] transition-transform cursor-pointer text-sm font-medium text-white">
                <a href="https://www.linkedin.com/in/ribin-k-roy/" target="_blank" rel="noreferrer">
                  Let&apos;s Connect
                </a>
              </Button>
            </div>

            <div className="mt-8 md:mt-12 text-xs sm:text-sm uppercase tracking-[0.2em] text-zinc-500">
              Available Worldwide
            </div>
          </div>

          {/* RIGHT COLUMN: Premium Card Avatar */}
          <div className="flex justify-center lg:justify-end lg:pr-8 order-0 lg:order-1 mt-2 lg:mt-0">
            <div className="relative w-60 h-72 sm:w-72 sm:h-96 md:w-80 md:h-104 rounded-[28px] overflow-hidden shadow-2xl lg:translate-x-6 lg:-translate-y-8 transform transition-all duration-500 group border border-white/15 backdrop-blur-sm">
              <div className="absolute -inset-10 bg-white/5 blur-3xl rounded-[28px] pointer-events-none" />

              <Image
                src="/images/anime-pfp.png"
                alt="Illustration Avatar"
                fill
                priority
                sizes="(max-width: 768px) 240px, 320px"
                className="object-cover transition-transform duration-700 ease-out lg:group-hover:scale-105"
              />
              
              <div className="absolute inset-0 bg-linear-to-br from-white/10 via-white/5 to-black/20 pointer-events-none" />

              <div className="absolute inset-x-0 bottom-0 py-6 px-6 bg-linear-to-t from-black via-black/75 to-transparent pointer-events-none">
                <h3 className="text-base sm:text-lg font-semibold text-white">{portfolio.name}</h3>
                <p className="text-xs sm:text-sm text-zinc-300">{portfolio.role}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}