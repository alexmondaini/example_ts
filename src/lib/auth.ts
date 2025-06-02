import type { User, LoginRequest } from "../types"

// API function to handle login
export const loginUser = async (credentials: LoginRequest): Promise<User> => {
  const response = await fetch("http://localhost:8010/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
    credentials: "include", // Important for cookies
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || "Login failed")
  }

  return response.json()
}

// API function to get current user
export const getCurrentUser = async (): Promise<User> => {
  const response = await fetch("http://localhost:8010/api/me", {
    credentials: "include", // Important for cookies
  })

  if (!response.ok) {
    // If 401, the cookie is invalid/expired - this is expected behavior
    if (response.status === 401) {
      throw new Error("Not authenticated")
    }
    // For other errors, throw a more specific error
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || `Server error: ${response.status}`)
  }

  return response.json()
}

// API function to logout
export const logoutUser = async (): Promise<void> => {
  const response = await fetch("http://localhost:8010/api/logout", {
    method: "POST",
    credentials: "include", // Important for cookies
  })

  if (!response.ok) {
    // Even if logout fails on server, we'll clear local state
    console.warn("Logout request failed, but clearing local state anyway")
  }
}
