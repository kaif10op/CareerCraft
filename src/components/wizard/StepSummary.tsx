"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/Textarea";
import { ResumeFormValues } from "@/lib/schema";
import { Sparkles, Info, Loader2 } from "lucide-react";

export function StepSummary() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<ResumeFormValues>();

  const summary = watch("summary") || "";
  const jobTitle = watch("jobTitle") || "";
  const role = watch("role") || "professional";
  const skills = watch("skills") || [];

  const [isAILoading, setIsAILoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const handleAIAssist = async () => {
    setIsAILoading(true);
    setAiError("");

    try {
      const response = await fetch("/api/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "summary",
          context: {
            jobTitle,
            role,
            notes: summary || "No notes yet, generate something professional",
            skills: skills.join(", "),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate summary");
      }

      setValue("summary", data.result, { shouldValidate: true });
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "AI assist failed");
    } finally {
      setIsAILoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Professional Summary</h2>
        <p className="text-gray-400 text-sm mb-6">
          Write a short, engaging pitch highlighting your expertise and what you bring to the table.
        </p>
      </div>

      <div className="bg-violet-900/20 border border-violet-500/30 rounded-xl p-4 flex gap-3 text-sm text-violet-200 mb-6">
        <Info className="w-5 h-5 shrink-0 text-violet-400 mt-0.5" />
        <p>
          <strong className="text-white">Tip:</strong> Just jot down some rough notes or keywords, then click the{" "}
          <strong className="text-violet-300">✨ Write with AI</strong> button below and our AI will craft a polished professional summary for you!
        </p>
      </div>

      <div className="relative">
        <Textarea
          label="Summary"
          placeholder={
            role === "student"
              ? "I'm a Computer Science student passionate about web development and machine learning..."
              : role === "fresher"
              ? "Recent graduate with a strong foundation in software development, eager to contribute..."
              : "Results-driven professional with 5+ years of experience in building scalable web applications..."
          }
          rows={8}
          {...register("summary")}
          error={errors.summary?.message}
        />

        {/* Character counter */}
        <div className={`absolute bottom-3 right-4 text-xs font-medium ${summary.length < 10 ? "text-red-400" : summary.length > 2000 ? "text-red-400" : "text-gray-500"}`}>
          {summary.length} / 2000
        </div>
      </div>

      {aiError && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {aiError}
        </div>
      )}

      <button
        type="button"
        disabled={isAILoading}
        className="ai-btn flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600/20 to-purple-600/20 text-violet-300 border border-violet-500/40 hover:border-violet-400 hover:text-white text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-violet-500/10"
        onClick={handleAIAssist}
      >
        {isAILoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Writing...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            ✨ Write with AI
          </>
        )}
      </button>
    </div>
  );
}
