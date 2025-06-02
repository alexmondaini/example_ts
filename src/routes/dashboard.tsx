import { createFileRoute } from "@tanstack/react-router"
import { requireAuth } from "../utils/route-protection"

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ context }) => {
    requireAuth(context.auth)
  },
  component: DashboardPage,
})

function DashboardPage() {
  const { auth } = Route.useRouteContext()
  const { user } = auth

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard, {user?.full_name}!</p>
    </div>
  )
}
