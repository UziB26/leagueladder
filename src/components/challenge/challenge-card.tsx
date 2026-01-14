"use client"

import { Challenge } from "@/types/database"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"

interface ChallengeCardProps {
  challenge: Challenge
  currentPlayerId?: string
  onAccept?: (challengeId: string) => void
  onDecline?: (challengeId: string) => void
  onCancel?: (challengeId: string) => void
}

export function ChallengeCard({ 
  challenge, 
  currentPlayerId,
  onAccept,
  onDecline,
  onCancel 
}: ChallengeCardProps) {
  const [loading, setLoading] = useState(false)
  
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
          <div className="font-medium">
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
        <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
          <div className="font-medium text-blue-800">Challenge Accepted!</div>
          <div className="text-blue-600 mt-1">
            Schedule your match. The winner should report the score.
          </div>
        </div>
      )}
    </div>
  )
}