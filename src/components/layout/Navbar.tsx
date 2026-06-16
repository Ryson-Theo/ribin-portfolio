"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { portfolio } from "@/data/portfolio";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "ABOUT", href: "#about" },
  { label: "EXPERIENCE", href: "#experience" },
  { label: "PROJECTS", href: "#projects" },
  { label: "DESIGNS", href: "#designs" },
  { label: "RESEARCH", href: "#research" },
  { label: "CONTACT", href: "#contact" },
  { label: "EXPERTISE", href: "#qualifications" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Safely manage structural document locks when mobile overlay triggers
  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <header
        className="
          fixed
          top-4
          sm:top-8
          left-1/2
          -translate-x-1/2
          z-50
          w-[calc(100%-2rem)]
          sm:w-max
          max-w-[95vw]
        "
      >
        <nav
          className="
            flex
            items-center
            justify-between
            gap-4
            lg:gap-8
            px-6
            sm:px-8
            py-3
            sm:py-4
            rounded-full
            border
            border-white/10
            bg-slate-950/60
            backdrop-blur-2xl
            shadow-[0_0_50px_rgba(255,255,255,0.02)]
          "
        >
          <Link
            href="#hero"
            onClick={() => setIsOpen(false)}
            className="
              text-xs
              tracking-[0.3em]
              text-white
              hover:text-zinc-400
              font-semibold
              uppercase
              whitespace-nowrap
              shrink-0
              transition-colors
              duration-200
            "
          >
            {portfolio.name}
          </Link>

          <div className="hidden sm:block w-px h-5 bg-white/10 shrink-0" />

          {/* Desktop Core Links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 shrink-0">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="
                  text-[11px]
                  tracking-[0.22em]
                  text-zinc-400
                  hover:text-white
                  transition-colors
                  duration-200
                  font-medium
                  whitespace-nowrap
                "
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Interactive Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex lg:hidden flex-col items-center justify-center w-8 h-8 gap-1.5 focus:outline-none z-50 cursor-pointer"
            aria-label="Toggle Menu"
          >
            <span
              className={`w-5 h-0.5 bg-white transition-all duration-300 origin-center ${
                isOpen ? "transform rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-white transition-all duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-white transition-all duration-300 origin-center ${
                isOpen ? "transform -rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </nav>
      </header>

      {/* FIXED MOBILE DRAWER LAYER */}
      <div
        className={`fixed inset-0 bg-black/95 backdrop-blur-3xl z-40 lg:hidden flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
          isOpen ? "opacity-100 pointer-events-auto visible" : "opacity-0 pointer-events-none invisible"
        }`}
      >
        <div className="flex flex-col items-center gap-8 text-center">
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              style={{ transitionDelay: `${index * 40}ms` }}
              className={`text-sm tracking-[0.25em] font-heading uppercase text-zinc-400 hover:text-white transition-all duration-300 ${
                isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}