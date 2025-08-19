"use client"

import Sidebar from "@/components/dashboard/sidebar"
import "../globals.css"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <>
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(v => !v)} />
      <main className={cn(
        "flex-1 flex flex-col bg-zinc-950 h-screen overflow-y-auto transition-all duration-300",
        isSidebarCollapsed ? "ml-16" : "ml-64"
      )}>
        {children}
      </main>
    </>
  )
} 