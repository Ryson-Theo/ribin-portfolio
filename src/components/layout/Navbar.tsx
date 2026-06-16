"use client";

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
  return (
    <header
      className="
        fixed
        top-8
        left-1/2
        -translate-x-1/2
        z-50
        hidden
        lg:block
        w-max
        max-w-[95vw]
      "
    >
      <nav
        className="
          flex
          items-center
          justify-between
          gap-8
          px-8
          py-4
          rounded-full
          border
          border-white/10
          bg-slate-950/40
          backdrop-blur-2xl
          shadow-[0_0_50px_rgba(255,255,255,0.02)]
        "
      >
        {/* Name Link: Works exactly like the other navigation elements */}
        <Link
          href="#hero"
          className="
            text-xs
            tracking-[0.3em]
            text-white
            hover:text-blue-400
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

        {/* Separator line */}
        <div className="w-px h-5 bg-white/10 shrink-0" />

        {/* Links Container */}
        <div className="flex items-center gap-6 xl:gap-8 shrink-0">
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
      </nav>
    </header>
  );
}