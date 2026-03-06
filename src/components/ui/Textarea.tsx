import React, { forwardRef } from "react";
import { AlertCircle } from "lucide-react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className={`w-full ${className}`}>
        <label
          className="block text-sm font-medium mb-1.5 ml-1"
          style={{ color: "#d1d5db" }}
        >
          {label}
        </label>
        <div className="relative group">
          <textarea
            ref={ref}
            className="w-full rounded-xl px-4 py-3 transition-all duration-200 outline-none resize-y"
            style={{
              backgroundColor: "rgba(17, 24, 39, 0.5)",
              border: error ? "1px solid rgba(239, 68, 68, 0.5)" : "1px solid rgba(55, 65, 81, 0.5)",
              color: "#ffffff",
              minHeight: "100px",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = error ? "#ef4444" : "#8b5cf6";
              e.target.style.backgroundColor = "rgba(31, 41, 55, 0.8)";
              e.target.style.boxShadow = error
                ? "0 0 0 1px rgba(239, 68, 68, 0.5)"
                : "0 0 0 1px rgba(139, 92, 246, 0.5)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = error ? "rgba(239, 68, 68, 0.5)" : "rgba(55, 65, 81, 0.5)";
              e.target.style.backgroundColor = "rgba(17, 24, 39, 0.5)";
              e.target.style.boxShadow = "none";
            }}
            {...props}
          />
        </div>
        {error && (
          <p
            className="mt-1.5 text-sm flex items-center gap-1 ml-1 fade-in"
            style={{ color: "#f87171" }}
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
