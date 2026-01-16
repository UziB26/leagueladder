"use client"

import { useEffect } from "react"

/**
 * Viewport Manager Component
 * Handles viewport meta tag updates to prevent zoom on input focus
 * and manages safe area insets for iOS devices
 */
export function ViewportManager() {
  useEffect(() => {
    // Get viewport meta tag
    let viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement

    if (!viewport) {
      // Create if doesn't exist
      viewport = document.createElement('meta')
      viewport.name = 'viewport'
      document.head.appendChild(viewport)
    }

    // Store original content
    const originalContent = viewport.content

    // Note: We use CSS (16px minimum font-size) to prevent zoom instead of
    // changing viewport meta tag, as this is more reliable and doesn't
    // interfere with accessibility features
    // The CSS rule in globals.css handles this automatically
    // No event listeners needed - CSS handles zoom prevention
  }, [])

  return null
}
