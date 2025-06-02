import { createFileRoute, redirect } from "@tanstack/react-router"
import { UserProfile } from "../components/UserProfile"
import { Spin } from "antd"

export const Route = createFileRoute("/profile")({
  beforeLoad: ({ context }) => {
    const { auth } = context

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
  },
  component: ProfilePage,
})

function ProfilePage() {
  const { auth } = Route.useRouteContext()
  const { user, logout, isLoading, isAuthenticated } = auth

  console.log("ProfilePage render:", { user, isLoading, isAuthenticated })

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
        <Spin size="large" tip="Loading profile..." />
      </div>
    )
  }

  // If not authenticated after loading, redirect to home
  if (!isAuthenticated || !user) {
    window.location.href = "/" // Force redirect to clear any stale state
    return null
  }

  return <UserProfile user={user} onLogout={logout} />
}
