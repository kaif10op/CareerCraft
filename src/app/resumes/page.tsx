"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ResumeCard from "@/components/ResumeCard";
import { ResumeRecord } from "@/types/resume";
import { Plus, Loader2, FileText, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ResumesPage() {
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResumes() {
      try {
        const res = await fetch("/api/resumes");
        if (!res.ok) {
          throw new Error("Failed to fetch resumes");
        }
        const data = await res.json();
        setResumes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchResumes();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <main className="min-h-screen bg-gray-950 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">My <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Resumes</span></h1>
            <p className="text-gray-400">View and manage all your AI-generated resumes.</p>
          </div>
          <Link
            href="/create"
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 hover:shadow-lg hover:shadow-violet-500/25 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Create New
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <Loader2 className="w-12 h-12 text-violet-500 animate-spin mb-4" />
            <p className="text-gray-400 font-medium">Loading your masterpieces...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-2xl mx-auto text-center shadow-2xl">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-300 mb-2">Failed to load resumes</h3>
            <p className="text-red-400/80 mb-6">{error}</p>
            <div className="text-sm text-gray-400 border-t border-red-500/10 pt-4 max-w-md mx-auto">
              Make sure you have configured your Supabase Database credentials in the <code className="bg-gray-900 px-1 py-0.5 rounded text-gray-300">.env.local</code> file and run the SQL setup script.
            </div>
          </div>
        ) : resumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-gray-800 rounded-3xl bg-gray-900/30 max-w-3xl mx-auto backdrop-blur-sm">
            <div className="w-24 h-24 bg-gray-800/80 rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-gray-900">
               <FileText className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No resumes yet</h3>
            <p className="text-gray-400 max-w-md mb-8">
              You haven't created any resumes. Start building your professional profile using our AI generator to land your dream job!
            </p>
            <Link
              href="/create"
              className="flex items-center gap-2 bg-white text-gray-950 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors hover:scale-105 duration-200"
            >
              <Plus className="w-5 h-5" />
              Build Your First Resume
            </Link>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {resumes.map((resume) => (
              <motion.div key={resume.id} variants={itemVariants}>
                <ResumeCard resume={resume} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
