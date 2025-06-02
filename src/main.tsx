"use client"

import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { routeTree } from "./routeTree.gen"
import { AuthProvider, useAuth, type AuthContextType } from "./providers/auth-provider"

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

// Define the router context interface
interface RouterContext {
  auth: AuthContextType
  queryClient: QueryClient
}

// Set up a Router instance with auth context
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    auth: undefined!, // This will be set after we wrap the app in an AuthProvider
    queryClient,
  },
})

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
  interface RouterContext {
    auth: AuthContextType
    queryClient: QueryClient
  }
}

function InnerApp() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth, queryClient }} />
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

// Wait for DOM to be ready
function initializeApp() {
  const rootElement = document.getElementById("root")

  if (!rootElement) {
    console.error("Root element not found. Make sure you have a div with id='root' in your HTML.")
    return
  }

  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp)
} else {
  initializeApp()
}
