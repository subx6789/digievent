"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle, Home } from "lucide-react";
import { useRouter } from "next/navigation";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary?: () => void;
  showHomeButton?: boolean;
}

/**
 * A fallback UI component displayed when an error occurs
 * Provides options to retry the operation or navigate home
 */
const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  showHomeButton = true,
}) => {
  const router = useRouter();
  const isNetworkError = error.message.includes("network") || 
                         error.message.includes("fetch") ||
                         error.message.includes("connection");
  
  const errorTitle = isNetworkError 
    ? "Network Error" 
    : "Something went wrong";
  
  const errorMessage = isNetworkError
    ? "We're having trouble connecting to our servers. Please check your internet connection and try again."
    : error.message || "An unexpected error occurred. Our team has been notified.";

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
        <AlertTriangle className="h-8 w-8 text-red-500 dark:text-red-400" />
      </div>
      
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
        {errorTitle}
      </h2>
      
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        {errorMessage}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        {resetErrorBoundary && (
          <Button 
            onClick={resetErrorBoundary}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        )}
        
        {showHomeButton && (
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Go to Home
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback;