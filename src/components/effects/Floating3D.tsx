'use client';

import React, { useEffect, useRef } from 'react';

export default function FloatingMacBot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const time = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        mousePos.current = {
          x: e.clientX - (rect.left + rect.width / 2),
          y: e.clientY - (rect.top + rect.height / 2),
        };
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Extra gentle, slow floating speed
      time.current += 0.006; 
      const floatY = Math.sin(time.current) * 12;
      
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Adjusted to "Center-Right-Top" orientation
      const centerX = canvas.width / 2 + 50;            // Nudged right
      const centerY = canvas.height / 2 + floatY - 100; // Shifted significantly up

      // 1. Clear with pitch black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(centerX, centerY);

      // --- 2. Classic Macintosh Chassis ---
      const width = 260;
      const height = 270;
      const radius = 24;
      
      const bodyGrad = ctx.createRadialGradient(-30, -50, 20, 0, 0, height);
      bodyGrad.addColorStop(0, '#ffffff');    
      bodyGrad.addColorStop(0.4, '#e2e8f0');  
      bodyGrad.addColorStop(0.85, '#cbd5e1'); 
      bodyGrad.addColorStop(1, '#94a3b8');    
      
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.roundRect(-width / 2, -height / 2, width, height, radius);
      ctx.fill();

      // Classic Mac "Chin" horizontal groove
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-width / 2 + 20, height / 2 - 35);
      ctx.lineTo(width / 2 - 20, height / 2 - 35);
      ctx.stroke();

      // Floppy Disk Slot Detail
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.roundRect(width / 4, height / 2 - 25, 35, 5, 1);
      ctx.fill();

      // --- 3. Maximized Big Computer Screen ---
      ctx.fillStyle = '#0f1115';
      ctx.strokeStyle = '#64748b'; 
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(-115, -115, 230, 165, 16);
      ctx.fill();
      ctx.stroke();

      // Screen gloss glare
      const screenGlare = ctx.createLinearGradient(-115, -115, 50, 30);
      screenGlare.addColorStop(0, 'rgba(255, 255, 255, 0.06)');
      screenGlare.addColorStop(0.6, 'rgba(255, 255, 255, 0.0)');
      ctx.fillStyle = screenGlare;
      ctx.fill();

      // --- 4. Interactive Screen Eyes Only ---
      const maxOffsetX = 35;
      const maxOffsetY = 22;
      const faceOffsetX = Math.min(Math.max(mousePos.current.x * 0.05, -maxOffsetX), maxOffsetX);
      const faceOffsetY = Math.min(Math.max(mousePos.current.y * 0.05, -maxOffsetY), maxOffsetY);
      
      ctx.save();
      ctx.translate(faceOffsetX, faceOffsetY - 32); 

      ctx.fillStyle = '#00d2ff'; 
      ctx.shadowColor = '#00d2ff';
      ctx.shadowBlur = 8; 
      
      const p = 6; 

      // Left Eye
      ctx.fillRect(-50, -12, 2.5 * p, 4 * p);
      
      // Right Eye
      ctx.fillRect(30, -12, 2.5 * p, 4 * p);

      ctx.restore();

      // --- 5. Matching Platinum Keyboard ---
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.roundRect(-120, height / 2 + 25, 240, 24, 6);
      ctx.fill();

      // Dark Keybed Inset
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.roundRect(-114, height / 2 + 29, 228, 16, 3);
      ctx.fill();

      // Grid simulation lines for keys
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      for (let i = -104; i < 110; i += 16) {
        ctx.beginPath();
        ctx.moveTo(i, height / 2 + 29);
        ctx.lineTo(i, height / 2 + 45);
        ctx.stroke();
      }

      // --- 6. Matching Platinum Mouse ---
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.roundRect(140, height / 2 + 27, 24, 34, 6);
      ctx.fill();

      // Mouse button split line profile
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(152, height / 2 + 27);
      ctx.lineTo(152, height / 2 + 40);
      ctx.moveTo(140, height / 2 + 40);
      ctx.lineTo(164, height / 2 + 40);
      ctx.stroke();

      // Mouse Cable Cord
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(152, height / 2 + 27);
      ctx.bezierCurveTo(152, height / 2 + 10, 110, height / 2 + 20, 90, height / 2 + 20);
      ctx.stroke();

      ctx.restore(); 

      // --- 7. Deep Ground Neon Glow ---
      ctx.save();
      // Dynamically tracks below the newly positioned setup
      ctx.translate(centerX, centerY + 240);
      
      const glowScale = 1 - (floatY / 90);
      ctx.fillStyle = 'rgba(0, 210, 255, 0.07)';
      ctx.filter = 'blur(15px)';
      ctx.beginPath();
      ctx.ellipse(0, 0, 160 * glowScale, 22 * glowScale, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      requestAnimationFrame(render);
    };

    const animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="w-full h-162.5 bg-black flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full max-w-187.5" />
    </div>
  );
}