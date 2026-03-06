import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/Textarea";
import { ResumeFormValues } from "@/lib/schema";
import { Sparkles, Info } from "lucide-react";

export function StepSummary() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<ResumeFormValues>();

  const summary = watch("summary") || "";

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Professional Summary</h2>
        <p className="text-gray-400 text-sm mb-6">
          Write a short, engaging pitch highlighting your expertise and what you bring to the table.
        </p>
      </div>

      <div className="bg-violet-900/20 border border-violet-500/30 rounded-xl p-4 flex gap-3 text-sm text-violet-200 mb-6">
        <Info className="w-5 h-5 shrink-0 text-violet-400" />
        <p>
          Need help writing this? Just jot down rough notes or keywords, and our <strong className="text-white">AI Resume Builder</strong> will polish it into a professional summary when you generate the resume!
        </p>
      </div>

      <div className="relative">
        <Textarea
          label="Summary"
          placeholder="I am a Software Engineer with 5+ years of experience building scalable web applications using React and Node.js..."
          rows={8}
          {...register("summary")}
          error={errors.summary?.message}
        />
        
        {/* Character counter */}
        <div className={`absolute bottom-3 right-4 text-xs font-medium ${summary.length < 10 ? "text-red-400" : summary.length > 2000 ? "text-red-400" : "text-gray-500"}`}>
          {summary.length} / 2000
        </div>
      </div>

      <button
        type="button"
        className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-violet-400 border border-gray-700 hover:border-violet-500 text-sm font-medium transition-colors hover:bg-gray-800/80"
        onClick={() => {
          // Future capability: Trigger an inline AI assist right here before form submission
          alert("AI Assistant feature coming soon! For now, the AI will polish whatever you write here when you click Generate.");
        }}
      >
        <Sparkles className="w-4 h-4" />
        AI Assist (Coming Soon)
      </button>
    </div>
  );
}
