"use client";

import { useFormContext } from "react-hook-form";
import { templates } from "@/config/templates";
import { ResumeFormValues } from "@/lib/schema";
import { Check } from "lucide-react";

export function StepTemplate() {
  const {
    setValue,
    watch,
  } = useFormContext<ResumeFormValues>();

  const selectedTemplate = watch("templateId") || "modern";

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 fade-in">
      <div>
        <h2 className="text-3xl font-extrabold mb-3 text-white tracking-tight">
          Choose Your Template
        </h2>
        <p className="text-base text-gray-400 font-medium pb-4 border-b border-gray-800">
          Select a professional design that fits your industry and style.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
        {templates.map((template) => {
          const isSelected = selectedTemplate === template.id;
          
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => setValue("templateId", template.id)}
              className={`group relative flex flex-col text-left rounded-3xl overflow-hidden transition-all duration-300 border-2 ${
                isSelected
                  ? "border-violet-500 ring-4 ring-violet-500/20 bg-violet-500/5 shadow-2xl"
                  : "border-gray-800 bg-gray-900/40 hover:border-gray-700 hover:bg-gray-800/50"
              }`}
            >
              {/* Template Thumbnail Placeholder/Preview */}
              <div className="aspect-[4/3] bg-gray-800 relative overflow-hidden flex items-center justify-center isolate">
                {template.thumbnail ? (
                  <div 
                    className="absolute inset-0 bg-cover bg-top opacity-60 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundImage: `url(${template.thumbnail})` }}
                  />
                ) : (
                  <div className="text-gray-600 bg-white/5 w-full h-full flex flex-col items-center justify-center uppercase tracking-widest text-[10px] font-bold">
                    <div className="w-12 h-16 border border-dashed border-gray-600 rounded-sm mb-2 opacity-30" />
                    No Preview
                  </div>
                )}
                
                {isSelected && (
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center shadow-lg z-20">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
                
                {/* Overlay with layout tag */}
                <div className="absolute bottom-3 left-3 flex gap-2 z-10">
                   <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-gray-950/80 text-white backdrop-blur-md rounded-full border border-white/10">
                    {template.layout}
                  </span>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-5">
                <h3 className={`text-lg font-bold mb-1 transition-colors ${isSelected ? 'text-violet-300' : 'text-white'}`}>
                  {template.name}
                </h3>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">
                  {template.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
