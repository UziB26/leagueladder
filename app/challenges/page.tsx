"use client"

import { useState, useEffect, useCallback } from "react"
import { ChallengeCard } from "@/components/challenge/challenge-card"
import { CreateChallengeForm } from "@/components/challenge/create-challenge-form"
import { Button } from "@/components/ui/button"
import { LoadingState } from "@/components/ui/loading-state"
import { ErrorState, ErrorMessage } from "@/components/ui/error-state"
import { SuccessMessage } from "@/components/ui/success-state"
import { EmptyState, EmptyChallengesState } from "@/components/ui/empty-state"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PullToRefresh } from "@/components/ui/pull-to-refresh"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Challenge } from "@/types/database"

export default function ChallengesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [currentPlayerId, setCurrentPlayerId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("incoming")

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
    }
  }

  const fetchChallenges = useCallback(async () => {
    setLoading(true)
    setFetchError(null)
    try {
      let endpoint = '/api/challenges/incoming'
      if (activeTab === 'outgoing') {
        endpoint = '/api/challenges/outgoing'
      } else if (activeTab === 'all') {
        endpoint = '/api/challenges'
      }
      
      const response = await fetch(endpoint)
      if (!response.ok) {
        throw new Error('Failed to fetch challenges')
      }
      const data = await response.json()
      setChallenges(data.challenges || [])
    } catch (error: any) {
      console.error('Error fetching challenges:', error)
      setFetchError(error.message || 'Failed to load challenges. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [activeTab])

  useEffect(() => {
    if (currentPlayerId) {
      fetchChallenges()
    }
  }, [currentPlayerId, fetchChallenges])

  // Listen for match confirmation to refresh challenges
  useEffect(() => {
    const handleMatchConfirmed = () => {
      // Refresh challenges when a match is confirmed (challenge status may have changed)
      if (currentPlayerId) {
        fetchChallenges()
      }
    }

    window.addEventListener('match:confirmed', handleMatchConfirmed)
    
    return () => {
      window.removeEventListener('match:confirmed', handleMatchConfirmed)
    }
  }, [currentPlayerId, fetchChallenges])

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleAccept = async (challengeId: string) => {
    try {
      setError("")
      const response = await fetch(`/api/challenges/${challengeId}/accept`, {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSuccess('Challenge accepted successfully!')
        setTimeout(() => setSuccess(""), 3000)
        fetchChallenges()
      } else {
        setError(data.error || 'Failed to accept challenge')
        setTimeout(() => setError(""), 5000)
      }
    } catch (error: any) {
      console.error('Error accepting challenge:', error)
      setError('Network error. Please try again.')
      setTimeout(() => setError(""), 5000)
    }
  }

  const handleDecline = async (challengeId: string) => {
    try {
      setError("")
      const response = await fetch(`/api/challenges/${challengeId}/decline`, {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSuccess('Challenge declined')
        setTimeout(() => setSuccess(""), 3000)
        fetchChallenges()
      } else {
        setError(data.error || 'Failed to decline challenge')
        setTimeout(() => setError(""), 5000)
      }
    } catch (error: any) {
      console.error('Error declining challenge:', error)
      setError('Network error. Please try again.')
      setTimeout(() => setError(""), 5000)
    }
  }

  const handleCancel = async (challengeId: string) => {
    try {
      setError("")
      const response = await fetch(`/api/challenges/${challengeId}/cancel`, {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSuccess('Challenge cancelled')
        setTimeout(() => setSuccess(""), 3000)
        fetchChallenges()
      } else {
        setError(data.error || 'Failed to cancel challenge')
        setTimeout(() => setError(""), 5000)
      }
    } catch (error: any) {
      console.error('Error cancelling challenge:', error)
      setError('Network error. Please try again.')
      setTimeout(() => setError(""), 5000)
    }
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title="Authentication required"
          message="Please login to view challenges"
          action={{
            label: "Go to Login",
            onClick: () => router.push('/auth/login')
          }}
          fullScreen
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-500">Challenges</h1>
        <p className="text-gray-300 font-medium mt-2">Challenge other players and manage your match requests</p>
      </div>

      {fetchError && (
        <div className="mb-4">
          <ErrorMessage message={fetchError} onDismiss={() => setFetchError(null)} />
        </div>
      )}

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} onDismiss={() => setError("")} />
        </div>
      )}

      {success && (
        <div className="mb-4">
          <SuccessMessage message={success} onDismiss={() => setSuccess("")} />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Create Challenge */}
        <div className="lg:col-span-1">
          <CreateChallengeForm 
            currentPlayerId={currentPlayerId}
            onSuccess={fetchChallenges}
          />
          
          {/* Quick Stats */}
          <div className="mt-6 bg-black border border-gray-700 p-4 rounded-lg">
            <h4 className="font-medium text-white mb-3">Challenge Stats</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-gray-900 rounded border border-gray-700">
                <div className="text-2xl font-bold text-blue-400">
                  {challenges.filter(c => c.status === 'pending').length}
                </div>
                <div className="text-sm text-white">Pending</div>
              </div>
              <div className="text-center p-3 bg-gray-900 rounded border border-gray-700">
                <div className="text-2xl font-bold text-green-400">
                  {challenges.filter(c => c.status === 'accepted').length}
                </div>
                <div className="text-sm text-white">Accepted</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Challenges List */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="incoming" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="incoming">Incoming</TabsTrigger>
              <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
              <TabsTrigger value="all">All Challenges</TabsTrigger>
            </TabsList>
            
            <TabsContent value="incoming" className="mt-4">
              {loading ? (
                <LoadingState text="Loading challenges..." />
              ) : challenges.length === 0 ? (
                <EmptyChallengesState
                  action={{
                    label: "Create Challenge",
                    onClick: () => setActiveTab("all")
                  }}
                />
              ) : (
                <PullToRefresh onRefresh={fetchChallenges} className="min-h-[200px]">
                  <div className="space-y-4">
                    {challenges.map(challenge => (
                      <ChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        currentPlayerId={currentPlayerId}
                        onAccept={handleAccept}
                        onDecline={handleDecline}
                        onCancel={handleCancel}
                        onReportSuccess={fetchChallenges}
                      />
                    ))}
                  </div>
                </PullToRefresh>
              )}
            </TabsContent>
            
            <TabsContent value="outgoing" className="mt-4">
              {loading ? (
                <LoadingState text="Loading challenges..." />
              ) : challenges.length === 0 ? (
                <EmptyChallengesState
                  action={{
                    label: "Create Challenge",
                    onClick: () => {} // Form is already visible on the left
                  }}
                />
              ) : (
                <PullToRefresh onRefresh={fetchChallenges} className="min-h-[200px]">
                  <div className="space-y-4">
                    {challenges.map(challenge => (
                      <ChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        currentPlayerId={currentPlayerId}
                        onAccept={handleAccept}
                        onDecline={handleDecline}
                        onCancel={handleCancel}
                        onReportSuccess={fetchChallenges}
                      />
                    ))}
                  </div>
                </PullToRefresh>
              )}
            </TabsContent>
            
            <TabsContent value="all" className="mt-4">
              {loading ? (
                <LoadingState text="Loading challenges..." />
              ) : challenges.length === 0 ? (
                <EmptyChallengesState
                  action={{
                    label: "Create Your First Challenge",
                    onClick: () => {} // Form is already visible on the left
                  }}
                />
              ) : (
                <PullToRefresh onRefresh={fetchChallenges} className="min-h-[200px]">
                  <div className="space-y-4">
                    {challenges.map(challenge => (
                      <ChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        currentPlayerId={currentPlayerId}
                        onAccept={handleAccept}
                        onDecline={handleDecline}
                        onCancel={handleCancel}
                        onReportSuccess={fetchChallenges}
                      />
                    ))}
                  </div>
                </PullToRefresh>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
