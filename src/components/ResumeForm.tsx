"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema, ResumeFormValues, defaultValues } from "@/lib/schema";
import { Stepper } from "@/components/ui/Stepper";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Loader2, Wand2 } from "lucide-react";

// Wizard Steps
import { StepBasics } from "./wizard/StepBasics";
import { StepSummary } from "./wizard/StepSummary";
import { StepExperience } from "./wizard/StepExperience";
import { StepEducation } from "./wizard/StepEducation";
import { StepProjects } from "./wizard/StepProjects";
import { StepSkills } from "./wizard/StepSkills";
import { LivePreview } from "./wizard/LivePreview";

const ALL_STEPS = [
  { id: "basics", title: "Basics", fields: ["fullName", "email", "phone", "linkedin", "github", "portfolio", "location", "jobTitle", "role"] },
  { id: "summary", title: "Summary", fields: ["summary"] },
  { id: "experience", title: "Experience", fields: ["experience"] },
  { id: "education", title: "Education", fields: ["education", "certifications"] },
  { id: "projects", title: "Projects", fields: ["projects"] },
  { id: "skills", title: "Skills", fields: ["skills"] },
];

const LOCAL_STORAGE_KEY = "ai_resume_builder_cache";

export default function ResumeForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const methods = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeSchema) as any,
    defaultValues,
    mode: "onChange",
  });

  const { trigger, handleSubmit, formState: { isValid }, watch, reset } = methods;
  const role = watch("role") || "professional";

  // For students/freshers, experience is fully optional — don't block on validation
  const getSteps = () => {
    return ALL_STEPS;
  };

  const STEPS = getSteps();

  // Load from LocalStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        reset(parsed);
      } catch (e) {
        console.error("Failed to parse local storage data", e);
      }
    }
  }, [reset]);

  // Save to LocalStorage on change
  useEffect(() => {
    if (isMounted) {
      const subscription = watch((value) => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, isMounted]);

  const handleNext = async () => {
    const currentFields = STEPS[currentStep].fields;
    const currentStepId = STEPS[currentStep].id;

    // For students/freshers, skip validation on experience and education steps
    const isOptionalStep =
      (role === "student" || role === "fresher") &&
      (currentStepId === "experience" || currentStepId === "education");

    if (isOptionalStep) {
      // Just move forward without validation
      if (currentStep < STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    // For projects step, always skip validation (it's optional for everyone)
    if (currentStepId === "projects") {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    const isStepValid = await trigger(currentFields as any);

    if (isStepValid) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onSubmit = async (data: ResumeFormValues) => {
    setIsGenerating(true);
    setApiError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Failed to generate resume");
      }

      // Clear localStorage cache after successful generation
      localStorage.removeItem(LOCAL_STORAGE_KEY);

      router.push(`/preview/${resData.id}`);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong");
      setIsGenerating(false);
    }
  };

  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <FormProvider {...methods}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start relative">

        {/* Left Side: The Wizard Form */}
        <div className="flex flex-col h-full bg-gray-950/50 backdrop-blur-xl border border-gray-800 rounded-3xl overflow-hidden shadow-2xl relative min-h-[600px]">
          {/* Decorative top gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-purple-500 to-cyan-500" />

          <div className="px-8 pt-8 pb-4 border-b border-gray-800/50 bg-gray-900/30">
            <Stepper steps={STEPS} currentStep={currentStep} />
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col flex-1 max-h-[70vh]"
          >
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar relative">
              {apiError && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm fade-in">
                  <p className="font-semibold mb-1">Error Generating Resume</p>
                  {apiError}
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={`step-${currentStep}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  {currentStep === 0 && <StepBasics />}
                  {currentStep === 1 && <StepSummary />}
                  {currentStep === 2 && <StepExperience />}
                  {currentStep === 3 && <StepEducation />}
                  {currentStep === 4 && <StepProjects />}
                  {currentStep === 5 && <StepSkills />}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="p-6 border-t border-gray-800/80 bg-gray-900/50 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 0 || isGenerating}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-700 text-gray-300 font-medium hover:border-gray-500 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              {isLastStep ? (
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="group relative flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating Magic...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      Generate AI Resume
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-white text-gray-950 font-semibold hover:bg-gray-200 transition-colors"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Side: Live Preview (Hidden on mobile) */}
        <div className="hidden lg:block h-full min-h-[600px] max-h-[85vh] sticky top-24">
          <LivePreview />
        </div>

      </div>
    </FormProvider>
  );
}
