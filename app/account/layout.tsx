import { ReactNode } from "react"
import { Header } from "@/components/header"
import LiveThroughFooter from "@/components/LiveThroughFooter"

interface AccountLayoutProps {
  children: ReactNode
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <div className="min-h-screen bg-black flex flex-col pt-16 md:pt-0">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Horizontal Navigation */}
        <nav className="flex gap-6 mb-8 border-b border-zinc-800 pb-4">
          <a
            href="/account/courses"
            className="text-zinc-400 hover:text-white transition-colors px-2 py-1 font-medium"
          >
            My Courses
          </a>
          <a
            href="/account/profile"
            className="text-zinc-400 hover:text-white transition-colors px-2 py-1 font-medium"
          >
            Profile
          </a>
          <a
            href="/account/settings"
            className="text-zinc-400 hover:text-white transition-colors px-2 py-1 font-medium"
          >
            Settings
          </a>
        </nav>
        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
      <LiveThroughFooter />
    </div>
  )
} 