import { useState, useRef, useEffect } from 'react'

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void
  threshold?: number
  resistance?: number
  disabled?: boolean
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  resistance = 2.5,
  disabled = false,
}: UsePullToRefreshOptions) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const startY = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (disabled || !containerRef.current) return

    const container = containerRef.current
    let touchStartY = 0
    let currentY = 0
    let isDragging = false

    const handleTouchStart = (e: TouchEvent) => {
      // Only trigger if at the top of the scrollable area
      if (container.scrollTop === 0) {
        touchStartY = e.touches[0].clientY
        isDragging = true
        startY.current = touchStartY
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || startY.current === null) return

      currentY = e.touches[0].clientY
      const deltaY = currentY - startY.current

      // Only allow pull down
      if (deltaY > 0) {
        e.preventDefault()
        setIsPulling(true)
        // Apply resistance after threshold
        const distance = deltaY > threshold 
          ? threshold + (deltaY - threshold) / resistance 
          : deltaY
        setPullDistance(distance)
      }
    }

    const handleTouchEnd = async () => {
      if (!isDragging) return

      isDragging = false
      startY.current = null

      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true)
        try {
          await onRefresh()
        } finally {
          setIsRefreshing(false)
        }
      }

      // Reset
      setIsPulling(false)
      setPullDistance(0)
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd)
    container.addEventListener('touchcancel', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
      container.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [onRefresh, threshold, resistance, disabled, pullDistance, isRefreshing])

  const pullProgress = Math.min(pullDistance / threshold, 1)
  const shouldShowIndicator = isPulling || isRefreshing

  return {
    containerRef,
    isPulling,
    isRefreshing,
    pullDistance,
    pullProgress,
    shouldShowIndicator,
  }
}
