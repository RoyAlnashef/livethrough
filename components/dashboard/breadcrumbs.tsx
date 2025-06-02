import Link from "next/link"
import { ChevronRight } from "lucide-react"

export function Breadcrumbs({ segments }: { segments: { name: string; href?: string }[] }) {
  return (
    <nav className="flex items-center text-sm text-zinc-400 mb-4" aria-label="Breadcrumb">
      {segments.map((segment, idx) => (
        <span key={segment.name} className="flex items-center">
          {idx > 0 && <ChevronRight className="mx-2 w-4 h-4 text-zinc-600" />}
          {segment.href ? (
            <Link href={segment.href} className="hover:underline text-zinc-300">
              {segment.name}
            </Link>
          ) : (
            <span className="text-zinc-400">{segment.name}</span>
          )}
        </span>
      ))}
    </nav>
  )
} 