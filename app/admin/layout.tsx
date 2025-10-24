import type React from "react"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"

// Simple admin authentication check
async function checkAdminAuth() {
  // TODO: Implement proper admin authentication
  // For now, we'll use a simple environment variable check
  const isAdmin = process.env.ADMIN_EMAIL === "admin@hemzpashmina.com"

  if (!isAdmin) {
    redirect("/admin/login")
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await checkAdminAuth()

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 ml-64">{children}</main>
      </div>
    </div>
  )
}
