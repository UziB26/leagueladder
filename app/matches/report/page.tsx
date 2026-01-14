"use client"

import { useState, useEffect } from "react"
import { MatchReportForm } from "@/components/match/match-report-form"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function ReportMatchPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [currentPlayerId, setCurrentPlayerId] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) {
      router.push('/auth/login')
      return
    }
    fetchCurrentPlayer()
  }, [session, router])

  const fetchCurrentPlayer = async () => {
    try {
      const response = await fetch('/api/players/me')
      const data = await response.json()
      setCurrentPlayerId(data.player?.id || "")
    } catch (error) {
      console.error('Error fetching current player:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMatchReported = () => {
    // Redirect to matches page to see the updated history
    router.push('/matches')
  }

  if (!session) {
    return null
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-600">Report Match</h1>
        <p className="text-gray-900 font-medium mt-2">
          Enter the final scores for your accepted challenges. Ratings will be updated automatically.
        </p>
      </div>

      <div className="max-w-4xl">
        {currentPlayerId ? (
          <MatchReportForm 
            currentPlayerId={currentPlayerId}
            onSuccess={handleMatchReported}
          />
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center py-8 text-gray-500">
              Loading player information...
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
