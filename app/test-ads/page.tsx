"use client"

import { AdSlot } from "@/components/ads"
import { Header } from "@/components/header"
import LiveThroughFooter from "@/components/LiveThroughFooter"

export default function TestAdsPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Ad Integration Test Page</h1>
        
        <div className="space-y-8">
          {/* Banner Ad Test */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Banner Ad (728x90)</h2>
            <div className="flex justify-center">
              <AdSlot
                slotId="test-banner-ad-slot"
                adUnitPath="/test/banner"
                size="banner"
                enabled={true}
              />
            </div>
          </section>

          {/* Content Ad Test */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Content Ad (300x250)</h2>
            <div className="flex justify-center">
              <AdSlot
                slotId="test-content-ad-slot"
                adUnitPath="/test/content"
                size="content"
                enabled={true}
              />
            </div>
          </section>

          {/* Sidebar Ad Test */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Sidebar Ad (300x250)</h2>
            <div className="flex justify-center">
              <AdSlot
                slotId="test-sidebar-ad-slot"
                adUnitPath="/test/sidebar"
                size="sidebar"
                enabled={true}
              />
            </div>
          </section>

          {/* Footer Ad Test */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Footer Ad (728x90)</h2>
            <div className="flex justify-center">
              <AdSlot
                slotId="test-footer-ad-slot"
                adUnitPath="/test/footer"
                size="footer"
                enabled={true}
              />
            </div>
          </section>

          {/* Test Content */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Test Content</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-zinc-300">
                This page is used to test the ad integration. The ads above should load if:
              </p>
              <ul className="text-zinc-300 list-disc list-inside space-y-2">
                <li>Google AdSense is properly configured</li>
                <li>User has given consent for marketing cookies</li>
                <li>No ad blocker is active</li>
                <li>Environment is production (ads are disabled in development)</li>
              </ul>
              <p className="text-zinc-300">
                If ads don't load, check the browser console for any error messages.
              </p>
            </div>
          </section>
        </div>
      </main>
      
      <LiveThroughFooter />
    </div>
  )
} 