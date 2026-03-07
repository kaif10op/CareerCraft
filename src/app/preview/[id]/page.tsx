"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ResumePreview from "@/components/ResumePreview";
import { AtsTracker } from "@/components/AtsTracker";
import { templates } from "@/config/templates";
import { ResumeRecord } from "@/types/resume";
import { supabase } from "@/lib/supabase";
import { Download, Save, Loader2, ArrowLeft } from "lucide-react";
import AuthModal from "@/components/AuthModal";

export default function PreviewPage() {
  const params = useParams();
  const [resume, setResume] = useState<ResumeRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [template, setTemplate] = useState<string>("modern");
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const headers: HeadersInit = {};
        if (session?.access_token) {
          headers["Authorization"] = `Bearer ${session.access_token}`;
        }

        const response = await fetch(`/api/resumes/${params.id}`, { headers });
        if (!response.ok) throw new Error("Resume not found or access denied");
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

  const handleDownload = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // If logged in but resume has no user_id, associate it
    if (resume && !resume.user_id) {
      try {
        setIsSaving(true);
        const { error } = await supabase
          .from("resumes")
          .update({ user_id: user.id })
          .eq("id", resume.id);
        
        if (error) throw error;
        setResume({ ...resume, user_id: user.id });
      } catch (err) {
        console.error("Failed to associate resume", err);
      } finally {
        setIsSaving(false);
      }
    }

    window.print();
  };

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
    <main className="min-h-screen bg-gray-950 pt-24 pb-16 print:min-h-0 print:p-0 print:bg-white">
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
          
          <div className="flex flex-col gap-3 mt-4 sm:mt-0 w-full sm:w-auto overflow-hidden">
            <span className="text-sm text-gray-400 font-medium whitespace-nowrap hidden sm:block">Select a Template:</span>
            
            {/* Horizontal Scrollable Template Selector */}
            <div className="flex gap-3 overflow-x-auto pb-4 pt-1 custom-scrollbar w-full sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] snap-x">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setTemplate(tpl.id)}
                  className={`relative flex-shrink-0 w-24 h-32 rounded-xl group transition-all overflow-hidden border-2 snap-center flex flex-col items-center bg-gray-900 ${
                    template === tpl.id
                      ? "border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                      : "border-gray-800 hover:border-gray-600"
                  }`}
                >
                  {/* Subtle graphical representation based on template style */}
                  <div className="absolute inset-x-0 top-0 bottom-6 bg-white flex flex-col items-center overflow-hidden">
                    {/* Render Image if exists, else fallback */}
                    {tpl.thumbnail && (
                      <div 
                        className={`absolute inset-0 bg-cover bg-top opacity-90 transition-opacity ${template === tpl.id ? 'opacity-100' : 'group-hover:opacity-100'}`}
                        style={{ backgroundImage: `url(${tpl.thumbnail})` }}
                      />
                    )}
                    
                    {/* CSS Fallback (hidden mostly by image if present) */}
                    <div className="absolute inset-x-0 top-0 bottom-0 p-2 flex flex-col items-center opacity-40 mix-blend-multiply bg-white">
                      <div className={`w-full bg-gray-300 mb-1.5 ${tpl.id === 'classic' || tpl.id === 'academic' || tpl.id === 'executive' ? 'h-3' : 'h-4'}`}></div>
                      <div className="w-4/5 h-1.5 bg-gray-300 mb-2"></div>
                      <div className={`w-full h-px bg-gray-200 mb-2 ${tpl.styles.hr.includes('dashed') ? 'border-dashed border-t' : tpl.styles.hr.includes('dotted') ? 'border-dotted border-t' : ''}`}></div>
                      
                      <div className={`w-full flex gap-1 ${tpl.id === 'modern' || tpl.id === 'functional' ? 'flex-col' : ''}`}>
                        <div className={`h-8 bg-gray-100 ${tpl.id === 'modern' || tpl.id === 'functional' ? 'w-full mb-1 h-3' : 'w-1/3'}`}></div>
                        <div className={`h-8 bg-gray-50 ${tpl.id === 'modern' || tpl.id === 'functional' ? 'w-full' : 'w-2/3'}`}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Title Label at the bottom */}
                  <div className={`absolute bottom-0 inset-x-0 h-6 flex items-center justify-center transition-colors ${template === tpl.id ? 'bg-violet-600' : 'bg-gray-800 group-hover:bg-gray-700'}`}>
                    <span className="text-white text-[10px] sm:text-xs font-bold truncate px-1">{tpl.name}</span>
                  </div>
                  
                  {/* Select overlay on hover */}
                  <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity z-10 ${template === tpl.id ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
                    <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded-md font-medium">Select</span>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="flex gap-3 sm:justify-end">
              <button
                onClick={handleDownload}
                disabled={isSaving}
                className="group relative flex items-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white px-7 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-[0_10px_30px_-5px_rgba(139,92,246,0.3)]"
              >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                    Download PDF
                  </>
                )}
              </button>
              <Link
                href="/create"
                className="px-5 py-3 rounded-xl border border-white/10 text-gray-300 font-medium hover:bg-white/5 hover:text-white transition-all whitespace-nowrap"
              >
                Create New
              </Link>
            </div>
          </div>
        </div>

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />

        {/* Top Feature Container (ATS Tracker) */}
        <div data-print-hide className="mb-10 flex justify-center mt-4">
          <AtsTracker resumeContent={resume.generated_resume} />
        </div>

        <ResumePreview content={resume.generated_resume} template={template} />
      </div>
    </main>
  );
}
