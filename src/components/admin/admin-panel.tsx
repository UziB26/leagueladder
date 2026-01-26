"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ConfirmationDialog, useConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { FormModal } from "@/components/ui/form-modal"
import { ErrorMessage } from "@/components/ui/error-state"
import { SuccessMessage } from "@/components/ui/success-state"
import { LoadingState } from "@/components/ui/loading-state"
import { parseDatabaseDate } from "@/lib/utils"

interface User {
  id: string
  email: string
  name: string | null
  is_admin: boolean
  created_at: string
}

interface League {
  id: string
  name: string
  game_type: string
  created_at: string
  member_count: number
}

interface Match {
  id: string
  player1_id: string
  player2_id: string
  league_id: string
  player1_score: number
  player2_score: number
  status: string
  winner_id?: string
  challenge_id?: string
  played_at?: string
  created_at: string
  player1_name?: string
  player2_name?: string
  league_name?: string
}

interface Stats {
  totalUsers: number
  totalPlayers: number
  totalLeagues: number
  totalMatches: number
  totalChallenges: number
  matches?: {
    total: number
    completed: number
    pending: number
    voided: number
  }
  challenges?: {
    total: number
    pending: number
    accepted: number
    completed: number
  }
  leagues?: any[]
  players?: {
    total: number
    active: number
    totalRatings: number
    averageRating: number
  }
  recentActivity?: {
    matches: number
    challenges: number
    users: number
  }
  topPlayers?: any[]
}

interface Player {
  id: string
  user_id: string
  name: string
  email: string
  avatar: string | null
  created_at: string
  user_email: string
  is_admin: boolean
  league_count: number
  match_count: number
}

