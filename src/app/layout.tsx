import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ribin K Roy | Full-Stack Developer",
  description: "Portfolio of Ribin K Roy - Full-Stack Developer creating modern digital products through design, engineering, and AI exploration.",
  openGraph: {
    siteName: "Ribin K Roy",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Ribin K Roy",
    "url": "https://ribin-portfolio.vercel.app",
  };

  return (
    <html
      lang="en"
      className={cn(
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <head>
        {/* Injecting structured data into the head tag */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      {/* Optimized for mobile dynamic viewport height to prevent scroll jank */}
      <body className="min-h-dvh flex flex-col overscroll-none">
        {children}
      </body>
    </html>
  );
}
