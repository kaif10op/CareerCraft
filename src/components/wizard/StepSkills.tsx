import React, { KeyboardEvent, useState } from "react";
import { useFormContext } from "react-hook-form";
import { ResumeFormValues } from "@/lib/schema";
import { X, Code2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function StepSkills() {
  const {
    setValue,
    watch,
    formState: { errors }
  } = useFormContext<ResumeFormValues>();

  const skills = watch("skills") || [];
  const [inputValue, setInputValue] = useState("");

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

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Technical Skills</h2>
        <p className="text-gray-400 text-sm mb-6">Type a skill and press <kbd className="bg-gray-800 border border-gray-700 rounded px-1.5 py-0.5 mx-1 font-mono text-xs text-gray-300">Enter</kbd> or <kbd className="bg-gray-800 border border-gray-700 rounded px-1.5 py-0.5 mx-1 font-mono text-xs text-gray-300">,</kbd> to add it.</p>
      </div>

      <div className="bg-gray-900/50 border border-gray-700/50 rounded-2xl p-6">
        <div className="relative mb-6">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            <Code2 className="w-5 h-5" />
          </div>
          <input
            type="text"
            className="w-full bg-gray-800/80 border border-gray-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all shadow-inner"
            placeholder="e.g. JavaScript, Python, AWS, Figma..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {errors.skills?.message && typeof errors.skills.message === 'string' && (
          <p className="text-red-400 text-sm mb-4 bg-red-500/10 p-3 rounded-lg border border-red-500/20 inline-block">{errors.skills.message}</p>
        )}

        <div className="min-h-[200px] border-t border-gray-800 pt-6 mt-2">
          {skills.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2 mt-8">
               <Code2 className="w-10 h-10 opacity-20" />
               <p>No skills added yet.</p>
             </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {skills.map((skill) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    layout
                    className="flex items-center gap-2 pl-4 pr-2 py-2 rounded-full bg-violet-600/20 border border-violet-500/40 text-violet-200 text-sm font-medium hover:bg-violet-600/30 hover:border-violet-500/60 transition-colors shadow-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="w-5 h-5 rounded-full bg-violet-900/50 flex items-center justify-center text-violet-300 hover:bg-violet-500 hover:text-white transition-colors"
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