interface PlayerRating {
  player_id: string
  league_id: string
  rating: number
  wins: number
  losses: number
  draws: number
  games_played: number
}

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'players' | 'leagues' | 'matches'>('overview')
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [leagues, setLeagues] = useState<League[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const deleteUserDialog = useConfirmationDialog()
  const deleteMatchDialog = useConfirmationDialog()
  const voidMatchDialog = useConfirmationDialog()
  const deletePlayerDialog = useConfirmationDialog()
  const unvoidMatchDialog = useConfirmationDialog()
  
  // Modal states for correction features
  const [adjustRatingModal, setAdjustRatingModal] = useState<{ open: boolean; playerId?: string; leagueId?: string; currentRating?: number; availableLeagues?: Array<{ league_id: string; league_name: string; rating: number }> }>({ open: false })
  const [editMatchScoreModal, setEditMatchScoreModal] = useState<{ open: boolean; match?: Match }>({ open: false })
  const [adjustStatsModal, setAdjustStatsModal] = useState<{ open: boolean; playerId?: string; leagueId?: string; stats?: PlayerRating }>({ open: false })

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError("")

      if (activeTab === 'overview') {
        const response = await fetch('/api/admin/stats')
        if (!response.ok) throw new Error('Failed to fetch stats')
        const data = await response.json()
        setStats(data)
      } else if (activeTab === 'users') {
        const response = await fetch('/api/admin/users')
        if (!response.ok) throw new Error('Failed to fetch users')
        const data = await response.json()
        setUsers(data.users || [])
      } else if (activeTab === 'players') {
        const response = await fetch('/api/admin/players')
        if (!response.ok) throw new Error('Failed to fetch players')
        const data = await response.json()
        setPlayers(data.players || [])
      } else if (activeTab === 'matches') {
        const response = await fetch('/api/admin/matches')
        if (!response.ok) throw new Error('Failed to fetch matches')
        const data = await response.json()
        setMatches(data.matches || [])
      } else if (activeTab === 'leagues') {
        const response = await fetch('/api/admin/leagues')
        if (!response.ok) throw new Error('Failed to fetch leagues')
        const data = await response.json()
        setLeagues(data.leagues || [])
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/toggle-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_admin: !currentStatus })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update admin status')
      }

      setSuccess(`User admin status ${!currentStatus ? 'granted' : 'revoked'}`)
      setTimeout(() => setSuccess(""), 3000)
      fetchData()
    } catch (err: any) {
      setError(err.message || 'Failed to update admin status')
      setTimeout(() => setError(""), 5000)
    }
  }

  const deleteUser = async (userId: string) => {
    deleteUserDialog.openDialog({
      title: "Delete User",
      message: "Are you sure you want to delete this user? This will permanently delete their account, player profile, and all associated data. This action cannot be undone.",
      confirmText: "Delete User",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE'
          })

          if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error || 'Failed to delete user')
          }

          setSuccess('User deleted successfully')
          setTimeout(() => setSuccess(""), 3000)
          fetchData()
        } catch (err: any) {
          setError(err.message || 'Failed to delete user')
          setTimeout(() => setError(""), 5000)
        }
      },
    })
  }

  const voidMatch = async (matchId: string) => {
    voidMatchDialog.openDialog({
      title: "Cancel Match",
      message: "Are you sure you want to cancel this match? This will revert player ratings (if applicable) and permanently delete the match. This action cannot be undone.",
      confirmText: "Cancel Match",
      cancelText: "Keep Match",
      variant: "destructive",
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/admin/matches/${matchId}/void`, {
            method: 'POST'
          })

          if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error || 'Failed to cancel match')
          }

          const data = await response.json()
          setSuccess(data.message || 'Match cancelled successfully')
          setTimeout(() => setSuccess(""), 3000)
          fetchData()
        } catch (err: any) {
          setError(err.message || 'Failed to cancel match')
          setTimeout(() => setError(""), 5000)
        }
      },
    })
  }

  const deleteMatch = async (matchId: string) => {
    deleteMatchDialog.openDialog({
      title: "Delete Match",
      message: "Are you sure you want to delete this match? This will permanently remove the match record and may affect player ratings. This action cannot be undone.",
      confirmText: "Delete Match",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/admin/matches/${matchId}`, {
            method: 'DELETE'
          })

          if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error || 'Failed to delete match')
          }

          setSuccess('Match deleted successfully')
          setTimeout(() => setSuccess(""), 3000)
          fetchData()
        } catch (err: any) {
          setError(err.message || 'Failed to delete match')
          setTimeout(() => setError(""), 5000)
        }
      },
    })
  }

  const deletePlayer = async (playerId: string) => {
    deletePlayerDialog.openDialog({
      title: "Delete Player",
      message: "Are you sure you want to delete this player? This will permanently delete their profile, ratings, and all associated data. This action cannot be undone.",
      confirmText: "Delete Player",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/admin/players/${playerId}`, {
            method: 'DELETE'
          })

          if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error || 'Failed to delete player')
          }

          setSuccess('Player deleted successfully')
          setTimeout(() => setSuccess(""), 3000)
          fetchData()
        } catch (err: any) {
          setError(err.message || 'Failed to delete player')
          setTimeout(() => setError(""), 5000)
        }
      },
    })
  }

  const unvoidMatch = async (matchId: string) => {
    unvoidMatchDialog.openDialog({
      title: "Un-void Match",
      message: "Are you sure you want to un-void this match? This will restore player ratings based on the match result. Ratings will be recalculated.",
      confirmText: "Un-void Match",
      cancelText: "Cancel",
      variant: "default",
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/admin/matches/${matchId}/unvoid`, {
            method: 'POST'
          })

          if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error || 'Failed to un-void match')
          }

          const data = await response.json()
          setSuccess(data.message || 'Match un-voided successfully')
          setTimeout(() => setSuccess(""), 3000)
          fetchData()
        } catch (err: any) {
          setError(err.message || 'Failed to un-void match')
          setTimeout(() => setError(""), 5000)
        }
      },
    })
  }

  const handleAdjustRating = async (formData: any) => {
    try {
      const { rating, reason, league_id } = formData
      const selectedLeagueId = league_id || adjustRatingModal.leagueId
      if (!adjustRatingModal.playerId || !selectedLeagueId) return

      const response = await fetch(`/api/admin/players/${adjustRatingModal.playerId}/ratings/${selectedLeagueId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: parseInt(rating), reason })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to adjust rating')
      }

      const data = await response.json()
      setSuccess(data.message || 'Rating adjusted successfully')
      setTimeout(() => setSuccess(""), 3000)
      setAdjustRatingModal({ open: false })
      fetchData()
    } catch (err: any) {
      setError(err.message || 'Failed to adjust rating')
      setTimeout(() => setError(""), 5000)
    }
  }

  const handleEditMatchScore = async (formData: any) => {
    try {
      const { player1_score, player2_score, reason } = formData
      if (!editMatchScoreModal.match) return

      const response = await fetch(`/api/admin/matches/${editMatchScoreModal.match.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          player1_score: parseInt(player1_score), 
          player2_score: parseInt(player2_score),
          reason 
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update match scores')
      }

      const data = await response.json()
      setSuccess(data.message || 'Match scores updated successfully')
      setTimeout(() => setSuccess(""), 3000)
      setEditMatchScoreModal({ open: false })
      fetchData()
    } catch (err: any) {
      setError(err.message || 'Failed to update match scores')
      setTimeout(() => setError(""), 5000)
    }
  }

  const handleAdjustStats = async (formData: any) => {
    try {
      if (!adjustStatsModal.playerId || !adjustStatsModal.leagueId) return

      const body: any = { reason: formData.reason }
      if (formData.wins) body.wins = parseInt(formData.wins)
      if (formData.losses) body.losses = parseInt(formData.losses)
      if (formData.draws) body.draws = parseInt(formData.draws)
      if (formData.games_played) body.games_played = parseInt(formData.games_played)

      const response = await fetch(`/api/admin/players/${adjustStatsModal.playerId}/stats/${adjustStatsModal.leagueId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to adjust stats')
      }

      const data = await response.json()
      setSuccess(data.message || 'Stats adjusted successfully')
      setTimeout(() => setSuccess(""), 3000)
      setAdjustStatsModal({ open: false })
      fetchData()
    } catch (err: any) {
      setError(err.message || 'Failed to adjust stats')
      setTimeout(() => setError(""), 5000)
    }
  }

  const openAdjustRatingModal = async (playerId: string, leagueId?: string) => {
    try {
      const response = await fetch(`/api/admin/players/${playerId}`)
      if (!response.ok) throw new Error('Failed to fetch player data')
      const data = await response.json()
      const availableLeagues = data.ratings?.map((r: any) => ({
        league_id: r.league_id,
        league_name: r.league_name,
        rating: r.rating
      })) || []
      
      if (availableLeagues.length === 0) {
        setError('Player has no league memberships')
        setTimeout(() => setError(""), 5000)
        return
      }

      // If leagueId provided, use it; otherwise use first league
      const selectedLeagueId = leagueId || availableLeagues[0].league_id
      const selectedRating = availableLeagues.find((r: any) => r.league_id === selectedLeagueId) || availableLeagues[0]
      
      setAdjustRatingModal({ 
        open: true, 
        playerId, 
        leagueId: selectedLeagueId, 
        currentRating: selectedRating.rating,
        availableLeagues
      })
    } catch (err: any) {
      setError(err.message || 'Failed to load player data')
      setTimeout(() => setError(""), 5000)
    }
  }

  const openAdjustStatsModal = async (playerId: string, leagueId: string) => {
    try {
      const response = await fetch(`/api/admin/players/${playerId}`)
      if (!response.ok) throw new Error('Failed to fetch player data')
      const data = await response.json()
      const stats = data.ratings?.find((r: any) => r.league_id === leagueId)
      if (stats) {
        setAdjustStatsModal({ open: true, playerId, leagueId, stats })
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load player data')
      setTimeout(() => setError(""), 5000)
    }
  }

  return (
    <div className="space-y-6">
      <ConfirmationDialog
        isOpen={deleteUserDialog.isOpen}
        onClose={deleteUserDialog.closeDialog}
        onConfirm={deleteUserDialog.handleConfirm}
        title={deleteUserDialog.config?.title || ""}
        message={deleteUserDialog.config?.message || ""}
        confirmText={deleteUserDialog.config?.confirmText}
        cancelText={deleteUserDialog.config?.cancelText}
        variant={deleteUserDialog.config?.variant}
      />
      <ConfirmationDialog
        isOpen={deleteMatchDialog.isOpen}
        onClose={deleteMatchDialog.closeDialog}
        onConfirm={deleteMatchDialog.handleConfirm}
        title={deleteMatchDialog.config?.title || ""}
        message={deleteMatchDialog.config?.message || ""}
        confirmText={deleteMatchDialog.config?.confirmText}
        cancelText={deleteMatchDialog.config?.cancelText}
        variant={deleteMatchDialog.config?.variant}
      />
      <ConfirmationDialog
        isOpen={voidMatchDialog.isOpen}
        onClose={voidMatchDialog.closeDialog}
        onConfirm={voidMatchDialog.handleConfirm}
        title={voidMatchDialog.config?.title || ""}
        message={voidMatchDialog.config?.message || ""}
        confirmText={voidMatchDialog.config?.confirmText}
        cancelText={voidMatchDialog.config?.cancelText}
        variant={voidMatchDialog.config?.variant}
      />
      <ConfirmationDialog
        isOpen={deletePlayerDialog.isOpen}
        onClose={deletePlayerDialog.closeDialog}
        onConfirm={deletePlayerDialog.handleConfirm}
        title={deletePlayerDialog.config?.title || ""}
        message={deletePlayerDialog.config?.message || ""}
        confirmText={deletePlayerDialog.config?.confirmText}
        cancelText={deletePlayerDialog.config?.cancelText}
        variant={deletePlayerDialog.config?.variant}
      />
      <ConfirmationDialog
        isOpen={unvoidMatchDialog.isOpen}
        onClose={unvoidMatchDialog.closeDialog}
        onConfirm={unvoidMatchDialog.handleConfirm}
        title={unvoidMatchDialog.config?.title || ""}
        message={unvoidMatchDialog.config?.message || ""}
        confirmText={unvoidMatchDialog.config?.confirmText}
        cancelText={unvoidMatchDialog.config?.cancelText}
        variant={unvoidMatchDialog.config?.variant}
      />
      
      {/* Rating Adjustment Modal */}
      <FormModal
        isOpen={adjustRatingModal.open}
        onClose={() => setAdjustRatingModal({ open: false })}
        onSubmit={handleAdjustRating}
        title="Adjust Player Rating"
        submitText="Adjust Rating"
      >
        {adjustRatingModal.availableLeagues && adjustRatingModal.availableLeagues.length > 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select League
            </label>
            <select
              name="league_id"
              required
              defaultValue={adjustRatingModal.leagueId}
              onChange={(e) => {
                const selectedLeague = adjustRatingModal.availableLeagues?.find(l => l.league_id === e.target.value)
                if (selectedLeague) {
                  setAdjustRatingModal({
                    ...adjustRatingModal,
                    leagueId: selectedLeague.league_id,
                    currentRating: selectedLeague.rating
                  })
                }
              }}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {adjustRatingModal.availableLeagues.map((league) => (
                <option key={league.league_id} value={league.league_id}>
                  {league.league_name} (Current: {league.rating})
                </option>
              ))}
            </select>
          </div>
        )}
        {adjustRatingModal.availableLeagues && adjustRatingModal.availableLeagues.length === 1 && (
          <div className="text-sm text-gray-400 mb-2">
            League: {adjustRatingModal.availableLeagues[0].league_name}
            <input type="hidden" name="league_id" value={adjustRatingModal.availableLeagues[0].league_id} />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Current Rating: {adjustRatingModal.currentRating || 'N/A'}
          </label>
          <input
            type="number"
            name="rating"
            required
            min="0"
            max="5000"
            defaultValue={adjustRatingModal.currentRating}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="New rating"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Reason (optional)
          </label>
          <textarea
            name="reason"
            rows={3}
            maxLength={500}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Reason for adjustment"
          />
        </div>
      </FormModal>

      {/* Edit Match Score Modal */}
      <FormModal
        isOpen={editMatchScoreModal.open}
        onClose={() => setEditMatchScoreModal({ open: false })}
        onSubmit={handleEditMatchScore}
        title="Edit Match Scores"
        submitText="Update Scores"
      >
        {editMatchScoreModal.match && (
          <>
            <div className="text-sm text-gray-300 mb-4">
              <p>{editMatchScoreModal.match.player1_name || 'Player 1'} vs {editMatchScoreModal.match.player2_name || 'Player 2'}</p>
              <p className="text-xs text-gray-400 mt-1">Current: {editMatchScoreModal.match.player1_score} - {editMatchScoreModal.match.player2_score}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {editMatchScoreModal.match.player1_name || 'Player 1'} Score
                </label>
                <input
                  type="number"
                  name="player1_score"
                  required
                  min="0"
                  max="1000"
                  defaultValue={editMatchScoreModal.match.player1_score}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {editMatchScoreModal.match.player2_name || 'Player 2'} Score
                </label>
                <input
                  type="number"
                  name="player2_score"
                  required
                  min="0"
                  max="1000"
                  defaultValue={editMatchScoreModal.match.player2_score}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reason (optional)
              </label>
              <textarea
                name="reason"
                rows={3}
                maxLength={500}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Reason for correction"
              />
            </div>
          </>
        )}
      </FormModal>

      {/* Adjust Stats Modal */}
      <FormModal
        isOpen={adjustStatsModal.open}
        onClose={() => setAdjustStatsModal({ open: false })}
        onSubmit={handleAdjustStats}
        title="Adjust Player Stats"
        submitText="Update Stats"
      >
        {adjustStatsModal.stats && (
          <>
            <div className="text-xs text-gray-400 mb-4">
              Current: {adjustStatsModal.stats.wins}W - {adjustStatsModal.stats.losses}L - {adjustStatsModal.stats.draws}D ({adjustStatsModal.stats.games_played} games)
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Wins
                </label>
                <input
                  type="number"
                  name="wins"
                  min="0"
                  defaultValue={adjustStatsModal.stats.wins}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Losses
                </label>
                <input
                  type="number"
                  name="losses"
                  min="0"
                  defaultValue={adjustStatsModal.stats.losses}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Draws
                </label>
                <input
                  type="number"
                  name="draws"
                  min="0"
                  defaultValue={adjustStatsModal.stats.draws}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Games Played
                </label>
                <input
                  type="number"
                  name="games_played"
                  min="0"
                  defaultValue={adjustStatsModal.stats.games_played}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reason (optional)
              </label>
              <textarea
                name="reason"
                rows={3}
                maxLength={500}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Reason for adjustment"
              />
            </div>
          </>
        )}
      </FormModal>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
      </div>

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

      {/* Tabs */}
      <div className="border-b border-gray-700">
        <nav className="flex space-x-8">
          {(['overview', 'users', 'players', 'leagues', 'matches'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState text="Loading admin data..." />
      ) : (
        <>
          {activeTab === 'overview' && stats && (
            <div className="space-y-6">
              {/* Basic Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-medium text-gray-400">Total Users</h3>
                  <p className="text-3xl font-bold text-white mt-2">{stats.totalUsers}</p>
                </div>
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-medium text-gray-400">Total Players</h3>
                  <p className="text-3xl font-bold text-white mt-2">{stats.totalPlayers}</p>
                </div>
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-medium text-gray-400">Total Leagues</h3>
                  <p className="text-3xl font-bold text-white mt-2">{stats.totalLeagues}</p>
                </div>
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-medium text-gray-400">Total Matches</h3>
                  <p className="text-3xl font-bold text-white mt-2">{stats.totalMatches}</p>
                </div>
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-medium text-gray-400">Total Challenges</h3>
                  <p className="text-3xl font-bold text-white mt-2">{stats.totalChallenges}</p>
                </div>
              </div>

              {/* Match Statistics */}
              {stats.matches && (
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Match Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Total</p>
                      <p className="text-2xl font-bold text-white">{stats.matches.total}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Completed</p>
                      <p className="text-2xl font-bold text-green-400">{stats.matches.completed}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Pending</p>
                      <p className="text-2xl font-bold text-yellow-400">{stats.matches.pending}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Voided</p>
                      <p className="text-2xl font-bold text-red-400">{stats.matches.voided}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              {stats.recentActivity && (
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Activity (Last 7 Days)</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">New Matches</p>
                      <p className="text-2xl font-bold text-white">{stats.recentActivity.matches}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">New Challenges</p>
                      <p className="text-2xl font-bold text-white">{stats.recentActivity.challenges}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">New Users</p>
                      <p className="text-2xl font-bold text-white">{stats.recentActivity.users}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Top Players */}
              {stats.topPlayers && stats.topPlayers.length > 0 && (
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Top Players by Rating</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-300">Player</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-300">League</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-300">Rating</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-300">Record</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {stats.topPlayers.map((player: any, index: number) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm text-white">{player.name}</td>
                            <td className="px-4 py-2 text-sm text-gray-300">{player.league_name}</td>
                            <td className="px-4 py-2 text-sm font-bold text-white">{player.rating}</td>
                            <td className="px-4 py-2 text-sm text-gray-300">
                              {player.wins}-{player.losses} ({player.games_played} games)
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Admin</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900 divide-y divide-gray-700">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.name || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {user.is_admin ? (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-900 text-green-300">Admin</span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-700 text-gray-300">User</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {parseDatabaseDate(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                            className="text-xs"
                          >
                            {user.is_admin ? 'Revoke Admin' : 'Make Admin'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteUser(user.id)}
                            className="text-xs bg-red-600 hover:bg-red-700 text-white border-red-600"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'players' && (
            <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Leagues</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Matches</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900 divide-y divide-gray-700">
                    {players.map((player) => (
                      <tr key={player.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{player.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{player.email || player.user_email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{player.league_count}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{player.match_count}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {parseDatabaseDate(player.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // For now, use first league - in production, you'd want a dropdown
                              const firstLeague = leagues[0]?.id || 'tt_league'
                              openAdjustRatingModal(player.id)
                            }}
                            className="text-xs bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                            title="Adjust rating (select league in modal)"
                          >
                            Adjust Rating
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const firstLeague = leagues[0]?.id || 'tt_league'
                              openAdjustStatsModal(player.id, firstLeague)
                            }}
                            className="text-xs bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                            title="Adjust stats (uses first league)"
                          >
                            Adjust Stats
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deletePlayer(player.id)}
                            className="text-xs bg-red-600 hover:bg-red-700 text-white border-red-600"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'leagues' && (
            <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Game Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Members</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900 divide-y divide-gray-700">
                    {leagues.map((league) => (
                      <tr key={league.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{league.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{league.game_type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{league.member_count}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {parseDatabaseDate(league.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'matches' && (
            <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Players</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">League</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900 divide-y divide-gray-700">
                    {matches.map((match) => (
                      <tr key={match.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="text-white font-medium">
                            {match.player1_name || 'Player 1'} vs {match.player2_name || 'Player 2'}
                          </div>
                          <div className="text-gray-400 text-xs font-mono mt-1">
                            {match.id.substring(0, 8)}...
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {match.league_name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                          {match.player1_score} - {match.player2_score}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            match.status === 'completed' 
                              ? 'bg-green-900 text-green-300' 
                              : match.status === 'voided'
                              ? 'bg-red-900 text-red-300'
                              : 'bg-yellow-900 text-yellow-300'
                          }`}>
                            {match.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {match.played_at 
                            ? parseDatabaseDate(match.played_at).toLocaleDateString()
                            : parseDatabaseDate(match.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {match.status === 'completed' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditMatchScoreModal({ open: true, match })}
                                className="text-xs bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                              >
                                Edit Score
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => voidMatch(match.id)}
                                className="text-xs bg-orange-600 hover:bg-orange-700 text-white border-orange-600"
                              >
                                Void
                              </Button>
                            </>
                          )}
                          {match.status === 'voided' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => unvoidMatch(match.id)}
                              className="text-xs bg-green-600 hover:bg-green-700 text-white border-green-600"
                            >
                              Un-void
                            </Button>
                          )}
                          {match.status !== 'voided' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditMatchScoreModal({ open: true, match })}
                              className="text-xs bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                            >
                              Edit Score
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteMatch(match.id)}
                            className="text-xs bg-red-600 hover:bg-red-700 text-white border-red-600"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
