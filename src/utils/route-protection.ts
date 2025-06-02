import { redirect } from "@tanstack/react-router"
import type { AuthContextType } from "../providers/auth-provider"

// Utility function for protecting routes
export function requireAuth(auth: AuthContextType) {
  // If not authenticated and not currently checking auth, redirect to home
  if (!auth.isAuthenticated && !auth.isLoading && !auth.shouldCheckAuth) {
    throw redirect({
      to: "/",
    })
  }

  // If we should check auth but haven't yet, trigger the check
  if (!auth.isAuthenticated && !auth.isLoading && auth.shouldCheckAuth) {
    auth.triggerAuthCheck()
  }
}

// Utility function for routes that should redirect if already authenticated
export function requireGuest(auth: AuthContextType) {
  if (auth.isAuthenticated) {
    throw redirect({
      to: "/profile", // or wherever you want authenticated users to go
    })
  }
}
