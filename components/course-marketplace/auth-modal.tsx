"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import LoginForm from "./login-form"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 bg-transparent border-none">
        <DialogTitle className="sr-only">Authentication</DialogTitle>
        <LoginForm />
      </DialogContent>
    </Dialog>
  )
} 