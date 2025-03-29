/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorInfo } from "react";

// Define error severity levels
export enum ErrorSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

// Define error context interface
export interface ErrorContext {
  userId?: string;
  role?: string;
  path?: string;
  action?: string;
  additionalData?: Record<string, unknown>;
}

/**
 * Captures and logs errors to the console and potentially to an external service
 * @param error The error object
 * @param errorInfo Additional React error info (optional)
 * @param context Additional context about the error (optional)
 * @param severity Error severity level (optional)
 */
export function captureError(
  error: Error,
  errorInfo?: ErrorInfo,
  context?: ErrorContext,
  severity: ErrorSeverity = ErrorSeverity.MEDIUM
): void {
  // Get current user info from localStorage/sessionStorage if available
  let userContext = {};
  try {
    const authData =
      localStorage.getItem("auth") || sessionStorage.getItem("auth");
    if (authData) {
      const user = JSON.parse(authData);
      userContext = {
        userId: user.id,
        role: user.role,
      };
    }
  } catch (e) {
    console.error("Failed to get user context:", e);
  }

  // Get current route
  const path = typeof window !== "undefined" ? window.location.pathname : "";

  // Prepare error data
  const errorData = {
    timestamp: new Date().toISOString(),
    message: error.message,
    name: error.name,
    stack: error.stack,
    componentStack: errorInfo?.componentStack,
    severity,
    context: {
      ...userContext,
      path,
      ...context,
    },
    environment: process.env.NODE_ENV,
    appVersion: process.env.NEXT_PUBLIC_APP_VERSION || "unknown",
  };

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.group("%cError Captured", "color: #ff0000; font-weight: bold;");
    console.error(error);
    if (errorInfo) {
      console.error("Component Stack:", errorInfo.componentStack);
    }
    console.log("Error Context:", errorData.context);
    console.groupEnd();
  }

  // In production, send to error tracking service
  if (process.env.NODE_ENV === "production") {
    // Send to your preferred error tracking service
    // This is where you would integrate with services like Sentry, LogRocket, etc.
    sendToErrorService(errorData);
  }
}

/**
 * Sends error data to an external error tracking service
 * @param errorData The formatted error data
 */
function sendToErrorService(errorData: any): void {
  // Example implementation for sending to a backend API
  // Replace with your actual error reporting service integration
  try {
    // Uncomment and modify this to use your actual error reporting service
    /*
    fetch('/api/error-logging', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorData),
    });
    */

    // For now, just log that we would send this data
    console.log("Would send to error service:", errorData);
  } catch (e) {
    // Fallback logging if the error service itself fails
    console.error("Failed to send error to logging service:", e);
  }
}

/**
 * Creates a standardized API error from various error types
 * @param error The original error
 * @returns A standardized error object
 */
export function createAPIError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === "string") {
    return new Error(error);
  }

  return new Error("An unknown error occurred");
}

/**
 * Handles API response errors and transforms them into standardized errors
 * @param response The fetch API response
 * @returns The parsed error or throws if not an error response
 */
export async function handleAPIError(response: Response): Promise<Error> {
  let errorData;

  try {
    errorData = await response.json();
  } catch (e) {
    return new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const errorMessage =
    errorData.message ||
    errorData.error ||
    `API Error: ${response.status} ${response.statusText}`;
  const error = new Error(errorMessage);

  // Add additional properties to the error
  (error as any).status = response.status;
  (error as any).statusText = response.statusText;
  (error as any).data = errorData;

  return error;
}
