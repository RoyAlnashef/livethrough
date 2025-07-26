"use client"

import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import LiveThroughFooter from "@/components/LiveThroughFooter"

interface AccountLayoutProps {
  children: ReactNode
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/')
  }

  return (
    <div className="min-h-screen bg-black flex flex-col pt-16 md:pt-0">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Horizontal Navigation */}
        <nav className="flex mb-8 border-b border-zinc-800">
          <a
            href="/account/courses"
            className={`px-4 py-4 font-medium transition-colors ${
              isActive('/account/courses')
                ? 'text-white border-b-1 border-teal-500'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            My Courses
          </a>
          <a
            href="/account/settings"
            className={`px-4 py-4 font-medium transition-colors ${
              isActive('/account/settings')
                ? 'text-white border-b-1 border-teal-500'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Settings
          </a>
        </nav>
        {/* Main Content */}
        <main className="flex-1 pb-8 transition-opacity duration-300 ease-in-out">
          {children}
        </main>
      </div>
      <LiveThroughFooter />
    </div>
  )
} 