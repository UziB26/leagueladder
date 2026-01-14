"use client"

import { useState, useEffect } from "react"
import { MatchReportForm } from "@/components/match/match-report-form"
import { MatchHistory } from "@/components/match/match-history"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function MatchesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [currentPlayerId, setCurrentPlayerId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("history")

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
    // Refresh match history when a new match is reported
    if (activeTab === 'history') {
      // The MatchHistory component will refresh automatically
      // but we can trigger a refresh by changing the key or calling a refresh function
      setActiveTab('report')
      setTimeout(() => setActiveTab('history'), 100)
    }
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
        <h1 className="text-3xl font-bold text-blue-600">Matches</h1>
        <p className="text-gray-900 font-medium mt-2">
          Report match results and view your match history
        </p>
      </div>

      <Tabs defaultValue="history" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="history">Match History</TabsTrigger>
          <TabsTrigger value="report">Report Match</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="mt-4">
          {currentPlayerId ? (
            <MatchHistory currentPlayerId={currentPlayerId} limit={20} />
          ) : (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-center py-8 text-gray-500">
                Loading player information...
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="report" className="mt-4">
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
