"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema, ResumeFormValues, defaultValues } from "@/lib/schema";
import { Stepper } from "@/components/ui/Stepper";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Loader2, Wand2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// Wizard Steps
import { StepTemplate } from "./wizard/StepTemplate";
import { StepBasics } from "./wizard/StepBasics";
import { StepSummary } from "./wizard/StepSummary";
import { StepExperience } from "./wizard/StepExperience";
import { StepEducation } from "./wizard/StepEducation";
import { StepProjects } from "./wizard/StepProjects";
import { StepSkills } from "./wizard/StepSkills";
import { LivePreview } from "./wizard/LivePreview";
import { AtsInsights } from "./wizard/AtsInsights";

const ALL_STEPS = [
  { id: "template", title: "Design", fields: ["templateId"] },
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
  const formContainerRef = useRef<HTMLDivElement>(null);

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
        formContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    if (currentStepId === "projects") {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1);
        formContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    const isStepValid = await trigger(currentFields as any);

    if (isStepValid) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1);
        formContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      formContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onInvalid = (errors: any) => {
    // Find the first field with an error
    const firstErrorField = Object.keys(errors)[0];
    if (!firstErrorField) return;

    // Find which step this field belongs to
    // For arrays like experience.0.company, we just need the root key 'experience'
    const rootKey = firstErrorField.split('.')[0];
    const stepIndex = STEPS.findIndex(step => step.fields.includes(rootKey));
    
    if (stepIndex !== -1 && stepIndex !== currentStep) {
      setCurrentStep(stepIndex);
      toast.error(`Please fix errors in the ${STEPS[stepIndex].title} section`);
      formContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error("Please fix the highlighted errors before submitting.");
    }
  };

  const onSubmit = async (data: ResumeFormValues) => {
    setIsGenerating(true);
    setApiError("");

    try {
      // Get a fresh session/user to avoid stale tokens
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      const { data: { session } } = await supabase.auth.getSession();

      if (userError) {
        console.warn("User session verification failed:", userError);
      }

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
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            className="flex flex-col flex-1 max-h-[70vh]"
          >
            <div ref={formContainerRef} className="flex-1 p-8 overflow-y-auto custom-scrollbar relative scroll-smooth">
              {apiError && (
                <div className="mb-6 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <p className="font-bold text-white">Generation Failed</p>
                  </div>
                  <p className="opacity-80 leading-relaxed">{apiError}</p>
                  <p className="mt-3 text-xs text-red-400/60 italic">Tip: Try checking your internet connection or reducing the description length.</p>
                </div>
              )}

              {Object.keys(methods.formState.errors).length > 0 && (
                <div className="mb-8 p-6 rounded-[2rem] bg-red-500/5 border border-red-500/20 animate-in fade-in zoom-in duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shrink-0 shadow-lg shadow-red-500/20">
                      <AlertCircle className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="text-red-300 font-bold text-lg">Fix needed before proceeding</h4>
                  </div>
                  <ul className="space-y-2 ml-11">
                    {Object.entries(methods.formState.errors).map(([key, error]: [string, any]) => (
                      <li key={key} className="text-sm text-red-400/80 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-red-500/50" />
                        <span className="font-bold capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {error.message || "This field is required"}
                      </li>
                    ))}
                  </ul>
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
                  {currentStep === 0 && <StepTemplate />}
                  {currentStep === 1 && <StepBasics />}
                  {currentStep === 2 && <StepSummary />}
                  {currentStep === 3 && <StepExperience />}
                  {currentStep === 4 && <StepEducation />}
                  {currentStep === 5 && <StepProjects />}
                  {currentStep === 6 && <StepSkills />}
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
                      <span>Creating Your Masterpiece...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      <span>Generate AI Resume</span>
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
        <div className="hidden lg:flex flex-col gap-6 sticky top-24 h-[calc(100vh-120px)] animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
           {currentStep > 0 && <AtsInsights />}
           <div className="flex-1 rounded-3xl overflow-hidden bg-white/[0.02] backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex-col relative group">
              {/* Desk surface ambient glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-violet-500/5 pointer-events-none" />
              <LivePreview />
           </div>
        </div>

      </div>
    </FormProvider>
  );
}
