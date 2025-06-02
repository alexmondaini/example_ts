import { createFileRoute } from "@tanstack/react-router"
import { requireAuth } from "../utils/route-protection"

export const Route = createFileRoute("/settings")({
  beforeLoad: ({ context }) => {
    requireAuth(context.auth)
  },
  component: SettingsPage,
})

function SettingsPage() {
  const { auth } = Route.useRouteContext()
  const { user } = auth

  return (
    <div>
      <h1>Settings</h1>
      <p>Manage your settings, {user?.full_name}!</p>
    </div>
  )
}
