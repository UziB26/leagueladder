"use client"

import { useEffect } from "react"
import { registerServiceWorker } from "@/lib/pwa-register"

export function PWAInitializer() {
  useEffect(() => {
    // Register service worker
    registerServiceWorker()

    // Add viewport meta tag for mobile if not present
    if (typeof document !== 'undefined') {
      let viewport = document.querySelector('meta[name="viewport"]')
      if (!viewport) {
        viewport = document.createElement('meta')
        viewport.setAttribute('name', 'viewport')
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover')
        document.head.appendChild(viewport)
      }

      // Add theme-color meta tag
      let themeColor = document.querySelector('meta[name="theme-color"]')
      if (!themeColor) {
        themeColor = document.createElement('meta')
        themeColor.setAttribute('name', 'theme-color')
        themeColor.setAttribute('content', '#2563eb')
        document.head.appendChild(themeColor)
      }

      // Add apple-mobile-web-app-capable meta tag
      let appleMobile = document.querySelector('meta[name="apple-mobile-web-app-capable"]')
      if (!appleMobile) {
        appleMobile = document.createElement('meta')
        appleMobile.setAttribute('name', 'apple-mobile-web-app-capable')
        appleMobile.setAttribute('content', 'yes')
        document.head.appendChild(appleMobile)
      }

      // Add apple-mobile-web-app-status-bar-style
      let appleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
      if (!appleStatusBar) {
        appleStatusBar = document.createElement('meta')
        appleStatusBar.setAttribute('name', 'apple-mobile-web-app-status-bar-style')
        appleStatusBar.setAttribute('content', 'black-translucent')
        document.head.appendChild(appleStatusBar)
      }
    }
  }, [])

  return null
}
