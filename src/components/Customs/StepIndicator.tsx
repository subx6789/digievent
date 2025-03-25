"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

export interface Step {
  id: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (index: number) => void;
  className?: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  onStepClick,
  className,
}) => {
  return (
    <div className={cn("w-full py-4", className)}>
      <div className="flex items-center justify-between relative">
        {/* Connecting line - positioned to span the full width */}
        <div className="absolute top-5 left-0 right-0 h-[5px] bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0">
          <motion.div
            className="h-full rounded-r-full bg-blue-600 dark:bg-blue-400"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className={cn(
              "flex flex-col items-center relative z-10",
              index <= currentStep ? "text-primary" : "text-muted-foreground"
            )}
            onClick={() =>
              onStepClick && index <= currentStep && onStepClick(index)
            }
            style={{
              cursor:
                index <= currentStep && onStepClick ? "pointer" : "not-allowed",
            }}
          >
            <motion.div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center mb-2",
                index < currentStep
                  ? "bg-blue-600 dark:bg-blue-500 text-white"
                  : index === currentStep
                  ? "ring-2 ring-blue-600 dark:ring-blue-500 bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-500"
                  : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
              )}
              whileHover={index <= currentStep ? { scale: 1.1 } : {}}
              whileTap={index <= currentStep ? { scale: 0.95 } : {}}
            >
              {index < currentStep ? (
                <CheckIcon className="h-5 w-5" />
              ) : (
                <span className="text-sm">{step.icon}</span>
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
