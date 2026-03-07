"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
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

    const isOptionalStep =
      (role === "student" || role === "fresher") &&
      (currentStepId === "experience" || currentStepId === "education");

    if (isOptionalStep) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

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
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Failed to generate resume");
      }

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start relative mt-6">

        {/* Left Side: The Wizard Form */}
        <div className="relative flex flex-col h-full min-h-[600px] w-full isolate">
          {/* Subtle Outer Glow behind form */}
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 to-cyan-600/20 blur-2xl opacity-50 -z-10 rounded-3xl" />
          
          <div className="flex flex-col h-full rounded-3xl overflow-hidden relative bg-white/[0.02] backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)]">
            {/* Decorative top gradient */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-purple-500 to-cyan-500 shadow-[0_0_10px_rgba(139,92,246,0.8)]" />

            <div className="px-8 pt-8 pb-4 border-b border-white/5 bg-white/[0.01]">
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

            <div className="p-6 flex items-center justify-between border-t border-white/5 bg-white/[0.01] backdrop-blur-md">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 0 || isGenerating}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              {isLastStep ? (
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="group relative flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-gradient-to-r from-violet-600 to-cyan-600 shadow-[0_4px_14px_rgba(139,92,246,0.25)] hover:shadow-[0_6px_20px_rgba(139,92,246,0.4)]"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating Magic...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      Generate Carrier Craft Resume
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-colors bg-white text-gray-950 hover:bg-gray-100 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-950 outline-none"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
          </div>
        </div>

        {/* Right Side: Live Preview (Hidden on mobile) */}
        <div className="hidden lg:flex h-[85vh] sticky top-24 rounded-3xl overflow-hidden bg-white/[0.02] backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex-col relative group">
           {/* Desk surface ambient glow */}
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-violet-500/5 pointer-events-none" />
          <LivePreview />
        </div>

      </div>
    </FormProvider>
  );
}
