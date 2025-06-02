"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/dashboard"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard"
            ? "text-black dark:text-white"
            : "text-muted-foreground"
        )}
      >
        Overview
      </Link>
      <Link
        href="/dashboard/customers"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard/customers"
            ? "text-black dark:text-white"
            : "text-muted-foreground"
        )}
      >
        Customers
      </Link>
      <Link
        href="/dashboard/products"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard/products"
            ? "text-black dark:text-white"
            : "text-muted-foreground"
        )}
      >
        Products
      </Link>
      <Link
        href="/dashboard/settings"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard/settings"
            ? "text-black dark:text-white"
            : "text-muted-foreground"
        )}
      >
        Settings
      </Link>
    </nav>
  )
} 