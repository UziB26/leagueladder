"use client"

import { ReactNode } from "react"
import { useSwipeGestures } from "@/hooks/use-swipe-gestures"
import { cn } from "@/lib/utils"

interface SwipeAction {
  label: string
  color: string
  onAction: () => void
}

interface SwipeableCardProps {
  children: ReactNode
  onSwipeLeft?: SwipeAction
  onSwipeRight?: SwipeAction
  disabled?: boolean
  className?: string
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  disabled = false,
  className,
}: SwipeableCardProps) {
  const {
    elementRef,
    swipeOffset,
    isSwiping,
    swipeProgress,
    showAction,
    currentAction,
  } = useSwipeGestures({
    onSwipeLeft,
    onSwipeRight,
    disabled,
  })

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Background action */}
      {(showAction || isSwiping) && currentAction && (
        <div
          className={cn(
            "absolute inset-y-0 flex items-center justify-center z-0 transition-opacity duration-200",
            currentAction.color,
            showAction ? "opacity-100" : "opacity-50"
          )}
          style={{
            width: "100%",
            left: swipeOffset < 0 ? "auto" : "0",
            right: swipeOffset < 0 ? "0" : "auto",
          }}
        >
          <span className="text-white font-semibold text-lg px-6">
            {currentAction.label}
          </span>
        </div>
      )}

      {/* Card content */}
      <div
        ref={elementRef}
        className={cn(
          "relative z-10 bg-white transition-transform duration-200 ease-out",
          isSwiping && "select-none"
        )}
        style={{
          transform: `translateX(${swipeOffset}px)`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
