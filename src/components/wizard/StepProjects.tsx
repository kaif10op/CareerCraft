import { useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ResumeFormValues } from "@/lib/schema";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function StepProjects() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ResumeFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Projects <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span></h2>
          <p className="text-gray-400 text-sm">Stand out by sharing your most impactful side projects or open-source work.</p>
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
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600/10 text-violet-400 border border-violet-500/30 hover:bg-violet-600/20 transition-colors text-sm font-medium whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      <div className="space-y-6">
        {fields.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed border-gray-800 rounded-2xl bg-gray-900/20">
            <p className="text-gray-500">No projects added. Click 'Add Project' to showcase your portfolio work.</p>
          </div>
        )}
        
        <AnimatePresence initial={false}>
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, overflow: "hidden", transition: { duration: 0.2 } }}
              className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 relative group"
            >
              <div className="absolute top-4 left-4 text-gray-600 cursor-grab hover:text-gray-400">
                <GripVertical className="w-5 h-5 hidden sm:block" />
              </div>
              
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-400/10 transition-colors"
                title="Remove Project"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="pl-0 sm:pl-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Project Name"
                    placeholder="e.g. AI Resume Builder"
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
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
