'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const EDUCATION_DATA = [
  {
    degree: "Bachelor of Computer Applications (BCA)",
    university: "Mahatma Gandhi University",
    timeline: "2023 — 2026",
    description: "Focusing on full-stack web architectures, database management systems, and systems optimization analysis."
  }
];

const CERTIFICATES_DATA = [
  {
    title: "Legacy Responsive Web Design V8 Certification",
    issuer: "freeCodeCamp",
    date: "2025",
    credentialUrl: "https://www.freecodecamp.org/certification/ryson_theo/responsive-web-design",
    tags: ["CSS Grid", "Flexbox", "HTML", "Accessibility", "Responsive Design"]
  },
  {
    title: "Docker Foundations Professional Certificate",
    issuer: "Docker, Inc. & LinkedIn",
    date: "2025",
    credentialUrl: "https://www.linkedin.com/learning/certificates/647042703e5659299e16cbf241f565d9ad01c9e0e38413cce42c4dda31105fab",
    tags: ["Docker Products", "Containerization"]
  },
  {
    title: "JavaScript Foundations Professional Certificate by Mozilla",
    issuer: "Mozilla & LinkedIn",
    date: "2025",
    credentialUrl: "https://www.linkedin.com/learning/certificates/79df11624257e8f5817f7a9ee0506a66e429855124648baca01ff0a55699131a",
    tags: ["Web Development", "JavaScript"]
  },
  {
    title: "Java Foundations Professional Certificate by JetBrains",
    issuer: "JetBrains & LinkedIn",
    date: "2025",
    credentialUrl: "https://www.linkedin.com/learning/certificates/a3aa18c7508f51e515a45fefaf6fdee5f5a8e780e6959277cfbc489fbc5f7af0",
    tags: ["Data Structures", "Object-Oriented Programming (OOP)", "Java"]
  }
];

