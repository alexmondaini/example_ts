"use client"

import { createFileRoute } from "@tanstack/react-router"
import { LoginForm } from "../components/LoginForm"
import { useAuth } from "../providers/auth-provider"
import { Button, Spin } from "antd"
import { Link } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: HomePage,
})

function HomePage() {
  const { user, isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
        <Spin size="large" tip="Loading..." />
      </div>
    )
  }

  // If user is already logged in, show a welcome message with a link to profile
  if (isAuthenticated && user) {
    return (
      <div style={{ textAlign: "center" }}>
        <h2>Welcome, {user.full_name || "User"}!</h2>
        <p>You are logged in.</p>
        <Button type="primary">
          <Link to="/profile">Go to your profile</Link>
        </Button>
      </div>
    )
  }

  // Otherwise show the login form
  return <LoginForm />
}
