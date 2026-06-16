"use client";

import Image from "next/image";
import DotGrid from "@/components/effects/DotGrid";
import { portfolio } from "@/data/portfolio";
import { Button } from "@/components/ui/button";
import DecryptedText from "@/components/ui/DecryptedText";

export default function Hero() {
  return (
    <section 
      id="hero" 
      className="relative min-h-screen w-full overflow-x-hidden bg-linear-to-b from-black via-[#040404] to-[#050305] text-white flex flex-col justify-center"
    >
      
      {/* Dot Grid Background Layer */}
      <div className="absolute inset-0 opacity-60 pointer-events-none z-0">
        <DotGrid
          dotSize={1.8}
          gap={22}
          baseColor="#262626"
          activeColor="#ffffff"
          proximity={150}
        />
      </div>

      {/* Modern Noise & Radial Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.03),transparent_30%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent)] mix-blend-overlay" />
      </div>

      {/* Hero Content Container - Tighter, balanced padding configuration */}
      <div className="relative z-20 container mx-auto px-4 lg:px-8 pt-24 pb-16 sm:pt-28 lg:pt-32 lg:pb-20 w-full">
        <div className="grid lg:grid-cols-[1.7fr_0.5fr] gap-10 lg:gap-12 items-center w-full">
          
          {/* LEFT COLUMN: Main Typography & CTA Blocks */}
          <div className="text-left order-1 lg:order-0">
            <p className="uppercase tracking-[0.4em] text-[10px] sm:text-[11px] text-zinc-500 mb-6 md:mb-10">
              Based in Kerala, India
            </p>

            <div className="group relative inline-block w-full sm:w-auto">
              <h1 className="relative font-heading uppercase leading-[0.85] tracking-[-0.04em] text-4xl sm:text-6xl md:text-[128px] xl:text-[170px] transition-colors drop-shadow-xl">
                <span className="block transition-opacity duration-300 group-hover:opacity-0">
                  FULL STACK
                  <br />
                  DEVELOPER
                </span>
              </h1>

              <div className="absolute inset-0 flex items-center justify-start opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <DecryptedText
                  text={portfolio.name}
                  speed={35}
                  maxIterations={18}
                  sequential
                  revealDirection="center"
                  className="text-white font-semibold uppercase"
                  encryptedClassName="text-zinc-500 uppercase"
                  parentClassName="block text-3xl sm:text-5xl md:text-[120px] xl:text-[165px] font-heading uppercase leading-[0.85] tracking-[-0.08em]"
                />
              </div>
            </div>

            <div className="mt-4 md:mt-6 text-xl md:text-3xl text-zinc-300 font-medium opacity-95">
              Interfaces ✦ Systems ✦ Intelligence
            </div>

            <blockquote className="mt-6 md:mt-8 border-l-2 border-white/10 pl-4 md:pl-6 text-sm sm:text-lg text-zinc-400 italic max-w-2xl">
              Creating modern digital products through design, engineering, and AI exploration.
            </blockquote>

            <div className="flex flex-wrap gap-4 mt-8 md:mt-12 justify-start">
              <Button asChild className="rounded-full bg-white text-black px-8 h-12 hover:scale-[1.02] shadow-lg transition-transform cursor-pointer">
                <a href="https://github.com/Ryson-Theo" target="_blank" rel="noreferrer">
                  View Work
                </a>
              </Button>

              <Button asChild variant="outline" className="rounded-full px-8 h-12 border-white/10 bg-white/5 backdrop-blur-xl hover:scale-[1.02] transition-transform cursor-pointer">
                <a href="https://www.linkedin.com/in/ribin-k-roy/" target="_blank" rel="noreferrer">
                  Let&apos;s Connect
                </a>
              </Button>
            </div>

            <div className="mt-8 md:mt-12 text-xs sm:text-sm uppercase tracking-[0.2em] text-zinc-500">
              Available Worldwide
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive 3D Card Avatar */}
          <div className="flex justify-center lg:justify-end lg:pr-8 order-2 lg:order-0 mt-2 lg:mt-0">
            <div className="relative w-64 h-80 sm:w-72 sm:h-96 md:w-80 md:h-104 rounded-[28px] overflow-hidden shadow-2xl lg:translate-x-6 lg:-translate-y-8 transform transition-all duration-500 group hover:shadow-[0_30px_80px_rgba(0,0,0,0.8)] group-hover:transform-[perspective(1000px)_rotateX(6deg)_rotateY(-6deg)_translateY(-8px)] border border-white/15 backdrop-blur-sm">
              
              {/* Deep Glow Asset */}
              <div className="absolute -inset-10 bg-white/5 blur-3xl rounded-[28px] pointer-events-none" />

              <Image
                src="/images/anime-pfp.png"
                alt="Anime Version Illustration"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              
              {/* Dynamic Overlay Gradient */}
              <div className="absolute inset-0 bg-linear-to-br from-white/8 via-white/2 to-black/20 group-hover:via-white/4 transition-colors duration-300 pointer-events-none" />

              {/* Title Identity Tag */}
              <div className="absolute inset-x-0 bottom-0 py-6 px-6 bg-linear-to-t from-black/90 via-black/75 to-transparent pointer-events-none">
                <h3 className="text-lg sm:text-xl font-semibold">{portfolio.name}</h3>
                <p className="text-xs sm:text-sm text-zinc-300">{portfolio.role}</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}