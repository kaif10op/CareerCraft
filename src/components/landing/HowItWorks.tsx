"use client";

import { FileEdit, Wand2, LayoutDashboard, DownloadCloud } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <FileEdit className="w-8 h-8 text-violet-400 group-hover:text-violet-300 transition-colors" />,
      title: "Enter Your Details",
      description: "Fill in our intuitive form with your basics, experience, education, and skills.",
      glow: "bg-violet-500/10 group-hover:bg-violet-500/20",
      border: "group-hover:border-violet-500/30",
      line: "from-violet-500/50 to-cyan-500/50"
    },
    {
      icon: <Wand2 className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" />,
      title: "AI Optimization",
      description: "Our advanced AI refines your content and checks ATS compatibility in real-time.",
      glow: "bg-cyan-500/10 group-hover:bg-cyan-500/20",
      border: "group-hover:border-cyan-500/30",
      line: "from-cyan-500/50 to-purple-500/50"
    },
    {
      icon: <LayoutDashboard className="w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors" />,
      title: "Choose a Template",
      description: "Select from 15+ professionally designed, ATS-friendly templates.",
      glow: "bg-purple-500/10 group-hover:bg-purple-500/20",
      border: "group-hover:border-purple-500/30",
      line: "from-purple-500/50 to-pink-500/50"
    },
    {
      icon: <DownloadCloud className="w-8 h-8 text-pink-400 group-hover:text-pink-300 transition-colors" />,
      title: "Download & Apply",
      description: "Export as a pixel-perfect PDF instantly. Zero paywalls, zero hassle.",
      glow: "bg-pink-500/10 group-hover:bg-pink-500/20",
      border: "group-hover:border-pink-500/30",
      line: ""
    }
  ];

  return (
    <section className="relative py-32 bg-gray-950 overflow-hidden isolate shadow-[inset_0_20px_40px_-20px_rgba(0,0,0,0.8)] border-t border-white/5">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-screen" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Works</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Your professional resume is just four simple steps away.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-[4.5rem] left-[12.5%] right-[12.5%] h-1 bg-white/5 -z-10 rounded-full" />

          {steps.map((step, index) => (
            <div key={index} className="relative group text-center flex flex-col items-center">
              {/* Desktop specific connecting glow (partial) */}
              {index < steps.length - 1 && (
                <div className={`hidden md:block absolute top-[4.5rem] left-1/2 w-full h-1 bg-gradient-to-r ${step.line} scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left -z-10 rounded-full`} />
              )}

              {/* Icon Container with Glassmorphism */}
              <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 border border-white/10 backdrop-blur-md shadow-xl ${step.glow} ${step.border} group-hover:-translate-y-2 transition-all duration-300 relative z-10`}>
                 {/* Inner glow */}
                 <div className="absolute inset-0 rounded-3xl bg-white/[0.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" />
                 <div className="relative z-10">
                   {step.icon}
                 </div>
                 
                 {/* Step Number Badge */}
                 <div className="absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center text-xs font-bold text-gray-300 group-hover:bg-white group-hover:text-gray-900 transition-colors shadow-lg">
                    {index + 1}
                 </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gray-200 transition-colors">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed font-medium px-4">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
