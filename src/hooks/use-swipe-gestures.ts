import { useRef, useEffect, useState } from 'react'

interface SwipeAction {
  label: string
  color: string
  onAction: () => void
}

interface UseSwipeGesturesOptions {
  onSwipeLeft?: SwipeAction
  onSwipeRight?: SwipeAction
  threshold?: number
  disabled?: boolean
}

export function useSwipeGestures({
  onSwipeLeft,
  onSwipeRight,
  threshold = 100,
  disabled = false,
}: UseSwipeGesturesOptions) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const startX = useRef<number | null>(null)
  const currentAction = useRef<SwipeAction | null>(null)

  useEffect(() => {
    if (disabled || !elementRef.current) return

    const element = elementRef.current
    let touchStartX = 0
    let isDragging = false

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
      startX.current = touchStartX
      isDragging = true
      setIsSwiping(true)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || startX.current === null) return

      const currentX = e.touches[0].clientX
      const deltaX = currentX - startX.current

      // Determine which action to show
      if (deltaX < -threshold && onSwipeLeft) {
        currentAction.current = onSwipeLeft
      } else if (deltaX > threshold && onSwipeRight) {
        currentAction.current = onSwipeRight
      } else {
        currentAction.current = null
      }

      setSwipeOffset(deltaX)
    }

    const handleTouchEnd = () => {
      if (!isDragging) return

      isDragging = false
      const finalOffset = swipeOffset

      // Trigger action if threshold met
      if (Math.abs(finalOffset) >= threshold && currentAction.current) {
        currentAction.current.onAction()
      }

      // Reset
      startX.current = null
      setSwipeOffset(0)
      setIsSwiping(false)
      currentAction.current = null
    }

    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchmove', handleTouchMove, { passive: true })
    element.addEventListener('touchend', handleTouchEnd)
    element.addEventListener('touchcancel', handleTouchEnd)

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
      element.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [onSwipeLeft, onSwipeRight, threshold, disabled, swipeOffset])

  const swipeProgress = Math.min(Math.abs(swipeOffset) / threshold, 1)
  const showAction = Math.abs(swipeOffset) >= threshold

  return {
    elementRef,
    swipeOffset,
    isSwiping,
    swipeProgress,
    showAction,
    currentAction: currentAction.current,
  }
}
