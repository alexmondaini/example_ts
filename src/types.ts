// Define all shared types here
export interface User {
  id: string
  email?: string
  full_name?: string
  department?: string
  role?: Record<string, boolean>
  org?: Record<string, string>
}

export interface LoginRequest {
  username: string
  password: string
}
