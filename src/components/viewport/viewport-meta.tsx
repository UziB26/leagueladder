"use client"

import { useEffect } from "react"

/**
 * Viewport Meta Tag Component
 * Ensures proper viewport meta tag is set with all necessary attributes
 */
export function ViewportMeta() {
  useEffect(() => {
    // Get or create viewport meta tag
    let viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement

    if (!viewport) {
      viewport = document.createElement('meta')
      viewport.name = 'viewport'
      document.head.appendChild(viewport)
    }

    // Set comprehensive viewport content
    // Allow scaling for accessibility, but prevent zoom on input focus via CSS (16px font-size)
    viewport.content = [
      'width=device-width',
      'initial-scale=1.0',
      'maximum-scale=5.0',
      'user-scalable=yes',
      'viewport-fit=cover',
      'interactive-widget=resizes-content',
    ].join(', ')

    // Add additional iOS meta tags if not present
    const metaTags = [
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'format-detection', content: 'telephone=no' },
    ]

    metaTags.forEach(({ name, content }) => {
      let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
      if (!tag) {
        tag = document.createElement('meta')
        tag.name = name
        document.head.appendChild(tag)
      }
      tag.content = content
    })
  }, [])

  return null
}
