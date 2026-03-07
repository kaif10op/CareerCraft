"use client";

import Link from "next/link";
import { MouseEvent } from "react";

export default function Hero() {
  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-950"
      onMouseMove={handleMouseMove}
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 bg-gray-950 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[15%] w-96 h-96 rounded-full bg-violet-600/20 blur-[100px] animate-blob mix-blend-screen" />
        <div className="absolute bottom-[10%] right-[15%] w-[30rem] h-[30rem] rounded-full bg-cyan-600/20 blur-[100px] animate-blob delay-1000 mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-purple-600/15 rounded-full blur-[120px] animate-pulse mix-blend-screen" />
        {/* Grid pattern overlay that tracks mouse */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] transition-all duration-300 pointer-events-none" 
          style={{
            maskImage: `radial-gradient(circle 600px at var(--mouse-x, 50%) var(--mouse-y, 50%), #000 0%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(circle 600px at var(--mouse-x, 50%) var(--mouse-y, 50%), #000 0%, transparent 100%)`
          }}
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 bg-white/5 border border-white/10 text-gray-300 backdrop-blur-md shadow-2xl animate-float">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse" />
          Carrier Craft: Build your perfect career
        </div>

        {/* Heading */}
        <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] text-white tracking-tighter drop-shadow-2xl">
          Build Your{" "}
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient relative inline-block">
            Perfect Resume
            {/* Soft text glow behind the gradient */}
            <span className="absolute inset-0 bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 blur-2xl opacity-30 select-none -z-10">Perfect Resume</span>
          </span>
          <br />
          in Seconds
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed text-gray-400 font-medium tracking-wide">
          Enter your details and let our AI craft a professional, ATS-optimized
          resume that stands out. <span className="text-gray-300">No templates, no hassle — just results.</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href="/create"
            className="group relative flex items-center justify-center gap-2 px-10 py-5 rounded-2xl text-white font-bold text-lg transition-all hover:scale-105 bg-gradient-to-br from-violet-600 to-cyan-600 shadow-[0_0_40px_-5px_rgba(139,92,246,0.5)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10">Create Your Resume</span>
            <span className="relative z-10 inline-block group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
          <Link
            href="/resumes"
            className="px-10 py-5 rounded-2xl font-bold text-lg transition-all border border-white/10 text-gray-300 bg-white/5 hover:bg-white/10 hover:text-white backdrop-blur-xl shadow-xl hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)]"
          >
            View Saved Resumes
          </Link>
        </div>

        {/* Feature cards */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Card 1 */}
          <div className="relative group rounded-3xl p-8 transition-all duration-300 bg-white/5 border border-white/10 backdrop-blur-xl hover:-translate-y-2 hover:bg-white/10 hover:shadow-[0_10px_40px_-10px_rgba(139,92,246,0.3)] hover:border-violet-500/50 shadow-2xl overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-violet-500/30 transition-colors duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] group-hover:from-violet-500/40 group-hover:to-purple-500/40 transition-colors">
                <svg className="w-7 h-7 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white tracking-wide group-hover:text-violet-300 transition-colors">AI-Powered Magic</h3>
              <p className="text-gray-400/90 leading-relaxed font-medium">
                Advanced AI generates tailored, professional content based perfectly on your custom experience.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative group rounded-3xl p-8 transition-all duration-300 bg-white/5 border border-white/10 backdrop-blur-xl hover:-translate-y-2 hover:bg-white/10 hover:shadow-[0_10px_40px_-10px_rgba(6,182,212,0.3)] hover:border-cyan-500/50 shadow-2xl overflow-hidden text-left md:translate-y-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-500/30 transition-colors duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] group-hover:from-cyan-500/40 group-hover:to-blue-500/40 transition-colors">
                <svg className="w-7 h-7 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white tracking-wide group-hover:text-cyan-300 transition-colors">ATS-Optimized</h3>
              <p className="text-gray-400/90 leading-relaxed font-medium">
                Resumes that perfectly parse and bypass strict Applicant Tracking Systems every single time.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative group rounded-3xl p-8 transition-all duration-300 bg-white/5 border border-white/10 backdrop-blur-xl hover:-translate-y-2 hover:bg-white/10 hover:shadow-[0_10px_40px_-10px_rgba(168,85,247,0.3)] hover:border-purple-500/50 shadow-2xl overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/30 transition-colors duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] group-hover:from-purple-500/40 group-hover:to-pink-500/40 transition-colors">
                <svg className="w-7 h-7 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08-.402-2.599-1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white tracking-wide group-hover:text-purple-300 transition-colors">100% Free</h3>
              <p className="text-gray-400/90 leading-relaxed font-medium">
                Premium high-quality features with no hidden fees and absolutely no subscriptions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
