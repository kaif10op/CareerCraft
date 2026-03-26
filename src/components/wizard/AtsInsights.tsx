"use client";

import { useFormContext } from "react-hook-form";
import { ResumeFormValues } from "@/lib/schema";
import { CheckCircle2, AlertCircle, TrendingUp, Info, Shield, Zap } from "lucide-react";

export function AtsInsights() {
  const { watch } = useFormContext<ResumeFormValues>();
  const data = watch();

  // Calculate insights directly during render
  let currentScore = 0;
  const tips: { text: string; impact: "blocking" | "high" | "medium" | "low"; fix: string }[] = [];

  // Basics
  if (data.fullName) currentScore += 5;
  else tips.push({ text: "Full Name is required", impact: "blocking", fix: "Go to Step 2" });

  if (data.email) currentScore += 5;
  else tips.push({ text: "Email address is required", impact: "blocking", fix: "Go to Step 2" });

  if (data.phone) currentScore += 5;
  if (data.location) currentScore += 5;
  
  // Links
  if (data.linkedin) currentScore += 10;
  else tips.push({ text: "Add your LinkedIn URL — recruiters look for this first", impact: "medium", fix: "Go to Step 2" });
  
  // Summary
  if (data.summary && data.summary.length >= 10) {
    currentScore += 15;
    if (data.summary.length < 100) tips.push({ text: "Expand your summary to 100+ characters for better ATS scores", impact: "low", fix: "Use AI Write" });
  } else {
    tips.push({ text: "Professional summary is required", impact: "blocking", fix: "Go to Step 2" });
  }

  // Experience
  if (data.experience && data.experience.length > 0 && data.experience[0].company) {
    currentScore += 20;
    const totalWords = data.experience.reduce((acc, exp) => acc + (exp.description?.split(" ").length || 0), 0);
    if (totalWords < 50) tips.push({ text: "Add more detail to your experience descriptions (aim for 50+ words each)", impact: "high", fix: "Use ✨ Improve" });
  } else if (data.role === 'professional') {
    tips.push({ text: "Work history is critical for professionals", impact: "blocking", fix: "Go to Step 3" });
  }

  // Skills
  if (data.skills && data.skills.length >= 1) {
    currentScore += 15;
    if (data.skills.length < 5) tips.push({ text: "Add at least 5 skills — more keywords = better ATS match", impact: "medium", fix: "Use AI Suggest" });
  } else {
    tips.push({ text: "Add at least 1 skill", impact: "blocking", fix: "Go to Step 5" });
  }

  // Projects
  if (data.projects && data.projects.length > 0 && data.projects[0]?.name) currentScore += 10;
  else tips.push({ text: "Adding projects shows initiative and hands-on skills", impact: "low", fix: "Go to Portfolio" });

  // Education
  if (data.education && data.education.length > 0 && data.education[0]?.institution) currentScore += 10;

  const score = Math.min(currentScore, 100);
  const visibleTips = tips.slice(0, 4);
  const blockingCount = tips.filter(t => t.impact === "blocking").length;

  const getScoreColor = () => {
    if (score > 80) return { text: "text-emerald-400", bg: "bg-emerald-500", label: "Excellent" };
    if (score > 60) return { text: "text-green-400", bg: "bg-green-500", label: "Good" };
    if (score > 40) return { text: "text-yellow-400", bg: "bg-yellow-500", label: "Needs Work" };
    return { text: "text-red-400", bg: "bg-red-500", label: "Low" };
  };

  const scoreInfo = getScoreColor();

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-6 h-fit sticky top-24">
      {/* Header with score */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-violet-500/15 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-violet-400" />
          </div>
          ATS Strength
        </h3>
        <div className="text-right">
          <span className={`text-3xl font-black ${scoreInfo.text}`}>
            {score}
          </span>
          <span className="text-sm text-gray-500 font-bold">/100</span>
        </div>
      </div>

      {/* Score label */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {blockingCount > 0 ? (
            <Shield className="w-4 h-4 text-red-400" />
          ) : (
            <Zap className="w-4 h-4 text-emerald-400" />
          )}
          <span className={`text-xs font-bold ${blockingCount > 0 ? 'text-red-400' : score > 60 ? 'text-emerald-400' : 'text-yellow-400'}`}>
            {blockingCount > 0 ? `${blockingCount} required field${blockingCount > 1 ? 's' : ''} missing` : scoreInfo.label}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-gray-800 rounded-full mb-6 overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-out rounded-full ${scoreInfo.bg}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Tips */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <Info className="w-3 h-3" />
          {tips.length > 0 ? "Optimization Tips" : "All Clear!"}
        </h4>
        
        {visibleTips.length > 0 ? (
          visibleTips.map((tip, i) => (
            <div key={i} className={`flex gap-3 text-sm p-3 rounded-xl transition-colors ${
              tip.impact === 'blocking' ? 'bg-red-500/5 border border-red-500/15' : 'bg-transparent'
            }`}>
              <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${
                tip.impact === 'blocking' ? 'text-red-500' 
                : tip.impact === 'high' ? 'text-orange-400' 
                : tip.impact === 'medium' ? 'text-yellow-400'
                : 'text-blue-400'
              }`} />
              <div className="flex-1">
                <p className={`leading-tight ${tip.impact === 'blocking' ? 'text-red-400 font-bold' : 'text-gray-400'}`}>
                  {tip.text}
                </p>
                <p className="text-xs text-gray-600 mt-1 font-medium">
                  💡 {tip.fix}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex gap-3 text-sm p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <p className="text-emerald-400/80 leading-tight font-medium">Your resume is well-optimized! Consider adding more details to stand out.</p>
          </div>
        )}

        {tips.length > 4 && (
          <p className="text-xs text-gray-600 font-medium text-center">
            +{tips.length - 4} more tip{tips.length - 4 > 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Pro Insight */}
      <div className="mt-6 pt-5 border-t border-gray-800">
        <p className="text-[11px] text-gray-500 leading-relaxed">
          <span className="font-bold text-violet-400">Pro tip:</span> Use metric-driven bullet points (e.g. &quot;Increased revenue by 20%&quot;) and match keywords from the job description to maximize your ATS score.
        </p>
      </div>
    </div>
  );
}
