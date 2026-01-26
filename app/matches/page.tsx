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
import Link from "next/link"
import { Button } from "@/components/ui/button"

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

    // Check if email is verified
    const user = session.user as { email_verified?: boolean; email?: string } | undefined
    if (user && !user.email_verified) {
      router.push('/auth/verify-email-required')
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
        const errorData = await response.json().catch(() => ({}))
        // If player doesn't exist, that's okay - they just need to join a league first
        if (response.status === 404) {
          setError('Please join a league first to access matches. Visit the Leagues page to get started.')
          setLoading(false)
          return
        }
        throw new Error(errorData.error || 'Failed to fetch player information')
      }
      const data = await response.json()
      if (!data.player?.id) {
        setError('Please join a league first to access matches. Visit the Leagues page to get started.')
        setLoading(false)
        return
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
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Join a League First</h2>
          <p className="text-gray-300 mb-6">
            {error.includes('join a league') ? error : 'You need to join a league before you can access matches. Join a league to create your player profile and start competing!'}
          </p>
          <Link href="/leagues">
            <Button className="w-full md:w-auto">
              Go to Leagues
            </Button>
          </Link>
        </div>
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
