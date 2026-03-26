import React, { forwardRef } from "react";
import { AlertCircle } from "lucide-react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = "", ...props }, ref) => {
    return (
      <div className={`w-full ${className}`}>
        <label className="block text-sm font-semibold mb-1.5 ml-1 text-gray-300">
          {label}
        </label>
        <div className="relative group">
          <textarea
            ref={ref}
            className={`w-full rounded-2xl px-4 py-3 text-[15px] transition-all duration-200 outline-none resize-y min-h-[120px] bg-gray-900/50 text-white placeholder-gray-500 shadow-inner leading-relaxed ${
              error
                ? "border border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border border-gray-700/80 hover:border-gray-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            }`}
            {...props}
          />
        </div>
        {hint && !error && (
          <p className="mt-1.5 text-xs text-gray-500 ml-1">{hint}</p>
        )}
        {error && (
          <p className="mt-2 text-sm flex items-center gap-1.5 ml-1 animate-in fade-in text-red-500 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
