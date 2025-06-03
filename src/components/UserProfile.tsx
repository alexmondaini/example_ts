"use client"

import type React from "react"
import { Card, Typography, Descriptions, Button, Avatar, Tabs, Table, message } from "antd"
import { UserOutlined, LogoutOutlined, IdcardOutlined, TeamOutlined, BankOutlined } from "@ant-design/icons"
import type { User } from "../types"

const { Title, Text } = Typography
const { TabPane } = Tabs

interface UserProfileProps {
  user: User
  onLogout: () => void
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  // Convert user role object to a displayable format
  const roleItems = Object.entries(user.role || {})
    .filter(([_, value]) => value === true)
    .map(([key]) => {
      const displayName = key.replace("is", "")
      return displayName
    })

  // Organization data for table display
  const orgData = user.org
    ? Object.entries(user.org).map(([key, value]) => ({
        key,
        level: key,
        value: value || "N/A",
      }))
    : []

  // Handle logout with error handling
  const handleLogout = async () => {
    try {
      await onLogout()
      message.success("Logged out successfully")
    } catch (error) {
      message.error("Failed to logout. Please try again.")
      console.error("Logout error:", error)
    }
  }

  return (
    <Card>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Avatar size={64} icon={<UserOutlined />} />
        <Title level={3} style={{ marginTop: "16px", marginBottom: "4px" }}>
          {user.full_name || "User"}
        </Title>
        <Text type="secondary">{roleItems.length > 0 ? roleItems.join(", ") : "No roles assigned"}</Text>
      </div>

      <Tabs defaultActiveKey="basic">
        <TabPane
          tab={
            <span>
              <IdcardOutlined /> Basic Info
            </span>
          }
          key="basic"
        >
          <Descriptions bordered column={1}>
            <Descriptions.Item label="User ID">{user.id}</Descriptions.Item>
            {user.email && <Descriptions.Item label="Email">{user.email}</Descriptions.Item>}
            {user.full_name && <Descriptions.Item label="Full Name">{user.full_name}</Descriptions.Item>}
            {user.department && <Descriptions.Item label="Department">{user.department}</Descriptions.Item>}
          </Descriptions>
        </TabPane>

        <TabPane
          tab={
            <span>
              <TeamOutlined /> Roles
            </span>
          }
          key="roles"
        >
          <Descriptions bordered column={1}>
            {Object.entries(user.role || {}).map(([role, hasRole]) => (
              <Descriptions.Item key={role} label={role.replace("is", " ")}>
                {hasRole ? "Yes" : "No"}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </TabPane>

        <TabPane
          tab={
            <span>
              <BankOutlined /> Organization
            </span>
          }
          key="org"
        >
          {orgData.length > 0 ? (
            <Table
              dataSource={orgData}
              columns={[
                {
                  title: "Level",
                  dataIndex: "level",
                  key: "level",
                  render: (text) => text.charAt(0).toUpperCase() + text.slice(1),
                },
                {
                  title: "Value",
                  dataIndex: "value",
                  key: "value",
                },
              ]}
              pagination={false}
              size="small"
            />
          ) : (
            <Text>No organization data available</Text>
          )}
        </TabPane>
      </Tabs>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </Card>
  )
}
