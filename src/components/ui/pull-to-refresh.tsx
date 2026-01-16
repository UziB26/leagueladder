"use client"

import { ReactNode } from "react"
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void
  children: ReactNode
  disabled?: boolean
  className?: string
}

export function PullToRefresh({
  onRefresh,
  children,
  disabled = false,
  className,
}: PullToRefreshProps) {
  const {
    containerRef,
    isPulling,
    isRefreshing,
    pullDistance,
    pullProgress,
    shouldShowIndicator,
  } = usePullToRefresh({
    onRefresh,
    disabled,
  })

  return (
    <div className={cn("relative", className)}>
      {/* Pull indicator */}
      {shouldShowIndicator && (
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-center z-50 pointer-events-none transition-all duration-200"
          style={{
            transform: `translateY(${Math.min(pullDistance, 80)}px)`,
            opacity: Math.min(pullProgress * 1.5, 1),
          }}
        >
          <div className="bg-gray-900 rounded-full p-3 shadow-lg border border-gray-700">
            <RefreshCw
              className={cn(
                "h-6 w-6 text-blue-500 transition-transform duration-200",
                isRefreshing && "animate-spin"
              )}
              style={{
                transform: `rotate(${pullProgress * 360}deg)`,
              }}
            />
          </div>
        </div>
      )}

      {/* Content container */}
      <div
        ref={containerRef}
        className={cn(
          "transition-transform duration-200 ease-out",
          isPulling && "select-none"
        )}
        style={{
          transform: shouldShowIndicator
            ? `translateY(${Math.min(pullDistance, 80)}px)`
            : "translateY(0)",
        }}
      >
        {children}
      </div>
    </div>
  )
}
