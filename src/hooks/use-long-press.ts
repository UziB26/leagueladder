import { useRef, useCallback } from 'react'

interface UseLongPressOptions {
  onLongPress: (e: React.TouchEvent | React.MouseEvent) => void
  onClick?: (e: React.TouchEvent | React.MouseEvent) => void
  delay?: number
  threshold?: number
  disabled?: boolean
}

export function useLongPress({
  onLongPress,
  onClick,
  delay = 500,
  threshold = 10,
  disabled = false,
}: UseLongPressOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const targetRef = useRef<EventTarget | null>(null)
  const startPosRef = useRef<{ x: number; y: number } | null>(null)
  const hasMovedRef = useRef(false)

  const start = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (disabled) return

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

      targetRef.current = e.target
      startPosRef.current = { x: clientX, y: clientY }
      hasMovedRef.current = false

      timeoutRef.current = setTimeout(() => {
        if (!hasMovedRef.current && targetRef.current) {
          onLongPress(e)
        }
      }, delay)
    },
    [onLongPress, delay, disabled]
  )

  const clear = useCallback(
    (e: React.TouchEvent | React.MouseEvent, shouldTriggerClick = true) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      // Check if user moved too much
      if (startPosRef.current) {
        const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX
        const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY

        const deltaX = Math.abs(clientX - startPosRef.current.x)
        const deltaY = Math.abs(clientY - startPosRef.current.y)

        if (deltaX > threshold || deltaY > threshold) {
          hasMovedRef.current = true
        }
      }

      // Trigger click if it was a short press and not moved
      if (shouldTriggerClick && !hasMovedRef.current && onClick && targetRef.current) {
        onClick(e)
      }

      targetRef.current = null
      startPosRef.current = null
      hasMovedRef.current = false
    },
    [onClick, threshold]
  )

  const move = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!startPosRef.current) return

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

    const deltaX = Math.abs(clientX - startPosRef.current.x)
    const deltaY = Math.abs(clientY - startPosRef.current.y)

    if (deltaX > threshold || deltaY > threshold) {
      hasMovedRef.current = true
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [threshold])

  return {
    onMouseDown: (e: React.MouseEvent) => start(e),
    onMouseUp: (e: React.MouseEvent) => clear(e),
    onMouseLeave: (e: React.MouseEvent) => clear(e, false),
    onMouseMove: (e: React.MouseEvent) => move(e),
    onTouchStart: (e: React.TouchEvent) => start(e),
    onTouchEnd: (e: React.TouchEvent) => clear(e),
    onTouchCancel: (e: React.TouchEvent) => clear(e, false),
    onTouchMove: (e: React.TouchEvent) => move(e),
  }
}
