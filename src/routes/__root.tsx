import { Outlet, createRootRoute } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { ConfigProvider, Layout, Typography, App } from "antd"

const { Header, Content, Footer } = Layout
const { Title } = Typography

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#1890ff" } }}>
      <App>
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
      </App>
      <TanStackRouterDevtools />
    </ConfigProvider>
  )
}
