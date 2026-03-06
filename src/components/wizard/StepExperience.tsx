import { useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ResumeFormValues } from "@/lib/schema";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function StepExperience() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ResumeFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Work Experience</h2>
          <p className="text-gray-400 text-sm">Add your relevant work history, starting with the most recent.</p>
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
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600/10 text-violet-400 border border-violet-500/30 hover:bg-violet-600/20 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      {errors.experience?.message && typeof errors.experience.message === 'string' && (
        <p className="text-red-400 text-sm">{errors.experience.message}</p>
      )}

      <div className="space-y-6">
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
              
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-400/10 transition-colors"
                  title="Remove Experience"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}

              <div className="pl-0 sm:pl-8">
                <h3 className="text-lg font-semibold text-white mb-4">Position #{index + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                  placeholder="Describe your responsibilities and impact. Bullet points work best! (e.g. - Increased conversion rate by 15%...)"
                  rows={4}
                  {...register(`experience.${index}.description`)}
                  error={errors.experience?.[index]?.description?.message}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
