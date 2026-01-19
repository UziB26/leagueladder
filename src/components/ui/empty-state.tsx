"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
  variant?: 'default' | 'light' | 'dark'
}

export function EmptyState({
  title = "No items found",
  description,
  icon,
  action,
  className,
  variant = 'dark',
}: EmptyStateProps) {
  const defaultIcon = (
    <svg
      className="mx-auto h-16 w-16 md:h-12 md:w-12 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  )

  const textColor = variant === 'light' 
    ? 'text-gray-900' 
    : variant === 'dark' 
    ? 'text-white' 
    : 'text-gray-900'
  
  const descriptionColor = variant === 'light'
    ? 'text-gray-600'
    : variant === 'dark'
    ? 'text-gray-400'
    : 'text-gray-500'

  return (
    <div
      className={cn(
        "text-center py-12 md:py-8 px-4",
        className
      )}
    >
      <div className="mb-6 md:mb-4">
        {icon || defaultIcon}
      </div>
      <h3 className={cn(
        "text-xl md:text-lg font-semibold mb-3 md:mb-2",
        textColor
      )}>
        {title}
      </h3>
      {description && (
        <p className={cn(
          "mb-8 md:mb-6 max-w-sm mx-auto text-base md:text-sm",
          descriptionColor
        )}>
          {description}
        </p>
      )}
      {action && (
        <Button
          onClick={action.onClick}
          variant="outline"
          className={cn(
            variant === 'dark' 
              ? "text-white border-white hover:bg-white hover:text-black active:bg-gray-200"
              : "text-gray-900 border-gray-300 hover:bg-gray-100 active:bg-gray-200"
          )}
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}

// Specific empty state variants
interface EmptyListStateProps {
  itemName?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
  variant?: 'default' | 'light' | 'dark'
}

export function EmptyListState({
  itemName = "items",
  action,
  className,
  variant = 'dark',
}: EmptyListStateProps) {
  return (
    <EmptyState
      title={`No ${itemName} yet`}
      description={`Get started by creating your first ${itemName}.`}
      action={action}
      className={className}
      variant={variant}
      icon={
        <svg
          className="mx-auto h-16 w-16 md:h-12 md:w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      }
    />
  )
}

// Empty state for challenges
interface EmptyChallengesStateProps {
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyChallengesState({
  action,
  className,
}: EmptyChallengesStateProps) {
  return (
    <EmptyState
      title="No challenges yet"
      description="Challenge other players in your league to start competing. Create your first challenge to get started!"
      action={action}
      className={className}
      variant="dark"
      icon={
        <svg
          className="mx-auto h-16 w-16 md:h-12 md:w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      }
    />
  )
}

// Empty state for leaderboard
interface EmptyLeaderboardStateProps {
  leagueName?: string
  className?: string
}

export function EmptyLeaderboardState({
  leagueName,
  className,
}: EmptyLeaderboardStateProps) {
  return (
    <EmptyState
      title={leagueName ? `No players in ${leagueName} yet` : "No players in this league yet"}
      description="Be the first to join this league! Once players join and start playing matches, they'll appear on the leaderboard."
      className={className}
      variant="dark"
      icon={
        <svg
          className="mx-auto h-16 w-16 md:h-12 md:w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      }
    />
  )
}

// Empty state for matches
interface EmptyMatchesStateProps {
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
  message?: string
}

export function EmptyMatchesState({
  action,
  className,
  message,
}: EmptyMatchesStateProps) {
  return (
    <EmptyState
      title="No matches played yet"
      description={message || "Complete a match to see it here. Challenge another player or report a match result to get started!"}
      action={action}
      className={className}
      variant="dark"
      icon={
        <svg
          className="mx-auto h-16 w-16 md:h-12 md:w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      }
    />
  )
}

interface EmptySearchStateProps {
  searchTerm?: string
  onClear?: () => void
  className?: string
}

export function EmptySearchState({
  searchTerm,
  onClear,
  className,
}: EmptySearchStateProps) {
  return (
    <EmptyState
      title="No results found"
      description={
        searchTerm
          ? `We couldn't find any results for "${searchTerm}". Try adjusting your search.`
          : "Try adjusting your search criteria."
      }
      className={className}
      icon={
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
      action={
        onClear
          ? {
              label: "Clear search",
              onClick: onClear,
            }
          : undefined
      }
    />
  )
}
