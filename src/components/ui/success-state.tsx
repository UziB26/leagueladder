"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SuccessStateProps {
  title?: string
  message?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
  fullScreen?: boolean
}

export function SuccessState({
  title = "Success!",
  message = "Operation completed successfully.",
  action,
  className,
  fullScreen = false,
}: SuccessStateProps) {
  const content = (
    <div className={cn("text-center py-12 px-4", className)}>
      <div className="mb-4">
        <svg
          className="mx-auto h-12 w-12 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-white mb-2">
        {title}
      </h3>
      {message && (
        <p className="text-gray-400 mb-6 max-w-sm mx-auto">
          {message}
        </p>
      )}
      {action && (
        <Button
          onClick={action.onClick}
          className="text-white border-white hover:bg-white hover:text-black"
        >
          {action.label}
        </Button>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        {content}
      </div>
    )
  }

  return content
}

// Inline success message component
interface SuccessMessageProps {
  message: string
  onDismiss?: () => void
  className?: string
}

export function SuccessMessage({ message, onDismiss, className }: SuccessMessageProps) {
  return (
    <div
      className={cn(
        "bg-green-900 border border-green-700 text-green-100 px-4 py-3 rounded-lg flex items-center justify-between",
        className
      )}
      role="alert"
    >
      <div className="flex items-center gap-2">
        <svg
          className="h-5 w-5 text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{message}</span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-4 text-green-400 hover:text-green-300"
          aria-label="Dismiss success message"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
