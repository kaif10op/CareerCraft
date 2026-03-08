import { useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ResumeFormValues } from "@/lib/schema";
import { Plus, Trash2, GripVertical, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function StepProjects() {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ResumeFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  const [aiLoadingIndex, setAiLoadingIndex] = useState<number | null>(null);
  const [aiError, setAiError] = useState("");

  const handleAIImprove = async (index: number) => {
    const projects = watch("projects") || [];
    const proj = projects[index];
    if (!proj) return;

    setAiLoadingIndex(index);
    setAiError("");

    try {
      const response = await fetch("/api/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "projects",
          context: {
            name: proj.name,
            techStack: proj.techStack,
            description: proj.description || "General project work",
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to improve description");

      setValue(`projects.${index}.description`, data.result, { shouldValidate: true });
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "AI assist failed");
    } finally {
      setAiLoadingIndex(null);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
      <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-800">
        <div>
          <h2 className="text-3xl font-extrabold mb-1 text-white tracking-tight">
            Projects{" "}
            <span className="text-sm font-medium ml-3 text-gray-500">(Optional)</span>
          </h2>
          <p className="text-base font-medium text-gray-400">
            Stand out by sharing your most impactful side projects or open-source work.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            append({
              name: "",
              description: "",
              link: "",
              techStack: "",
            })
          }
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors bg-violet-500/10 text-violet-400 border border-violet-500/30 hover:bg-violet-500/20"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      <div className="space-y-6">
        {fields.length === 0 && (
          <div className="text-center py-16 rounded-3xl border-2 border-dashed border-gray-800 bg-gray-900/30">
            <p className="text-gray-500 font-medium">
              No projects added. Click &apos;Add Project&apos; to showcase your portfolio work.
            </p>
          </div>
        )}
        
        <AnimatePresence initial={false}>
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, overflow: "hidden", transition: { duration: 0.2 } }}
              className="rounded-3xl p-5 sm:p-6 relative group bg-gray-800/20 border border-gray-700/50 shadow-sm"
            >
              <div className="absolute top-5 left-3 cursor-grab text-gray-500 hover:text-gray-300 transition-colors">
                <GripVertical className="w-5 h-5 hidden sm:block" />
              </div>
              
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-4 right-4 p-1.5 rounded-xl transition-all text-gray-500 hover:text-red-400 hover:bg-red-500/10"
                title="Remove Project"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="pl-0 sm:pl-6">
                <h3 className="text-lg font-bold mb-4 text-white">
                  Project #{index + 1}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Project Name"
                    placeholder="e.g. Carrier Craft"
                    {...register(`projects.${index}.name`)}
                    error={errors.projects?.[index]?.name?.message}
                  />
                  <Input
                    label="Link / Repository"
                    placeholder="https://github.com/..."
                    {...register(`projects.${index}.link`)}
                    error={errors.projects?.[index]?.link?.message}
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="Tech Stack (comma separated)"
                      placeholder="e.g. React, Next.js, Tailwind, TypeScript"
                      {...register(`projects.${index}.techStack`)}
                      error={errors.projects?.[index]?.techStack?.message}
                    />
                  </div>
                </div>
                <Textarea
                  label="Description & Impact"
                  placeholder="Describe the problem it solved, how you built it, and any metrics of success..."
                  rows={3}
                  {...register(`projects.${index}.description`)}
                  error={errors.projects?.[index]?.description?.message}
                />
                
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
