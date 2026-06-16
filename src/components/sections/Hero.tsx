// src/components/sections/Hero.tsx

"use client";

import Image from "next/image";

import DotGrid from "@/components/effects/DotGrid";

import { portfolio } from "@/data/portfolio";
import { Button } from "@/components/ui/button";
import DecryptedText from "@/components/ui/DecryptedText";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-linear-to-b from-black via-[#040404] to-[#050305] text-white">
      {/* Dot Grid Background */}

      <div className="absolute inset-0 opacity-60">
        <DotGrid
          dotSize={1.8}
          gap={22}
          baseColor="#262626"
          activeColor="#ffffff"
          proximity={150}
        />
      </div>

      {/* Noise Overlay */}

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.03),transparent_30%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent)] mix-blend-overlay" />
      </div>

      {/* Hero Content */}

      <div className="relative z-20 container mx-auto px-4 lg:px-8 min-h-screen flex items-start pt-24 lg:pt-32">
        <div className="grid lg:grid-cols-[1.7fr_0.5fr] gap-12 items-center w-full">
          {/* LEFT */}

          <div className="text-left">
            <p
              className="
                uppercase
                tracking-[0.4em]
                text-[11px]
                text-zinc-500
                mb-10
              "
            >
              Based in Kerala, India
            </p>

            <div className="group relative inline-block">
              <h1
                className="
                  relative
                  font-heading
                  uppercase
                  leading-[0.82]
                  tracking-[-0.04em]
                  text-[80px]
                  md:text-[128px]
                  xl:text-[170px]
                  transition-colors
                  drop-shadow-xl
                "
              >
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
                  parentClassName="block text-[72px] md:text-[120px] xl:text-[165px] font-heading uppercase leading-[0.82] tracking-[-0.08em]"
                />
              </div>
            </div>

            <div className="mt-6 text-2xl md:text-3xl text-zinc-300 font-medium opacity-95">
              Interfaces ✦ Systems ✦ Intelligence
            </div>

            <blockquote className="mt-8 border-l-2 border-white/8 pl-6 text-lg text-zinc-400 italic max-w-2xl">
              Creating modern digital products through design, engineering, and AI exploration.
            </blockquote>

            <div className="flex flex-wrap gap-4 mt-12 justify-start">
              <Button asChild className="rounded-full bg-white text-black px-8 h-12 hover:scale-[1.02] shadow-lg transition-transform">
                <a href="https://github.com/Ryson-Theo" target="_blank" rel="noreferrer">
                  View Work
                </a>
              </Button>

              <Button asChild variant="outline" className="rounded-full px-8 h-12 border-white/10 bg-white/3 backdrop-blur-xl hover:scale-[1.02] transition-transform">
                <a href="https://www.linkedin.com/in/ribin-k-roy/" target="_blank" rel="noreferrer">
                  Let&apos;s Connect
                </a>
              </Button>
            </div>

            <div
              className="
                mt-12
                text-sm
                uppercase
                tracking-[0.2em]
                text-zinc-500
              "
            >
              Available Worldwide
            </div>
          </div>

          {/* RIGHT */}

          <div className="flex justify-end lg:pr-8">
            <div className="relative w-72 h-96 md:w-80 md:h-104 rounded-[28px] overflow-hidden shadow-2xl lg:translate-x-6 lg:-translate-y-8 transform transition-transform duration-500 group hover:shadow-[0_30px_80px_rgba(0,0,0,0.8)] group-hover:transform-[perspective(1000px)_rotateX(6deg)_rotateY(-6deg)_translateY(-8px)] border border-white/15 backdrop-blur-sm">
              <div className="absolute -inset-10 bg-white/5 blur-3xl rounded-[28px]" />

              <Image
  src="/images/anime-pfp.png"
  alt="Anime Version"
  fill
  priority
  sizes="(max-width: 768px) 50vw, 300px"
  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
/>
              <div className="absolute inset-0 bg-linear-to-br from-white/8 via-white/2 to-black/20 group-hover:via-white/4 transition-colors duration-300 pointer-events-none" />

              <div className="absolute inset-x-0 bottom-0 py-8 px-6 bg-linear-to-t from-black/90 via-black/75 to-transparent">
                <h3 className="text-xl font-semibold">{portfolio.name}</h3>

                <p className="text-sm text-zinc-300">{portfolio.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}