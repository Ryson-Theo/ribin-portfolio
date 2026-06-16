'use client';

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from 'react';
import Folder from "@/components/ui/Folder";

const BehanceIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M8.22 5.384c1.117 0 2.025.213 2.723.638.699.425 1.213.992 1.543 1.702.33.71.495 1.5.495 2.37 0 .975-.205 1.808-.614 2.5a4.341 4.341 0 0 1-1.742 1.68c.795.344 1.417.892 1.867 1.644.45.752.675 1.654.675 2.707 0 1.157-.272 2.146-.818 2.967a5.53 5.53 0 0 1-2.316 1.992c-1 .446-2.186.669-3.559.669H2V5.384h6.22zm1.616 9.87c0-.62-.172-1.122-.517-1.507-.344-.385-.838-.577-1.481-.577H5.21v4.111h2.512c.691 0 1.206-.168 1.543-.505.338-.337.507-.845.507-1.522zm-.233-5.592c0-.52-.152-.942-.455-1.265-.304-.323-.746-.484-1.328-.484H5.21v3.422h2.512c.594 0 1.036-.145 1.328-.435.293-.29.439-.7.439-1.238zM22 11.602H14.5c.012-.89.246-1.587.702-2.09.456-.504 1.096-.756 1.92-.756.76 0 1.347.227 1.761.682.414.455.64 1.033.68 1.734H22c-.047-1.406-.487-2.522-1.319-3.348C19.85 7.002 18.665 6.59 17.12 6.59c-1.637 0-2.955.534-3.953 1.602-1 1.068-1.499 2.514-1.499 4.337 0 1.777.487 3.208 1.46 4.292.974 1.084 2.273 1.626 3.897 1.626 1.547 0 2.766-.467 3.657-1.4 1-.95 1.424-2.27 1.424-3.935l-.106-1.51zm-4.88 3.518c-.734 0-1.31-.225-1.729-.675-.418-.45-.645-1.09-.68-1.92h4.743c-.024.84-.239 1.483-.647 1.93-.407.446-.968.665-1.687.665zM14.244 4h5.71v1.611h-5.71V4z"/>
  </svg>
);

const designs = [
  {
    title: "UI/UX Design Showcase",
    description: "A collection of user experience and interface layouts designed for responsive web systems and data-dense software viewports.",
    source: "https://www.behance.net/ribinkroy",
    folderColor: "#5227FF",
    previews: [
      "/images/vaporui-1.png",
      "/images/vaporui-2.png",
      "/images/vaporui-3.png"
    ]
  },
  {
    title: "Event Access Identity Kit",
    description: "High-fidelity credential pass design featuring complex vector line geometry, nested inline typography scales, and repeating security micro-text parameters for system access tokens.",
    source: "https://www.behance.net/ribinkroy",
    folderColor: "#00F5FF",
    previews: [
      "/images/event-id-staff.png",
      "/images/event-id-mockup.png",
      "/images/event-id-mockup2.png"
    ]
  },
  {
    title: "Future Concepts", 
    description: "Exploring new creative horizons in user experience design. Fresh interface case studies, layout explorations, and visual concepts are currently in development.",
    source: "https://www.behance.net/ribinkroy",
    folderColor: "#FF2775",
    upcoming: true,
    previews: []
  },
];

