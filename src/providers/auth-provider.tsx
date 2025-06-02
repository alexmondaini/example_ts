"use client"

import { createContext, useContext, type ReactNode, useState, useEffect } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { getCurrentUser, loginUser, logoutUser } from "../lib/auth"
import { queryClient } from "../main"
import type { User, LoginRequest } from "../types"

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isPending: boolean
  isFetching: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  loginError: string | null
  // Add method to check if we should attempt auth
  shouldCheckAuth: boolean
  // Method to trigger auth check (for after login)
  triggerAuthCheck: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [shouldCheckAuth, setShouldCheckAuth] = useState(false)

  // Check if we should attempt auth on mount
  useEffect(() => {
    // Only check auth if there's a reasonable chance the user is logged in
    // You could check for any indicator here (like a session cookie exists)
    const hasSessionCookie = document.cookie.includes("session") // Adjust based on your cookie name
    setShouldCheckAuth(hasSessionCookie)
  }, [])

  // Query to get the current user - only runs when we should check
  const {
    data: user,
    isLoading,
    isError,
    error,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: ["auth-user"],
    queryFn: getCurrentUser,
    retry: false,
    enabled: shouldCheckAuth, // Only run when we should check auth
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    throwOnError: false,
  })

  // Mutation to handle login
  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: loginUser,
    onSuccess: (userData) => {
      // Enable auth checking for future
      setShouldCheckAuth(true)
      // Update the auth-user query with the new user data
      queryClient.setQueryData(["auth-user"], userData)
      navigate({ to: "/profile" })
    },
  })

  // Mutation to handle logout
  const logoutMutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: logoutUser,
    onSuccess: () => {
      // Disable auth checking
      setShouldCheckAuth(false)
      // Clear all auth-related data from cache
      queryClient.removeQueries({ queryKey: ["auth-user"] })
      navigate({ to: "/" })
    },
    onError: () => {
      // Even if logout API fails, clear local state and redirect
      setShouldCheckAuth(false)
      queryClient.removeQueries({ queryKey: ["auth-user"] })
      navigate({ to: "/" })
    },
  })

  // Login function
  const login = async (credentials: LoginRequest) => {
    await loginMutation.mutateAsync(credentials)
  }

  // Logout function
  const logout = async () => {
    await logoutMutation.mutateAsync()
  }

  // Method to trigger auth check (useful for manual checks)
  const triggerAuthCheck = () => {
    setShouldCheckAuth(true)
  }

  // User is authenticated if we have user data and no error
  const isAuthenticated = !!user && !isError

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading: shouldCheckAuth && isLoading,
        isPending: shouldCheckAuth && isPending,
        isFetching: shouldCheckAuth && isFetching,
        isAuthenticated,
        shouldCheckAuth,
        triggerAuthCheck,
        login,
        logout,
        loginError: loginMutation.error ? (loginMutation.error as Error).message : null,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
