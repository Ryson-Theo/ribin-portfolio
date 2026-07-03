'use client';

// =========================================================================
// PRODUCTION RESEARCH DATA CONFIGURATION
// Add or update your published papers below.
// =========================================================================
const RESEARCH_DATA = {
  title: "Enhancing Autonomous Vehicle Safety and Efficiency Through Intelligent Mapping and Recommendations",
  journal: "International Research Journal on Advanced Engineering and Management (IRJAEM)",
  year: "2024",
  doi: "10.47392/IRJAEM.2024.0532",
  paperUrl: "https://goldncloudpublications.com/index.php/irjaem/article/view/621",
  abstract: "Awarded Best Presentation and Podium Distinction within the International Technical Presentation track. This co-authored research paper addresses multi-modal navigation data processing and real-time environment routing optimization. The study leverages sensor fusion, adaptive route planning, and real-time object detection architectures to significantly improve autonomous system navigational safety and operational efficiency.",
  tags: ["AI Research", "Machine Learning", "Autonomous Systems", "Intelligent Mapping", "Award Winning"]
};

export default function Research() {
  return (
    <section id="research" className="relative py-16 md:py-24 border-t border-white/10 bg-slate-950/20 overflow-hidden">
      {/* Structural ambient lighting backdrops - Optimized blur radius for mobile rendering */}
      <div className="absolute bottom-0 right-10 w-60 h-60 md:w-80 md:h-80 bg-purple-500/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10">
        
        {/* Section Header */}
        <div className="mb-10 md:mb-14 max-w-3xl">
          <h2 className="font-heading uppercase leading-[0.9] tracking-tighter text-4xl md:text-5xl text-white">
            Research
          </h2>
          <p className="mt-3 text-sm md:text-base leading-6 text-zinc-400 max-w-[70ch]">
            Peer-reviewed publications, academic tracking, and systems optimization analysis.
          </p>
        </div>

        {/* Paper Main Layout Card - Optimized backdrop filter layers */}
        <div className="max-w-4xl mx-auto border border-white/10 bg-slate-950/90 lg:bg-slate-950/60 rounded-2xl p-5 md:p-10 shadow-2xl backdrop-blur-none lg:backdrop-blur-3xl group transition-colors duration-300 hover:border-white/20 will-change-transform">
          
          {/* Document Header Block */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-6 border-b border-white/10 pb-6 mb-6">
            <div>
              {/* Journal Meta Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[10px] font-mono tracking-wider font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-md border border-purple-500/10">
                  {RESEARCH_DATA.journal}
                </span>
                <span className="text-[10px] font-mono tracking-wider text-zinc-500 bg-white/5 px-2 py-0.5 rounded-md">
                  {RESEARCH_DATA.year}
                </span>
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
                {RESEARCH_DATA.title}
              </h3>
              
              {/* DOI Identifier block */}
              <div className="text-xs text-zinc-500 mt-2 font-mono">
                DOI: <span className="text-zinc-400 select-all">{RESEARCH_DATA.doi}</span>
              </div>
            </div>

            {/* View Paper Call to Action Link */}
            <a 
              href={RESEARCH_DATA.paperUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white font-semibold text-xs tracking-wider uppercase transition-colors duration-200 hover:bg-white hover:text-slate-950 self-start shrink-0 w-full md:w-auto mt-2 md:mt-0"
            >
              View Paper
              <span className="text-sm font-light leading-none">↗</span>
            </a>
          </div>

          {/* Academic Content Stream */}
          <div className="space-y-6">
            
            {/* Abstract Block */}
            <div>
              <h4 className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase mb-2 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-purple-500" />
                Core Context & Overview
              </h4>
              <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-normal text-left sm:text-justify">
                {RESEARCH_DATA.abstract}
              </p>
            </div>

            {/* Core Domain Tag Arrays */}
            <div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {RESEARCH_DATA.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="text-[10px] font-medium tracking-wide text-zinc-400 bg-white/5 border border-white/5 px-2.5 py-1 rounded-md transition-colors duration-200 lg:hover:bg-white/10 lg:hover:text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Critical Hardware Acceleration Layer */}
          <style jsx>{`
            div {
              transform: translateZ(0);
              -webkit-font-smoothing: antialiased;
            }
          `}</style>

        </div>

      </div>
    </section>
  );
}
