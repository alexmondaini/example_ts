"use client"

import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { routeTree } from "./routeTree.gen"
import { AuthProvider, useAuth, type AuthContextType } from "./providers/auth-provider"
import { queryClient } from "./lib/query-client"

// Define the router context interface
interface RouterContext {
  auth: AuthContextType
}

// Set up a Router instance with auth context
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    auth: undefined!, // This will be set after we wrap the app in an AuthProvider
  },
})

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
  interface RouterContext extends RouterContext {}
}

function InnerApp() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
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
