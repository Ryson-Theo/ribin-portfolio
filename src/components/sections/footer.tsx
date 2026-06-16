"use client";

import Ballpit from "@/components/ui/Ballpit";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950/90 text-slate-200 h-105 md:h-115">
      
      {/* 1. BALLPIT BACKGROUND */}
      <div className="absolute inset-0 opacity-40 z-0">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0">
          <div className="pointer-events-none h-full w-full">
            <Ballpit
              count={60}
              gravity={0}
              friction={0.998}
              wallBounce={0.95}
              followCursor={true}
              colors={[0xffffff, 0x0ea5e9, 0x1e40af, 0x64748b, 0x000000]}
              ambientColor={0xffffff}
              ambientIntensity={0.8}
              lightIntensity={180}
              minSize={0.7}
              maxSize={1.2}
              size0={1.3}
              maxVelocity={0.2}
              maxX={5}
              maxY={5}
              maxZ={2}
            />
          </div>
        </div>
      </div>

      {/* 2. TOP SIDE-BY-SIDE CONTENT BLOCK 
          FIXED: Changed max-w-7xl to w-full and optimized padding to push items 
          further to the edges and slightly lower down the page */}
      <div className="relative w-full px-6 pt-14 lg:px-12 h-full z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 w-full">
          {/* Left Side */}
          <div className="flex flex-col gap-3 max-w-xl">
            <h2 className="text-2xl md:text-4xl font-black leading-tight tracking-tight text-white">
              Have a Cool Idea?
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-sky-300">Let&apos;s Collaborate.</span>
            </h2>
            <a href="#contact" className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-sky-400 text-slate-950 font-extrabold text-xs hover:bg-sky-300 transition-colors w-fit">
              Get in Touch →
            </a>
          </div>

          {/* Right Side */}
          <div className="flex flex-col gap-4 text-xs md:text-right">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400 mb-1 font-bold">Contact</p>
              <a href="mailto:Ribinkroy@protonmail.com" className="font-extrabold text-sky-300 hover:text-sky-200 transition-colors text-sm">
                Ribinkroy@protonmail.com
              </a>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400 mb-1 font-bold">Social</p>
              <div className="flex gap-4 md:justify-end">
                <a href="https://github.com/Ryson-Theo" target="_blank" rel="noreferrer" className="font-bold text-slate-200 hover:text-sky-300 transition-colors">GitHub</a>
                <a href="https://www.linkedin.com/in/ribin-k-roy/" target="_blank" rel="noreferrer" className="font-bold text-slate-200 hover:text-sky-300 transition-colors">LinkedIn</a>
                <a href="https://x.com/Ryson_Theo" target="_blank" rel="noreferrer" className="font-bold text-slate-200 hover:text-sky-300 transition-colors">Twitter</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. UNIFIED BOTTOM STACK */}
      <div className="absolute bottom-0 left-0 w-full z-30 flex flex-col items-center pointer-events-none select-none">
        
       
        <div className="w-full max-w-7xl px-8 lg:px-16 flex flex-col items-center gap-2 mb-2 pointer-events-auto">
          <a href="/additional-profiles" className="text-[11px] uppercase tracking-[0.35em] text-sky-300 hover:text-sky-200 transition-colors font-black">
            Additional Profiles
          </a>

          <div className="w-full text-[10px] uppercase tracking-[0.3em] text-slate-400 text-center border-t border-white/10 pt-3 font-bold">
            © {new Date().getFullYear()} • Built with Next.js, Tailwind, three.js
          </div>
        </div>

        {/* Name Layout with Edge-to-Edge Guard */}
        <div className="relative w-full overflow-hidden px-4">
          <h1 className="text-[19.5vw] font-black text-white text-center tracking-[-0.06em] leading-[0.8] whitespace-nowrap block select-none">
            RIBIN K ROY
          </h1>
          
         
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />
        </div>
      </div>

     
      <div className="absolute bottom-0 inset-x-0 h-12 bg-linear-to-t from-black to-transparent pointer-events-none z-20" />

    </footer>
  );
}