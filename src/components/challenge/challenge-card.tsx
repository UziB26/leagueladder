"use client"

import { Challenge } from "@/types/database"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface ChallengeCardProps {
  challenge: Challenge
  currentPlayerId?: string
  onAccept?: (challengeId: string) => void
  onDecline?: (challengeId: string) => void
  onCancel?: (challengeId: string) => void
  onReportSuccess?: () => void
}

export function ChallengeCard({ 
  challenge, 
  currentPlayerId,
  onAccept,
  onDecline,
  onCancel,
  onReportSuccess
}: ChallengeCardProps) {
  const [loading, setLoading] = useState(false)
  const [reporting, setReporting] = useState(false)
  const [showReportForm, setShowReportForm] = useState(false)
  const [player1Score, setPlayer1Score] = useState("")
  const [player2Score, setPlayer2Score] = useState("")
  const [reportError, setReportError] = useState("")
  const router = useRouter()
  
  const isChallenger = challenge.challenger_id === currentPlayerId
  const isChallengee = challenge.challengee_id === currentPlayerId
  
  const handleAction = async (action: 'accept' | 'decline' | 'cancel') => {
    setLoading(true)
    try {
      if (action === 'accept' && onAccept) {
        await onAccept(challenge.id)
      } else if (action === 'decline' && onDecline) {
        await onDecline(challenge.id)
      } else if (action === 'cancel' && onCancel) {
        await onCancel(challenge.id)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReportScore = async () => {
    const p1Score = parseInt(player1Score)
    const p2Score = parseInt(player2Score)

    if (isNaN(p1Score) || isNaN(p2Score)) {
      setReportError('Please enter valid scores for both players')
      return
    }

    if (p1Score < 0 || p2Score < 0) {
      setReportError('Scores must be non-negative')
      return
    }

    setReporting(true)
    setReportError("")

    try {
      const response = await fetch(`/api/matches/from-challenge/${challenge.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player1Score: p1Score,
          player2Score: p2Score,
          status: 'completed'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to report match')
      }

      // Reset form
      setPlayer1Score("")
      setPlayer2Score("")
      setShowReportForm(false)
      
      // Trigger leaderboard refresh event
      window.dispatchEvent(new CustomEvent('leaderboard:refresh'))
      // Trigger match reported event for navigation badge
      window.dispatchEvent(new CustomEvent('match:reported'))
      
      // Refresh challenges or navigate
      if (onReportSuccess) {
        onReportSuccess()
      } else {
        router.refresh()
      }
    } catch (error: any) {
      console.error('Error reporting match:', error)
      setReportError(error.message || 'Failed to report match. Please try again.')
    } finally {
      setReporting(false)
    }
  }

  const getChallengerName = () => {
    if (isChallenger) return 'You'
    return challenge.challenger_name || 'Challenger'
  }

  const getChallengeeName = () => {
    if (isChallengee) return 'You'
    return challenge.challengee_name || 'Opponent'
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-blue-100 text-blue-800'
      case 'declined': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(challenge.status)}`}>
              {challenge.status.toUpperCase()}
            </span>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(challenge.created_at), { addSuffix: true })}
            </span>
          </div>
          <div className="font-medium text-black">
            {isChallenger ? 'You challenged' : 'Challenged by'} 
            <span className="font-bold mx-1">
              {isChallenger ? challenge.challengee_name || 'Opponent' : challenge.challenger_name || 'Opponent'}
            </span>
            {challenge.league_name && `in ${challenge.league_name}`}
          </div>
        </div>
        
        {challenge.expires_at && new Date(challenge.expires_at) < new Date() && (
          <span className="text-xs text-red-600 font-medium">EXPIRED</span>
        )}
      </div>
      
      {/* Action Buttons */}
      {challenge.status === 'pending' && (
        <div className="flex gap-2 mt-4">
          {isChallengee && (
            <>
              <Button
                size="sm"
                onClick={() => handleAction('accept')}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Accepting...' : 'Accept Challenge'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAction('decline')}
                disabled={loading}
              >
                Decline
              </Button>
            </>
          )}
          {isChallenger && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAction('cancel')}
              disabled={loading}
              className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
            >
              {loading ? 'Cancelling...' : 'Cancel Challenge'}
            </Button>
          )}
        </div>
      )}
      
      {challenge.status === 'accepted' && (
        <div className="mt-4">
          {!showReportForm ? (
            <>
              <div className="p-3 bg-blue-50 rounded text-sm mb-3">
                <div className="font-medium text-blue-800">Challenge Accepted!</div>
                <div className="text-blue-600 mt-1">
                  Schedule your match. Report the score when the match is complete.
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => setShowReportForm(true)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Report Score
              </Button>
            </>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="mb-3">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Enter match scores:
                </div>
                <div className="text-xs text-gray-600 mb-3">
                  {getChallengerName()} vs {getChallengeeName()}
                </div>
              </div>

              {reportError && (
                <div className="mb-3 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                  {reportError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {getChallengerName()} Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={player1Score ?? ''}
                    onChange={(e) => {
                      const val = e.target.value
                      if (val === '' || /^\d+$/.test(val)) {
                        setPlayer1Score(val)
                        setReportError("")
                      }
                    }}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="0"
                    disabled={reporting}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {getChallengeeName()} Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={player2Score ?? ''}
                    onChange={(e) => {
                      const val = e.target.value
                      if (val === '' || /^\d+$/.test(val)) {
                        setPlayer2Score(val)
                        setReportError("")
                      }
                    }}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="0"
                    disabled={reporting}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleReportScore}
                  disabled={reporting || !player1Score || !player2Score}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {reporting ? 'Reporting...' : 'Submit Score'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowReportForm(false)
                    setPlayer1Score("")
                    setPlayer2Score("")
                    setReportError("")
                  }}
                  disabled={reporting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}