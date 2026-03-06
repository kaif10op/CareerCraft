import Link from "next/link";
import { ResumeRecord } from "@/types/resume";
import { FileText, Calendar, ChevronRight } from "lucide-react";

interface ResumeCardProps {
  resume: ResumeRecord;
}

export default function ResumeCard({ resume }: ResumeCardProps) {
  const dateObj = new Date(resume.created_at);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(dateObj);

  return (
    <Link href={`/preview/${resume.id}`} className="block h-full outline-none">
      <div className="group relative h-full p-6 rounded-2xl bg-gray-900/50 border border-gray-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10 hover:border-violet-500/50 hover:bg-gray-800/80 cursor-pointer flex flex-col justify-between overflow-hidden">
        
        {/* Subtle background glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div>
          <div className="flex items-start justify-between mb-5 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 group-hover:bg-violet-500 group-hover:text-white transition-colors duration-300 shadow-inner">
              <FileText className="w-6 h-6" />
            </div>
            <span className="flex items-center text-xs font-medium text-gray-500 bg-gray-950/80 border border-gray-800 px-3 py-1.5 rounded-full shadow-sm">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-600" />
              {formattedDate}
            </span>
          </div>

          <div className="relative z-10">
            <h3 className="text-white font-bold text-lg mb-1.5 group-hover:text-violet-300 transition-colors line-clamp-1">
              {resume.full_name}
            </h3>
            <p className="text-gray-400 text-sm mb-5 line-clamp-1">
              {resume.job_title || resume.email}
            </p>

            {resume.skills && resume.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {resume.skills.slice(0, 3).map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-md bg-gray-950 text-gray-300 border border-gray-800 group-hover:border-gray-700 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
                {resume.skills.length > 3 && (
                  <span className="text-xs px-2 py-1 rounded-md bg-transparent text-gray-500 font-medium">
                    +{resume.skills.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="pt-5 border-t border-gray-800/80 relative z-10">
          <span className="text-sm font-semibold text-violet-400 group-hover:text-violet-300 transition-colors flex items-center gap-1">
            View Resume
            <ChevronRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </span>
        </div>
      </div>
    </Link>
  );
}
