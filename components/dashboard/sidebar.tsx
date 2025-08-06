"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Users,
  School,
  BookOpen,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  UserCog,
  Home,
  LogOut,
  Megaphone,
  Mail,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

const mainLinks = [
  { name: "Marketplace", href: "/", icon: Home },
  { name: "Courses", href: "/dashboard/courses", icon: BookOpen },
  { name: "Schools", href: "/dashboard/schools", icon: School },
  { name: "Students", href: "/dashboard/students", icon: Users },
  { name: "Newsletter", href: "/dashboard/newsletter", icon: Mail },
  { name: "Ads", href: "/dashboard/ads", icon: Megaphone },
]

const systemLinks = [
  { name: "Admin Users", href: "/dashboard/admin-users", icon: UserCog },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Security", href: "/dashboard/security", icon: Shield },
]

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-30 bg-zinc-950 border-r border-zinc-800 flex flex-col h-screen transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Top section: Branding and Main Nav */}
      <div>
        <div className="flex items-center gap-3 px-3 h-16 border-b border-zinc-800">
          {/* Logo Mark Placeholder, aligned with nav icons */}
          <div className="flex items-center justify-center transition-all duration-300 ease-in-out" style={{ width: 40, height: 40 }}>
            {/* Replace this SVG with your actual logo mark if available */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" rx="6" fill="#18181B" stroke="#27272A" strokeWidth="2" />
              <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">LT</text>
            </svg>
          </div>
          <div className={cn(
            "flex flex-col transition-all duration-300 ease-in-out",
            isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
          )}>
            <span className="font-semibold text-white leading-tight whitespace-nowrap">LiveThrough</span>
          </div>
        </div>
        <nav>
          <ul className="mb-6 mt-4">
            {mainLinks.map(link => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  target={link.name === 'Marketplace' ? '_blank' : undefined}
                  rel={link.name === 'Marketplace' ? 'noopener noreferrer' : undefined}
                  className={cn(
                    "flex items-center gap-3 px-6 py-2 text-sm font-medium transition-all duration-300 ease-in-out",
                    pathname === link.href
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                  )}
                  title={isCollapsed ? link.name : undefined}
                >
                  <link.icon className="w-5 h-5 flex-shrink-0 transition-all duration-300 ease-in-out" />
                  <span className={cn(
                    "transition-all duration-300 ease-in-out whitespace-nowrap",
                    isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                  )}>
                    {link.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {/* Divider between nav sections */}
          <div className={cn(
            "border-t border-zinc-800 mx-4 my-2 transition-all duration-300 ease-in-out",
            isCollapsed ? "mx-2" : "mx-4"
          )} />
        </nav>
      </div>
      {/* Bottom section: System Nav */}
      <div className="mb-4">
        <ul>
          {systemLinks.map(link => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-6 py-2 text-sm font-medium transition-all duration-300 ease-in-out",
                  pathname === link.href
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                )}
                title={isCollapsed ? link.name : undefined}
              >
                <link.icon className="w-5 h-5 flex-shrink-0 transition-all duration-300 ease-in-out" />
                <span className={cn(
                  "transition-all duration-300 ease-in-out whitespace-nowrap",
                  isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                )}>
                  {link.name}
                </span>
              </Link>
            </li>
          ))}
           {/* Logout Button */}
           <li key="logout">
            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center gap-3 px-6 py-2 text-sm font-medium transition-all duration-300 ease-in-out w-full text-zinc-300 hover:bg-zinc-900 hover:text-white",
                "focus:outline-none"
              )}
              title={isCollapsed ? "Log Out" : undefined}
            >
              <LogOut className="w-5 h-5 flex-shrink-0 transition-all duration-300 ease-in-out" />
              <span className={cn(
                "transition-all duration-300 ease-in-out whitespace-nowrap",
                isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
              )}>
                Log Out
              </span>
            </button>
          </li>
          {/* Collapse/Expand nav item at the end of Main nav */}
          <li key="sidebar-toggle">
            <button
              onClick={onToggle}
              className={cn(
                "flex items-center gap-3 px-6 py-2 text-sm font-medium transition-all duration-300 ease-in-out w-full text-zinc-300 hover:bg-zinc-900 hover:text-white",
                "focus:outline-none"
              )}
              title={isCollapsed ? "Expand" : "Collapse"}
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5 flex-shrink-0 transition-all duration-300 ease-in-out" />
              ) : (
                <ChevronLeft className="w-5 h-5 flex-shrink-0 transition-all duration-300 ease-in-out" />
              )}
              <span className={cn(
                "transition-all duration-300 ease-in-out whitespace-nowrap",
                isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
              )}>
                {isCollapsed ? "Expand" : "Collapse"}
              </span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  )
} 