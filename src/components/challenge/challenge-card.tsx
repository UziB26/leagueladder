"use client"

import { Challenge } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/loading-state"
import { ConfirmationDialog, useConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { SwipeableCard } from "@/components/ui/swipeable-card"
import { ContextMenu } from "@/components/ui/context-menu"
import { formatDistanceToNow } from "date-fns"
import { parseDatabaseDate } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, X, MoreVertical, Trash2 } from "lucide-react"

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
  const confirmationDialog = useConfirmationDialog()
  
  const isChallenger = challenge.challenger_id === currentPlayerId
  const isChallengee = challenge.challengee_id === currentPlayerId
  
  const handleAction = async (action: 'accept' | 'decline' | 'cancel') => {
    // Show confirmation for cancel action
    if (action === 'cancel') {
      confirmationDialog.openDialog({
        title: "Cancel Challenge",
        message: "Are you sure you want to cancel this challenge? This action cannot be undone.",
        confirmText: "Cancel Challenge",
        cancelText: "Keep Challenge",
        variant: "destructive",
        onConfirm: async () => {
          setLoading(true)
          try {
            if (onCancel) {
              await onCancel(challenge.id)
            }
          } finally {
            setLoading(false)
          }
        },
      })
      return
    }

    setLoading(true)
    try {
      if (action === 'accept' && onAccept) {
        await onAccept(challenge.id)
      } else if (action === 'decline' && onDecline) {
        await onDecline(challenge.id)
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
      setReportError('Scores must be positive numbers')
      return
    }

    // Validate reasonable score limits
    const MAX_REASONABLE_SCORE = 1000
    if (p1Score > MAX_REASONABLE_SCORE || p2Score > MAX_REASONABLE_SCORE) {
      setReportError(`Scores must be reasonable numbers (max ${MAX_REASONABLE_SCORE})`)
      return
    }

    // Ensure at least one score is greater than 0
    if (p1Score === 0 && p2Score === 0) {
      setReportError('At least one player must have a score greater than 0')
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
          player2Score: p2Score
          // Status will be set to 'pending_confirmation' automatically (same as Matches page)
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
      
      // Refresh challenges to show updated status
      if (onReportSuccess) {
        onReportSuccess()
      } else {
        router.refresh()
      }
      
      // Navigate to matches page to see pending confirmation
      setTimeout(() => {
        router.push('/matches')
      }, 1000) // Small delay to show success message
    } catch (error: any) {
      console.error('Error reporting match:', error)
      if (error.message?.includes('fetch') || error.message?.includes('network')) {
        setReportError('Network error. Please check your connection and try again.')
      } else {
        setReportError(error.message || 'Failed to report match. Please try again.')
      }
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
      case 'pending': return 'bg-yellow-900/50 text-yellow-300 border border-yellow-700'
      case 'accepted': return 'bg-blue-900/50 text-blue-300 border border-blue-700'
      case 'declined': return 'bg-red-900/50 text-red-300 border border-red-700'
      case 'completed': return 'bg-green-900/50 text-green-300 border border-green-700'
      default: return 'bg-gray-800 text-gray-300 border border-gray-700'
    }
  }

  // Determine swipe actions based on challenge status and user role
  const getSwipeActions = () => {
    if (challenge.status === 'pending' && isChallengee) {
      return {
        onSwipeRight: {
          label: 'Accept',
          color: 'bg-green-600',
          onAction: () => handleAction('accept'),
        },
        onSwipeLeft: {
          label: 'Decline',
          color: 'bg-red-600',
          onAction: () => handleAction('decline'),
        },
      }
    }
    if (challenge.status === 'pending' && isChallenger) {
      return {
        onSwipeLeft: {
          label: 'Cancel',
          color: 'bg-red-600',
          onAction: () => handleAction('cancel'),
        },
      }
    }
    return {}
  }

  // Context menu options
  const getContextMenuOptions = () => {
    const options = []
    
    if (challenge.status === 'pending' && isChallengee) {
      options.push(
        {
          label: 'Accept Challenge',
          icon: <Check className="h-4 w-4" />,
          onClick: () => handleAction('accept'),
        },
        {
          label: 'Decline Challenge',
          icon: <X className="h-4 w-4" />,
          onClick: () => handleAction('decline'),
          variant: 'destructive' as const,
        }
      )
    }
    
    if (challenge.status === 'pending' && isChallenger) {
      options.push({
        label: 'Cancel Challenge',
        icon: <Trash2 className="h-4 w-4" />,
        onClick: () => handleAction('cancel'),
        variant: 'destructive' as const,
      })
    }

    if (challenge.status === 'accepted' && (isChallenger || isChallengee)) {
      options.push({
        label: 'Report Score',
        icon: <MoreVertical className="h-4 w-4" />,
        onClick: () => setShowReportForm(true),
      })
    }

    return options
  }

  const swipeActions = getSwipeActions()
  const contextMenuOptions = getContextMenuOptions()
  
  return (
    <>
      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={confirmationDialog.closeDialog}
        onConfirm={confirmationDialog.handleConfirm}
        title={confirmationDialog.config?.title || ""}
        message={confirmationDialog.config?.message || ""}
        confirmText={confirmationDialog.config?.confirmText}
        cancelText={confirmationDialog.config?.cancelText}
        variant={confirmationDialog.config?.variant}
        isLoading={loading}
      />
      <SwipeableCard
        onSwipeLeft={swipeActions.onSwipeLeft}
        onSwipeRight={swipeActions.onSwipeRight}
        disabled={loading || Object.keys(swipeActions).length === 0}
        className="rounded-lg"
      >
        <ContextMenu
          options={contextMenuOptions}
          disabled={loading || contextMenuOptions.length === 0}
        >
          <div className="bg-black border border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(challenge.status)}`}>
              {challenge.status.toUpperCase()}
            </span>
            <span className="text-sm text-gray-400">
              {formatDistanceToNow(parseDatabaseDate(challenge.created_at), { addSuffix: true })}
            </span>
          </div>
          <div className="font-medium text-white">
            {isChallenger ? 'You challenged' : 'Challenged by'} 
            <span className="font-bold mx-1">
              {isChallenger ? challenge.challengee_name || 'Opponent' : challenge.challenger_name || 'Opponent'}
            </span>
            {challenge.league_name && `in ${challenge.league_name}`}
          </div>
        </div>
        
        {challenge.expires_at && parseDatabaseDate(challenge.expires_at) < new Date() && (
          <span className="text-xs text-red-400 font-medium">EXPIRED</span>
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
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Accepting...
                  </>
                ) : (
                  'Accept Challenge'
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAction('decline')}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Declining...
                  </>
                ) : (
                  'Decline'
                )}
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
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Cancelling...
                </>
              ) : (
                'Cancel Challenge'
              )}
            </Button>
          )}
        </div>
      )}
      
      {challenge.status === 'accepted' && (
        <div className="mt-4">
          {!showReportForm ? (
            <>
              <div className="p-3 bg-blue-900/30 border border-blue-700 rounded text-sm mb-3">
                <div className="font-medium text-blue-300">Challenge Accepted!</div>
                <div className="text-blue-400 mt-1">
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
            <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
              <div className="mb-3">
                <div className="text-sm font-medium text-white mb-2">
                  Enter match scores:
                </div>
                <div className="text-xs text-gray-400 mb-3">
                  {getChallengerName()} vs {getChallengeeName()}
                </div>
              </div>

              {reportError && (
                <div className="mb-3 bg-red-900/30 border border-red-700 text-red-300 px-3 py-2 rounded text-sm">
                  {reportError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-base font-medium text-white mb-2">
                    {getChallengerName()} Score
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    enterKeyHint="next"
                    min="0"
                    value={player1Score ?? ''}
                    onChange={(e) => {
                      const val = e.target.value
                      if (val === '' || /^\d+$/.test(val)) {
                        setPlayer1Score(val)
                        setReportError("")
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const nextInput = e.currentTarget.parentElement?.parentElement?.querySelector<HTMLInputElement>('input[type="number"]:last-of-type')
                        nextInput?.focus()
                      }
                    }}
                    className="w-full px-4 py-3 text-base border border-gray-600 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="0"
                    disabled={reporting}
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-white mb-2">
                    {getChallengeeName()} Score
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    enterKeyHint="done"
                    min="0"
                    value={player2Score ?? ''}
                    onChange={(e) => {
                      const val = e.target.value
                      if (val === '' || /^\d+$/.test(val)) {
                        setPlayer2Score(val)
                        setReportError("")
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !reporting && player1Score && player2Score) {
                        e.preventDefault()
                        handleReportScore()
                      }
                    }}
                    className="w-full px-4 py-3 text-base border border-gray-600 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="0"
                    disabled={reporting}
                  />
                </div>
              </div>

              <div className="flex gap-3 md:gap-2">
                <Button
                  size="sm"
                  onClick={handleReportScore}
                  disabled={reporting || !player1Score || !player2Score}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                >
                  {reporting ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Reporting...
                    </>
                  ) : (
                    'Submit Score'
                  )}
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
                  className="active:bg-gray-200"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
            </div>
          </ContextMenu>
        </SwipeableCard>
    </>
  )
}