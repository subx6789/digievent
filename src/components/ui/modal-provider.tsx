"use client";

import React from "react";
import {
  Dialog as ShadcnDialog,
  DialogContent as ShadcnDialogContent,
  DialogHeader as ShadcnDialogHeader,
  DialogFooter as ShadcnDialogFooter,
  DialogTitle as ShadcnDialogTitle,
  DialogDescription as ShadcnDialogDescription,
  DialogTrigger as ShadcnDialogTrigger,
  DialogClose as ShadcnDialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Enhanced Dialog component with dark mode support
export const Dialog = ShadcnDialog;
export const DialogTrigger = ShadcnDialogTrigger;
export const DialogClose = ShadcnDialogClose;

// Enhanced DialogContent with dark mode styling
export const DialogContent = React.forwardRef<
  React.ElementRef<typeof ShadcnDialogContent>,
  React.ComponentPropsWithoutRef<typeof ShadcnDialogContent>
>(({ className, ...props }, ref) => (
  <ShadcnDialogContent
    ref={ref}
    className={cn(
      "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl",
      className
    )}
    {...props}
  />
));
DialogContent.displayName = "DialogContent";

// Enhanced DialogHeader with dark mode styling
export const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <ShadcnDialogHeader className={cn("mb-6", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

// Enhanced DialogFooter with dark mode styling
export const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <ShadcnDialogFooter className={cn("mb-6", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

// Enhanced DialogTitle with dark mode styling
export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof ShadcnDialogTitle>,
  React.ComponentPropsWithoutRef<typeof ShadcnDialogTitle>
>(({ className, ...props }, ref) => (
  <ShadcnDialogTitle
    ref={ref}
    className={cn(
      "text-xl font-bold text-gray-900 dark:text-gray-100",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

// Enhanced DialogDescription with dark mode styling
export const DialogDescription = React.forwardRef<
  React.ElementRef<typeof ShadcnDialogDescription>,
  React.ComponentPropsWithoutRef<typeof ShadcnDialogDescription>
>(({ className, ...props }, ref) => (
  <ShadcnDialogDescription
    ref={ref}
    className={cn("text-gray-600 dark:text-gray-300", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";
