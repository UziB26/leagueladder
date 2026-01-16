"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface LoadingStateProps {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
  fullScreen?: boolean
}

export function LoadingState({
  size = "md",
  text,
  className,
  fullScreen = false,
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const spinner = (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
        "transition-all duration-300 ease-in-out",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
      style={{
        animation: "spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite",
      }}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          {spinner}
          {text && (
            <p className="mt-4 text-gray-400 text-sm">{text}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {spinner}
      {text && (
        <p className="mt-4 text-gray-400 text-sm">{text}</p>
      )}
    </div>
  )
}

// Spinner component for inline use
interface SpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
        "transition-all duration-300 ease-in-out",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
      style={{
        animation: "spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite",
      }}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Skeleton loader for content placeholders
interface SkeletonProps {
  className?: string
  lines?: number
}

export function Skeleton({ className, lines = 1 }: SkeletonProps) {
  if (lines === 1) {
    return (
      <div
        className={cn(
          "animate-pulse bg-gray-700 rounded",
          className || "h-4 w-full"
        )}
      />
    )
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "animate-pulse bg-gray-700 rounded",
            i === lines - 1 ? "w-3/4" : "w-full",
            className || "h-4"
          )}
        />
      ))}
    </div>
  )
}
