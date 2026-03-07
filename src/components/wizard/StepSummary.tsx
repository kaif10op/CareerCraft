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
    <div className="space-y-8 animate-in slide-in-from-right-4 fade-in">
      <div className="pb-3 border-b border-gray-800">
        <h2 className="text-3xl font-extrabold mb-1 text-white tracking-tight">
          Professional Summary
        </h2>
        <p className="text-base font-medium text-gray-400">
          Write a short, engaging pitch highlighting your expertise and what you bring to the table.
        </p>
      </div>

      <div className="rounded-2xl p-5 flex gap-4 text-sm mb-8 bg-purple-900/20 border border-purple-500/30 text-purple-200">
        <Info className="w-6 h-6 shrink-0 text-purple-400" />
        <p className="leading-relaxed">
          <strong className="text-white">Tip:</strong> Just jot down some rough notes or keywords, then click the{" "}
          <strong className="text-purple-300">✨ Write with AI</strong> button below and our AI will craft a polished professional summary for you!
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
        <div
          className={`absolute bottom-3 right-4 text-xs font-bold ${
            summary.length < 10 ? "text-red-400" : summary.length > 2000 ? "text-red-400" : "text-gray-500"
          }`}
        >
          {summary.length} / 2000
        </div>
      </div>

      {aiError && (
        <div className="p-4 rounded-xl text-sm font-medium bg-red-500/10 border border-red-500/30 text-red-400">
          {aiError}
        </div>
      )}

      <button
        type="button"
        disabled={isAILoading}
        className="ai-btn mt-6 flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-300 border border-violet-500/40 hover:border-violet-400 hover:text-white"
        onClick={handleAIAssist}
      >
        {isAILoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Writing...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            ✨ Write with AI
          </>
        )}
      </button>
    </div>
  );
}