export default function Qualifications() {
  const [activeCertIdx, setActiveCertIdx] = useState(0);

  const nextCert = useCallback(() => {
    setActiveCertIdx((prev) => (prev + 1) % CERTIFICATES_DATA.length);
  }, []);

  const prevCert = () => {
    setActiveCertIdx((prev) => (prev - 1 + CERTIFICATES_DATA.length) % CERTIFICATES_DATA.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextCert();
    }, 6000);
    return () => clearInterval(interval);
  }, [nextCert]);

  return (
    <section id="qualifications" className="relative z-10 py-32 bg-black text-zinc-100 overflow-hidden">
      
      {/* Glow Backdrop: Fixed to valid arbitrary token syntax */}
      <div className="absolute bottom-0 right-0 w-150 h-150 max-w-full bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-8 lg:px-20 relative z-10 max-w-7xl">
        
        {/* Section Title */}
        <div className="mb-28 max-w-2xl">
          <h2 className="font-heading uppercase leading-[0.9] tracking-tighter text-5xl md:text-6xl text-white">
            Academic & Credentials
          </h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-zinc-400">
            Formal education history, professional industry certifications, and open-source platform contributions.
          </p>
        </div>

        {/* Vertical Flow Space */}
        <div className="space-y-36">
          
          {/* 01 / EDUCATION TIMELINE */}
          <div className="max-w-3xl">
            <h4 className="text-xs font-mono font-bold tracking-[0.25em] text-zinc-500 uppercase mb-12 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              01 / Academic Foundation
            </h4>

            <div className="relative border-l border-zinc-800 pl-8 ml-2 space-y-12">
              {EDUCATION_DATA.map((edu, idx) => (
                <div key={idx} className="relative group">
                  {/* Fixed to explicit layout constraint class */}
                  <div className="absolute -left-9.5 top-1.5 w-4 h-4 rounded-full bg-black border border-blue-500 transition-transform duration-300 group-hover:scale-125" />
                  
                  <div className="space-y-4">
                    <div className="text-sm font-mono tracking-wider font-bold text-blue-400">
                      {edu.timeline}
                    </div>
                    
                    <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                      {edu.degree}
                    </h3>
                    
                    <div className="text-sm text-zinc-400 font-mono">
                      {edu.university}
                    </div>

                    <p className="max-w-2xl text-base text-zinc-300 leading-relaxed font-normal text-justify pt-2">
                      {edu.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 02 / AUTO CAROUSEL CERTIFICATIONS */}
          <div className="max-w-3xl">
            <h4 className="text-xs font-mono font-bold tracking-[0.25em] text-zinc-500 uppercase mb-12 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              02 / Certified Achievements
            </h4>

            <div className="min-h-64 flex flex-col justify-between transition-all duration-500 ease-in-out">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-mono tracking-wider font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-md border border-blue-500/10">
                    {CERTIFICATES_DATA[activeCertIdx].issuer}
                  </span>
                  <span className="text-xs font-mono tracking-wider text-zinc-500">
                    {CERTIFICATES_DATA[activeCertIdx].date}
                  </span>
                </div>
                
                <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight transition-opacity duration-300">
                  {CERTIFICATES_DATA[activeCertIdx].title}
                </h3>

                {/* Tags */}
                <div className="pt-2 max-w-2xl">
                  <div className="flex flex-wrap gap-2">
                    {CERTIFICATES_DATA[activeCertIdx].tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="text-xs font-mono tracking-wide text-zinc-400 bg-white/5 border border-white/5 px-3 py-1 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex flex-wrap items-center gap-8 pt-8">
                <div className="flex items-center gap-4 font-mono text-xs text-zinc-500">
                  <button onClick={prevCert} className="hover:text-white transition-colors py-1 tracking-wider font-bold cursor-pointer">PREV</button>
                  <span className="text-zinc-700">/</span>
                  <button onClick={nextCert} className="hover:text-white transition-colors py-1 tracking-wider font-bold cursor-pointer">NEXT</button>
                </div>

                <a 
                  href={CERTIFICATES_DATA[activeCertIdx].credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-white hover:text-blue-400 font-bold font-mono text-xs tracking-wider uppercase transition-colors duration-200"
                >
                  Verify Credentials ↗
                </a>
              </div>
            </div>
          </div>

          {/* 03 / METRICS & STATS */}
          <div className="w-full pt-16 border-t border-zinc-800">
            <h4 className="text-xs font-mono font-bold tracking-[0.25em] text-blue-400 uppercase mb-14 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              03 / Industry Verification
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
              
              {/* GITHUB INTEGRATION */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <h5 className="text-lg md:text-xl font-heading font-bold text-zinc-200 tracking-tight">
                    Open Source Contributions
                  </h5>
                  <p className="text-sm md:text-base text-zinc-400 font-normal leading-relaxed max-w-xl">
                    Live production telemetry mapping commits, pull requests, and repository velocity.
                  </p>
                </div>
                
                <div className="relative w-full h-64 flex items-center justify-start overflow-hidden opacity-90 hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg bg-zinc-900/20 p-2">
                  <Image 
                    src="https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=Ryson-Theo&theme=github_dark" 
                    alt="GitHub Contributions Analytics"
                    fill
                    sizes="(max-w-768px) 100vw, 50vw"
                    className="object-contain object-left scale-105 origin-left"
                    unoptimized
                    priority // 👈 Added to fix LCP warnings
                  />
                </div>
              </div>

              {/* HOLOPIN INTEGRATION */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <h5 className="text-lg md:text-xl font-heading font-bold text-zinc-200 tracking-tight">
                    Verified Digital Badges
                  </h5>
                  <p className="text-sm md:text-base text-zinc-400 font-normal leading-relaxed max-w-xl">
                    Cryptographically secured validation tokens representing core ecosystem milestones.
                  </p>
                </div>

                <div className="relative w-full h-64 flex items-center justify-start overflow-hidden opacity-90 hover:opacity-100 transition-opacity duration-300 rounded-lg bg-zinc-900/20 p-2">
                  <a 
                    href="https://holopin.io/@ribinkroy" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="relative block w-full h-full z-20"
                  >
                    <Image 
                      src="https://holopin.me/ribinkroy" 
                      alt="Holopin Achievement Badges" 
                      fill
                      sizes="(max-w-768px) 100vw, 50vw"
                      className="object-contain object-left scale-105 origin-left"
                      unoptimized
                      priority // 👈 Added to fix LCP warnings
                    />
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}