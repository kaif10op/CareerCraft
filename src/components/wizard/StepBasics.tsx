import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { ResumeFormValues, ROLE_OPTIONS } from "@/lib/schema";
import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

export function StepBasics() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ResumeFormValues>();

  const selectedRole = watch("role") || "professional";
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const handleBrainstormTitles = async () => {
    setIsAILoading(true);
    setAiError("");
    try {
      const response = await fetch("/api/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "job_titles",
          context: { role: selectedRole, jobTitle: watch("jobTitle") }
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to suggest titles");
      
      const suggestedTitles = data.result.split(",").map((s: string) => s.trim());
      if (suggestedTitles.length > 0) {
        setValue("jobTitle", suggestedTitles[0], { shouldValidate: true });
      }
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "AI assist failed");
    } finally {
      setIsAILoading(false);
    }
  };

  const handleQuickFill = async () => {
    if (!watch("jobTitle")) {
      setAiError("Please enter a Professional Title first so I know what to write!");
      return;
    }

    setIsAILoading(true);
    setAiError("");
    try {
      const response = await fetch("/api/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "summary",
          context: {
            jobTitle: watch("jobTitle"),
            role: selectedRole,
            notes: "Generate a full base resume summary and placeholder experience for a " + watch("jobTitle")
          }
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to quick fill");
      
      setValue("summary", data.result, { shouldValidate: true });
      // We could potentially fill more fields here if we had more AI types
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Quick fill failed");
    } finally {
      setIsAILoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 fade-in">
      <div>
        <h2 className="text-3xl font-extrabold mb-3 text-white tracking-tight">
          Basic Information
        </h2>
        <p className="text-base text-gray-400 font-medium pb-2 border-b border-gray-800">
          Let&apos;s start with your contact details and professional links.
        </p>
      </div>

      {/* AI Quick Start Callout */}
      <div className="bg-violet-600/10 border border-violet-500/20 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl animate-in fade-in zoom-in duration-500">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-500 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-white font-bold text-lg">AI Quick Start</h4>
            <p className="text-violet-200/70 text-sm leading-relaxed max-w-md">
              Short on time? Enter your job title below and click here to have AI generate a high-quality base resume for you.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleQuickFill}
          disabled={isAILoading}
          className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-violet-500/40 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
        >
          {isAILoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Magic Fill
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-3 text-gray-300">
          I am a...
        </label>
        <div className="flex flex-wrap gap-2">
          {ROLE_OPTIONS.map((option) => {
            const isSelected = selectedRole === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setValue("role", option.value, { shouldValidate: true })}
                className={`flex-1 min-w-[120px] sm:min-w-0 py-2.5 px-4 rounded-xl text-sm font-bold transition-all border ${
                  isSelected
                    ? "border-violet-500 bg-violet-500/10 text-violet-300 shadow-[0_4px_10px_-2px_rgba(139,92,246,0.15)]"
                    : "border-gray-800 bg-gray-900/40 text-gray-400 hover:border-gray-700 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name *"
          placeholder="e.g. John Doe"
          {...register("fullName")}
          error={errors.fullName?.message}
        />
        <div className="relative group/field">
          <Input
            label="Professional Title"
            placeholder={
              selectedRole === "student" ? "e.g. CS Student at MIT"
              : selectedRole === "fresher" ? "e.g. Aspiring Data Scientist"
              : selectedRole === "freelancer" ? "e.g. Freelance UI/UX Designer"
              : "e.g. Senior Frontend Engineer"
            }
            {...register("jobTitle")}
            error={errors.jobTitle?.message}
          />
          <button
            type="button"
            disabled={isAILoading}
            onClick={handleBrainstormTitles}
            className="absolute right-0 top-0 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-400 hover:text-violet-300 transition-colors py-1 group/btn"
          >
            {isAILoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 group-hover/btn:scale-125 transition-transform" />}
            Brainstorm
          </button>
        </div>
        <Input
          label="Email Address *"
          type="email"
          placeholder="john@example.com"
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          label="Phone Number"
          placeholder="+1 (555) 123-4567"
          {...register("phone")}
          error={errors.phone?.message}
        />
        <Input
          label="Location"
          placeholder="e.g. San Francisco, CA"
          {...register("location")}
          error={errors.location?.message}
        />
        <Input
          label="LinkedIn URL"
          placeholder="https://linkedin.com/in/johndoe"
          {...register("linkedin")}
          error={errors.linkedin?.message}
        />
        <Input
          label="GitHub URL"
          placeholder="https://github.com/johndoe"
          {...register("github")}
          error={errors.github?.message}
        />
        <Input
          label="Portfolio URL"
          placeholder="https://johndoe.dev"
          {...register("portfolio")}
          error={errors.portfolio?.message}
        />
      </div>
    </div>
  );
}
