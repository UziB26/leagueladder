"use client"

import { AuthButton } from "@/components/auth/auth-button"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

export function Navigation() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [pendingMatchesCount, setPendingMatchesCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/')
  }

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (session) {
      fetchPendingMatchesCount()
      // Refresh count periodically
      const interval = setInterval(fetchPendingMatchesCount, 30000) // Every 30 seconds
      
      // Listen for match reporting and confirmation events to refresh count
      const handleMatchReported = () => {
        fetchPendingMatchesCount()
      }
      const handleMatchConfirmed = () => {
        fetchPendingMatchesCount()
      }
      window.addEventListener('match:reported', handleMatchReported)
      window.addEventListener('match:confirmed', handleMatchConfirmed)
      
      return () => {
        clearInterval(interval)
        window.removeEventListener('match:reported', handleMatchReported)
        window.removeEventListener('match:confirmed', handleMatchConfirmed)
      }
    } else {
      setPendingMatchesCount(0)
    }
  }, [session])

  const fetchPendingMatchesCount = async () => {
    try {
      const response = await fetch('/api/matches/pending-count')
      if (response.ok) {
        const data = await response.json()
        setPendingMatchesCount(data.count || 0)
      }
    } catch (error) {
      console.error('Error fetching pending matches count:', error)
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const navLinks = [
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/leagues', label: 'Leagues' },
    { href: '/challenges', label: 'Challenges' },
    { href: '/matches', label: 'Matches', badge: pendingMatchesCount > 0 ? pendingMatchesCount : undefined },
  ]

  if (session?.user && (session.user as { is_admin?: boolean }).is_admin) {
    navLinks.push({ href: '/admin', label: 'Admin' })
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-700 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60 safe-area-top">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 min-h-[44px] min-w-[44px] items-center justify-center">
            <div className="h-8 w-8 flex items-center justify-center">
              <img 
                src="/app logo.png" 
                alt="League Ladder Logo" 
                className="h-8 w-8 object-contain"
                loading="eager"
                decoding="async"
              />
            </div>
            <span className="text-xl font-bold text-white hidden sm:inline">League Ladder</span>
          </Link>
          
          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const badgeCount = typeof link.badge === 'number' ? link.badge : 0

              return (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`text-sm font-medium transition-colors min-h-[44px] flex items-center px-2 ${
                    isActive(link.href) 
                      ? 'text-blue-500' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {badgeCount > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white min-w-[1.25rem] h-5">
                      {badgeCount > 9 ? '9+' : badgeCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Mobile Hamburger Button - Visible on mobile, hidden on desktop */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          
          <AuthButton />
        </div>
      </div>
      
      {/* Mobile Menu - Visible when mobileMenuOpen is true */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-700 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
          <div className="container mx-auto px-4 py-2">
            {navLinks.map((link) => {
              const badgeCount = typeof link.badge === 'number' ? link.badge : 0

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block min-h-[44px] flex items-center px-4 py-3 text-base font-medium transition-colors rounded-md ${
                    isActive(link.href)
                      ? 'text-blue-500 bg-blue-900/30'
                      : 'text-gray-300 hover:bg-gray-800 active:bg-gray-700'
                  }`}
                >
                  <span className="flex items-center">
                    {link.label}
                    {badgeCount > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white min-w-[1.5rem] h-6">
                        {badgeCount > 9 ? '9+' : badgeCount}
                      </span>
                    )}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}