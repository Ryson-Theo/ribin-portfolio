"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
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
  const [hasMounted, setHasMounted] = useState(false);

  // OPTIMIZATION: Light client-side mounting transition to protect mobile processors
 useEffect(() => {
    const timer = setTimeout(() => {
      setHasMounted(true);
    }, 16); // Defer by ~1 frame (16ms) to eliminate synchronous cascading render loops
    
    return () => clearTimeout(timer);
  }, []);

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
    event.stopPropagation();
    dragActive.current = true;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  };

  useEffect(() => {
    if (!hasMounted) return;

    // OPTIMIZATION: Throttling event execution loops with requestAnimationFrame to prevent rendering freezes
    let animationFrameId: number;

    const handlePointerMove = (event: PointerEvent) => {
      if (!dragActive.current) return;
      
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        updateScrollFromPosition(event.clientX);
      });
    };

    const handlePointerUp = () => { dragActive.current = false; };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [hasMounted]);

  // Render a clean structure container matching sizes until page fully processes
  if (!hasMounted) {
    return <section id="designs" className="min-h-screen bg-transparent border-t border-white/10" />;
  }

  return (
    <section id="designs" className="relative py-20 md:py-36 border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-8 lg:px-16">
        
        {/* Header Block */}
        <div className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="font-heading uppercase leading-[0.9] tracking-tighter text-4xl md:text-5xl text-white">
              Designs
            </h2>
            <p className="mt-4 text-base md:text-lg leading-7 text-zinc-300 max-w-prose">
              Selected case studies, interfaces, and visual explorations.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-0">
            <a
              href="https://www.behance.net/ribinkroy"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10 active:scale-95"
            >
              View More
            </a>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="flex items-center justify-center h-9 w-9 rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15 active:scale-95"
                aria-label="Previous design"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="flex items-center justify-center h-9 w-9 rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15 active:scale-95"
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
        <div className="relative mt-8 overflow-visible pt-4 md:pt-12">
          <div className="relative flex items-center gap-4">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex gap-4 md:gap-6 overflow-x-auto overflow-y-visible pb-8 pl-2 pr-4 snap-x snap-mandatory flex-1 transform-gpu [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none"
            >
            {designs.map((design) => (
              <article
                key={design.title}
                className="group relative z-10 w-[85vw] sm:w-96 shrink-0 snap-center h-96 overflow-hidden rounded-4xl border border-white/10 bg-slate-950/40 shadow-2xl backdrop-blur-3xl transition-all duration-300 hover:z-50 hover:border-white/20 animate-fade-in"
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
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 shrink-0 active:scale-95"
                    >
                      <BehanceIcon className="h-4 w-4" />
                    </a>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">
                    {design.description}
                  </p>
                </div>

                {/* Interactive Folder Container Layer */}
                <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center h-[45%] overflow-visible pointer-events-none group-hover:pointer-events-auto">
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
                                alt={`Preview visual for ${design.title}`}
                                fill 
                                sizes="(max-width: 640px) 70vw, (max-width: 1024px) 300px, 300px"
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

          {/* Carousel Track Scroll Line - Hidden on Mobile to let native Touch gestures slide smoothly */}
          <div
            ref={trackRef}
            onPointerDown={handleTrackPointerDown}
            className="hidden sm:flex mt-6 relative h-6 w-full cursor-pointer group/track items-center"
            style={{ touchAction: "none" }}
          >
            {/* Visual background track */}
            <div className="absolute inset-x-0 h-1 rounded-full bg-slate-700/30" />
            
            {/* The draggable Thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center h-8 w-8 cursor-grab active:cursor-grabbing"
              style={{ left: `calc(${Math.min(Math.max(scrollProgress, 0), 100)}% - 16px)`, touchAction: "none" }}
              onPointerDown={handleThumbPointerDown}
            >
              <div className="h-3 w-3 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-transform group-active/track:scale-110" />
            </div>
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