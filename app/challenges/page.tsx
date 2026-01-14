"use client"

import { useState, useEffect } from "react"
import { ChallengeCard } from "@/components/challenge/challenge-card"
import { CreateChallengeForm } from "@/components/challenge/create-challenge-form"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Challenge } from "@/types/database"

export default function ChallengesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [currentPlayerId, setCurrentPlayerId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("incoming")

  useEffect(() => {
    if (!session) {
      router.push('/auth/login')
      return
    }
    fetchCurrentPlayer()
  }, [session, router])

  useEffect(() => {
    if (currentPlayerId) {
      fetchChallenges()
    }
  }, [currentPlayerId, activeTab])

  const fetchCurrentPlayer = async () => {
    try {
      const response = await fetch('/api/players/me')
      const data = await response.json()
      setCurrentPlayerId(data.player?.id || "")
    } catch (error) {
      console.error('Error fetching current player:', error)
    }
  }

  const fetchChallenges = async () => {
    setLoading(true)
    try {
      let endpoint = '/api/challenges/incoming'
      if (activeTab === 'outgoing') {
        endpoint = '/api/challenges/outgoing'
      } else if (activeTab === 'all') {
        endpoint = '/api/challenges'
      }
      
      const response = await fetch(endpoint)
      const data = await response.json()
      setChallenges(data.challenges || [])
    } catch (error) {
      console.error('Error fetching challenges:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (challengeId: string) => {
    try {
      const response = await fetch(`/api/challenges/${challengeId}/accept`, {
        method: 'POST'
      })
      
      if (response.ok) {
        fetchChallenges()
      }
    } catch (error) {
      console.error('Error accepting challenge:', error)
    }
  }

  const handleDecline = async (challengeId: string) => {
    try {
      const response = await fetch(`/api/challenges/${challengeId}/decline`, {
        method: 'POST'
      })
      
      if (response.ok) {
        fetchChallenges()
      }
    } catch (error) {
      console.error('Error declining challenge:', error)
    }
  }

  const handleCancel = async (challengeId: string) => {
    try {
      const response = await fetch(`/api/challenges/${challengeId}/cancel`, {
        method: 'POST'
      })
      
      if (response.ok) {
        fetchChallenges()
      }
    } catch (error) {
      console.error('Error cancelling challenge:', error)
    }
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Please login to view challenges</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-600">Challenges</h1>
        <p className="text-gray-900 font-medium mt-2">Challenge other players and manage your match requests</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Create Challenge */}
        <div className="lg:col-span-1">
          <CreateChallengeForm 
            currentPlayerId={currentPlayerId}
            onSuccess={fetchChallenges}
          />
          
          {/* Quick Stats */}
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Challenge Stats</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-white rounded">
                <div className="text-2xl font-bold text-blue-600">
                  {challenges.filter(c => c.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center p-3 bg-white rounded">
                <div className="text-2xl font-bold text-green-600">
                  {challenges.filter(c => c.status === 'accepted').length}
                </div>
                <div className="text-sm text-gray-600">Accepted</div>
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
                <div className="text-center py-12">Loading challenges...</div>
              ) : challenges.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="text-gray-400 mb-2">No incoming challenges</div>
                  <p className="text-gray-500">Other players can challenge you from your profile</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {challenges.map(challenge => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      currentPlayerId={currentPlayerId}
                      onAccept={handleAccept}
                      onDecline={handleDecline}
                      onCancel={handleCancel}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="outgoing" className="mt-4">
              {loading ? (
                <div className="text-center py-12">Loading challenges...</div>
              ) : challenges.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="text-gray-400 mb-2">No outgoing challenges</div>
                  <p className="text-gray-500">Create a challenge using the form on the left</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {challenges.map(challenge => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      currentPlayerId={currentPlayerId}
                      onAccept={handleAccept}
                      onDecline={handleDecline}
                      onCancel={handleCancel}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="all" className="mt-4">
              {loading ? (
                <div className="text-center py-12">Loading challenges...</div>
              ) : challenges.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="text-gray-400 mb-2">No challenges yet</div>
                  <p className="text-gray-500">Be the first to create a challenge!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {challenges.map(challenge => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      currentPlayerId={currentPlayerId}
                      onAccept={handleAccept}
                      onDecline={handleDecline}
                      onCancel={handleCancel}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
