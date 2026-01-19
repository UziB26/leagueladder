"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void | Promise<void>
  title: string
  children: React.ReactNode
  submitText?: string
  cancelText?: string
  variant?: "default" | "destructive"
  isLoading?: boolean
}

export function FormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  submitText = "Submit",
  cancelText = "Cancel",
  variant = "default",
  isLoading = false,
}: FormModalProps) {
  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: any = {}
    formData.forEach((value, key) => {
      data[key] = value
    })
    onSubmit(data)
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-900 rounded-lg shadow-xl border border-gray-700 max-w-md w-full p-6 animate-in fade-in zoom-in-95">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {children}
            <div className="flex gap-4 md:gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="text-white border-white hover:bg-white hover:text-black active:bg-gray-200"
              >
                {cancelText}
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                  variant === "destructive"
                    ? "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white"
                    : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white"
                )}
              >
                {isLoading ? "Processing..." : submitText}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
