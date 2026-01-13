"use client"

import Link from "next/link"

import { AuthButton } from "../../../auth-button"

export function Navigation() {
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
            <Link href="/leagues" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Leagues
            </Link>
            <Link href="/leaderboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Leaderboard
            </Link>
            <Link href="/challenges" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Challenges
            </Link>
            <Link href="/matches" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Matches
            </Link>
          </div>
        </div>
        
        <AuthButton />
      </div>
    </nav>
  )
}