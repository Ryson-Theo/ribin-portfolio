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
    icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    tagline: "The formal tie and jacket side",
    description: "Where I handle professional networking, share solid engineering updates, log milestones, and connect with people looking for software talent.",
    source: "https://www.linkedin.com/in/ribin-k-roy/",
    accent: "#0A66C2",
    icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
  },
  {
    id: "x",
    title: "X / Twitter",
    tagline: "Live shipping diary",
    description: "Tech hot-takes, random feature clips, and raw UI experiments. If I built something weird at 2 AM, it gets logged right here.",
    source: "https://x.com/Ryson_Theo",
    accent: "#E2E8F0",
    icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
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
        <path d="M 137.14285714285714 201.14285714285714 Q 130.28571428571428 196.57142857142858 123.42857142857143 196.57142857142858 L 104 196.57142857142858 L 104 196.57142857142858 L 104 315.42857142857144 L 104 315.42857142857144 L 123.42857142857143 315.42857142857144 L 123.42857142857143 315.42857142857144 Q 130.28571428571428 315.42857142857144 137.14285714285714 310.85714285714283 Q 144 306.2857142857143 144 296 L 144 216 L 144 216 Q 144 206.85714285714286 137.14285714285714 201.14285714285714 L 137.14285714285714 201.14285714285714 Z M 461.7142857142857 0 L 50.285714285714285 0 L 461.7142857142857 0 L 50.285714285714285 0 Q 28.571428571428573 0 14.857142857142858 14.857142857142858 Q 1.1428571428571428 28.571428571428573 0 50.285714285714285 L 0 461.7142857142857 L 0 461.7142857142857 Q 1.1428571428571428 483.42857142857144 14.857142857142858 497.14285714285717 Q 28.571428571428573 512 50.285714285714285 512 L 461.7142857142857 512 L 461.7142857142857 512 Q 483.42857142857144 512 497.14285714285717 497.14285714285717 Q 510.85714285714283 483.42857142857144 512 461.7142857142857 L 512 50.285714285714285 L 512 50.285714285714285 Q 510.85714285714283 28.571428571428573 497.14285714285717 14.857142857142858 Q 483.42857142857144 0 461.7142857142857 0 L 461.7142857142857 0 Z M 176 296 Q 177.14285714285714 313.14285714285717 164.57142857142858 331.42857142857144 L 164.57142857142858 331.42857142857144 L 164.57142857142858 331.42857142857144 Q 152 348.57142857142856 121.14285714285714 349.7142857142857 L 67.42857142857143 349.7142857142857 L 67.42857142857143 349.7142857142857 L 67.42857142857143 161.14285714285714 L 67.42857142857143 161.14285714285714 L 122.28571428571429 161.14285714285714 L 122.28571428571429 161.14285714285714 Q 152 162.28571428571428 164.57142857142858 180.57142857142858 Q 177.14285714285714 197.71428571428572 176 214.85714285714286 L 176 296 L 176 296 Z M 291.42857142857144 195.42857142857142 L 230.85714285714286 195.42857142857142 L 291.42857142857144 195.42857142857142 L 230.85714285714286 195.42857142857142 L 230.85714285714286 238.85714285714286 L 230.85714285714286 238.85714285714286 L 267.42857142857144 238.85714285714286 L 267.42857142857144 238.85714285714286 L 267.42857142857144 273.14285714285717 L 267.42857142857144 273.14285714285717 L 230.85714285714286 273.14285714285717 L 230.85714285714286 273.14285714285717 L 230.85714285714286 316.57142857142856 L 230.85714285714286 316.57142857142856 L 291.42857142857144 316.57142857142856 L 291.42857142857144 316.57142857142856 L 291.42857142857144 350.85714285714283 L 291.42857142857144 350.85714285714283 L 220.57142857142858 350.85714285714283 L 220.57142857142858 350.85714285714283 Q 198.85714285714286 348.57142857142856 196.57142857142858 328 L 196.57142857142858 185.14285714285714 L 196.57142857142858 185.14285714285714 Q 197.71428571428572 163.42857142857142 219.42857142857142 161.14285714285714 L 291.42857142857144 161.14285714285714 L 291.42857142857144 161.14285714285714 L 291.42857142857144 195.42857142857142 L 291.42857142857144 195.42857142857142 Z M 410.2857142857143 326.85714285714283 Q 397.7142857142857 352 381.7142857142857 350.85714285714283 L 381.7142857142857 350.85714285714283 L 381.7142857142857 350.85714285714283 Q 365.7142857142857 348.57142857142856 355.42857142857144 326.85714285714283 L 312 161.14285714285714 L 312 161.14285714285714 L 348.57142857142856 161.14285714285714 L 348.57142857142856 161.14285714285714 L 382.85714285714283 291.42857142857144 L 382.85714285714283 291.42857142857144 L 416 161.14285714285714 L 416 161.14285714285714 L 453.7142857142857 161.14285714285714 L 453.7142857142857 161.14285714285714 L 410.2857142857143 326.85714285714283 L 410.2857142857143 326.85714285714283 Z" />
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
    icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M13.54 12a6.8 6.8 0 1 1-13.54 0 6.8 6.8 0 0 1 13.54 0zm6.77 0c0 3.44-1.52 6.24-3.39 6.24e-16-1.87 0-3.39-2.8-3.39-6.24s1.52-6.24 3.39-6.24 3.39 2.8 3.39 6.24zm3.69 0c0 3.01-.53 5.46-1.18 5.46s-1.18-2.45-1.18-5.46.53-5.46 1.18-5.46 1.18 2.45 1.18 5.46z"/></svg>
  },
  {
    id: "substack",
    title: "Substack",
    tagline: "The dev newsletter pipeline",
    description: "Direct dispatches highlighting clean layout systems, neat software engineering updates, and tools I think are worth sharing.",
    source: "https://rysontheo.substack.com",
    accent: "#FF6719",
    icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.539 8.242H1.46V5.406h21.079v2.836zM1.46 10.881h21.079v2.837H1.46v-2.837zm0 5.474h21.079V24L12 18.981 1.46 24v-7.645z"/></svg>
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
        <path d="M5.5955 10.184c0.602 0 1.0919999999999999 -0.21349999999999997 1.0919999999999999 -0.8889999999999999 0 -0.6895 -0.4095 -0.959 -1.0605 -0.9624999999999999h-1.6099999999999999v1.8515h1.5785Zm-0.18899999999999997 -4.536h-1.386v1.568h1.4944999999999997c0.5285 0 0.9029999999999999 -0.23099999999999998 0.9029999999999999 -0.8015 0 -0.6194999999999999 -0.4795 -0.7665 -1.0114999999999998 -0.7665Zm4.5325 2.618h2.177c-0.0595 -0.6475 -0.39549999999999996 -1.0395 -1.0675 -1.0395 -0.6405 0 -1.0675 0.399 -1.1095 1.0395ZM13.6 0.16H2.4C1.1645 0.16 0.16 1.1645 0.16 2.4v11.200000000000001c0 1.2355 1.0045 2.2399999999999998 2.2399999999999998 2.2399999999999998h11.200000000000001c1.2355 0 2.2399999999999998 -1.0045 2.2399999999999998 -2.2399999999999998V2.4c0 -1.2355 -1.0045 -2.2399999999999998 -2.2399999999999998 -2.2399999999999998Zm-1.2075 5.3549999999999995h-2.723v-0.6614999999999999h2.723v0.6614999999999999Zm-5.452999999999999 2.0545c0.826 0.2345 1.2249999999999999 0.9624999999999999 1.2249999999999999 1.8059999999999998 0 1.365 -1.1444999999999999 1.9494999999999998 -2.366 1.9564999999999997H2.54v-6.72h3.1674999999999995c1.1514999999999997 0 2.1489999999999996 0.3255 2.1489999999999996 1.6624999999999999 0 0.6755 -0.315 1.008 -0.9169999999999999 1.295Zm4.1545 -1.351c1.5225 0 2.366 1.2005 2.366 2.639 0 0.056 -0.0035 0.11549999999999999 -0.007 0.17500000000000002 0 0.028 -0.0035 0.0525 -0.0035 0.077H9.942499999999999c0 0.7769999999999999 0.4095 1.2355 1.1935 1.2355 0.40599999999999997 0 0.9274999999999999 -0.21699999999999997 1.057 -0.6335h1.1795c-0.364 1.1165 -1.1165 1.638 -2.2784999999999997 1.638 -1.533 0 -2.4884999999999997 -1.0395 -2.4884999999999997 -2.555 0 -1.4629999999999999 1.0045 -2.576 2.4884999999999997 -2.576Z" />
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
        <path d="M23.998 8.128c0.063 -1.379 -1.612 -2.376 -2.795 -1.664 -1.23 0.598 -1.322 2.52 -0.156 3.234 1.2 0.862 2.995 -0.09 2.951 -1.57zm0 7.748c0.063 -1.38 -1.612 -2.377 -2.795 -1.665 -1.23 0.598 -1.322 2.52 -0.156 3.234 1.2 0.863 2.995 -0.09 2.951 -1.57zm-20.5 1.762L0 6.364h3.257l2.066 8.106 2.245 -8.106h3.267l2.244 8.106 2.065 -8.106h3.257l-3.54 11.274H11.39c-0.73 -2.713 -1.46 -5.426 -2.188 -8.14l-2.233 8.14H3.5z" />
      </svg>
    )
  },
  {
    id: "hackerrank",
    title: "HackerRank",
    tagline: "Code logic exercises",
    description: "Solving algorithmic tests, proving simple code paths, and running through core programming logic setups to keep sharp.",
    source: "https://www.hackerrank.com/profile/ribinkroy",
    accent: "#1BA94C",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 0v24h24V0zm9.95 8.002h1.805c0.061 0 0.111 0.05 0.111 0.111v7.767c0 0.061 -0.05 0.111 -0.11 0.111H9.95c-0.061 0 -0.111 -0.05 -0.111 -0.11v-2.87H7.894v2.87c0 0.06 -0.05 0.11 -0.11 0.11H5.976a0.11 0.11 0 0 1 -0.11 -0.11V8.112c0 -0.06 0.05 -0.11 0.11 -0.11h1.806c0.061 0 0.11 0.05 0.11 0.11v2.869H9.84v-2.87c0 -0.06 0.05 -0.11 0.11 -0.11zm2.999 0h5.778c0.061 0 0.111 0.05 0.111 0.11v7.767a0.11 0.11 0 0 1 -0.11 0.112h-5.78a0.11 0.11 0 0 1 -0.11 -0.11v-7.77c0 -0.06 0.05 -0.11 0.11 -0.11z" />
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
    icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
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
        <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z" />
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
    icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
  },
  {
    id: "facebook",
    title: "Facebook",
    tagline: "Old school social node",
    description: "Keeping in touch with childhood buddies, university classmates, and standard community message feeds.",
    source: "https://facebook.com/Ryson-Theo",
    accent: "#1877F2",
    icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
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
  const keys = useRef<{ [key: string]: boolean }>({});
  
  const cameraY = useRef(0);
  const player = useRef({
    x: 450,
    y: 60,
    vx: 0,
    vy: 0,
    size: 26, 
    speed: 4.5,       
    jumpForce: 7.5,   
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

    const updateGame = () => {
      const p = player.current;
      const gravity = 0.23;   
      const friction = 0.86;

      if (keys.current['ArrowLeft'] || keys.current['KeyA']) {
        p.vx = -p.speed;
      } else if (keys.current['ArrowRight'] || keys.current['KeyD']) {
        p.vx = p.speed;
      } else {
        p.vx *= friction;
      }

      if ((keys.current['Space'] || keys.current['ArrowUp'] || keys.current['KeyW']) && p.isGrounded) {
        p.vy = -p.jumpForce;
        p.isGrounded = false;
      }

      p.vy += gravity;
      p.x += p.vx;
      p.y += p.vy;

      if (p.x + p.size < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = -p.size;

      if (p.y < 20) { p.y = 20; p.vy = 0; }

      const targetCamY = p.y - canvas.height / 2.5;
      if (targetCamY > cameraY.current) {
        cameraY.current += (targetCamY - cameraY.current) * 0.08;
      }

      p.isGrounded = false;

      platforms.current.forEach((plat) => {
        if (
          p.x + p.size > plat.x &&
          p.x < plat.x + plat.width &&
          p.y + p.size >= plat.y &&
          p.y + p.size - p.vy <= plat.y + 12 &&
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
      if (p.vx > 0.4) eyeLookX = 2;
      if (p.vx < -0.4) eyeLookX = -2;

      ctx.fillRect(px + 3 + eyeLookX, py + 5, 6, 6);
      ctx.fillRect(px + 13 + eyeLookX, py + 5, 6, 6);

      ctx.fillStyle = '#000000';
      let pupilLookX = 0;
      if (p.vx > 0.4) pupilLookX = 2;
      if (p.vx < -0.4) pupilLookX = -1;

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
              <canvas ref={canvasRef} className="w-full h-auto block aspect-[16/9.6]" />
            </div>

            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
              activeExpanded ? 'max-h-125 opacity-100 mt-6' : 'max-h-0 opacity-0 pointer-events-none'
            }`}>
              {activeExpanded && (
                <div className="p-6 rounded-3xl border border-zinc-800 bg-linear-to-br from-zinc-900 to-black shadow-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800" style={{ color: activeExpanded.accent }}>
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
                      href={activeExpanded.source}
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