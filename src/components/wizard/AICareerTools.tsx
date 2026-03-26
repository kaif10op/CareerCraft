"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { ResumeFormValues } from "@/lib/schema";
import { Sparkles, Loader2, FileText, MessageSquare, Search, X, Copy, Check } from "lucide-react";

type ToolId = "cover_letter" | "resume_review" | "interview_prep";

interface Tool {
  id: ToolId;
  label: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

const tools: Tool[] = [
  {
    id: "cover_letter",
    label: "Cover Letter",
    description: "Generate a tailored cover letter based on your resume data.",
    icon: <FileText className="w-5 h-5" />,
    gradient: "from-violet-500 to-purple-600",
  },
  {
    id: "resume_review",
    label: "AI Resume Review",
    description: "Get 5 actionable suggestions to improve your resume.",
    icon: <Search className="w-5 h-5" />,
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    id: "interview_prep",
    label: "Interview Prep",
    description: "Get likely interview questions with coaching tips.",
    icon: <MessageSquare className="w-5 h-5" />,
    gradient: "from-emerald-500 to-teal-600",
  },
];

export function AICareerTools() {
  const { watch } = useFormContext<ResumeFormValues>();
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (toolId: ToolId) => {
    setActiveTool(toolId);
    setIsLoading(true);
    setError("");
    setResult("");

    const data = watch();
    const experienceDesc = data.experience?.map(e => `${e.position} at ${e.company}: ${e.description}`).join(". ") || "";
    const skillsList = data.skills?.join(", ") || "";

    try {
      const response = await fetch("/api/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: toolId,
          context: {
            jobTitle: data.jobTitle || "",
            role: data.role || "professional",
            notes: data.summary || "",
            skills: skillsList,
            description: experienceDesc,
            company: "",
          },
        }),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || "AI generation failed");
      setResult(resData.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setActiveTool(null);
    setResult("");
    setError("");
  };

  return (
    <div className="space-y-4">
      <div className="pb-3 border-b border-gray-800">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-400" />
          AI Career Tools
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Powered by AI — generate career documents from your resume data.
        </p>
      </div>

      {/* Tool Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {tools.map((tool) => (
          <button
            key={tool.id}
            type="button"
            disabled={isLoading}
            onClick={() => handleGenerate(tool.id)}
            className={`group relative p-4 rounded-2xl text-left transition-all duration-300 border overflow-hidden ${
              activeTool === tool.id && isLoading
                ? "border-violet-500/50 bg-violet-500/5"
                : "border-gray-800 bg-gray-900/40 hover:border-gray-700 hover:bg-gray-800/50"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-3 text-white shadow-lg group-hover:scale-110 transition-transform`}>
              {activeTool === tool.id && isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : tool.icon}
            </div>
            <h4 className="text-sm font-bold text-white mb-1">{tool.label}</h4>
            <p className="text-xs text-gray-500 leading-relaxed">{tool.description}</p>
          </button>
        ))}
      </div>

      {/* Result Panel */}
      {(result || error) && (
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 overflow-hidden animate-in slide-in-from-bottom-4 fade-in">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-gray-900/80">
            <h4 className="text-sm font-bold text-white">
              {tools.find(t => t.id === activeTool)?.label} Result
            </h4>
            <div className="flex items-center gap-2">
              {result && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors bg-violet-500/10 text-violet-300 hover:bg-violet-500/20"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-5 max-h-[400px] overflow-y-auto custom-scrollbar">
            {error ? (
              <p className="text-red-400 text-sm font-medium">{error}</p>
            ) : (
              <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">
                {result}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
