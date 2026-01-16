"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)

  useEffect(() => {
    setIsTransitioning(true)
    
    const timer = setTimeout(() => {
      setDisplayChildren(children)
      // Small delay before showing to allow content to render
      setTimeout(() => {
        setIsTransitioning(false)
      }, 50)
    }, 150) // Half of transition duration

    return () => clearTimeout(timer)
  }, [pathname])

  // Update children when they change (but don't trigger transition)
  useEffect(() => {
    if (!isTransitioning) {
      setDisplayChildren(children)
    }
  }, [children, isTransitioning])

  return (
    <div
      className={cn(
        "transition-opacity duration-300 ease-in-out",
        "transform transition-transform duration-300 ease-in-out",
        isTransitioning 
          ? "opacity-0 translate-y-2" 
          : "opacity-100 translate-y-0"
      )}
    >
      {displayChildren}
    </div>
  )
}
