"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ConfirmationDialog, useConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { ErrorMessage } from "@/components/ui/error-state"
import { SuccessMessage } from "@/components/ui/success-state"
import { LoadingState } from "@/components/ui/loading-state"

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
      } else if (activeTab === 'leagues') {
        const response = await fetch('/api/admin/leagues')
        if (!response.ok) throw new Error('Failed to fetch leagues')
        const data = await response.json()
        setLeagues(data.leagues || [])
      } else if (activeTab === 'matches') {
        const response = await fetch('/api/admin/matches')
        if (!response.ok) throw new Error('Failed to fetch matches')
        const data = await response.json()
        setMatches(data.matches || [])
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
      title: "Void Match",
      message: "Are you sure you want to void this match? This will revert player ratings to their previous values and mark the match as voided. This action can be undone by un-voiding the match.",
      confirmText: "Void Match",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/admin/matches/${matchId}/void`, {
            method: 'POST'
          })

          if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error || 'Failed to void match')
          }

          const data = await response.json()
          setSuccess(data.message || 'Match voided successfully')
          setTimeout(() => setSuccess(""), 3000)
          fetchData()
        } catch (err: any) {
          setError(err.message || 'Failed to void match')
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
                          {new Date(user.created_at).toLocaleDateString()}
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
                          {new Date(player.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                          {new Date(league.created_at).toLocaleDateString()}
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
                            ? new Date(match.played_at).toLocaleDateString()
                            : new Date(match.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {match.status === 'completed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => voidMatch(match.id)}
                              className="text-xs bg-orange-600 hover:bg-orange-700 text-white border-orange-600"
                            >
                              Void
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
