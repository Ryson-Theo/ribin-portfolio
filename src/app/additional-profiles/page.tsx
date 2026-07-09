'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ==========================================
// MODULAR DATA MATRIX (CASUAL & REAL BRANDED)
// ==========================================
const SOCIALS_DATA = [
  {
    id: "github-main",
    title: "GitHub Core",
    tagline: "Where the real builds live",
    description: "My main code base. This is where I ship production-grade software setups, my primary MERN and PHP stacks, and all my actual clean repositories.",
    source: "https://github.com/Ryson-Theo",
    accent: "#24292e",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    )
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    tagline: "The formal tie and jacket side",
    description: "Where I handle professional networking, share solid engineering updates, log milestones, and connect with people looking for software talent.",
    source: "https://www.linkedin.com/in/ribin-k-roy/",
    accent: "#0A66C2",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    )
  },
  {
    id: "x",
    title: "X / Twitter",
    tagline: "Live shipping diary",
    description: "Tech hot-takes, random feature clips, and raw UI experiments. If I built something weird at 2 AM, it gets logged right here.",
    source: "https://x.com/Ryson_Theo",
    accent: "#E2E8F0",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  },
  {
    id: "bluesky",
    title: "Bluesky",
    tagline: "Exploring the open web feed",
    description: "Hanging out across the decentralized space. Talking shop with developers and experimenting with AT Protocol streams.",
    source: "https://bsky.app/profile/ryson-theo.bsky.social",
    accent: "#3B82F6",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 10.58c-.53-.82-1.34-.195-2.07-2.82C8.3 5.83 7.46 5.04 6.78 5.04c-.84 0-1.46.64-1.46 1.47 0 1.14.53 2.85 1.5 4.75 1.37 2.72 3.41 4.82 5.48 5.8a12.8 12.8 0 01-.8.42c-2.06 1.04-4.1 2.7-4.1 5.15 0 2.03 2.15 2.7 3.5 1.52 1.24-1.07 2.66-3.29 3.65-4.95.99 1.66 2.4 3.88 3.65 4.95 1.36 1.18 3.5.5 3.5-1.52 0-2.45-2.05-4.11-4.1-5.15-.27-.14-.54-.28-.8-.42 2.07-.98 4.11-3.08 5.48-5.8.96-1.9 1.5-3.6 1.5-4.75 0-1.95-2.03-2.76-3.54-1.56-1.38 1.1-2.88 3.24-3.84 4.76z" />
      </svg>
    )
  },
  {
    id: "devto",
    title: "Dev.to",
    tagline: "Handbooks and code notes",
    description: "Where I break down how I solved specific bugs, drop easy developer guides, and explain architectural logic from past builds.",
    source: "https://dev.to/ryson_theo",
    accent: "#A855F7",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 512 512" fill="currentColor">
        <path d="M137.1 201.1c-6.8-4.5-13.7-4.5-20.5-4.5h-12.6v118.8h19.4c6.8 0 13.7 0 20.5-4.5 6.9-4.5 6.9-14.8 6.9-25.1v-54.8c0-9.2-.1-18.4-7-24.9zM461.7 0H50.3Q28.6 0 14.9 14.9Q1.1 28.6 0 50.3v411.4q1.1 21.7 14.9 35.4Q28.6 512 50.3 512h411.4q21.7 0 35.4-14.9q13.7-13.7 14.9-35.4V50.3Q510.9 28.6 497.1 14.9Q483.4 0 461.7 0zm-285.7 296c1.1 17.1-11.4 35.4-24 53.7h-.1c-12.6 17.1-43.4 18.3-74.3 19.6H67.4V161.1h54.9c29.7 1.1 42.3 2.3 44.9 20.6c12.6 17.1 11.4 34.3 10.3 51.4v62.9zm115.4-100.6H230.9v43.4h36.6v34.3h-36.6v43.4h60.6v34.3h-70.9c-21.7-2.3-24-22.9-26.3-43.4V185.1c1.1-21.7 22.9-24 44.6-26.3h72v34.3zm118.9 131.4c-12.6 25.1-28.6 24-44.6 22.9c-16-2.3-26.3-4.5-36.6-26.3L312 161.1h36.6l34.3 130.3l33.1-130.3h37.7l-43.4 165.7z" />
      </svg>
    )
  },
  {
    id: "medium",
    title: "Medium",
    tagline: "Long-form design write-ups",
    description: "Deep, long articles about UI/UX concepts, web systems metrics, and the overall thought process of making software clean.",
    source: "https://medium.com/@ryson_theo",
    accent: "#F1F5F9",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.54 12a6.8 6.8 0 1 1-13.54 0 6.8 6.8 0 0 1 13.54 0zm6.77 0c0 3.44-1.52 6.24-3.39 6.24-1.87 0-3.39-2.8-3.39-6.24s1.52-6.24 3.39-6.24 3.39 2.8 3.39 6.24zm3.69 0c0 3.01-.53 5.46-1.18 5.46s-1.18-2.45-1.18-5.46.53-5.46 1.18-5.46 1.18 2.45 1.18 5.46z"/>
      </svg>
    )
  },
  {
    id: "substack",
    title: "Substack",
    tagline: "The dev newsletter pipeline",
    description: "Direct dispatches highlighting clean layout systems, neat software engineering updates, and tools I think are worth sharing.",
    source: "https://rysontheo.substack.com",
    accent: "#FF6719",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.539 8.242H1.46V5.406h21.079v2.836zM1.46 10.881h21.079v2.837H1.46v-2.837zm0 5.474h21.079V24L12 18.981 1.46 24v-7.645z"/>
      </svg>
    )
  },
  {
    id: "behance",
    title: "Behance",
    tagline: "The visual design grid",
    description: "Where I show off high-fidelity layouts, core product mockups, and UI design work. Built to look crisp and feel intuitive.",
    source: "https://www.behance.net/ribinkroy",
    accent: "#0057FF",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 16 16" fill="currentColor">
        <path d="M5.5955 10.184c0.602 0 1.092-.213 1.092-.889 0-.69-.41-.959-1.061-.962h-1.61v1.852h1.579zm-.189-4.536h-1.386v1.568h1.494c.529 0 .903-.231.903-.802 0-.619-.48-.766-1.011-.766zm4.533 2.618h2.177c-.06-.648-.396-1.04-1.068-1.04-.64 0-1.067.399-1.11 1.04zM13.6.16H2.4C1.165.16.16 1.165.16 2.4v11.2c0 1.236 1.005 2.24 2.24 2.24h11.2c1.236 0 2.24-1.004 2.24-2.24V2.4c0-1.235-1.004-2.24-2.24-2.24zm-1.208 5.355h-2.723v-.661h2.723v.661zm-5.453 2.055c.826.234 1.225.962 1.225 1.806 0 1.365-1.144 1.95-2.366 1.956H2.54v-6.72h3.167c1.151 0 2.149.325 2.149 1.662 0 .676-.315 1.008-.917 1.295zm4.155-1.351c1.523 0 2.366 1.201 2.366 2.639 0 .056-.004.115-.007.175 0 .028-.004.053-.004.077H9.942c0 .777.41 1.236 1.194 1.236.406 0 .927-.217 1.057-.634h1.18c-.364 1.117-1.117 1.638-2.279 1.638-1.533 0-2.488-1.04-2.488-2.555 0-1.463 1.004-2.576 2.488-2.576z" />
      </svg>
    )
  },
  {
    id: "wellfound",
    title: "Wellfound",
    tagline: "Startup space pipeline",
    description: "Tracking software engineer alignments, project matching opportunities, and remote full-stack roles with modern tech companies.",
    source: "https://wellfound.com/ribin-k-roy",
    accent: "#38BDF8",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.998 8.128c0.063-1.379-1.612-2.376-2.795-1.664-1.23.598-1.322 2.52-.156 3.234 1.2.862 2.995-.09 2.951-1.57zm0 7.748c0.063-1.38-1.612-2.377-2.795-1.665-1.23.598-1.322 2.52-.156 3.234 1.2.863 2.995-.09 2.951-1.57zm-20.5 1.762L0 6.364h3.257l2.066 8.106 2.245-8.106h3.267l2.244 8.106 2.065-8.106h3.257l-3.54 11.274H11.39c-.73-2.713-1.46-5.426-2.188-8.14l-2.233 8.14H3.5z" />
      </svg>
    )
  },
 {
    id: "googledev",
    title: "Google Developer",
    tagline: "Developer profile & tracking",
    description: "Showcasing open-source contributions, developer badges, and technical expertise within the Google developer ecosystem.",
    source: "https://developers.google.com/profile/u/ribin-k-roy",
    accent: "#38BDF8",
    icon: (
      <svg className="h-5 w-5" viewBox="0 -65.5 256 256" fill="currentColor">
        <path d="M184.31 67.7c13.47-7.73 26.9-15.53 40.42-23.19 12.83-7.27 27.92-.56 30.83 13.58 1.68 8.18-1.97 17.02-9.36 21.32-24.22 14.11-48.47 28.17-72.84 42.01-7.55 4.29-15.32 3.51-22.19-1.74-6.99-5.33-9.19-12.68-7.55-21.24 1.87-6.51 6.15-10.87 11.99-14.13 9.65-5.38 19.14-11.05 28.7-16.6M194.2 62.08c-13.43-7.8-26.9-15.53-40.29-23.41-12.71-7.47-14.45-23.9-3.65-33.49 6.24-5.54 15.72-6.8 23.14-2.55 24.33 13.91 48.63 27.89 72.81 42.08 7.48 4.39 10.68 11.51 9.57 20.09-1.12 8.71-6.39 14.3-14.62 17.16-6.58 1.64-12.49.11-18.23-3.32-9.49-5.66-19.15-11.05-28.73-16.56M71.75 56.56c-8.62 4.9-17.25 9.79-25.86 14.7-5.04 2.88-10.02 5.85-15.08 8.67-10.2 5.7-22.33 2.36-28.11-7.67C-2.82 62.69.35 50.28 10.18 44.54 34.2 30.52 58.29 16.6 82.46 2.83c7.41-4.21 15.1-3.68 21.96 1.36 7.24 5.33 9.61 12.82 7.98 21.61-1.01 2.13-1.61 4.62-3.12 6.3-2.45 2.72-5.24 5.33-8.35 7.24-9.61 5.93-19.44 11.51-29.18 17.22M61.87 62.06c8.55 5.01 17.1 10.04 25.66 15.04 5.01 2.93 10.07 5.75 15.05 8.73 10.03 5.99 13.2 18.15 7.41 28.18-5.53 9.57-17.86 13.03-27.74 7.39-24.16-13.8-48.26-27.69-72.27-41.75-7.36-4.31-10.75-11.23-9.8-19.69.99-8.93 6.3-14.73 14.72-17.72 2.34-.19 4.8-.92 7.01-.45 3.59.76 7.24 1.88 10.45 3.61 9.94 5.36 19.69 11.08 29.51 16.66" />
      </svg>
    )
  },
  {
    id: "kaggle",
    title: "Kaggle",
    tagline: "Messing with data models",
    description: "Where I manage Python analysis scripts, try out machine learning ideas, and build simple model operations packages.",
    source: "https://www.kaggle.com/ribinkroy",
    accent: "#20BEFF",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.825 23.859c-.22.092-.477.141-.726.141c-.482 0-.915-.221-1.205-.592l-5.203-6.914l-2.454 2.376v4.4c0 .48-.392.873-.872.873H6.262a.873.873 0 0 1-.872-.873V.873C5.39.392 5.781 0 6.262 0h2.106c.48 0 .872.392.872.873v11.83l6.577-6.732a1.51 1.51 0 0 1 1.09-.452c.28 0 .552.073.792.213c.484.28.775.789.775 1.346c0 .393-.153.766-.43 1.047l-5.632 5.66l6.307 8.358c.284.3.428.694.398 1.1c-.033.407-.234.773-.566 1.011z" />
      </svg>
    )
  },
  {
    id: "github-sandbox",
    title: "GitHub Sandbox",
    tagline: "The messy experimental lab",
    description: "My separate playground account for tiny practice ideas, sandbox prototypes, and breaking code pieces just to learn how they work.",
    source: "https://github.com/Ribin-K-Roy",
    accent: "#6E7681",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
      </svg>
    )
  },
  {
    id: "threads",
    title: "Threads",
    tagline: "Quick developer chatter",
    description: "Brief updates, work-in-progress screenshots, and simple, casual interactions with other dev creators online.",
    source: "https://www.threads.net/@ryson_theo",
    accent: "#4ADE80",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 192 192" fill="currentColor">
        <path d="M141.537 88.988c-.827-.396-1.667-.778-2.518-1.143-1.482-27.307-16.403-42.94-41.457-43.1-1.134 0-1.247 0-1.36 0-14.986 0-27.449 6.397-35.12 18.036l13.779 9.452c5.73-8.694 14.724-10.548 21.348-10.548.076 0 .152 0 .228 0 8.25.053 14.475 2.45 18.504 7.128 2.932 3.405 4.893 8.11 5.864 14.05-7.314-1.243-15.224-1.625-23.68-1.14-23.82 1.372-39.134 15.264-38.105 34.568.522 9.792 5.4 18.216 13.735 23.719 7.047 4.652 16.124 6.927 25.557 6.412 12.458-.683 22.231-5.436 29.049-14.127 5.178-6.6 8.453-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.867 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.487 16.351-22.809-.169-40.06-7.484-51.275-21.742-10.503-13.351-15.931-32.635-16.133-57.318.202-24.682 5.63-43.966 16.133-57.317 11.215-14.258 28.465-21.573 51.275-21.743 22.975.171 40.526 7.521 52.171 21.848 5.71 7.026 10.015 15.861 12.853 26.162l16.147-4.308c-3.44-12.68-8.853-23.606-16.219-32.668C147.036 9.607 125.202.195 97.07 0H96.957C68.882.194 47.292 9.642 32.788 28.079 19.882 44.486 13.224 67.316 13 95.933V96l.007.068c.224 28.616 6.882 51.446 19.781 67.853 14.504 18.437 36.093 27.885 64.169 28.079h.113c24.96-.173 42.554-6.708 57.048-21.189 18.963-18.945 18.392-42.692 12.142-57.27-4.484-10.454-13.033-18.945-24.723-24.553zm-43.096 40.52c-10.4 12.435-21.246 7.749-21.781-2.288-.396-7.442 5.297-15.746 22.462-16.735 1.966-.113 3.895-.169 5.79-.169 6.235 0 12.068.606 17.371 1.765-1.978 24.702-13.58 28.713-23.842 29.274z" />
      </svg>
    )
  },
  {
    id: "instagram",
    title: "Instagram",
    tagline: "Behind the scenes shots",
    description: "Visual layout cuts, quick aesthetic clips of my workstation, and casual lifestyle highlights outside of full-stack programming loops.",
    source: "https://www.instagram.com/ryson_theo/",
    accent: "#E1306C",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    )
  },
  {
    id: "facebook",
    title: "Facebook",
    tagline: "Old school social node",
    description: "Keeping in touch with childhood buddies, university classmates, and standard community message feeds.",
    source: "https://facebook.com/Ryson-Theo",
    accent: "#1877F2",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  }
];

