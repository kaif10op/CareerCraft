"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ResumePreview from "@/components/ResumePreview";
import { ResumeRecord } from "@/types/resume";

export default function PreviewPage() {
  const params = useParams();
  const [resume, setResume] = useState<ResumeRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await fetch(`/api/resumes/${params.id}`);
        if (!response.ok) throw new Error("Resume not found");
        const data = await response.json();
        setResume(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load resume");
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-950 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your resume...</p>
        </div>
      </main>
    );
  }

  if (error || !resume) {
    return (
      <main className="min-h-screen bg-gray-950 pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error || "Resume not found"}</p>
          <Link
            href="/create"
            className="px-6 py-3 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-500 transition-colors"
          >
            Create a New Resume
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header bar */}
        <div data-print-hide className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              {resume.full_name}&apos;s Resume
            </h1>
            <p className="text-gray-400">
              Generated on{" "}
              {new Date(resume.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <Link
              href="/create"
              className="px-5 py-2.5 rounded-xl border border-gray-700 text-gray-300 font-medium hover:border-gray-500 hover:text-white transition-colors"
            >
              Create Another
            </Link>
            <Link
              href="/resumes"
              className="px-5 py-2.5 rounded-xl border border-gray-700 text-gray-300 font-medium hover:border-gray-500 hover:text-white transition-colors"
            >
              My Resumes
            </Link>
          </div>
        </div>

        <ResumePreview content={resume.generated_resume} />
      </div>
    </main>
  );
}
