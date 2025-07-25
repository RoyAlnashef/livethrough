"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, Sparkles, ArrowRight, ArrowLeft, User, Info } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import Image from "next/image"
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { validateEmail, validateRequired } from "@/lib/validation"
import { Checkbox } from "@/components/ui/checkbox"

type AuthState = "login" | "signup" | "forgot-password"

interface ValidationErrors {
  email?: string
  password?: string
  fullName?: string
}

interface LoginFormProps {
  initialAuthState?: AuthState
}

export default function LoginForm({ initialAuthState }: LoginFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [authMode, setAuthMode] = useState<"password" | "magic">("magic")
  const [authState, setAuthState] = useState<AuthState>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  // Add state for policy agreement
  const [agreedToPolicies, setAgreedToPolicies] = useState(true)
  // Add error state for policy agreement
  const [policyError, setPolicyError] = useState<string | undefined>(undefined)

  // Reset errors when auth state or mode changes
  useEffect(() => {
    setErrors({})
  }, [authState, authMode])

  useEffect(() => {
    // On mount, check for initialAuthState prop or localStorage
    let initial: AuthState = initialAuthState || "login"
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("authModalInitialState") as AuthState | null
      if (stored === "signup" || stored === "login") {
        initial = stored
        window.localStorage.removeItem("authModalInitialState")
      }
    }
    setAuthState(initial)
  }, [initialAuthState])

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Password is required"
    if (password.length < 8) return "Password must be at least 8 characters"
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter"
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter"
    if (!/[0-9]/.test(password)) return "Password must contain at least one number"
    if (!/[!@#$%^&*()\-_=+\[\]{};:'&quot;,.<>/?\\`~]/.test(password)) return "Password must contain at least one special character (!@#$%^&*()-_=+[]{};:'&quot;,&lt;.&gt;/?&#96;~)"
    return undefined
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    // Always validate email
    const emailError = validateEmail(email)
    if (emailError) newErrors.email = emailError

    // Validate password fields for password-based auth
    if (authMode === "password" && authState !== "forgot-password") {
      const passwordError = validatePassword(password)
      if (passwordError) newErrors.password = passwordError
    }

    // Validate full name for signup
    if (authState === "signup") {
      const fullNameError = validateRequired(fullName, "Full name")
      if (fullNameError) newErrors.fullName = fullNameError
    }

    // Validate policy agreement for signup
    if (authState === "signup" && !agreedToPolicies) {
      setPolicyError("You must agree to the terms, privacy, and cookie policies.")
      return false
    } else {
      setPolicyError(undefined)
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0 && (!policyError)
  }

  // Helper to sync user to users table
  const syncUserToTable = async (user: SupabaseUser, fullNameOverride?: string) => {
    if (!user) return
    const { data: existing, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()
    if (!existing && !fetchError) {
      await supabase.from('users').insert([
        {
          id: user.id,
          email: user.email,
          full_name: fullNameOverride || (user.user_metadata?.full_name as string) || '',
        },
      ])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      if (authState === "forgot-password") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })
        if (error) throw error
        toast.success("Password reset link sent to your email!")
      } else if (authState === "signup") {
        if (authMode === "magic") {
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
              emailRedirectTo: window.location.origin,
              data: {
                full_name: fullName,
              },
            },
          })
          if (error) throw error
          toast.success("Magic link sent to your email!")
        } else {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
              },
            },
          })
          if (error) throw error
          if (data.user) {
            await syncUserToTable(data.user, fullName)
          }
          toast.success("Account created successfully! Please check your email to confirm your account.")
        }
      } else {
        if (authMode === "magic") {
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
              emailRedirectTo: window.location.origin,
            },
          })
          if (error) throw error
          toast.success("Magic link sent to your email!")
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })
          if (error) throw error
          if (data && data.user) {
            await syncUserToTable(data.user)
          }
          toast.success("Login successful!")
        }
      }
    } catch (error) {
      console.error("Authentication error:", error)
      toast.error(error instanceof Error ? error.message : "An error occurred during authentication")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await syncUserToTable(session.user)

        // Check for admin role and redirect if necessary
        const { data: userData, error: roleError } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (roleError) {
          console.error("Error fetching user role on auth state change:", roleError)
        }

        if (userData?.role === 'admin') {
          router.push('/dashboard/courses')
        }
      }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const getTitle = () => {
    switch (authState) {
      case "signup":
        return "Sign Up"
      case "forgot-password":
        return "Reset your password"
      default:
        return "Log In"
    }
  }

  const getButtonText = () => {
    switch (authState) {
      case "signup":
        return authMode === "magic" ? "Send Magic Link" : "Create Account"
      case "forgot-password":
        return "Send Reset Link"
      default:
        return authMode === "magic" ? "Send Magic Link" : "Log In"
    }
  }

  return (
    <Card className="w-full shadow-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm gap-4">
      <CardHeader className="space-y-1 text-center py-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center mb-2"
        >
          <Image
            src="/images/logo-mark.svg"
            alt="LiveThrough"
            width={40}
            height={40}
            className="h-10 w-auto"
          />
        </motion.div>
        <motion.div
          key={authState}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            {getTitle()}
          </CardTitle>
        </motion.div>
      </CardHeader>

      <CardContent className="space-y-6">
        {authState !== "forgot-password" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex rounded-lg bg-zinc-800 p-1"
          >
            <button
              type="button"
              onClick={() => setAuthMode("magic")}
              disabled={isLoading}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                authMode === "magic" 
                  ? "bg-zinc-700 text-zinc-100 shadow-sm" 
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Sparkles className="w-4 h-4" />
              Magic Link
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("password")}
              disabled={isLoading}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                authMode === "password" 
                  ? "bg-zinc-700 text-zinc-100 shadow-sm" 
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Lock className="w-4 h-4" />
              Password
            </button>
          </motion.div>
        )}
        {/* CardDescription removed as requested */}

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {authState === "signup" && (
              <motion.div
                key="fullName"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
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
                    onChange={(e) => {
                      setFullName(e.target.value)
                      if (errors.fullName) {
                        setErrors(prev => ({ ...prev, fullName: undefined }))
                      }
                    }}
                    className={`pl-10 h-11 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-zinc-500 transition-all duration-200 ${
                      errors.fullName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                    required
                  />
                </div>
                <AnimatePresence>
                  {errors.fullName && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-sm text-red-500 mt-1"
                    >
                      {errors.fullName}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-2"
          >
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
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: undefined }))
                  }
                }}
                className={`pl-10 h-11 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-zinc-500 transition-all duration-200 ${
                  errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                }`}
                required
              />
            </div>
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm text-red-500 mt-1"
                >
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence mode="wait">
            {authMode === "password" && authState !== "forgot-password" && (
              <motion.div
                key="password"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-zinc-200 flex items-center gap-1">
                    Password
                    <Popover>
                      <PopoverTrigger asChild>
                        <button type="button" tabIndex={0} aria-label="Password requirements" className="ml-1 text-zinc-400 hover:text-zinc-200 focus:outline-none">
                          <Info className="w-4 h-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="bg-zinc-900 border-zinc-700 text-zinc-200 text-sm w-80">
                        <div className="font-semibold mb-2">Password requirements</div>
                        <ul className="list-disc pl-5 space-y-1 text-xs">
                          <li>At least 8 characters</li>
                          <li>At least 1 lowercase letter</li>
                          <li>At least 1 uppercase letter</li>
                          <li>At least 1 number</li>
                          <li>At least 1 special character (!@#$%^&*()-_=+[]{};&apos;&quot;,&lt;.&gt;/?&#96;~)</li>
                        </ul>
                      </PopoverContent>
                    </Popover>
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
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) {
                        setErrors(prev => ({ ...prev, password: undefined }))
                      }
                    }}
                    className={`pl-10 pr-10 h-11 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-zinc-500 ${
                      errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
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
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Policy Agreement Checkbox for Signup */}
          {authState === "signup" && (
            <div className="flex flex-col gap-1 py-2">
              <Label htmlFor="policy-agreement" className="flex items-center gap-2 text-sm text-zinc-200">
                <Checkbox
                  id="policy-agreement"
                  checked={agreedToPolicies}
                  onCheckedChange={checked => setAgreedToPolicies(!!checked)}
                  className="mr-2"
                  required
                />
                <span>
                  By signing up, I agree to the{' '}
                  <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300">terms of service</a>,{' '}
                  <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300">privacy policy</a>, and{' '}
                  <a href="/cookie-policy" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300">cookie policy</a>.
                </span>
              </Label>
              {policyError && (
                <span className="text-sm text-red-500">{policyError}</span>
              )}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
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
          </motion.div>
        </form>

        <AnimatePresence mode="wait">
          {authState === "forgot-password" ? (
            <motion.div
              key="forgot-password"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <button
                type="button"
                onClick={() => setAuthState("login")}
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 font-medium transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </button>
            </motion.div>
          ) : (
            <motion.p
              key="auth-toggle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="text-center text-sm text-zinc-400"
            >
              {authState === "login" ? (
                <>
                  {"Don't have an account? "}
                  <button
                    type="button"
                    onClick={() => setAuthState("signup")}
                    className="font-medium text-zinc-300 hover:text-zinc-200 transition-colors duration-200"
                  >
                    Sign up for free
                  </button>
                </>
              ) : (
                <>
                  {'Already have an account? '}
                  <button
                    type="button"
                    onClick={() => setAuthState("login")}
                    className="font-medium text-zinc-300 hover:text-zinc-200 transition-colors duration-200"
                  >
                    Log In
                  </button>
                </>
              )}
            </motion.p>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}