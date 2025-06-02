import { ReactNode } from "react"
import { Header } from "@/components/header"

interface AccountLayoutProps {
  children: ReactNode
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              <a
                href="/account"
                className="block px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                Dashboard
              </a>
              <a
                href="/account/courses"
                className="block px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                My Courses
              </a>
              <a
                href="/account/profile"
                className="block px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                Profile
              </a>
              <a
                href="/account/settings"
                className="block px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                Settings
              </a>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
} 