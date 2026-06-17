'use client';

import React, { useState, useSyncExternalStore } from 'react';

interface FolderProps {
  color?: string;
  size?: number; // Base sizing multiplier
  items?: React.ReactNode[];
  className?: string;
}

const darkenColor = (hex: string, percent: number): string => {
  let color = hex.startsWith('#') ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color.split('').map(c => c + c).join('');
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

// Safe subscriptions for hydration-proofing window operations
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const Folder: React.FC<FolderProps> = ({ color = '#5227FF', size = 1, items = [], className = '' }) => {
  const maxItems = 3;
  const papers = items.slice(0, maxItems);
  while (papers.length < maxItems) {
    papers.push(null);
  }

  const [open, setOpen] = useState(false);
  
  // Hydration-safe client evaluation checks
  const isMounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
  
  const isHoverDevice = isMounted && window.matchMedia('(pointer: fine)').matches;
  const isMobileScreen = isMounted && window.innerWidth < 640;

  const [paperOffsets, setPaperOffsets] = useState<{ x: number; y: number }[]>(
    Array.from({ length: maxItems }, () => ({ x: 0, y: 0 }))
  );

  const folderBackColor = darkenColor(color, 0.08);
  const paper1 = darkenColor('#1e293b', 0.1); 
  const paper2 = darkenColor('#0f172a', 0.05);
  const paper3 = '#1e293b';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(prev => !prev);
    if (open) {
      setPaperOffsets(Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })));
    }
  };

  const handlePaperMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (!open || !isHoverDevice) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) * 0.12;
    const offsetY = (e.clientY - centerY) * 0.12;
    setPaperOffsets(prev => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: offsetX, y: offsetY };
      return newOffsets;
    });
  };

  const handlePaperMouseLeave = (index: number) => {
    if (!isHoverDevice) return;
    setPaperOffsets(prev => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: 0, y: 0 };
      return newOffsets;
    });
  };

  const folderStyle = {
    '--folder-color': color,
    '--folder-back-color': folderBackColor,
    '--paper-1': paper1,
    '--paper-2': paper2,
    '--paper-3': paper3,
    transform: `scale(${size})`,
  } as React.CSSProperties;

  const getOpenTransform = (index: number) => {
    if (isMobileScreen) {
      if (index === 0) return 'translate(-95%, -45%) rotate(-8deg) scale(0.9)';
      if (index === 1) return 'translate(0%, -45%) rotate(8deg) scale(0.9)';
      if (index === 2) return 'translate(-48%, -70%) rotate(1deg) scale(0.95)';
    }
    if (index === 0) return 'translate(-105%, -60%) rotate(-12deg)';
    if (index === 1) return 'translate(5%, -60%) rotate(12deg)';
    if (index === 2) return 'translate(-50%, -85%) rotate(2deg)';
    return '';
  };

  return (
    <div 
      style={folderStyle} 
      className={`inline-block select-none touch-none will-change-transform ${className}`}
    >
      <div
        className={`group/folder relative transition-all duration-300 ease-out cursor-pointer ${
          !open && isHoverDevice ? 'hover:-translate-y-2' : ''
        }`}
        style={{
          transform: open ? 'translateY(-12px)' : undefined
        }}
        onClick={handleClick}
      >
        <div
          className="relative w-24 h-20 rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px] transition-colors duration-200"
          style={{ backgroundColor: folderBackColor }}
        >
          <span
            className="absolute bottom-[98%] left-0 w-8 h-3 rounded-tl-md rounded-tr-md"
            style={{ backgroundColor: folderBackColor }}
          />

          {papers.map((item, i) => {
            let sizeClasses = '';
            if (i === 0) sizeClasses = open ? 'w-[85%] h-[90%]' : 'w-[75%] h-[85%]';
            if (i === 1) sizeClasses = open ? 'w-[90%] h-[90%]' : 'w-[80%] h-[75%]';
            if (i === 2) sizeClasses = open ? 'w-[95%] h-[90%]' : 'w-[85%] h-[65%]';

            const transformStyle = open
              ? `${getOpenTransform(i)} translate(${paperOffsets[i].x}px, ${paperOffsets[i].y}px)`
              : undefined;

            return (
              <div
                key={i}
                onMouseMove={e => handlePaperMouseMove(e, i)}
                onMouseLeave={() => handlePaperMouseLeave(i)}
                className={`absolute left-1/2 bottom-[15%] transition-all duration-300 ease-in-out border border-white/5 shadow-xl overflow-hidden ${
                  !open 
                    ? 'transform -translate-x-1/2 translate-y-[8%] group-hover/folder:translate-y-0 z-20' 
                    : 'z-40 md:hover:scale-105 md:hover:z-50'
                } ${sizeClasses}`}
                style={{
                  ...(!open ? {} : { transform: transformStyle }),
                  backgroundColor: i === 0 ? paper1 : i === 1 ? paper2 : paper3,
                  borderRadius: '6px'
                }}
              >
                {item}
              </div>
            );
          })}

          {/* FIX: Replaced broken styling strings with clean native Tailwind interactions */}
          <div
            className={`absolute inset-0 z-30 origin-bottom rounded-tl-[5px] rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px] transition-all duration-300 ease-in-out ${
              open 
                ? '-skew-x-12 scale-y-[0.55]' 
                : isHoverDevice 
                  ? 'group-hover/folder:-skew-x-12 group-hover/folder:scale-y-[0.55]' 
                  : ''
            }`}
            style={{
              backgroundColor: color,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Folder;