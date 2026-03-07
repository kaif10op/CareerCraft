"use client";

import Link from "next/link";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export default function Logo({ className = "", iconOnly = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 group select-none ${className}`}>
      {/* Creative Icon */}
      <div className="relative w-10 h-10 flex items-center justify-center">
        {/* Animated Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-cyan-500 rounded-xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-500 animate-pulse" />
        
        {/* Main Logo Container */}
        <div className="relative w-full h-full rounded-xl bg-gray-950 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl group-hover:border-white/20 transition-colors">
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7"
          >
            {/* Background Shape */}
            <path
              d="M10 12C10 10.8954 10.8954 10 12 10H28C29.1046 10 30 10.8954 30 12V28C30 29.1046 29.1046 30 28 30H12C10.8954 30 10 29.1046 10 28V12Z"
              fill="url(#logo-grad)"
              fillOpacity="0.1"
            />
            
            {/* First stylized 'C' */}
            <path
              d="M26 14C24.5 12.5 22.5 12 20 12C15.5817 12 12 15.5817 12 20C12 24.4183 15.5817 28 20 28C22.5 28 24.5 27.5 26 26"
              stroke="url(#logo-grad)"
              strokeWidth="3"
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]"
            />
            
            {/* Second stylized 'C' (Interlocking) */}
            <path
              d="M18 16C19.5 14.5 21.5 14 24 14C28.4183 14 32 17.5817 32 22C32 26.4183 28.4183 30 24 30C21.5 30 19.5 29.5 18 28"
              stroke="url(#logo-grad-2)"
              strokeWidth="3"
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
            />

            <defs>
              <linearGradient id="logo-grad" x1="12" y1="12" x2="26" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8B5CF6" />
                <stop offset="1" stopColor="#D946EF" />
              </linearGradient>
              <linearGradient id="logo-grad-2" x1="32" y1="14" x2="18" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#22D3EE" />
                <stop offset="1" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Subtle sheen reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      </div>

      {!iconOnly && (
        <span className="text-2xl font-black tracking-tighter text-white">
          <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent group-hover:from-violet-300 group-hover:to-cyan-300 transition-all duration-300">
            Carrier
          </span>
          <span className="text-violet-500 group-hover:text-cyan-400 transition-colors ml-0.5">Craft</span>
        </span>
      )}
    </div>
  );
}
