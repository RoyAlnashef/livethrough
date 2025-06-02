"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, Sparkles, ArrowRight, ArrowLeft, User } from "lucide-react"

type AuthState = "login" | "signup" | "forgot-password"

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [authMode, setAuthMode] = useState<"password" | "magic">("password")
  const [authState, setAuthState] = useState<AuthState>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (authState === "forgot-password") {
      alert("Password reset link sent to your email!")
    } else if (authState === "signup") {
      if (authMode === "magic") {
        alert("Magic link sent to your email!")
      } else {
        alert("Account created successfully!")
      }
    } else {
      if (authMode === "magic") {
        alert("Magic link sent to your email!")
      } else {
        alert("Login successful!")
      }
    }

    setIsLoading(false)
  }

  const getTitle = () => {
    switch (authState) {
      case "signup":
        return "Create your account"
      case "forgot-password":
        return "Reset your password"
      default:
        return "Welcome to LiveThrough"
    }
  }

  const getDescription = () => {
    switch (authState) {
      case "signup":
        return authMode === "magic"
          ? "Enter your details to receive a magic link"
          : "Enter your details to create your account"
      case "forgot-password":
        return "Enter your email to receive a password reset link"
      default:
        return authMode === "magic" ? "Enter your email to receive a magic link" : "Sign in to your account to continue"
    }
  }

  const getButtonText = () => {
    switch (authState) {
      case "signup":
        return authMode === "magic" ? "Send Magic Link" : "Create Account"
      case "forgot-password":
        return "Send Reset Link"
      default:
        return authMode === "magic" ? "Send Magic Link" : "Sign In"
    }
  }

  return (
    <Card className="w-full shadow-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center pb-8">
        <div className="flex items-center justify-center mb-4">
          <img
            src="/images/logo-mark.svg"
            alt="LiveThrough"
            className="h-10 w-auto"
          />
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          {getTitle()}
        </CardTitle>
        <CardDescription className="text-zinc-400">{getDescription()}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {authState !== "forgot-password" && (
          <div className="flex rounded-lg bg-zinc-800 p-1">
            <button
              type="button"
              onClick={() => setAuthMode("password")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                authMode === "password" ? "bg-zinc-700 text-zinc-100 shadow-sm" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Lock className="w-4 h-4" />
              Password
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("magic")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                authMode === "magic" ? "bg-zinc-700 text-zinc-100 shadow-sm" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Magic Link
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {authState === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium text-zinc-200">
                Full name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10 h-11 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-zinc-500"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-zinc-200">
              Email address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-zinc-500"
                required
              />
            </div>
          </div>

          {authMode === "password" && authState !== "forgot-password" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-zinc-200">
                  Password
                </Label>
                {authState === "login" && (
                  <button
                    type="button"
                    onClick={() => setAuthState("forgot-password")}
                    className="text-sm text-zinc-400 hover:text-zinc-300 font-medium"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-zinc-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" x2="22" y1="2" y2="22" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}

          {authState === "signup" && authMode === "password" && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-200">
                Confirm password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-zinc-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-300"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" x2="22" y1="2" y2="22" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-gradient-to-r from-zinc-700 to-zinc-600 hover:from-zinc-600 hover:to-zinc-500 text-zinc-100 font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {getButtonText()}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        {authState === "forgot-password" && (
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => setAuthState("login")}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </button>
          </div>
        )}

        {authState !== "forgot-password" && (
          <p className="text-center text-sm text-zinc-400">
            {authState === "login" ? (
              <>
                {"Don't have an account? "}
                <button
                  type="button"
                  onClick={() => setAuthState("signup")}
                  className="font-medium text-zinc-300 hover:text-zinc-200"
                >
                  Sign up for free
                </button>
              </>
            ) : (
              <>
                {"Already have an account? "}
                <button
                  type="button"
                  onClick={() => setAuthState("login")}
                  className="font-medium text-zinc-300 hover:text-zinc-200"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  )
} 