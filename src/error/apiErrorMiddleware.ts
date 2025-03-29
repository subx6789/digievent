import { captureError, createAPIError, handleAPIError } from "./errorLogger";

/**
 * Wraps an API fetch call with standardized error handling
 * @param fetchPromise The original fetch promise
 * @param errorContext Additional context about the API call
 * @returns The fetch response or throws a standardized error
 */
export async function withErrorHandling<T>(
  fetchPromise: Promise<Response>,
  errorContext?: Record<string, unknown>
): Promise<T> {
  try {
    const response = await fetchPromise;
    
    if (!response.ok) {
      const error = await handleAPIError(response);
      captureError(error, undefined, { additionalData: errorContext });
      throw error;
    }
    
    return await response.json() as T;
  } catch (error) {
    // If it's already a handled error, just rethrow it
    if (error instanceof Error) {
      throw error;
    }
    
    // Otherwise, create and capture a standardized error
    const standardError = createAPIError(error);
    captureError(standardError, undefined, { additionalData: errorContext });
    throw standardError;
  }
}

/**
 * Creates a fetch function with built-in error handling
 * @param baseUrl Optional base URL for all requests
 * @returns A wrapped fetch function with error handling
 */
export function createFetchWithErrorHandling(baseUrl = "") {
  return async function fetchWithErrorHandling<T>(
    url: string,
    options?: RequestInit,
    errorContext?: Record<string, unknown>
  ): Promise<T> {
    const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;
    return withErrorHandling<T>(fetch(fullUrl, options), errorContext);
  };
}

/**
 * A hook to use the error-handled fetch in components
 */
export function useApiWithErrorHandling() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  
  return {
    fetchWithErrorHandling: createFetchWithErrorHandling(baseUrl),
  };
}