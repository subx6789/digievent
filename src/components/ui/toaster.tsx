/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        variant,
        ...props
      }: any) {
        return (
          <Toast
            key={id}
            {...props}
            className={cn(
              "group border border-gray-200 dark:border-gray-700",
              "bg-white dark:bg-gray-800",
              "text-gray-900 dark:text-gray-100",
              variant === "destructive" &&
                "border-red-500 dark:border-red-600 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200",
              variant === "success" &&
                "border-green-500 dark:border-green-600 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200",
              variant === "warning" &&
                "border-yellow-500 dark:border-yellow-600 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-200",
              props.className
            )}
          >
            <div className="grid gap-1">
              {title && (
                <ToastTitle
                  className={cn(
                    "text-gray-900 dark:text-gray-100 font-medium",
                    variant === "destructive" &&
                      "text-red-600 dark:text-red-200",
                    variant === "success" &&
                      "text-green-600 dark:text-green-200",
                    variant === "warning" &&
                      "text-yellow-600 dark:text-yellow-200"
                  )}
                >
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription
                  className={cn(
                    "text-gray-600 dark:text-gray-300 text-sm",
                    variant === "destructive" &&
                      "text-red-500 dark:text-red-300",
                    variant === "success" &&
                      "text-green-500 dark:text-green-300",
                    variant === "warning" &&
                      "text-yellow-500 dark:text-yellow-300"
                  )}
                >
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100" />
          </Toast>
        );
      })}
      <ToastViewport className="p-4 md:p-6" />
    </ToastProvider>
  );
}
