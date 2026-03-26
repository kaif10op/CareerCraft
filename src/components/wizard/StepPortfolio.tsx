"use client";

import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ResumeFormValues } from "@/lib/schema";
import { Plus, Trash2, GripVertical, Sparkles, Loader2, GraduationCap, FolderKanban, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type TabId = "education" | "projects" | "certifications";

export function StepPortfolio() {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ResumeFormValues>();

  const role = watch("role") || "professional";
  const [activeTab, setActiveTab] = useState<TabId>("education");
  const [aiLoadingIndex, setAiLoadingIndex] = useState<number | null>(null);
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // Education Array
  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
  } = useFieldArray({ control, name: "education" });

  // Projects Array
  const {
    fields: projFields,
    append: appendProj,
    remove: removeProj,
  } = useFieldArray({ control, name: "projects" });

  // Certifications Array
  const {
    fields: certFields,
    append: appendCert,
    remove: removeCert,
  } = useFieldArray({ control, name: "certifications" });

  const handleAIImproveProject = async (index: number) => {
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

  const handleSuggestCertifications = async () => {
    setIsAILoading(true);
    setAiError("");
    try {
      const field = watch("education")?.[0]?.field || watch("jobTitle") || "Professional";
      const response = await fetch("/api/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "certifications",
          context: { field },
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to suggest certs");
      const suggestedCerts = data.result.split(",").map((s: string) => s.trim());
      suggestedCerts.forEach((certName: string) => {
        appendCert({ name: certName, issuer: "Industry standard", date: "", link: "" });
      });
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "AI assist failed");
    } finally {
      setIsAILoading(false);
    }
  };

  const tabs: { id: TabId; label: string; icon: React.ReactNode; count: number }[] = [
    { id: "education", label: "Education", icon: <GraduationCap className="w-4 h-4" />, count: eduFields.length },
    { id: "projects", label: "Projects", icon: <FolderKanban className="w-4 h-4" />, count: projFields.length },
    { id: "certifications", label: "Certifications", icon: <Award className="w-4 h-4" />, count: certFields.length },
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
      <div className="pb-3 border-b border-gray-800">
        <h2 className="text-3xl font-extrabold mb-1 text-white tracking-tight">
          Portfolio & Education
        </h2>
        <p className="text-base font-medium text-gray-400">
          Add your academic background, projects, and certifications.
        </p>
      </div>

      {aiError && (
        <div className="p-4 rounded-xl text-sm font-medium bg-red-500/10 border border-red-500/30 text-red-400">
          {aiError}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 rounded-2xl bg-gray-900/50 border border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id
                ? "bg-violet-500/15 text-violet-300 border border-violet-500/30 shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? "bg-violet-500/30 text-violet-200" : "bg-gray-800 text-gray-500"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Education Tab */}
      {activeTab === "education" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400 font-medium">
              {role === "student" || role === "fresher"
                ? "Your academic background is key — highlight it well."
                : "Include your degrees, schools, and timelines."}
            </p>
            <button
              type="button"
              onClick={() => appendEdu({ institution: "", degree: "", field: "", startYear: "", endYear: "" })}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors bg-violet-500/10 text-violet-400 border border-violet-500/30 hover:bg-violet-500/20"
            >
              <Plus className="w-4 h-4" />
              Add Degree
            </button>
          </div>

          {errors.education?.message && typeof errors.education.message === "string" && (
            <p className="text-sm font-medium px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
              {errors.education.message}
            </p>
          )}

          <AnimatePresence initial={false}>
            {eduFields.map((field, index) => (
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
                {eduFields.length > 1 && (
                  <button type="button" onClick={() => removeEdu(index)} className="absolute top-4 right-4 p-1.5 rounded-xl transition-all text-gray-500 hover:text-red-400 hover:bg-red-500/10">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <div className="pl-0 sm:pl-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Input label="Institution Name" placeholder="e.g. Massachusetts Institute of Technology" {...register(`education.${index}.institution`)} error={errors.education?.[index]?.institution?.message} />
                    </div>
                    <Input label="Degree" placeholder="e.g. Bachelor of Science" {...register(`education.${index}.degree`)} error={errors.education?.[index]?.degree?.message} />
                    <Input label="Field of Study" placeholder="e.g. Computer Science" {...register(`education.${index}.field`)} error={errors.education?.[index]?.field?.message} />
                    <Input label="Start Year" placeholder="e.g. 2018" {...register(`education.${index}.startYear`)} error={errors.education?.[index]?.startYear?.message} />
                    <Input label="End Year" placeholder="e.g. 2022" {...register(`education.${index}.endYear`)} error={errors.education?.[index]?.endYear?.message} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {eduFields.length === 0 && (
            <div className="text-center py-16 rounded-3xl border-2 border-dashed border-gray-800 bg-gray-900/30">
              <GraduationCap className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No education added yet. Click &apos;Add Degree&apos; to start.</p>
            </div>
          )}
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === "projects" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400 font-medium">
              Showcase your most impactful projects and open-source work.
            </p>
            <button
              type="button"
              onClick={() => appendProj({ name: "", description: "", link: "", techStack: "" })}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors bg-violet-500/10 text-violet-400 border border-violet-500/30 hover:bg-violet-500/20"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </button>
          </div>

          <AnimatePresence initial={false}>
            {projFields.map((field, index) => (
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
                <button type="button" onClick={() => removeProj(index)} className="absolute top-4 right-4 p-1.5 rounded-xl transition-all text-gray-500 hover:text-red-400 hover:bg-red-500/10" title="Remove Project">
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="pl-0 sm:pl-6">
                  <h3 className="text-lg font-bold mb-4 text-white">Project #{index + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input label="Project Name" placeholder="e.g. CareerCraft" {...register(`projects.${index}.name`)} error={errors.projects?.[index]?.name?.message} />
                    <Input label="Link / Repository" placeholder="https://github.com/..." {...register(`projects.${index}.link`)} error={errors.projects?.[index]?.link?.message} />
                    <div className="md:col-span-2">
                      <Input label="Tech Stack (comma separated)" placeholder="e.g. React, Next.js, Tailwind, TypeScript" {...register(`projects.${index}.techStack`)} error={errors.projects?.[index]?.techStack?.message} />
                    </div>
                  </div>
                  <Textarea label="Description & Impact" placeholder="Describe the problem it solved, how you built it, and any metrics of success..." rows={3} {...register(`projects.${index}.description`)} error={errors.projects?.[index]?.description?.message} />
                  <button
                    type="button"
                    disabled={aiLoadingIndex === index}
                    onClick={() => handleAIImproveProject(index)}
                    className="ai-btn mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-300 border border-violet-500/40 hover:border-violet-400 hover:text-white"
                  >
                    {aiLoadingIndex === index ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Improving...</>
                    ) : (
                      <><Sparkles className="w-4 h-4" /> ✨ Improve with AI</>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {projFields.length === 0 && (
            <div className="text-center py-16 rounded-3xl border-2 border-dashed border-gray-800 bg-gray-900/30">
              <FolderKanban className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No projects added. Click &apos;Add Project&apos; to showcase your work.</p>
            </div>
          )}
        </div>
      )}

      {/* Certifications Tab */}
      {activeTab === "certifications" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400 font-medium">
              Add relevant professional certifications and licenses.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={isAILoading}
                onClick={handleSuggestCertifications}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors bg-violet-500/10 text-violet-400 border border-violet-500/30 hover:bg-violet-500/20"
              >
                {isAILoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                AI Suggest
              </button>
              <button
                type="button"
                onClick={() => appendCert({ name: "", issuer: "", date: "", link: "" })}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-600 hover:text-white hover:bg-gray-700"
              >
                <Plus className="w-4 h-4" />
                Add Cert
              </button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {certFields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, overflow: "hidden", transition: { duration: 0.2 } }}
                className="rounded-2xl p-5 relative bg-gray-800/30 border border-gray-700"
              >
                <div className="flex justify-between items-center mb-4 pl-0 sm:pl-2">
                  <h4 className="text-base font-bold text-gray-300">Certification #{index + 1}</h4>
                  <button type="button" onClick={() => removeCert(index)} className="p-1.5 rounded-lg transition-colors text-gray-500 hover:text-red-400 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Name" placeholder="e.g. AWS Solutions Architect" {...register(`certifications.${index}.name`)} error={errors.certifications?.[index]?.name?.message} />
                  <Input label="Issuer" placeholder="e.g. Amazon Web Services" {...register(`certifications.${index}.issuer`)} error={errors.certifications?.[index]?.issuer?.message} />
                  <Input label="Date / Valid Until" placeholder="e.g. Valid until May 2025" {...register(`certifications.${index}.date`)} error={errors.certifications?.[index]?.date?.message} />
                  <Input label="Credential URL" placeholder="https://credly.com/..." {...register(`certifications.${index}.link`)} error={errors.certifications?.[index]?.link?.message} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {certFields.length === 0 && (
            <div className="text-center py-16 rounded-3xl border-2 border-dashed border-gray-800 bg-gray-900/30">
              <Award className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No certifications added. Click &apos;Add Cert&apos; or let AI suggest some.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
