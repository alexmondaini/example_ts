import { QueryClient } from "@tanstack/react-query"

// Create a client with better error handling for auth
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: (failureCount, error: any) => {
        // Don't retry 401 errors (authentication failures)
        if (error?.message?.includes("Not authenticated") || error?.status === 401) {
          return false
        }
        // Retry other errors up to 2 times
        return failureCount < 2
      },
      staleTime: 1000 * 60 * 2, // 2 minutes
    },
  },
})
