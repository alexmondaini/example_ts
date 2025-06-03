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
    const errorData = await response.json()
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
    throw new Error("Not authenticated")
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
    throw new Error("Logout failed")
  }
}