interface Platform {
  x: number;
  y: number;
  width: number;
  socialData: typeof SOCIALS_DATA[0] | null;
  collected: boolean;
}

export default function InteractiveProfiles() {
  const [isGameMode, setIsGameMode] = useState(true);
  const [activeExpanded, setActiveExpanded] = useState<typeof SOCIALS_DATA[0] | null>(null);
  const [score, setScore] = useState(0);
  const [collectedCount, setCollectedCount] = useState(0);
  const [showToast, setShowToast] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const keys = useRef<{ [key: string]: boolean }>({});
  
  const cameraY = useRef(0);
  const player = useRef({
    x: 450,
    y: 60,
    vx: 0,
    vy: 0,
    size: 26, 
    speed: 270,       
    jumpForce: 450,   
    isGrounded: false
  });

  const platforms = useRef<Platform[]>([]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleToggleMode = () => {
    const nextMode = !isGameMode;
    if (nextMode) {
      setScore(0);
      setCollectedCount(0);
      setShowToast(false);
      setTimeout(() => {
        if (canvasRef.current) canvasRef.current.focus();
      }, 50);
    }
    setIsGameMode(nextMode);
    setActiveExpanded(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      if (['Space', 'ArrowUp', 'KeyW', 'ArrowDown', 'KeyS', 'ArrowLeft', 'ArrowRight'].includes(e.code) && isGameMode) {
        e.preventDefault();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.code] = false; };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isGameMode]);

  useEffect(() => {
    if (!isGameMode) return;

    const generated: Platform[] = [];
    generated.push({ x: 350, y: 140, width: 200, socialData: null, collected: false });

    let currentY = 260;
    let socialIndex = 0;

    const structuralStepsCount = Math.max(45, SOCIALS_DATA.length * 4);
    const socialDistributionInterval = Math.floor((structuralStepsCount - 4) / Math.max(1, SOCIALS_DATA.length));

    for (let i = 0; i < structuralStepsCount; i++) {
      currentY += 105 + Math.random() * 35;
      const stepWidth = 140 + Math.random() * 55;
      const stepX = 80 + Math.random() * (900 - stepWidth - 160);

      let assignedSocial = null;
      if (i > 2 && (i - 3) % socialDistributionInterval === 0) {
        if (socialIndex < SOCIALS_DATA.length) {
          assignedSocial = SOCIALS_DATA[socialIndex];
          socialIndex++;
        }
      }

      generated.push({
        x: stepX,
        y: currentY,
        width: stepWidth,
        socialData: assignedSocial,
        collected: false
      });
    }
    platforms.current = generated;
    
    player.current.x = 450;
    player.current.y = 60;
    player.current.vx = 0;
    player.current.vy = 0;
    cameraY.current = 0;
    lastTimeRef.current = performance.now();
  }, [isGameMode]);

  useEffect(() => {
    if (!isGameMode) {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 900;
    canvas.height = 540;

    const updateGame = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      let dt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      if (dt > 0.1) dt = 0.1;

      const p = player.current;
      const gravity = 1100;     
      const friction = 0.001;   

      if (keys.current['ArrowLeft'] || keys.current['KeyA']) {
        p.vx = -p.speed;
      } else if (keys.current['ArrowRight'] || keys.current['KeyD']) {
        p.vx = p.speed;
      } else {
        p.vx *= Math.pow(friction, dt);
      }

      if ((keys.current['Space'] || keys.current['ArrowUp'] || keys.current['KeyW']) && p.isGrounded) {
        p.vy = -p.jumpForce;
        p.isGrounded = false;
      }

      p.vy += gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      if (p.x + p.size < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = -p.size;

      if (p.y < 20) { p.y = 20; p.vy = 0; }

      const targetCamY = p.y - canvas.height / 2.5;
      if (targetCamY > cameraY.current) {
        cameraY.current += (targetCamY - cameraY.current) * (1 - Math.pow(0.01, dt));
      }

      p.isGrounded = false;

      platforms.current.forEach((plat) => {
        if (
          p.x + p.size > plat.x &&
          p.x < plat.x + plat.width &&
          p.y + p.size >= plat.y &&
          p.y + p.size - (p.vy * dt) <= plat.y + 14 &&
          p.vy >= 0
        ) {
          p.vy = 0;
          p.y = plat.y - p.size;
          p.isGrounded = true;
        }

        if (plat.socialData && !plat.collected) {
          const dotRadius = 12;
          const dotX = plat.x + plat.width / 2;
          const dotY = plat.y - 20;

          const distX = Math.abs((p.x + p.size / 2) - dotX);
          const distY = Math.abs((p.y + p.size / 2) - dotY);

          if (distX < (p.size / 2 + dotRadius) && distY < (p.size / 2 + dotRadius)) {
            plat.collected = true;
            setScore(prev => prev + 100); 
            setCollectedCount(prev => {
              const nextCount = prev + 1;
              if (nextCount === SOCIALS_DATA.length) {
                setShowToast(true);
              }
              return nextCount;
            });
            setActiveExpanded(plat.socialData);
          }
        }
      });

      if (p.y > cameraY.current + canvas.height + 40) {
        const visiblePlats = platforms.current.filter(
          plat => plat.y > cameraY.current + 40 && plat.y < cameraY.current + canvas.height - 60
        );

        if (visiblePlats.length > 0) {
          const targetSurface = visiblePlats[0];
          p.x = targetSurface.x + (targetSurface.width / 2) - (p.size / 2);
          p.y = targetSurface.y - p.size;
        } else {
          p.x = 450;
          p.y = 60;
          cameraY.current = 0;
        }
        p.vx = 0;
        p.vy = 0;
        p.isGrounded = true;
      }

      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(0, -Math.floor(cameraY.current));

      platforms.current.forEach((plat) => {
        ctx.fillStyle = '#27272a';
        ctx.fillRect(plat.x, plat.y, plat.width, 4);

        if (plat.socialData) {
          if (!plat.collected) {
            ctx.fillStyle = plat.socialData.accent || '#3b82f6';
            ctx.beginPath();
            ctx.arc(plat.x + plat.width / 2, plat.y - 20, 11, 0, 2 * Math.PI);
            ctx.fill();

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          } else {
            ctx.strokeStyle = '#18181b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(plat.x + plat.width / 2, plat.y - 20, 8, 0, 2 * Math.PI);
            ctx.stroke();
          }
        }
      });

      const px = Math.floor(p.x);
      const py = Math.floor(p.y);
      const s = p.size;

      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(px + 4, py, s - 8, s);
      ctx.fillRect(px, py + 4, s, s - 8);
      ctx.fillRect(px + 2, py + 2, s - 4, s - 4);

      ctx.fillStyle = '#ffffff';
      let eyeLookX = 0;
      if (p.vx > 10) eyeLookX = 2;
      if (p.vx < -10) eyeLookX = -2;

      ctx.fillRect(px + 3 + eyeLookX, py + 5, 6, 6);
      ctx.fillRect(px + 13 + eyeLookX, py + 5, 6, 6);

      ctx.fillStyle = '#000000';
      let pupilLookX = 0;
      if (p.vx > 10) pupilLookX = 2;
      if (p.vx < -10) pupilLookX = -1;

      ctx.fillRect(px + 5 + eyeLookX + pupilLookX, py + 7, 2, 3);
      ctx.fillRect(px + 15 + eyeLookX + pupilLookX, py + 7, 2, 3);

      ctx.restore();

      gameLoopRef.current = requestAnimationFrame(updateGame);
    };

    gameLoopRef.current = requestAnimationFrame(updateGame);
    return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current); };
  }, [isGameMode]);

  const handleResume = () => {
    setActiveExpanded(null);
    if (canvasRef.current) canvasRef.current.focus();
  };

  return (
    <section id="interactive-spaces" className="relative py-24 bg-zinc-950 text-white selection:bg-indigo-500/30">
      <div className="container mx-auto px-6 lg:px-16">
        
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-zinc-400 hover:text-white transition-colors group uppercase"
          >
            <svg 
              className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform duration-200" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Portfolio
          </Link>
        </div>

        <div className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-100">
              Connections Hub
            </h2>
            <p className="mt-1 text-zinc-400 text-sm">
              Descend down the architecture matrix layout or toggle traditional grid tracking logs view.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full select-none self-start sm:self-auto">
            <span className="text-xs font-mono tracking-wider uppercase text-zinc-400">Arcade Layout</span>
            <button
              onClick={handleToggleMode}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isGameMode ? 'bg-indigo-600' : 'bg-zinc-800'
              }`}
              role="switch"
              aria-checked={isGameMode}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                  isGameMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {isGameMode ? (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-zinc-900/60 border border-zinc-800 px-6 py-3.5 rounded-2xl flex flex-wrap justify-between items-center text-xs font-mono gap-4">
              <span className="text-zinc-400">
                🕹️ Move: <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-white border border-zinc-700">A</kbd>/<kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-white border border-zinc-700">D</kbd> or <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-white border border-zinc-700">←</kbd>/<kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-white border border-zinc-700">→</kbd> | Jump: <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-white border border-zinc-700">SPACE</kbd> / <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-white border border-zinc-700">W</kbd>
              </span>
              <div className="flex gap-5 text-xs font-bold tracking-wider">
                <div className="text-indigo-400">SCORE: {score}</div>
                <div className="text-emerald-400">COLLECTED: {collectedCount}/{SOCIALS_DATA.length}</div>
              </div>
            </div>

            <div className="relative border border-zinc-800 rounded-3xl overflow-hidden bg-zinc-950 shadow-2xl">
              <canvas tabIndex={0} ref={canvasRef} className="w-full h-auto block aspect-[16/9.6] outline-none focus:ring-1 focus:ring-zinc-800 rounded-3xl" />
            </div>

            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
              activeExpanded ? 'max-h-125 opacity-100 mt-6' : 'max-h-0 opacity-0 pointer-events-none'
            }`}>
              {activeExpanded && (
                <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900 shadow-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800" style={{ color: activeExpanded.accent }}>
                        {activeExpanded.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{activeExpanded.title}</h3>
                        <p className="text-xs font-mono" style={{ color: activeExpanded.accent }}>{activeExpanded.tagline}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleResume}
                      className="px-3 py-1 text-xs font-mono bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded-lg transition"
                    >
                      Resume Game ✕
                    </button>
                  </div>

                  <p className="mt-4 text-zinc-400 text-sm max-w-2xl leading-relaxed">
                    {activeExpanded.description}
                  </p>

                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={handleResume}
                      className="px-5 py-2 text-xs font-semibold rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition"
                    >
                      Keep Jumping
                    </button>
                    <a
                      href={socialIndexUrlHack(activeExpanded.source)}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2 text-xs font-bold text-white rounded-full transition shadow-lg hover:brightness-110"
                      style={{ backgroundColor: activeExpanded.accent }}
                    >
                      Open Link Profile Hub →
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="animate-fade-in grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOCIALS_DATA.map((social) => (
              <div 
                key={social.id}
                className="group relative p-7 rounded-3xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-md hover:border-zinc-700 hover:bg-zinc-900/60 transition-all duration-300 flex flex-col justify-between h-auto min-h-56 overflow-hidden shadow-sm hover:shadow-xl"
              >
                <div 
                  className="absolute -right-10 -top-10 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-15 transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundColor: social.accent }}
                />

                <div>
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-400 group-hover:text-white transition-all duration-300 shadow-inner">
                      {social.icon}
                    </div>

                    <a
                      href={social.source}
                      target="_blank"
                      rel="noreferrer"
                      className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-all shadow-md"
                      aria-label={`Visit endpoint for ${social.title}`}
                    >
                      <svg className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>

                  <div className="mt-5">
                    <h3 className="text-lg font-bold text-zinc-200 tracking-wide group-hover:text-white transition-colors">
                      {social.title}
                    </h3>
                    <p className="text-xs font-mono mt-0.5 text-zinc-500 group-hover:text-zinc-400 transition-colors">
                      {social.tagline}
                    </p>
                  </div>

                  <p className="mt-3 text-xs md:text-sm text-zinc-400 leading-relaxed line-clamp-4">
                    {social.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-zinc-900 border border-emerald-500/30 text-white px-5 py-3.5 rounded-2xl shadow-2xl animate-fade-in max-w-sm backdrop-blur-md">
          <div className="h-7 w-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm shrink-0">
            🏆
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold tracking-wide text-zinc-100">All Nodes Decrypted!</h4>
            <p className="text-xs text-zinc-400 mt-0.5 leading-snug">You mapped out all {SOCIALS_DATA.length} connection platforms perfectly.</p>
          </div>
          <button 
            onClick={() => setShowToast(false)} 
            className="text-zinc-500 hover:text-zinc-300 text-xs font-mono ml-2 p-1"
            aria-label="Close Notification"
          >
            ✕
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </section>
  );
}

function socialIndexUrlHack(url: string): string {
  return url;
}
