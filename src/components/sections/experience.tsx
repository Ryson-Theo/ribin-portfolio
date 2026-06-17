'use client';

import Floating3D from "@/components/effects/Floating3D";

// =========================================================================
// EXPERIENCE CONFIGURATION 
// To add a new position, paste a new object at the TOP of this array.
// =========================================================================
const EXPERIENCES_DATA = [
  {
    role: "Web Development Trainee",
    company: "Web Dev Open",
    type: "Apprenticeship", 
    period: "Jun 2026 — Present",
    location: "Remote",
    isActive: true, 
    description: "Building real-world web applications through project-based learning while developing practical skills in modern web development, software engineering, and industry-standard workflows.",
    tags: ["MongoDB", "Express.js", "React", "Node.js", "Git"]
  },
  /* TEMPLATE FOR FUTURE ENTRIES:
  {
    role: "Software Engineer",
    company: "Company Name",
    type: "Full-time",
    period: "Month Year — Month Year",
    location: "Remote / Hybrid / On-site",
    isActive: false,
    description: "Your core achievements and responsibilities go here.",
    tags: ["Skill1", "Skill2", "Skill3"]
  },
  */
];

export default function Experience() {
  const hasMultipleItems = EXPERIENCES_DATA.length > 1;

  return (
    <section id="experience" className="relative py-24 border-t border-white/10 overflow-hidden bg-slate-950/10">
      
      <div className="container mx-auto px-8 lg:px-16 relative z-10">
        
        {/* Header Block */}
        <div className="mb-12 max-w-3xl">
          <h2 className="font-heading uppercase leading-[0.9] tracking-tighter text-4xl md:text-5xl text-white">
            Experience
          </h2>
          <p className="mt-3 text-sm md:text-base leading-6 text-zinc-400 max-w-[70ch]">
            A snapshot of my professional growth, practical software engineering, and active development environments.
          </p>
        </div>

        {/* 2-Column Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT SIDE: Dynamic Timeline Engine (Takes 7/12 cols) */}
          <div className="lg:col-span-7 relative ml-2 md:ml-6">
            
            {/* Main Axis Track line - adapts length automatically based on item count */}
            <div className={`absolute left-3 top-3 w-px bg-linear-to-b from-blue-500 via-white/10 to-transparent ${
              hasMultipleItems ? 'bottom-3' : 'h-20'
            }`} />

            {/* Render loop mapping the configuration template array */}
            <div className="space-y-8">
              {EXPERIENCES_DATA.map((exp, index) => (
                <div key={`${exp.role}-${exp.company}-${index}`} className="relative pl-10 group">
                  
                  {/* Smart Indicator Node Accent Dot */}
                  <div className={`absolute left-3 top-3 w-2.5 h-2.5 rounded-full bg-slate-950 border-2 -translate-x-1/2 z-20 transition-all duration-300 ${
                    exp.isActive 
                      ? 'border-blue-500 scale-110 shadow-[0_0_10px_rgba(168,85,247,0.6)] group-hover:scale-125' 
                      : 'border-white/30 group-hover:border-blue-400 group-hover:scale-110'
                  }`} />

                  {/* Clean Semantic Layout Block */}
                  <div className="animate-fade-in">
                    <div className="relative p-6 rounded-2xl border border-white/10 bg-slate-950/40 shadow-lg backdrop-blur-3xl transition-all duration-300 group-hover:border-white/20 group-hover:bg-slate-950/60">
                      
                      {/* Ambient Accent Light Overlay */}
                      <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-transparent pointer-events-none rounded-2xl" />

                      {/* Header Layout Setup */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                        <div>
                          <h3 className="text-base font-bold text-white tracking-normal leading-normal inline-block">
                            {exp.role}
                          </h3>
                          <div className="text-xs text-zinc-400 mt-0.5 font-medium">
                            <span className="text-blue-400 font-semibold">{exp.company}</span>
                            <span className="text-zinc-600 mx-1.5">•</span>
                            <span>{exp.type}</span>
                            <span className="text-zinc-600 mx-1.5">•</span>
                            <span className="text-zinc-500">{exp.location}</span>
                          </div>
                        </div>

                        {/* Status / Date Badge line pill */}
                        <span className={`text-[10px] font-bold font-mono tracking-wider px-2.5 py-0.5 rounded-full self-start sm:self-center shrink-0 border ${
                          exp.isActive 
                            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/10' 
                            : 'text-zinc-400 bg-white/5 border-white/5'
                        }`}>
                          {exp.period}
                        </span>
                      </div>

                      {/* Description Paragraph Block */}
                      <p className="text-xs md:text-sm text-zinc-300 leading-relaxed mb-4 max-w-[65ch]">
                        {exp.description}
                      </p>

                      {/* Technologies Pill Node Loop */}
                      <div className="flex flex-wrap gap-1.5">
                        {exp.tags.map((tag) => (
                          <span 
                            key={tag} 
                            className="text-[10px] font-medium tracking-wide text-zinc-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded-md transition-colors duration-200 group-hover:border-white/10 group-hover:text-zinc-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: Floating Interactive 3D Canvas (Takes 5/12 cols) */}
          <div className="lg:col-span-5 relative w-full h-full flex items-center justify-center order-first lg:order-last">
            <div className="w-full max-w-95 lg:max-w-none h-75 lg:h-112.5">
              <Floating3D />
            </div>
          </div>

        </div>

      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </section>
  );
}