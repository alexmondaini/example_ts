"use client"

import { createContext, useContext, type ReactNode, useState, useEffect, useCallback } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { getCurrentUser, loginUser, logoutUser } from "../lib/auth"
import { queryClient } from "../lib/query-client"
import type { User, LoginRequest } from "../types"
import { useNavigate } from "@tanstack/react-router"

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isPending: boolean
  isFetching: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  loginError: string | null
  shouldCheckAuth: boolean
  triggerAuthCheck: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [shouldCheckAuth, setShouldCheckAuth] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  // Check if we should attempt auth on mount
  useEffect(() => {
    // Only check auth if there's a reasonable chance the user is logged in
    const hasSessionCookie = document.cookie.includes("session") // Adjust based on your cookie name
    setShouldCheckAuth(hasSessionCookie)
  }, [])

  // Query to get the current user - only runs when we should check
  const {
    data: user,
    isLoading,
    isError,
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
    mutationFn: loginUser,
    onSuccess: (userData) => {
      setLoginError(null)
      setShouldCheckAuth(true)
      queryClient.setQueryData(["auth-user"], userData)
      navigate({ to: "/profile" })
    },
    onError: (error: Error) => {
      setLoginError(error.message || "Login failed")
    },
  })

  // Mutation to handle logout
  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      setShouldCheckAuth(false)
      queryClient.removeQueries({ queryKey: ["auth-user"] })
      navigate({ to: "/" })
    },
    onError: () => {
      setShouldCheckAuth(false)
      queryClient.removeQueries({ queryKey: ["auth-user"] })
      navigate({ to: "/" })
    },
  })

  // Login function
  const login = useCallback(
    async (credentials: LoginRequest) => {
      await loginMutation.mutateAsync(credentials)
    },
    [loginMutation],
  )

  // Logout function
  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync()
  }, [logoutMutation])

  // Method to trigger auth check
  const triggerAuthCheck = useCallback(() => {
    setShouldCheckAuth(true)
  }, [])

  // User is authenticated if we have user data and no error
  const isAuthenticated = !!user && !isError

  const value = {
    user: user || null,
    isLoading: shouldCheckAuth && isLoading,
    isPending: shouldCheckAuth && isPending,
    isFetching: shouldCheckAuth && isFetching,
    isAuthenticated,
    shouldCheckAuth,
    triggerAuthCheck,
    login,
    logout,
    loginError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
