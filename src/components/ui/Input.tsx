import React, { forwardRef } from "react";
import { AlertCircle } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = "", ...props }, ref) => {
    return (
      <div className={`w-full ${className}`}>
        <label className="block text-sm font-semibold mb-2 ml-1 text-gray-300">
          {label}
        </label>
        <div className="relative group">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-violet-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full rounded-2xl px-4 py-3.5 transition-all outline-none bg-gray-900/50 text-white placeholder-gray-500 shadow-inner ${
              icon ? "pl-12" : ""
            } ${
              error
                ? "border border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                : "border border-gray-700/80 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            }`}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-2 text-sm flex items-center gap-1.5 ml-1 animate-in fade-in text-red-500 font-medium">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
