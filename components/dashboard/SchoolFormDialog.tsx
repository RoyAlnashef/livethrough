// SchoolFormDialog.tsx
"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { SchoolForm } from "../dashboard/SchoolForm"
import type { School } from "@/lib/types"

interface SchoolFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "add" | "edit"
  initialValues?: Partial<School>
  onSubmit: (data: Partial<School>) => void
  isSubmitting?: boolean
}

export function SchoolFormDialog({ open, onOpenChange, mode, initialValues, onSubmit, isSubmitting }: SchoolFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-zinc-900 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New School" : "Edit School"}</DialogTitle>
          <DialogDescription>
            {mode === "add" ? "Register a new school for LiveThrough." : "Update the school information."}
          </DialogDescription>
        </DialogHeader>
        <SchoolForm
          mode={mode}
          initialValues={initialValues}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
        <DialogFooter>
          {/* Footer actions handled in SchoolForm */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
