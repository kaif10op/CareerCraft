"use client";

import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ResumeFormValues } from "@/lib/schema";
import { Plus, Trash2, GripVertical, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function StepExperience() {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ResumeFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  const role = watch("role") || "professional";
  const [aiLoadingIndex, setAiLoadingIndex] = useState<number | null>(null);
  const [aiError, setAiError] = useState("");

  const handleAIImprove = async (index: number) => {
    const experience = watch("experience") || [];
    const exp = experience[index];
    if (!exp) return;

    setAiLoadingIndex(index);
    setAiError("");

    try {
      const response = await fetch("/api/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "experience",
          context: {
            company: exp.company,
            position: exp.position,
            description: exp.description || "General responsibilities",
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to improve description");
      }

      setValue(`experience.${index}.description`, data.result, { shouldValidate: true });
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "AI assist failed");
    } finally {
      setAiLoadingIndex(null);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 fade-in">
      <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-800">
        <div>
          <h2 className="text-3xl font-extrabold mb-1 text-white tracking-tight">
            Work Experience
            {(role === "student" || role === "fresher") && (
              <span className="text-sm font-medium text-gray-500 ml-3">
                (Optional)
              </span>
            )}
          </h2>
          <p className="text-base font-medium text-gray-400">
            {role === "student"
              ? "Add any internships, part-time jobs, or volunteer work you've done."
              : role === "fresher"
              ? "Include internships, freelance work, or any relevant experience."
              : "Add your relevant work history, starting with the most recent."}
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            append({
              company: "",
              position: "",
              startDate: "",
              endDate: "",
              description: "",
            })
          }
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors bg-violet-500/10 text-violet-400 border border-violet-500/30 hover:bg-violet-500/20"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      {aiError && (
        <div className="p-4 rounded-xl text-sm font-medium bg-red-500/10 border border-red-500/30 text-red-400">
          {aiError}
        </div>
      )}

      {fields.length === 0 && (
        <div className="text-center py-16 rounded-3xl border-2 border-dashed border-gray-800 bg-gray-900/30">
          <p className="text-gray-500 font-medium">
            {role === "student" || role === "fresher"
              ? "No experience yet? That's okay! You can skip this step and focus on projects and skills."
              : "Click 'Add Experience' to start listing your work history."}
          </p>
        </div>
      )}

      <div className="space-y-6">
        <AnimatePresence initial={false}>
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, overflow: "hidden", transition: { duration: 0.2 } }}
              className="rounded-3xl p-6 sm:p-8 relative group bg-gray-800/20 border border-gray-700/50 shadow-sm"
            >
              <div className="absolute top-6 left-4 cursor-grab text-gray-500 hover:text-gray-300 transition-colors">
                <GripVertical className="w-5 h-5 hidden sm:block" />
              </div>

              {fields.length > 0 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-5 right-5 p-2 rounded-xl transition-all text-gray-500 hover:text-red-400 hover:bg-red-500/10"
                  title="Remove Experience"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}

              <div className="pl-0 sm:pl-6">
                <h3 className="text-xl font-bold mb-5 text-white">
                  Position #{index + 1}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <Input
                    label="Company Name"
                    placeholder="e.g. Google"
                    {...register(`experience.${index}.company`)}
                    error={errors.experience?.[index]?.company?.message}
                  />
                  <Input
                    label="Position / Title"
                    placeholder="e.g. Software Engineer"
                    {...register(`experience.${index}.position`)}
                    error={errors.experience?.[index]?.position?.message}
                  />
                  <Input
                    label="Start Date"
                    placeholder="e.g. Jan 2020"
                    {...register(`experience.${index}.startDate`)}
                    error={errors.experience?.[index]?.startDate?.message}
                  />
                  <Input
                    label="End Date"
                    placeholder="e.g. Present"
                    {...register(`experience.${index}.endDate`)}
                    error={errors.experience?.[index]?.endDate?.message}
                  />
                </div>
                <Textarea
                  label="Description / Achievements"
                  placeholder="Describe your responsibilities and impact. Rough notes are fine — click the AI button to polish them!"
                  rows={4}
                  {...register(`experience.${index}.description`)}
                  error={errors.experience?.[index]?.description?.message}
                />

                {/* AI Improve Button */}
                <button
                  type="button"
                  disabled={aiLoadingIndex === index}
                  onClick={() => handleAIImprove(index)}
                  className="ai-btn mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-300 border border-violet-500/40 hover:border-violet-400 hover:text-white"
                >
                  {aiLoadingIndex === index ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Improving...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      ✨ Improve with AI
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
