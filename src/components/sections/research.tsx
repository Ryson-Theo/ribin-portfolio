'use client';

// =========================================================================
// PRODUCTION RESEARCH DATA CONFIGURATION
// Add or update your published papers below.
// =========================================================================
const RESEARCH_DATA = {
  title: "Autonomous Vehicle Research",
  journal: "International Research Journal (IRJAEM)",
  year: "2024",
  doi: "10.47392/IRJAEM.2024.0532",
  paperUrl: "https://goldncloudpublications.com/index.php/irjaem/article/view/621",
  abstract: "Co-authored research paper focusing on enhancing autonomous vehicle safety and efficiency through intelligent mapping architectures and advanced recommendation systems. The project addresses multi-modal navigation data processing and real-time environment routing optimization patterns.",
  tags: ["AI Research", "Machine Learning", "Autonomous Systems", "Intelligent Mapping"]
};

export default function Research() {
  return (
    <section id="research" className="relative py-24 border-t border-white/10 bg-slate-950/20 overflow-hidden">
      {/* Structural ambient lighting backdrops */}
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-8 lg:px-16 relative z-10">
        
        {/* Section Header */}
        <div className="mb-14 max-w-3xl">
          <h2 className="font-heading uppercase leading-[0.9] tracking-tighter text-4xl md:text-5xl text-white">
            Research
          </h2>
          <p className="mt-3 text-sm md:text-base leading-6 text-zinc-400 max-w-[70ch]">
            Peer-reviewed publications, academic tracking, and systems optimization analysis.
          </p>
        </div>

        {/* Paper Main Layout Card */}
        <div className="max-w-4xl mx-auto border border-white/10 bg-slate-950/60 rounded-2xl p-6 md:p-10 shadow-2xl backdrop-blur-3xl group transition-all duration-300 hover:border-white/20">
          
          {/* Document Header Block */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-white/10 pb-6 mb-6">
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
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white font-semibold text-xs tracking-wider uppercase transition-all duration-200 hover:bg-white hover:text-slate-950 self-start shrink-0"
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
              <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-normal text-justify">
                {RESEARCH_DATA.abstract}
              </p>
            </div>

            {/* Core Domain Tag Arrays */}
            <div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {RESEARCH_DATA.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="text-[10px] font-medium tracking-wide text-zinc-400 bg-white/5 border border-white/5 px-2.5 py-1 rounded-md transition-colors duration-200 hover:bg-white/10 hover:text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}