import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // REMOVED "h-full" from here
      className={cn("antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      {/* CHANGED "min-h-full" to "min-h-screen" here */}
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}