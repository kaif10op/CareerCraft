"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepperProps {
  steps: { id: string; title: string }[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="w-full">
      {/* Step circles + progress bar */}
      <div className="flex items-center justify-between relative mb-2">
        {/* Background Track */}
        <div
          className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 rounded-full z-0"
          style={{ backgroundColor: "#1f2937" }}
        />

        {/* Active Progress Track */}
        <motion.div
          className="absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full z-0"
          style={{
            background: "linear-gradient(to right, #7c3aed, #06b6d4)",
          }}
          initial={{ width: "0%" }}
          animate={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {steps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <motion.div
                onClick={() => {
                  if ((isCompleted || isCurrent) && onStepClick) {
                    onStepClick(index);
                  }
                }}
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isCurrent ? "#8b5cf6" : "#1f2937",
                  borderColor: isCompleted || isCurrent ? "#8b5cf6" : "#374151",
                  scale: isCurrent ? 1.1 : 1,
                }}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  isCompleted || isCurrent ? "cursor-pointer" : "cursor-not-allowed opacity-70"
                }`}
                style={{
                  boxShadow: isCurrent ? "0 4px 14px rgba(139, 92, 246, 0.3)" : "none",
                }}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                ) : (
                  <span
                    className="text-xs font-bold"
                    style={{
                      color: isCurrent ? "#ffffff" : "#9ca3af",
                    }}
                  >
                    {index + 1}
                  </span>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Step labels row — separate from circles */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;

          return (
            <span
              key={step.id}
              onClick={() => {
                if ((isCompleted || isCurrent) && onStepClick) {
                  onStepClick(index);
                }
              }}
              className={`text-xs font-medium text-center hidden sm:block ${
                isCompleted || isCurrent ? "cursor-pointer hover:text-white transition-colors" : ""
              }`}
              style={{
                color: isCurrent ? "#c4b5fd" : isCompleted ? "#d1d5db" : "#4b5563",
                width: `${100 / steps.length}%`,
              }}
            >
              {step.title}
            </span>
          );
        })}
      </div>
    </div>
  );
}
