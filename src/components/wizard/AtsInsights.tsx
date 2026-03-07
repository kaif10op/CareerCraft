"use client";

import { useFormContext } from "react-hook-form";
import { ResumeFormValues } from "@/lib/schema";
import { CheckCircle2, AlertCircle, TrendingUp, Info } from "lucide-react";

export function AtsInsights() {
  const { watch } = useFormContext<ResumeFormValues>();
  const data = watch();

  // Calculate insights directly during render
  let currentScore = 0;
  const newTips: { text: string; impact: "blocking" | "high" | "medium" | "low" }[] = [];

  // Basics
  if (data.fullName) currentScore += 5;
  else newTips.push({ text: "Full Name is required", impact: "blocking" });

  if (data.email) currentScore += 5;
  else newTips.push({ text: "Email address is required", impact: "blocking" });

  if (data.phone) currentScore += 5;
  if (data.location) currentScore += 5;
  
  // Links
  if (data.linkedin) currentScore += 10;
  else newTips.push({ text: "Add LinkedIn for recruiters", impact: "medium" });
  
  // Summary
  if (data.summary && data.summary.length >= 10) {
    currentScore += 15;
    if (data.summary.length < 50) newTips.push({ text: "Make summary > 50 chars", impact: "low" });
  } else {
    newTips.push({ text: "Professional summary is required", impact: "blocking" });
  }

  // Experience
  if (data.experience && data.experience.length > 0) {
    currentScore += 20;
    const totalWords = data.experience.reduce((acc, exp) => acc + (exp.description?.split(" ").length || 0), 0);
    if (totalWords < 50) newTips.push({ text: "Detail your experience more", impact: "high" });
  } else if (data.role === 'professional') {
    newTips.push({ text: "Work history is required for professionals", impact: "blocking" });
  }

  // Skills
  if (data.skills && data.skills.length >= 1) {
    currentScore += 15;
    if (data.skills.length < 5) newTips.push({ text: "Add at least 5 skills", impact: "medium" });
  } else {
    newTips.push({ text: "At least 1 skill is required", impact: "blocking" });
  }

  // Projects
  if (data.projects && data.projects.length > 0) currentScore += 10;

  // Educations
  if (data.education && data.education.length > 0) currentScore += 10;

  const score = Math.min(currentScore, 100);
  const tips = newTips.slice(0, 3); // show top 3 tips

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-6 h-fit sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-violet-400" />
          ATS Strength
        </h3>
        <span className={`text-2xl font-black ${score > 70 ? 'text-green-400' : score > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
          {score}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-gray-800 rounded-full mb-8 overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-out rounded-full ${
            score > 70 ? 'bg-green-500' : score > 40 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <Info className="w-3 h-3" />
          Optimization Tips
        </h4>
        
        {tips.length > 0 ? (
          tips.map((tip, i) => (
            <div key={i} className="flex gap-3 text-sm">
              <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${tip.impact === 'blocking' ? 'text-red-500' : tip.impact === 'high' ? 'text-red-400' : 'text-yellow-400'}`} />
              <p className={`${tip.impact === 'blocking' ? 'text-red-400 font-bold' : 'text-gray-400'} leading-tight`}>
                {tip.impact === 'blocking' && '<Required> '}
                {tip.text}
              </p>
            </div>
          ))
        ) : (
          <div className="flex gap-3 text-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-green-400" />
            <p className="text-green-400/80 leading-tight">Your resume is highly optimized!</p>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-800">
        <p className="text-[10px] text-gray-500 leading-relaxed italic">
          AI Suggestion: &quot;Using metric-driven bullet points (e.g. Increased revenue by 20%) can boost your score further.&quot;
        </p>
      </div>
    </div>
  );
}
