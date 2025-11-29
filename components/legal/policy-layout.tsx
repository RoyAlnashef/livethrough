import React from 'react'

interface PolicyLayoutProps {
  title: string;
  lastUpdated: string;
  version: string;
  children: React.ReactNode;
}

export function PolicyLayout({ title, lastUpdated, version, children }: PolicyLayoutProps) {
  return (
    <article className="mx-auto max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-zinc-400 text-sm space-y-1 sm:space-y-0">
          <span>Last updated: {lastUpdated}</span>
          <span className="hidden sm:inline">•</span>
          <span>Version: {version}</span>
        </div>
      </header>
      
      <div className="prose prose-invert prose-lg max-w-none">
        <div className="text-zinc-300 leading-relaxed space-y-6">
          {children}
        </div>
      </div>
    </article>
  )
} 