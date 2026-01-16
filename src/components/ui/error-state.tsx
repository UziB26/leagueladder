"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ErrorStateProps {
  title?: string
  message?: string
  error?: Error | string | null
  action?: {
    label: string
    onClick: () => void
  }
  onRetry?: () => void
  className?: string
  fullScreen?: boolean
}

export function ErrorState({
  title = "Something went wrong",
  message,
  error,
  action,
  onRetry,
  className,
  fullScreen = false,
}: ErrorStateProps) {
  const errorMessage = 
    typeof error === 'string' 
      ? error 
      : error?.message 
      ? error.message 
      : message 
      ? message 
      : "An unexpected error occurred. Please try again."

  const content = (
    <div className={cn("text-center py-12 px-4", className)}>
      <div className="mb-4">
        <svg
          className="mx-auto h-12 w-12 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-400 mb-6 max-w-sm mx-auto">
        {errorMessage}
      </p>
      <div className="flex gap-4 md:gap-3 justify-center">
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-black active:bg-gray-200"
          >
            Try Again
          </Button>
        )}
        {action && (
          <Button
            onClick={action.onClick}
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-black"
          >
            {action.label}
          </Button>
        )}
      </div>
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

// Inline error message component
interface ErrorMessageProps {
  message: string
  onDismiss?: () => void
  className?: string
}

export function ErrorMessage({ message, onDismiss, className }: ErrorMessageProps) {
  return (
    <div
      className={cn(
        "bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg flex items-center justify-between",
        "animate-in slide-in-from-top-5 fade-in duration-300",
        className
      )}
      role="alert"
    >
      <div className="flex items-center gap-2">
        <svg
          className="h-5 w-5 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>{message}</span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-4 text-red-400 hover:text-red-300 hover:scale-110 active:scale-95 transition-transform duration-200"
          aria-label="Dismiss error"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
