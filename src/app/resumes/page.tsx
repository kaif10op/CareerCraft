"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ResumeCard from "@/components/ResumeCard";
import { ResumeRecord } from "@/types/resume";
import { supabase } from "@/lib/supabase";
import { Plus, Loader2, FileText, AlertCircle } from "lucide-react";
import { motion, type Variants } from "framer-motion";

export default function ResumesPage() {
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResumes() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        const headers: HeadersInit = {};
        if (session?.access_token) {
          headers["Authorization"] = `Bearer ${session.access_token}`;
        }

        const res = await fetch("/api/resumes", {
          headers
        });
        
        if (res.status === 401) {
          throw new Error("Please sign in to view your resumes");
        }
        
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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <main className="min-h-screen bg-gray-950 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6 relative z-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">My <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Resumes</span></h1>
            <p className="text-gray-400 text-lg">View and manage all your AI-generated resumes.</p>
          </div>
          <Link
            href="/create"
            className="group relative flex items-center gap-2 bg-white text-gray-950 hover:bg-gray-100 px-7 py-3.5 rounded-2xl font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.15)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New
            </span>
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
          <div className="relative group flex flex-col items-center justify-center py-24 px-4 text-center rounded-[2rem] bg-white/[0.01] border border-white/5 max-w-3xl mx-auto backdrop-blur-xl shadow-2xl overflow-hidden hover:border-white/10 transition-colors">
            {/* Ambient background glows for empty state */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-violet-500/20 transition-colors duration-700" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-cyan-500/20 transition-colors duration-700 delay-100" />
            
            {/* Dashed inner bounding to preserve the blueprint feel but make it premium */}
            <div className="absolute inset-4 border-2 border-dashed border-white/10 rounded-[1.5rem] pointer-events-none" />

            <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_10px_30px_rgba(0,0,0,0.5)] rounded-2xl flex items-center justify-center mb-8 transform group-hover:scale-105 transition-transform duration-500">
               <FileText className="w-10 h-10 text-gray-400 group-hover:text-white transition-colors" />
            </div>
            <h3 className="relative z-10 text-3xl font-black text-white mb-4 tracking-tight">No resumes yet</h3>
            <p className="relative z-10 text-gray-400 max-w-md mb-10 text-lg leading-relaxed">
              Start building your professional profile using our AI generator to land your absolute dream job.
            </p>
            <Link
              href="/create"
              className="relative z-10 group/btn flex items-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-bold hover:from-violet-500 hover:to-cyan-500 transition-all hover:scale-105 shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)]"
            >
              <Plus className="w-5 h-5 transition-transform group-hover/btn:rotate-90" />
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
