"use client"

import { Form, Input, Button, Card, Alert, App } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import type { LoginRequest } from "../types"
import type React from "react"
import { useAuth } from "../providers/auth-provider"

export const LoginForm: React.FC = () => {
  const [form] = Form.useForm()
  const { login, loginError } = useAuth()
  const { message } = App.useApp() // Use App hook instead of static message

  const handleSubmit = async (values: LoginRequest) => {
    try {
      await login(values)
      message.success("Login successful!")
    } catch (error) {
      console.error("Login error:", error)
    }
  }

  return (
    <Card title="Login" variant="outlined">
      <Form form={form} name="login" layout="vertical" onFinish={handleSubmit} autoComplete="off">
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={false} block>
            Log in
          </Button>
        </Form.Item>

        {loginError && <Alert message="Login Error" description={loginError} type="error" showIcon />}
      </Form>
    </Card>
  )
}
