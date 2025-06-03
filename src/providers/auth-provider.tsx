"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { getCurrentUser, loginUser, logoutUser } from "../lib/auth"
import { queryClient } from "../main"
import type { User, LoginRequest } from "../types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  loginError: string | null
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  // Query to get the current user
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["auth-user"],
    queryFn: getCurrentUser,
    retry: false,
    // This query will be persisted by our persistQueryClient setup
  })

  // Mutation to handle login
  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: loginUser,
    onSuccess: (userData) => {
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
      // Invalidate and remove the user data from cache
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

  // Determine if user is authenticated
  const isAuthenticated = !!user && !isError

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        isAuthenticated,
        login,
        logout,
        loginError: isError
          ? (error as Error).message
          : loginMutation.error
            ? (loginMutation.error as Error).message
            : null,
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
