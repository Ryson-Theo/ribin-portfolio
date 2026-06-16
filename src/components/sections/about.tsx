"use client";

import Image from "next/image";
import { portfolio } from "@/data/portfolio";

export default function About() {
  return (
    <section
      id="about"
      className="
        relative
        py-40
        border-t
        border-white/10
      "
    >
      <div className="container mx-auto px-8 lg:px-16">
        {/* Main Grid */}

        <div className="grid lg:grid-cols-[1.8fr_0.6fr] gap-24 items-center">
          {/* LEFT */}

          <div className="lg:pr-12">
            <h2
              className="
                font-heading
                uppercase
                leading-[0.9]
                tracking-tighter
                text-4xl
                md:text-5xl
              "
            >
              About
            </h2>
            <p className="mt-6 text-lg md:text-xl leading-8 text-zinc-300 max-w-[86ch]">
              I build digital products with a focus on clean engineering, thoughtful design, and continuous learning. Working across full-stack development, backend systems, and user experience design, I enjoy turning complex ideas into practical, well-crafted solutions. As I continue exploring AI, machine learning, and modern infrastructure, my goal is to create technology that is not only scalable and reliable, but also meaningful and genuinely useful to the people who use it.
            </p>
          </div>

          {/* RIGHT - Circular profile */}

          <div className="flex justify-start lg:justify-start">
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl transform transition-transform duration-500 hover:shadow-[0_24px_60px_rgba(0,0,0,0.6)] hover:transform-[perspective(800px)_rotateX(5deg)_rotateY(-4deg)_translateY(-6px)] lg:-translate-x-6">
              <Image
                src="/images/profile.jpg"
                alt={portfolio.name}
                fill
                priority
                sizes="(max-width: 768px) 192px, 256px"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-black/8 mix-blend-overlay pointer-events-none rounded-full transition-opacity duration-300" />
            </div>
          </div>
        </div>

        {/* Marquee Tech Stack Block */}
        <div
          className="
            mt-32
            overflow-hidden
            rounded-3xl
            border
            border-white/10
            bg-white/3
            backdrop-blur-xl
          "
        >
          <div className="py-8">
            <div className="marquee flex min-w-full items-center overflow-hidden">
              <div className="marquee-track inline-flex whitespace-nowrap gap-16 text-lg md:text-xl text-zinc-100">
                <span className="inline-flex items-center gap-2">
                  <strong className="text-white">Frontend:</strong>
                  React • JavaScript • Tailwind CSS
                </span>
                <span className="inline-flex items-center gap-2">
                  <strong className="text-white">Backend:</strong>
                  Node.js • Express.js • PHP
                </span>
                <span className="inline-flex items-center gap-2">
                  <strong className="text-white">Databases:</strong>
                  MongoDB • MySQL
                </span>
                <span className="inline-flex items-center gap-2">
                  <strong className="text-white">DevOps & Tools:</strong>
                  Git • Docker
                </span>
                <span className="inline-flex items-center gap-2">
                  <strong className="text-white">Data & AI:</strong>
                  Python • OpenCV • TensorFlow <span className="text-zinc-400">(Prototyping)</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <strong className="text-white">Frontend:</strong>
                  React • JavaScript • Tailwind CSS
                </span>
                <span className="inline-flex items-center gap-2">
                  <strong className="text-white">Backend:</strong>
                  Node.js • Express.js • PHP
                </span>
                <span className="inline-flex items-center gap-2">
                  <strong className="text-white">Databases:</strong>
                  MongoDB • MySQL
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}