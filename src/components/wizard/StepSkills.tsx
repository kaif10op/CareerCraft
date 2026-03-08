"use client";

import React, { KeyboardEvent, useState } from "react";
import { useFormContext } from "react-hook-form";
import { ResumeFormValues } from "@/lib/schema";
import { X, Code2, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function StepSkills() {
  const {
    setValue,
    watch,
    formState: { errors }
  } = useFormContext<ResumeFormValues>();

  const skills = watch("skills") || [];
  const jobTitle = watch("jobTitle") || "";
  const role = watch("role") || "professional";
  const experience = watch("experience") || [];
  const [inputValue, setInputValue] = useState("");
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newSkill = inputValue.trim();

      if (newSkill && !skills.includes(newSkill)) {
        setValue("skills", [...skills, newSkill], { shouldValidate: true });
      }
      setInputValue("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setValue(
      "skills",
      skills.filter((s) => s !== skillToRemove),
      { shouldValidate: true }
    );
  };

  const clearAllSkills = () => {
    setValue("skills", [], { shouldValidate: true });
  };

  const handleAISuggest = async () => {
    setIsAILoading(true);
    setAiError("");

    try {
      const experienceSummary = experience
        .map((e) => `${e.position} at ${e.company}`)
        .join(", ");

      const response = await fetch("/api/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "skills",
          context: {
            jobTitle,
            role,
            background: experienceSummary || "No experience provided",
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to suggest skills");
      }

      // Parse the comma-separated or newline-separated skills and merge with existing
      const suggestedSkills = data.result
        .split(/[\n,]+/)
        .map((s: string) => s.replace(/^[-*•\s]+/, '').trim())
        .filter((s: string) => s.length > 0 && !skills.includes(s))
        .slice(0, 15); // limit to 15 per click to prevent overflow

      if (suggestedSkills.length > 0) {
        const uniqueSkills = Array.from(new Set([...skills, ...suggestedSkills])).slice(0, 30); // max 30 total
        setValue("skills", uniqueSkills, { shouldValidate: true });
      }
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "AI suggest failed");
    } finally {
      setIsAILoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 fade-in">
      <div className="pb-3 border-b border-gray-800">
        <h2 className="text-3xl font-extrabold mb-1 text-white tracking-tight">
          Technical Skills
        </h2>
        <p className="text-base font-medium text-gray-400">
          Type a skill and press{" "}
          <kbd className="rounded px-2 py-0.5 mx-1 font-mono text-xs font-semibold bg-gray-800 border border-gray-700 text-gray-300">
            Enter
          </kbd>{" "}
          or{" "}
          <kbd className="rounded px-2 py-0.5 mx-1 font-mono text-xs font-semibold bg-gray-800 border border-gray-700 text-gray-300">
            ,
          </kbd>{" "}
          to add it, or let AI suggest skills for you!
        </p>
      </div>

      <div className="rounded-3xl p-5 sm:p-6 bg-gray-800/20 border border-gray-700/50 shadow-sm">
        <div className="relative mb-6">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            <Code2 className="w-5 h-5" />
          </div>
          <input
            type="text"
            className="w-full rounded-2xl py-4 pl-12 pr-4 outline-none transition-all bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 shadow-inner block"
            placeholder="e.g. JavaScript, Python, AWS, Figma..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* AI Suggest & Clear Buttons */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            type="button"
            disabled={isAILoading}
            onClick={handleAISuggest}
            className="ai-btn flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-300 border border-violet-500/40 hover:border-violet-400 hover:text-white"
          >
            {isAILoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Suggesting...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                ✨ Suggest Skills
              </>
            )}
          </button>
          
          {skills.length > 0 && (
            <button
              type="button"
              onClick={clearAllSkills}
              className="px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 hover:text-red-300 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear All ({skills.length})
            </button>
          )}
        </div>

        {aiError && (
          <div className="mb-5 p-4 rounded-xl text-sm font-medium bg-red-500/10 border border-red-500/30 text-red-400">
            {aiError}
          </div>
        )}

        {errors.skills?.message && typeof errors.skills.message === 'string' && (
          <div className="mb-5 p-4 rounded-xl text-sm font-medium bg-red-500/10 border border-red-500/30 text-red-400">
            {errors.skills.message}
          </div>
        )}

        <div className="min-h-[200px] pt-6 mt-4 border-t border-gray-800">
          {skills.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[160px] gap-3 text-gray-500">
              <Code2 className="w-10 h-10 opacity-30" />
              <p className="font-medium text-sm">No skills added yet. Type above or click &quot;Suggest Skills with AI&quot;.</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              <AnimatePresence>
                {skills.map((skill, index) => (
                  <motion.span
                    key={`${skill}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    layout
                    className="flex items-center gap-2 pl-4 pr-2 py-2.5 rounded-full text-sm font-bold transition-colors bg-violet-500/10 border border-violet-500/30 text-violet-300 max-w-[250px]"
                  >
                    <span className="truncate flex-1" title={skill}>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="w-5 h-5 rounded-full flex items-center justify-center transition-colors bg-violet-900/50 text-violet-300 hover:bg-violet-500 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
