"use client";

import React, { useEffect, useRef, useState } from "react";

interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "blue" | "yellow" | "pink";
}

const variantGlow = {
  default: "rgba(255,255,255,0.2)",
  blue: "rgba(95,124,255,0.35)",
  yellow: "rgba(234,179,8,0.35)",
  pink: "rgba(236,72,153,0.35)",
};

export default function PixelCard({
  children,
  className = "",
  variant = "blue",
}: PixelCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!hovered) return;

    const canvas = canvasRef.current;
    const card = cardRef.current;

    if (!canvas || !card) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = card.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    const particles = Array.from({ length: 250 }).map(() => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      size: Math.random() * 3 + 1,
      opacity: Math.random(),
    }));

    let frame: number;

    const animate = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);

      particles.forEach((p) => {
        p.opacity -= 0.008;

        if (p.opacity <= 0) {
          p.opacity = 1;
          p.x = Math.random() * rect.width;
          p.y = Math.random() * rect.height;
        }

        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;

        ctx.fillRect(
          p.x,
          p.y,
          p.size,
          p.size
        );
      });

      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(frame);
  }, [hovered]);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        group
        relative
        overflow-hidden
        rounded-[36px]
        border
        border-white/10
        bg-white/3
        backdrop-blur-2xl
        shadow-[0_20px_80px_rgba(0,0,0,0.6)]
        ${className}
      `}
    >
      <div
        className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100"
        style={{
          boxShadow: `inset 0 0 80px ${variantGlow[variant]}`,
        }}
      />

      <div
        className="
          absolute
          inset-0
          bg-linear-to-b
          from-white/6
          via-transparent
          to-transparent
          pointer-events-none
        "
      />

      <canvas
        ref={canvasRef}
        className="
          absolute
          inset-0
          pointer-events-none
          z-30
        "
      />

      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );
}