"use client"

import { AuthButton } from "@/components/auth/auth-button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

export function Navigation() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [pendingMatchesCount, setPendingMatchesCount] = useState(0)
  
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/')
  }

  useEffect(() => {
    if (session) {
      fetchPendingMatchesCount()
      // Refresh count periodically
      const interval = setInterval(fetchPendingMatchesCount, 30000) // Every 30 seconds
      
      // Listen for match reporting events to refresh count
      const handleMatchReported = () => {
        fetchPendingMatchesCount()
      }
      window.addEventListener('match:reported', handleMatchReported)
      
      return () => {
        clearInterval(interval)
        window.removeEventListener('match:reported', handleMatchReported)
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

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold">🏓</span>
            </div>
            <span className="text-xl font-bold text-gray-900">League Ladder</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/leaderboard" 
              className={`text-sm font-medium transition-colors ${
                isActive('/leaderboard') 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Leaderboard
            </Link>
            <Link 
              href="/leagues" 
              className={`text-sm font-medium transition-colors ${
                isActive('/leagues') 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Leagues
            </Link>
            <Link 
              href="/challenges" 
              className={`text-sm font-medium transition-colors ${
                isActive('/challenges') 
                  ? 'text-blue-600 font-semibold' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Challenges
            </Link>
            <Link 
              href="/matches" 
              className={`relative text-sm font-medium transition-colors ${
                isActive('/matches') 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Matches
              {pendingMatchesCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white min-w-[1.25rem] h-5">
                  {pendingMatchesCount > 9 ? '9+' : pendingMatchesCount}
                </span>
              )}
            </Link>
          </div>
        </div>
        
        <AuthButton />
      </div>
    </nav>
  )
}