export default function Designs() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragActive = useRef(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollAnimRef = useRef<number | null>(null);

  const handleNext = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 408, behavior: "smooth" });
  };

  const handlePrev = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -408, behavior: "smooth" });
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
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const progress = scrollWidth > clientWidth ? (scrollLeft / (scrollWidth - clientWidth)) * 100 : 0;
      setScrollProgress(progress);
    }
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
    const handlePointerUp = () => { dragActive.current = false; };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      if (scrollAnimRef.current) cancelAnimationFrame(scrollAnimRef.current);
    };
  }, []);

  const scrollToCard = (el: HTMLElement, duration = 800) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const start = container.scrollLeft;
    const target = el.offsetLeft - (container.clientWidth - el.clientWidth) / 2;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    const clampedTarget = Math.max(0, Math.min(target, maxScrollLeft));
    const distance = clampedTarget - start;
    if (Math.abs(distance) < 1) return;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const startTime = performance.now();

    if (scrollAnimRef.current) cancelAnimationFrame(scrollAnimRef.current);

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(t);
      container.scrollLeft = start + distance * eased;
      if (t < 1) {
        scrollAnimRef.current = requestAnimationFrame(step);
      } else {
        scrollAnimRef.current = null;
      }
    };

    scrollAnimRef.current = requestAnimationFrame(step);
  };

  return (
    <section id="designs" className="relative py-36 border-t border-white/10">
      <div className="container mx-auto px-8 lg:px-16">
        
        {/* Header Block */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="font-heading uppercase leading-[0.9] tracking-tighter text-4xl md:text-5xl">
              Designs
            </h2>
            <p className="mt-4 text-base md:text-lg leading-7 text-zinc-300 max-w-[86ch]">
              Selected case studies, interfaces, and visual explorations.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-0">
            <a
              href="https://www.behance.net/ribinkroy"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              View More
            </a>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="flex items-center justify-center h-9 w-9 rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15"
                aria-label="Previous design"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="flex items-center justify-center h-9 w-9 rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15"
                aria-label="Next design"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Outer View Track Wrapper */}
        <div className="relative mt-8 overflow-visible pt-12">
          <div className="relative flex items-center gap-4">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex gap-6 overflow-x-auto overflow-visible pb-8 pl-2 pr-4 snap-x snap-mandatory scrollbar-hide flex-1"
            >
            {designs.map((design) => (
              <article
                key={design.title}
                onMouseEnter={(e) => scrollToCard(e.currentTarget as HTMLElement)}
                className="group relative z-10 min-w-[24rem] h-96 shrink-0 overflow-hidden rounded-4xl border border-white/10 bg-slate-950/40 shadow-2xl backdrop-blur-3xl transition-all duration-300 hover:z-50 hover:border-white/20 animate-fade-in"
              >
                <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-transparent pointer-events-none z-0" />

                {/* Content Head Block */}
                <div className="absolute left-6 right-6 top-6 flex flex-col gap-2 z-10">
                  <div className="flex items-start gap-3">
                    <h3 className="text-xl font-bold text-white flex-1 tracking-normal leading-normal">
                      {design.title}
                    </h3>
                    <a
                      href={design.source}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Behance presentation for ${design.title}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 shrink-0"
                    >
                      <BehanceIcon className="h-4 w-4" />
                    </a>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed max-w-76">
                    {design.description}
                  </p>
                </div>

                {/* Interactive Folder Container Layer */}
                <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center h-[45%] overflow-visible">
                  <Folder 
                    color={design.folderColor} 
                    size={1.4} 
                    className="origin-center"
                    items={
                      design.upcoming 
                        ? [
                            <div key="up1" className="w-full h-full flex items-center justify-center text-xl">⏳</div>,
                            <div key="up2" className="w-full h-full flex items-center justify-center text-xl">✨</div>,
                            <div key="up3" className="w-full h-full flex items-center justify-center text-xs text-zinc-400 font-mono p-1 text-center">BETA</div>
                          ]
                        : design.previews.map((imgSrc, imgIndex) => (
                            <div key={imgIndex} className="relative w-full h-full">
                              <Image 
                                src={imgSrc} 
                                alt="preview item" 
                                fill 
                                sizes="(max-width: 640px) 30vw, (max-width: 1024px) 25vw, 250px"
                                className="object-cover"
                              />
                            </div>
                          ))
                    }
                  />
                </div>
              </article>
            ))}
            </div>
          </div>

          {/* Carousel Track Scroll Line */}
          <div
            ref={trackRef}
            onPointerDown={handleTrackPointerDown}
            className="mt-6 relative h-1 w-full rounded-full bg-slate-700/20 cursor-pointer"
            style={{ touchAction: 'none' }}
          >
            <div className="absolute inset-0 rounded-full bg-slate-700/20" />
            <div className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 rounded-full bg-slate-500/30" />
            <div
              onPointerDown={handleThumbPointerDown}
              className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-lg cursor-grab"
              style={{ left: `${Math.min(Math.max(scrollProgress, 0), 100)}%`, touchAction: 'none' }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
      `}</style>
    </section>
  );
}