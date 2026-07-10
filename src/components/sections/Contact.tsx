"use client";

import React, { useState } from "react";
import PixelBlast from "@/components/ui/PixelBlast";

export default function Contact() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [botField, setBotField] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isAllowedEmail = (email: string): boolean => {
    const blacklistedDomains = [
      "mailinator.com", "10minutemail.com", "tempmail.com",
      "guerrillamail.com", "sharklasers.com", "dispostable.com"
    ];
    const domain = email.split("@")[1]?.toLowerCase();
    return !!domain && !blacklistedDomains.includes(domain);
  };

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    const cooldown = 60000;
    const lastSubmit = localStorage.getItem("form_last_submit");

    if (lastSubmit) {
      const timePassed = now - parseInt(lastSubmit, 10);
      if (timePassed < cooldown) {
        const remaining = Math.ceil((cooldown - timePassed) / 1000);
        setErrorMessage(`Rate limit exceeded. Please wait ${remaining}s before resubmitting.`);
        return false;
      }
    }

    const rawHistory = localStorage.getItem("form_submit_history");
    const history = rawHistory ? (JSON.parse(rawHistory) as number[]) : [];
    const recent = history.filter((timestamp) => now - timestamp < 60 * 60 * 1000);

    if (recent.length >= 5) {
      setErrorMessage("Too many messages sent. Please wait at least an hour before trying again.");
      return false;
    }

    return true;
  };

  const recordSubmission = () => {
    const now = Date.now();
    const rawHistory = localStorage.getItem("form_submit_history");
    const history = rawHistory ? (JSON.parse(rawHistory) as number[]) : [];
    const recent = history.filter((timestamp) => now - timestamp < 60 * 60 * 1000);
    localStorage.setItem("form_submit_history", JSON.stringify([...recent, now]));
    localStorage.setItem("form_last_submit", now.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (botField.trim()) {
      setErrorMessage("Spam detected. Submission blocked.");
      return;
    }

    if (!checkRateLimit()) return;
    if (!isAllowedEmail(formState.email)) {
      setErrorMessage("Please use a valid, stable email provider.");
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = `https://formsubmit.co/ajax/${process.env.NEXT_PUBLIC_FORMSUBMIT_ID}`;
      
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message,
        }),
      });

      if (res.ok) {
        recordSubmission();
        setSuccessMessage("Message sent successfully. I will respond as soon as possible.");
        setFormState({ name: "", email: "", message: "" });
        setBotField("");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(data?.message || "Failed to send message. Please try emailing directly.");
      }
    } catch {
      setErrorMessage("An unexpected transmission error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-20 md:py-32 lg:py-40 border-t border-white/10 bg-black overflow-hidden">
      {/* Background animation container - pointer events none so it doesn't trap mobile touches */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 transform-gpu">
        <PixelBlast
          className="absolute inset-0"
          variant="circle"
          pixelSize={6}
          color="#3b82f6"
          patternScale={3}
          patternDensity={1.2}
          pixelSizeJitter={0.5}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.6}
          edgeFade={0.25}
          transparent
        />
      </div>

      <div className="container mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
        <div className="mx-auto max-w-6xl">
          {/* Glassmorphic Card - Hardware accelerated */}
          <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-white/5 shadow-2xl shadow-sky-500/10 backdrop-blur-3xl transform-gpu">
            <div className="absolute inset-0 bg-black/30 pointer-events-none" />
            
            <div className="relative grid gap-10 lg:grid-cols-2 p-6 sm:p-8 md:p-10">
              
              {/* Left Column: Copy & Links */}
              <div className="flex flex-col justify-between gap-8">
                <div className="space-y-6">
                  <p className="text-xs font-mono tracking-[0.35em] text-sky-300 uppercase">Get in Touch</p>
                  <h2 className="font-heading text-4xl md:text-5xl text-white leading-tight tracking-tight">
                    Let&apos;s build something exceptional.
                  </h2>
                  <p className="text-sm md:text-base leading-relaxed md:leading-7 text-slate-300 max-w-xl">
                    I am currently accepting new collaborations and strategic project inquiries. Please share your requirements below to initiate a formal conversation.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-200">Email</p>
                    <a href="mailto:Ribinkroy@protonmail.com" className="mt-2 block text-sm font-semibold text-sky-300 hover:text-sky-200 transition-colors">
                      Ribinkroy@protonmail.com
                    </a>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-200">Socials</p>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-200">
                      <a href="https://github.com/Ryson-Theo" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-200 hover:text-sky-300 transition-colors">
                        GitHub ↗
                      </a>
                      <a href="https://www.linkedin.com/in/ribin-k-roy/" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-200 hover:text-sky-300 transition-colors">
                        LinkedIn ↗
                      </a>
                      <a href="https://x.com/Ryson_Theo" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-200 hover:text-sky-300 transition-colors">
                        Twitter ↗
                      </a>
                      <a href="https://linktr.ee/ryson_theo" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-200 hover:text-sky-300 transition-colors">
                        Socials & Links ↗
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Form */}
              <div className="flex justify-center lg:justify-end">
                {/* touch-pan-y ensures vertical swiping inside the form isn't trapped */}
                <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6 touch-pan-y">
                  <input
                    type="text"
                    name="bot-field"
                    value={botField}
                    onChange={(e) => setBotField(e.target.value)}
                    className="sr-only"
                    autoComplete="off"
                    tabIndex={-1}
                  />

                  <div className="space-y-3">
                    <label htmlFor="message" className="block text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-200">
                      Brief
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      // text-base is critical here to prevent iOS zoom-on-focus bug
                      className="w-full min-h-45 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-base text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:bg-white/8 transition-all resize-none"
                      placeholder="A short summary of your project or need"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-200">
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        // text-base is critical here to prevent iOS zoom-on-focus bug
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-base text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:bg-white/8 transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-200">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        // text-base is critical here to prevent iOS zoom-on-focus bug
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-base text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:bg-white/8 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {errorMessage && (
                      <div className="text-xs font-mono text-rose-400 bg-rose-500/10 border border-rose-500/10 p-3 rounded-2xl">
                        ⚠️ {errorMessage}
                      </div>
                    )}
                    {successMessage && (
                      <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/10 p-3 rounded-2xl">
                        ✓ {successMessage}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-2xl bg-sky-400 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-sm shadow-sky-500/10 transition-all duration-300 hover:bg-sky-300 active:scale-[0.98] disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending..." : "Send"}
                  </button>

                  <p className="text-xs text-slate-500 text-center lg:text-left">
                    One message per minute, five per hour. Disposable email domains and bot traffic are blocked automatically.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
