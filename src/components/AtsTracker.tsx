"use client";

import { useState, useEffect } from "react";
import { calculateAtsScore, AtsResult } from "@/utils/atsScoring";
import { CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp } from "lucide-react";

export function AtsTracker({ resumeContent }: { resumeContent: string }) {
  const [result, setResult] = useState<AtsResult | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (resumeContent) {
      setResult(calculateAtsScore(resumeContent));
    }
  }, [resumeContent]);

  if (!result) return null;

  const { score, feedback } = result;

  // Determine color theme based on score
  let strokeColor = "stroke-red-500";
  let textColor = "text-red-400";
  let bgGlow = "bg-red-500/10";
  let shadowGlow = "shadow-[0_0_20px_rgba(239,68,68,0.3)]";

  if (score >= 80) {
    strokeColor = "stroke-green-500";
    textColor = "text-green-400";
    bgGlow = "bg-green-500/10";
    shadowGlow = "shadow-[0_0_20px_rgba(34,197,94,0.3)]";
  } else if (score >= 60) {
    strokeColor = "stroke-yellow-500";
    textColor = "text-yellow-400";
    bgGlow = "bg-yellow-500/10";
    shadowGlow = "shadow-[0_0_20px_rgba(234,179,8,0.3)]";
  }

  // SVG Circle properties
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`relative w-full max-w-sm rounded-[2rem] bg-gray-900 border border-gray-800 ${shadowGlow} transition-all duration-500 overflow-hidden`}>
      {/* Background ambient glow */}
      <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[60px] pointer-events-none ${bgGlow}`} />

      {/* Header / Summary View */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full relative z-10 p-6 flex flex-row items-center justify-between text-left group"
      >
        <div className="flex flex-row items-center gap-5">
          {/* Circular Progress Ring */}
          <div className="relative w-24 h-24 flex items-center justify-center">
             <svg className="w-24 h-24 transform -rotate-90">
                {/* Background Circle */}
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  className="text-white/5"
                />
                {/* Progress Circle (animated) */}
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className={`${strokeColor} transition-all duration-1000 ease-out`}
                  strokeLinecap="round"
                />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center flex-col">
               <span className={`text-2xl font-black ${textColor} mt-1 drop-shadow-md`}>{score}</span>
             </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white tracking-tight mb-1 group-hover:text-violet-300 transition-colors">ATS Score</h3>
            <p className="text-gray-400 text-sm font-medium">
              {score >= 80 ? "Excellent Match" : score >= 60 ? "Needs Improvement" : "Weak Match"}
            </p>
          </div>
        </div>

        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors border border-white/5">
          {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </button>

      {/* Expanded Feedback View */}
      <div className={`transition-all duration-300 ease-in-out relative z-10 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}>
        <div className="p-6 pt-0 border-t border-gray-800 overflow-y-auto custom-scrollbar max-h-96">
          <ul className="space-y-4 pr-2">
            {feedback.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                {/* Icon based on feedback type */}
                <div className="mt-0.5 flex-shrink-0">
                  {item.type === "success" && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                  {item.type === "warning" && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
                  {item.type === "error" && <XCircle className="w-5 h-5 text-red-400" />}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed font-medium">
                  {item.message}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
