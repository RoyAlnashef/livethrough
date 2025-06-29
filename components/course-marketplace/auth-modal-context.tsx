"use client"

import { createContext, useContext, useState, useCallback } from "react"
import AuthModal from "./auth-modal"

interface AuthModalContextType {
  openAuthModal: (initialState?: "login" | "signup") => void
  closeAuthModal: () => void
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined)

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openAuthModal = useCallback((initialState?: "login" | "signup") => {
    if (typeof window !== "undefined" && initialState) {
      window.localStorage.setItem("authModalInitialState", initialState)
    }
    setIsOpen(true)
  }, [])

  const closeAuthModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <AuthModalContext.Provider value={{ openAuthModal, closeAuthModal }}>
      {children}
      <AuthModal isOpen={isOpen} onClose={closeAuthModal} />
    </AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  const context = useContext(AuthModalContext)
  if (context === undefined) {
    throw new Error("useAuthModal must be used within an AuthModalProvider")
  }
  return context
} 