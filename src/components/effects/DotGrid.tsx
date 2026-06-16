"use client";

import {
  useEffect,
  useRef,
  useCallback,
} from "react";

interface Dot {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
}

interface DotGridProps {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  shockRadius?: number;
  shockStrength?: number;
  resistance?: number;
  returnDuration?: number;
  className?: string;
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
    hex
  );

  if (!result)
    return {
      r: 255,
      g: 255,
      b: 255,
    };

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

export default function DotGrid({
  dotSize = 1.8,
  gap = 24,
  baseColor = "#262626",
  activeColor = "#ffffff",
  proximity = 150,
  shockRadius = 200,
  shockStrength = 4,
  resistance = 900,
  returnDuration = 1.8,
  className = "",
}: DotGridProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const dotsRef = useRef<Dot[]>([]);

  const mouseRef = useRef({
    x: -9999,
    y: -9999,
  });

  const buildGrid = useCallback(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;

    if (!wrapper || !canvas) return;

    const rect = wrapper.getBoundingClientRect();

    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const dots: Dot[] = [];

    for (let y = gap; y < rect.height; y += gap) {
      for (let x = gap; x < rect.width; x += gap) {
        dots.push({
          x,
          y,
          ox: x,
          oy: y,
          vx: 0,
          vy: 0,
        });
      }
    }

    dotsRef.current = dots;
  }, [gap]);

  useEffect(() => {
    buildGrid();

    const resize = new ResizeObserver(() =>
      buildGrid()
    );

    if (wrapperRef.current) {
      resize.observe(wrapperRef.current);
    }

    return () => resize.disconnect();
  }, [buildGrid]);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();

      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const leave = () => {
      mouseRef.current = {
        x: -9999,
        y: -9999,
      };
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
    };
  }, []);

  useEffect(() => {
    let frame: number;

    const base = hexToRgb(baseColor);
    const active = hexToRgb(activeColor);

    const render = () => {
      const canvas = canvasRef.current;

      if (!canvas) {
        frame = requestAnimationFrame(render);
        return;
      }

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        frame = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      dotsRef.current.forEach((dot) => {
        const dx = dot.x - mx;
        const dy = dot.y - my;

        const distance = Math.sqrt(
          dx * dx + dy * dy
        );

        if (distance < shockRadius) {
          const force =
            (1 - distance / shockRadius) *
            shockStrength;

          const angle = Math.atan2(dy, dx);

          dot.vx += Math.cos(angle) * force;
          dot.vy += Math.sin(angle) * force;
        }

        dot.vx +=
          (dot.ox - dot.x) /
          resistance *
          returnDuration;

        dot.vy +=
          (dot.oy - dot.y) /
          resistance *
          returnDuration;

        dot.vx *= 0.92;
        dot.vy *= 0.92;

        dot.x += dot.vx;
        dot.y += dot.vy;

        let color = baseColor;

        if (distance < proximity) {
          const t =
            1 - distance / proximity;

          const r = Math.round(
            base.r + (active.r - base.r) * t
          );

          const g = Math.round(
            base.g + (active.g - base.g) * t
          );

          const b = Math.round(
            base.b + (active.b - base.b) * t
          );

          color = `rgb(${r},${g},${b})`;
        }

        ctx.beginPath();

        ctx.arc(
          dot.x,
          dot.y,
          dotSize,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = color;
        ctx.fill();
      });

      frame = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(frame);
  }, [
    activeColor,
    baseColor,
    dotSize,
    proximity,
    shockRadius,
    shockStrength,
    resistance,
    returnDuration,
  ]);

  return (
    <div
      ref={wrapperRef}
      className={`absolute inset-0 ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}