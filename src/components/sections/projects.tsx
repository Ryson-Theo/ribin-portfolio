'use client';

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from 'react';

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703C6.73 19.91 6.14 18.274 6.14 18.274c-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.607.069-.607 1.003.07 1.531 1.031 1.531 1.031.892 1.529 2.341 1.087 2.91.832.091-.647.35-1.087.636-1.337-2.665-.305-5.467-1.333-5.467-5.93 0-1.31.469-2.381 1.236-3.221-.124-.304-.536-1.527.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404 11.5 11.5 0 0 1 3.003.404c2.291-1.552 3.297-1.23 3.297-1.23.654 1.649.242 2.872.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.807 5.624-5.48 5.921.36.31.68.92.68 1.855 0 1.338-.013 2.419-.013 2.749 0 .268.18.58.688.481A10.013 10.013 0 0 0 22 12c0-5.523-4.477-10-10-10z"
    />
  </svg>
);

const projects = [
  {
    title: "Interactive Developer Portfolio",
    description: "A high-performance, responsive portfolio engineered with Next.js 16 (Turbopack), TypeScript, and Tailwind CSS. Fully type-safe and optimized for instant static delivery via Vercel.",
    source: "https://github.com/Ryson-Theo/ribin-portfolio",
    preview: "https://ribin-portfolio.vercel.app",
    image: "/images/portfolio-preview.png",
  },
  {
    title: "CropVector",
    description: "Agritech platform for farmers, buyers, experts and admins — unified crop & marketplace management.",
    source: "https://github.com/Ryson-Theo/CropVector",
    preview: "https://github.com/Ryson-Theo/CropVector/blob/main/UI_PREVIEW.md",
    image: "/images/cropvector.png",
  },
  {
    title: "RemoteTeamPro",
    description: "Self-hosted PHP/MySQL team management for small teams — tasks, attendance, messaging, and client access.",
    source: "https://github.com/Ryson-Theo/RemoteTeamPro",
    live: "https://ryson-theo.github.io/RemoteTeamPro/",
    image: "/images/RemoteTeamPro.png",
  },
  {
    title: "Next Release",
    description: "Currently in private beta. Coming soon on GitHub.",
    source: "https://github.com/Ryson-Theo",
    image: "/images/new.png",
    upcoming: true,
  },
];

export default function Projects() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragActive = useRef(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 340, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -340, behavior: "smooth" });
    }
  };

  const updateScrollFromPosition = (clientX: number) => {
    if (!scrollRef.current || !trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const progress = rect.width > 0 ? (x / rect.width) * 100 : 0;

    const { scrollWidth, clientWidth } = scrollRef.current;
    scrollRef.current.scrollLeft = ((scrollWidth - clientWidth) * progress) / 100;
    setScrollProgress(progress);
  };

  const handleScroll = () => {
    if (dragActive.current || !scrollRef.current) return;

    requestAnimationFrame(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
      setScrollProgress(progress);
    });
  };

  const handleTrackPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragActive.current = true;
    updateScrollFromPosition(event.clientX);
  };

  const handleThumbPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragActive.current = true;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  };

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!dragActive.current) return;
      updateScrollFromPosition(event.clientX);
    };

    const handlePointerUp = () => {
      dragActive.current = false;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  return (
    <section id="projects" className="relative py-20 md:py-36 border-t border-white/10 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="font-heading uppercase leading-[0.9] tracking-tighter text-4xl md:text-5xl">
              Projects
            </h2>
            <p className="mt-4 text-base md:text-lg leading-7 text-zinc-300 max-w-[86ch]">
              Selected work with source links and live demos.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-0">
            <a
              href="https://github.com/Ryson-Theo"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-white transition"
            >
              View More
            </a>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="flex items-center justify-center h-9 w-9 rounded-full border border-white/15 bg-white/10 text-white transition-all duration-200 hover:bg-white/15"
                aria-label="Previous"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="flex items-center justify-center h-9 w-9 rounded-full border border-white/15 bg-white/10 text-white transition-all duration-200 hover:bg-white/15"
                aria-label="Next"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="relative mt-8 overflow-visible pt-4 md:pt-12">
          <div className="relative flex items-center gap-4">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex gap-4 md:gap-6 overflow-x-auto pb-6 pl-1 pr-4 snap-x snap-mandatory scrollbar-none flex-1 -mx-4 px-4 md:mx-0 md:px-0"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {projects.map((project) => (
                <article
                  key={project.title}
                  className="group relative z-10 w-[85vw] sm:w-88 md:min-w-[24rem] h-80 shrink-0 overflow-hidden rounded-3xl md:rounded-4xl border border-white/10 bg-slate-950/80 lg:bg-slate-950/40 shadow-xl backdrop-blur-none lg:backdrop-blur-3xl transition-transform duration-300 will-change-transform snap-center"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-transparent pointer-events-none z-0" />

                  <div className="absolute left-5 right-5 top-6 flex flex-col gap-3 z-10">
                    <div className="flex items-start gap-3">
                      <h3 className="text-lg font-semibold text-white flex-1 leading-7 pb-2 z-20">
                        {project.title}
                      </h3>
                      <a
                        href={project.source}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`GitHub repository for ${project.title}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition shrink-0 mt-0.5"
                      >
                        <GitHubIcon className="h-4 w-4" />
                      </a>

                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Live site for ${project.title}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 ml-2 shrink-0"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                            <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M15 3h6v6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10 14L21 3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </a>
                      )}

                      {project.preview && (
                        <a
                          href={project.preview}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Preview for ${project.title}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 ml-2 shrink-0"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                            <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8S2 12 2 12z" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-zinc-300 leading-6 max-w-[18rem]">
                      {project.description}
                    </p>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-[50%] overflow-hidden">
                    <Image 
                      src={project.image} 
                      alt={`${project.title} preview`} 
                      fill 
                      priority={false}
                      sizes="(max-width: 768px) 85vw, (max-width: 1200px) 50vw, 400px"
                      className="object-cover" 
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Progress Scrollbar track */}
          <div
            ref={trackRef}
            onPointerDown={handleTrackPointerDown}
            className="mt-6 relative h-1 w-full rounded-full bg-slate-700/20 cursor-pointer touch-none"
          >
            <div className="absolute inset-0 rounded-full bg-slate-700/20" />
            <div className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 rounded-full bg-slate-500/30" />
            <div
              onPointerDown={handleThumbPointerDown}
              className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-lg cursor-grab active:cursor-grabbing will-change-[left]"
              style={{ left: `${Math.min(Math.max(scrollProgress, 0), 100)}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}