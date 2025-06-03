import { Outlet, createRootRoute, redirect } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { ConfigProvider, Layout, Typography } from "antd"
import { AuthProvider } from "../providers/auth-provider"
import { queryClient } from "../main"

const { Header, Content, Footer } = Layout
const { Title } = Typography

export const Route = createRootRoute({
  component: RootComponent,
  beforeLoad: async ({ location }) => {
    try {
      // Try to get the user from the cache
      const user = queryClient.getQueryData(["auth-user"])

      // If trying to access /profile but not logged in, redirect to home
      if (location.pathname === "/profile" && !user) {
        throw redirect({
          to: "/",
        })
      }
    } catch (error) {
      // If there's an error or no user, and trying to access protected route
      if (location.pathname === "/profile") {
        throw redirect({
          to: "/",
        })
      }
    }
  },
})

function RootComponent() {
  return (
    <AuthProvider>
      <ConfigProvider theme={{ token: { colorPrimary: "#1890ff" } }}>
        <Layout style={{ minHeight: "100vh" }}>
          <Header style={{ display: "flex", alignItems: "center" }}>
            <Title level={3} style={{ color: "white", margin: 0 }}>
              My App
            </Title>
          </Header>
          <Content
            style={{
              padding: "50px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div style={{ maxWidth: "600px", width: "100%" }}>
              <Outlet />
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            FastAPI + Tanstack Query + Ant Design Demo ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </ConfigProvider>
      <TanStackRouterDevtools />
    </AuthProvider>
  )
}
