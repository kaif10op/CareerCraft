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
        <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">
          {label}
        </label>
        <div className="relative group">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-400 transition-colors">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-gray-900/50 border rounded-xl px-4 py-3 text-white placeholder-gray-500
              transition-all duration-200 outline-none
              ${
                icon ? "pl-11" : ""
              }
              ${
                error
                  ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
                  : "border-gray-700/50 hover:border-gray-600 focus:border-violet-500 focus:bg-gray-800/80 focus:ring-1 focus:ring-violet-500/50"
              }
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1 ml-1 animate-in slide-in-from-top-1 fade-in duration-200">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
