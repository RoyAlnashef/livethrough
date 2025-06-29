"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import LoginForm from "./login-form"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [initialAuthState, setInitialAuthState] = useState<'login' | 'signup'>("login")

  useEffect(() => {
    // Check localStorage for initial state when modal opens
    if (isOpen && typeof window !== 'undefined') {
      const stored = window.localStorage.getItem("authModalInitialState")
      if (stored === "signup" || stored === "login") {
        setInitialAuthState(stored)
      } else {
        setInitialAuthState("login")
      }
    }
  }, [isOpen])

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        onClose()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [onClose])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 bg-transparent border-none">
        <DialogTitle className="sr-only">Authentication</DialogTitle>
        <LoginForm initialAuthState={initialAuthState} />
      </DialogContent>
    </Dialog>
  )
} 