"use client"

import { createFileRoute } from "@tanstack/react-router"
import { UserProfile } from "../components/UserProfile"
import { useAuth } from "../providers/auth-provider"
import { Spin } from "antd"

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
})

function ProfilePage() {
  const { user, logout, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
        <Spin size="large" tip="Loading profile..." />
      </div>
    )
  }

  // This check is a fallback, but the beforeLoad in the root route should prevent this case
  if (!user) {
    return <div>Please log in to view your profile.</div>
  }

  return <UserProfile user={user} onLogout={logout} />
}
