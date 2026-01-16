"use client"

import { useState, useEffect } from "react"
import { MatchReportForm } from "@/components/match/match-report-form"
import { MatchHistory } from "@/components/match/match-history"
import { PendingConfirmations } from "@/components/match/pending-confirmations"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingState } from "@/components/ui/loading-state"
import { ErrorState } from "@/components/ui/error-state"
import { EmptyState } from "@/components/ui/empty-state"
import { PullToRefresh } from "@/components/ui/pull-to-refresh"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function MatchesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [currentPlayerId, setCurrentPlayerId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("history")
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (!session) {
      router.push('/auth/login')
      return
    }
    fetchCurrentPlayer()
  }, [session, router])

  const fetchCurrentPlayer = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/players/me')
      if (!response.ok) {
        throw new Error('Failed to fetch player information')
      }
      const data = await response.json()
      if (!data.player?.id) {
        throw new Error('Player profile not found')
      }
      setCurrentPlayerId(data.player.id)
    } catch (error: any) {
      console.error('Error fetching current player:', error)
      setError(error.message || 'Failed to load player information. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleMatchReported = () => {
    // Trigger refresh of match history by updating the key
    setRefreshKey(prev => prev + 1)
    // Switch to history tab to show the updated results
    setActiveTab('history')
  }

  if (!session) {
    return null
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingState text="Loading matches..." fullScreen />
      </div>
    )
  }

  if (error && !currentPlayerId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title="Failed to load matches"
          message={error}
          onRetry={fetchCurrentPlayer}
          fullScreen
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Matches</h1>
        <p className="text-gray-300 font-medium mt-2">
          Report match results and view your match history
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorState
            title="Error"
            message={error}
            onRetry={fetchCurrentPlayer}
          />
        </div>
      )}

      <Tabs defaultValue="confirmations" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="confirmations">Pending Confirmations</TabsTrigger>
          <TabsTrigger value="history">Match History</TabsTrigger>
          <TabsTrigger value="report">Report Match</TabsTrigger>
        </TabsList>
        
        <TabsContent value="confirmations" className="mt-4">
          <PullToRefresh 
            onRefresh={async () => {
              setRefreshKey(prev => prev + 1)
            }}
            className="min-h-[200px]"
          >
            <PendingConfirmations key={refreshKey} />
          </PullToRefresh>
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          {currentPlayerId ? (
            <PullToRefresh 
              onRefresh={async () => {
                setRefreshKey(prev => prev + 1)
              }}
              className="min-h-[200px]"
            >
              <MatchHistory 
                key={refreshKey}
                currentPlayerId={currentPlayerId}
                limit={20}
              />
            </PullToRefresh>
          ) : (
            <LoadingState text="Loading player information..." />
          )}
        </TabsContent>
        
        <TabsContent value="report" className="mt-4">
          {currentPlayerId ? (
            <MatchReportForm 
              currentPlayerId={currentPlayerId}
              onSuccess={handleMatchReported}
            />
          ) : (
            <LoadingState text="Loading player information..." />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
