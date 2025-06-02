"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Mail, ArrowRight, AlertCircle } from "lucide-react"

export default function ComingSoonPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to subscribe')
      }

      setIsSubmitted(true)
      setEmail("")
    } catch (error) {
      console.error('Subscription error:', error)
      setError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-50">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-4xl mx-auto text-center space-y-12">
          {/* Hero Content */}
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex justify-center mb-8">
                <Image
                  src="/images/livethrough-logo-lockup-red.svg"
                  alt="LiveThrough"
                  width={211}
                  height={32}
                  className="h-8 w-auto"
                  priority
                />
              </div>
          </div>

          {/* Email Subscription Form */}
          <Card className="max-w-2xl mx-auto bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-12">

              {/* Title */}
              <h1 className="text-3xl md:text-4xl sm:text-4xl font-bold text-white leading-tight mb-4">
                Learn To <span className="text-red-500">Survive Anything</span>
              </h1>
              
                <p className="text-xl text-zinc-300 max-w-[560px] leading-relaxed mx-auto mb-6">
                  LiveThrough is a markeplace for survival, tactical, and subsistence living courses in the U.S.
                </p>
              
              {(error || isSubmitted) && (
                <div className="w-full h-px bg-white/10 my-8" />
              )}

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 transform -translate-y-1/2 text-zinc-400 h-6 w-6" />
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-16 h-16 text-lg bg-white/5 border-white/20 text-white placeholder:text-zinc-400 focus:border-red-500/50 focus:ring-red-500/20 rounded-xl"
                        required
                      />
                    </div>
                    {error && (
                      <div className="flex items-center gap-2 text-red-400 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                      </div>
                    )}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-16 bg-teal-600 hover:bg-teal-700 text-white text-lg font-semibold rounded-xl"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Subscribing...
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          Notify me when it&apos;s ready
                          <ArrowRight className="h-5 w-5" />
                        </div>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-zinc-500 text-center">
                    * We&apos;d spam or sell your info *
                  </p>
                </form>
              ) : (
                <div className="text-center space-y-6">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-3">You&apos;re on the list!</h3>
                    <p className="text-lg text-zinc-200">
                      We&apos;ll notify you as soon as LiveThrough.co is ready.
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="text-zinc-400 hover:text-white text-lg h-12"
                  >
                    Subscribe another email
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="pt-12">
            <p className="text-zinc-500 text-lg">© 2025 LiveThrough.co</p>
          </div>
        </div>
      </div>
    </div>
  )
}
