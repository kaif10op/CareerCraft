"use client";

import { templates } from "@/config/templates";
import Link from "next/link";
import { ArrowRight, LayoutTemplate } from "lucide-react";
import { MouseEvent } from "react";

export default function TemplateShowcase() {
  // Take a mix of templates to showcase, up to 6
  const featuredTemplates = templates.slice(0, 6);

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <section 
      className="relative py-32 bg-gray-950 overflow-hidden isolate border-t border-white/5"
      onMouseMove={handleMouseMove}
    >
       {/* Background Grid that tracks mouse */}
       <div 
         className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-0 transition-opacity duration-300 pointer-events-none" 
         style={{
           maskImage: `radial-gradient(circle 800px at var(--mouse-x, 50%) var(--mouse-y, 50%), #000 0%, transparent 100%)`,
           WebkitMaskImage: `radial-gradient(circle 800px at var(--mouse-x, 50%) var(--mouse-y, 50%), #000 0%, transparent 100%)`
         }}
       />
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[30rem] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none -z-10 mix-blend-screen" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6 bg-purple-500/10 border border-purple-500/20 text-purple-300">
              <LayoutTemplate className="w-4 h-4" />
              15+ Premium Designs
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              A Layout for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Every Career</span>
            </h2>
            <p className="text-xl text-gray-400">
              Whether you&apos;re a creative designer, an executive, or a new grad, we have an ATS-optimized template designed specifically for your industry.
            </p>
          </div>
          
          <Link
            href="/create"
            className="group flex flex-shrink-0 items-center gap-2 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all hover:-translate-y-1 shadow-xl hover:shadow-[0_10px_30px_-10px_rgba(255,255,255,0.2)] backdrop-blur-md"
          >
            Explore the Builder
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredTemplates.map((tpl, i) => (
            <div 
              key={tpl.id}
              className="group relative rounded-[2rem] bg-gray-900 border border-gray-800 p-2 transition-all duration-500 hover:border-purple-500/50 hover:shadow-[0_20px_40px_-10px_rgba(168,85,247,0.3)] hover:-translate-y-2 overflow-hidden aspect-[1/1.2] flex flex-col"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              {/* Image Container */}
              <div className="relative flex-1 rounded-[1.5rem] overflow-hidden bg-gray-800 isolate">
                {tpl.thumbnail ? (
                  <div 
                    className="absolute inset-0 bg-cover bg-top opacity-50 group-hover:opacity-90 transition-opacity duration-500"
                    style={{ backgroundImage: `url(${tpl.thumbnail})` }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-30 mix-blend-multiply bg-white">
                    {/* Fallback wireframe */}
                    <div className="w-3/4 h-3/4 border-2 border-dashed border-gray-600 rounded-lg" />
                  </div>
                )}
                
                {/* Floating Tags */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-gray-950/80 text-white backdrop-blur-md border border-white/10 rounded-full">
                    {tpl.layout}
                  </span>
                </div>
              </div>

              {/* Title & Overlay */}
              <div className="pt-4 pb-2 px-4 flex justify-between items-center relative z-10">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors uppercase tracking-wide">
                    {tpl.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
