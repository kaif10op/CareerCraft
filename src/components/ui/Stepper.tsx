"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepperProps {
  steps: { id: string; title: string }[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Background Track */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -translate-y-1/2 rounded-full z-0" />

        {/* Active Progress Track */}
        <motion.div
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-violet-600 to-cyan-500 -translate-y-1/2 rounded-full z-0"
          initial={{ width: "0%" }}
          animate={{
            width: \`\${(currentStep / (steps.length - 1)) * 100}%\`,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {steps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isCurrent ? "#8b5cf6" : "#1f2937",
                  borderColor: isCompleted || isCurrent ? "#8b5cf6" : "#374151",
                  scale: isCurrent ? 1.1 : 1,
                }}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors duration-300 shadow-lg ${
                  isCurrent ? "shadow-violet-500/30" : ""
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                ) : (
                  <span
                    className={`text-xs font-bold ${
                      isCurrent ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </span>
                )}
              </motion.div>

              {/* Step Title (hidden on small screens, absolute positioning to avoid shifting UI) */}
              <span
                className={`absolute top-10 text-xs font-medium whitespace-nowrap hidden sm:block transition-colors duration-300 ${
                  isCurrent ? "text-violet-300" : isCompleted ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
