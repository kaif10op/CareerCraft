"use client";

import { useFormContext } from "react-hook-form";
import { ResumeFormValues } from "@/lib/schema";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";

export function LivePreview() {
  const { watch } = useFormContext<ResumeFormValues>();

  const data = watch();

  return (
    <div className="w-full h-full bg-white rounded-3xl shadow-2xl p-8 overflow-y-auto custom-scrollbar text-gray-900 font-sans">
      {/* Header */}
      <div className="border-b-2 border-gray-200 pb-6 mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wider text-gray-900 mb-2">
          {data.fullName || "Your Name"}
        </h1>
        {data.jobTitle && (
          <h2 className="text-xl text-violet-600 font-medium mb-4">
            {data.jobTitle}
          </h2>
        )}

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
          {data.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" /> {data.email}
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" /> {data.phone}
            </div>
          )}
          {data.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {data.location}
            </div>
          )}
          {data.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="w-4 h-4" /> LinkedIn
            </div>
          )}
          {data.github && (
            <div className="flex items-center gap-1">
              <Github className="w-4 h-4" /> GitHub
            </div>
          )}
          {data.portfolio && (
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" /> Portfolio
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
            {data.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && data.experience[0].company && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1 uppercase tracking-wide">
            Experience
          </h3>
          <div className="space-y-4">
            {data.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-gray-900">{exp.position}</h4>
                  <span className="text-sm font-medium text-violet-600 whitespace-nowrap ml-4">
                    {exp.startDate} {exp.startDate && exp.endDate ? "—" : ""} {exp.endDate}
                  </span>
                </div>
                <div className="text-gray-700 font-medium text-sm mb-2">{exp.company}</div>
                {exp.description && (
                  <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                    {exp.description}
                  </p>
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
              <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1 uppercase tracking-wide">
                Education
              </h3>
              <div className="space-y-3">
                {data.education.map((edu, i) => (
                  <div key={i}>
                    <h4 className="font-bold text-gray-900 text-sm">{edu.degree} in {edu.field}</h4>
                    <div className="text-gray-700 text-sm">{edu.institution}</div>
                    <div className="text-gray-500 text-xs mt-0.5">
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
              <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1 uppercase tracking-wide">
                Certifications
              </h3>
              <div className="space-y-3">
                {data.certifications.map((cert, i) => (
                  <div key={i}>
                    <h4 className="font-bold text-gray-900 text-sm">{cert.name}</h4>
                    <div className="text-gray-700 text-sm">{cert.issuer}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{cert.date}</div>
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
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1 uppercase tracking-wide">
            Projects
          </h3>
          <div className="space-y-4">
            {data.projects.map((proj, i) => (
              <div key={i}>
                <div className="flex items-baseline gap-2 mb-1">
                  <h4 className="font-bold text-gray-900">{proj.name}</h4>
                  {proj.techStack && (
                    <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
                      {proj.techStack}
                    </span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1 uppercase tracking-wide">
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, i) => (
              <span key={i} className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-md border border-gray-200">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Welcome State if empty */}
      {!data.fullName && !data.email && !data.experience?.[0]?.company && !data.education?.[0]?.institution && (
        <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-900 mb-1">Live Preview</p>
          <p className="text-sm">Start filling out the form to see your resume take shape!</p>
        </div>
      )}
    </div>
  );
}
