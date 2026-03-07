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
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-800">
          <div>
            <h2 className="text-3xl font-extrabold mb-1 text-white tracking-tight">Education</h2>
            <p className="text-base font-medium text-gray-400">Include your degrees, schools, and timelines.</p>
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors bg-violet-500/10 text-violet-400 border border-violet-500/30 hover:bg-violet-500/20"
          >
            <Plus className="w-4 h-4" />
            Add Degree
          </button>
        </div>

        {errors.education?.message && typeof errors.education.message === 'string' && (
          <p className="text-sm font-medium mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">{errors.education.message}</p>
        )}

        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {eduFields.map((field, index) => (
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
                
                {eduFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEdu(index)}
                    className="absolute top-5 right-5 p-2 rounded-xl transition-all text-gray-500 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}

                <div className="pl-0 sm:pl-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-800">
          <div>
            <h2 className="text-2xl font-bold mb-1 text-white tracking-tight">
              Certifications & Licenses{" "}
              <span className="text-sm font-medium text-gray-500 ml-2">(Optional)</span>
            </h2>
            <p className="text-sm font-medium text-gray-400">Add any relevant professional certifications.</p>
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-600 hover:text-white hover:bg-gray-700"
          >
            <Plus className="w-4 h-4" />
            Add Cert
          </button>
        </div>

        <div className="space-y-5">
          <AnimatePresence initial={false}>
            {certFields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, overflow: "hidden", transition: { duration: 0.2 } }}
                className="rounded-2xl p-6 relative bg-gray-800/30 border border-gray-700"
              >
                <div className="flex justify-between items-center mb-5 pl-0 sm:pl-2">
                   <h4 className="text-base font-bold text-gray-300">
                     Certification #{index + 1}
                   </h4>
                   <button
                    type="button"
                    onClick={() => removeCert(index)}
                    className="p-2 rounded-lg transition-colors text-gray-500 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
               
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
