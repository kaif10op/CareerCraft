import { useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { ResumeFormValues } from "@/lib/schema";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function StepEducation() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ResumeFormValues>();

  // Education Array
  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
  } = useFieldArray({
    control,
    name: "education",
  });

  // Certifications Array
  const {
    fields: certFields,
    append: appendCert,
    remove: removeCert,
  } = useFieldArray({
    control,
    name: "certifications",
  });

  return (
    <div className="space-y-12 animate-in slide-in-from-right-4 fade-in duration-300">
      
      {/* Education Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Education</h2>
            <p className="text-gray-400 text-sm">Include your degrees, schools, and timelines.</p>
          </div>
          <button
            type="button"
            onClick={() =>
              appendEdu({
                institution: "",
                degree: "",
                field: "",
                startYear: "",
                endYear: "",
              })
            }
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600/10 text-violet-400 border border-violet-500/30 hover:bg-violet-600/20 transition-colors text-sm font-medium whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Degree
          </button>
        </div>

        {errors.education?.message && typeof errors.education.message === 'string' && (
          <p className="text-red-400 text-sm mb-4">{errors.education.message}</p>
        )}

        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {eduFields.map((field, index) => (
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
                
                {eduFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEdu(index)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-400/10 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}

                <div className="pl-0 sm:pl-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        label="Institution Name"
                        placeholder="e.g. Massachusetts Institute of Technology"
                        {...register(`education.${index}.institution`)}
                        error={errors.education?.[index]?.institution?.message}
                      />
                    </div>
                    <Input
                      label="Degree"
                      placeholder="e.g. Bachelor of Science"
                      {...register(`education.${index}.degree`)}
                      error={errors.education?.[index]?.degree?.message}
                    />
                    <Input
                      label="Field of Study"
                      placeholder="e.g. Computer Science"
                      {...register(`education.${index}.field`)}
                      error={errors.education?.[index]?.field?.message}
                    />
                    <Input
                      label="Start Year"
                      placeholder="e.g. 2018"
                      {...register(`education.${index}.startYear`)}
                      error={errors.education?.[index]?.startYear?.message}
                    />
                    <Input
                      label="End Year"
                      placeholder="e.g. 2022"
                      {...register(`education.${index}.endYear`)}
                      error={errors.education?.[index]?.endYear?.message}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Certifications Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Certifications & Licenses <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span></h2>
            <p className="text-gray-400 text-sm">Add any relevant professional certifications.</p>
          </div>
          <button
            type="button"
            onClick={() =>
              appendCert({
                name: "",
                issuer: "",
                date: "",
                link: "",
              })
            }
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-600 hover:text-white transition-colors text-sm font-medium whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Cert
          </button>
        </div>

        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {certFields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, overflow: "hidden", transition: { duration: 0.2 } }}
                className="bg-gray-800/20 border border-gray-700 rounded-xl p-5 relative"
              >
                <div className="flex justify-between items-center mb-4 pl-0 sm:pl-2">
                   <h4 className="text-sm font-semibold text-gray-300">Certification #{index + 1}</h4>
                   <button
                    type="button"
                    onClick={() => removeCert(index)}
                    className="text-gray-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-400/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
               
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Name"
                    placeholder="e.g. AWS Solutions Architect"
                    {...register(`certifications.${index}.name`)}
                    error={errors.certifications?.[index]?.name?.message}
                  />
                  <Input
                    label="Issuer"
                    placeholder="e.g. Amazon Web Services"
                    {...register(`certifications.${index}.issuer`)}
                    error={errors.certifications?.[index]?.issuer?.message}
                  />
                  <Input
                    label="Date / Valid Until"
                    placeholder="e.g. Valid until May 2025"
                    {...register(`certifications.${index}.date`)}
                    error={errors.certifications?.[index]?.date?.message}
                  />
                  <Input
                    label="Credential URL"
                    placeholder="https://credly.com/..."
                    {...register(`certifications.${index}.link`)}
                    error={errors.certifications?.[index]?.link?.message}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

    </div>
  );
}
