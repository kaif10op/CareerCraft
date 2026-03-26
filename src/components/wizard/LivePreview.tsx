"use client";

import { useFormContext } from "react-hook-form";
import { ResumeFormValues } from "@/lib/schema";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export function LivePreview() {
  const { watch } = useFormContext<ResumeFormValues>();
  const data = watch();

  return (
    <div className="w-full h-full overflow-y-auto custom-scrollbar font-sans bg-white rounded-xl shadow-2xl p-10 text-gray-900 ring-1 ring-gray-200">
      {/* Header */}
      <div className="pb-6 mb-6 border-b-2 border-gray-200">
        <h1 className="font-extrabold uppercase tracking-wider text-3xl mb-1 text-gray-900">
          {data.fullName || "Your Name"}
        </h1>
        {data.jobTitle && (
          <h2 className="font-semibold text-lg text-violet-600 mb-3">
            {data.jobTitle}
          </h2>
        )}

        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600 font-medium mt-4">
          {data.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-gray-400" /> {data.email}
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-gray-400" /> {data.phone}
            </div>
          )}
          {data.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gray-400" /> {data.location}
            </div>
          )}
          {data.linkedin && (
            <div className="flex items-center gap-1.5">
              <Linkedin className="w-4 h-4 text-gray-400" /> LinkedIn
            </div>
          )}
          {data.github && (
            <div className="flex items-center gap-1.5">
              <Github className="w-4 h-4 text-gray-400" /> GitHub
            </div>
          )}
          {data.portfolio && (
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-gray-400" /> Portfolio
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-6">
          <div className="leading-relaxed text-sm text-gray-700 prose prose-sm max-w-none">
            <ReactMarkdown>{data.summary}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && data.experience[0].company && (
        <div className="mb-6">
          <h3 className="text-base font-bold mb-4 pb-1.5 uppercase tracking-wide text-gray-900 border-b border-gray-200">
            Experience
          </h3>
          <div className="space-y-4">
            {data.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-[15px] text-gray-900">{exp.position}</h4>
                  <span className="text-sm font-semibold whitespace-nowrap ml-4 text-violet-600">
                    {exp.startDate} {exp.startDate && exp.endDate ? "—" : ""} {exp.endDate}
                  </span>
                </div>
                <div className="text-sm font-semibold mb-2 text-gray-700">{exp.company}</div>
                {exp.description && (
                  <div className="text-[13px] leading-relaxed text-gray-600 prose prose-sm max-w-none">
                    <ReactMarkdown>{exp.description}</ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education & Certifications Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          {data.education && data.education.length > 0 && data.education[0].institution && (
            <>
              <h3 className="text-base font-bold mb-4 pb-1.5 uppercase tracking-wide text-gray-900 border-b border-gray-200">
                Education
              </h3>
              <div className="space-y-3">
                {data.education.map((edu, i) => (
                  <div key={i}>
                    <h4 className="font-bold text-sm text-gray-900">
                      {edu.degree} in {edu.field}
                    </h4>
                    <div className="text-sm font-medium text-gray-700 mt-0.5">{edu.institution}</div>
                    <div className="text-xs font-medium mt-1 text-violet-600">
                      {edu.startYear} - {edu.endYear}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div>
          {data.certifications && data.certifications.length > 0 && data.certifications[0].name && (
            <>
              <h3 className="text-base font-bold mb-4 pb-1.5 uppercase tracking-wide text-gray-900 border-b border-gray-200">
                Certifications
              </h3>
              <div className="space-y-3">
                {data.certifications.map((cert, i) => (
                  <div key={i}>
                    <h4 className="font-bold text-sm text-gray-900">{cert.name}</h4>
                    <div className="text-sm font-medium text-gray-700 mt-0.5">{cert.issuer}</div>
                    <div className="text-xs font-medium mt-1 text-violet-600">{cert.date}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Projects */}
      {data.projects && data.projects.length > 0 && data.projects[0].name && (
        <div className="mb-6">
          <h3 className="text-base font-bold mb-4 pb-1.5 uppercase tracking-wide text-gray-900 border-b border-gray-200">
            Projects
          </h3>
          <div className="space-y-4">
            {data.projects.map((proj, i) => (
              <div key={i}>
                <div className="flex items-baseline gap-3 mb-1.5">
                  <h4 className="font-bold text-[15px] text-gray-900">{proj.name}</h4>
                  {proj.techStack && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full text-violet-700 bg-violet-50 border border-violet-100">
                      {proj.techStack}
                    </span>
                  )}
                </div>
                {proj.description && (
                  <div className="text-[13px] leading-relaxed text-gray-600 prose prose-sm max-w-none">
                    <ReactMarkdown>{proj.description}</ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div>
          <h3 className="text-base font-bold mb-4 pb-1.5 uppercase tracking-wide text-gray-900 border-b border-gray-200">
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, i) => (
              <span
                key={i}
                className="text-[13px] font-medium px-3 py-1 rounded-md text-gray-700 bg-gray-100 border border-gray-200 break-words max-w-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Welcome State if empty */}
      {!data.fullName && !data.email && !data.experience?.[0]?.company && !data.education?.[0]?.institution && (
        <div className="h-full flex flex-col items-center justify-center text-center mt-12 mb-12">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-gray-50 border border-gray-100 shadow-sm">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-lg font-bold mb-2 text-gray-900">Live Preview</p>
          <p className="text-sm font-medium text-gray-500 max-w-xs mx-auto">Start filling out the form to see your professional resume take shape.</p>
        </div>
      )}
    </div>
  );
}
