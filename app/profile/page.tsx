"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LoadingState } from "@/components/ui/loading-state"
import { ErrorState, ErrorMessage } from "@/components/ui/error-state"
import { SuccessMessage } from "@/components/ui/success-state"
import { PlayerProfile } from "@/components/player/player-profile"
import Link from "next/link"

interface Player {
  id: string
  name: string
  email?: string
  avatar?: string
  createdAt: string
}

interface Rating {
  id: string
  player_id: string
  league_id: string
  rating: number
  games_played: number
  wins: number
  losses: number
  draws: number
  updated_at: string
  league_name: string
  game_type: string
}

interface Match {
  id: string
  challenge_id?: string
  player1_id: string
  player2_id: string
  league_id: string
  player1_score: number
  player2_score: number
  winner_id?: string
  status: string
  played_at: string
  confirmed_at?: string
  league_name: string
  player1_name: string
  player2_name: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [player, setPlayer] = useState<Player | null>(null)
  const [ratings, setRatings] = useState<Rating[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [newName, setNewName] = useState("")
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/login')
      return
    }

    fetchProfile()
  }, [session, status, router])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      
      // Fetch current player
      const playerResponse = await fetch('/api/players/me')
      if (!playerResponse.ok) {
        throw new Error('Failed to fetch player')
      }
      const playerData = await playerResponse.json()
      setPlayer(playerData.player)
      setNewName(playerData.player.name)

      if (playerData.player?.id) {
        // Fetch player details with ratings and matches
        const detailsResponse = await fetch(`/api/players/${playerData.player.id}/matches?limit=20`)
        if (detailsResponse.ok) {
          const detailsData = await detailsResponse.json()
          setMatches(detailsData.matches || [])
        }

        // Fetch ratings
        const ratingsResponse = await fetch(`/api/players/${playerData.player.id}/ratings`)
        if (ratingsResponse.ok) {
          const ratingsData = await ratingsResponse.json()
          setRatings(ratingsData.ratings || [])
        }
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error)
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setEditing(true)
    setError("")
    setSuccess("")
  }

  const handleCancel = () => {
    setEditing(false)
    setNewName(player?.name || "")
    setError("")
    setSuccess("")
  }

  const handleSave = async () => {
    if (!newName.trim()) {
      setError("Name cannot be empty")
      return
    }

    if (newName.trim() === player?.name) {
      setEditing(false)
      return
    }

    setUpdating(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch('/api/players/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update name')
      }

      setPlayer({ ...player!, name: data.player.name })
      setSuccess('Username updated successfully!')
      setEditing(false)
      
      // Refresh the page data
      setTimeout(() => {
        fetchProfile()
      }, 500)
    } catch (error: any) {
      setError(error.message || 'Failed to update username')
    } finally {
      setUpdating(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <LoadingState text="Loading your profile..." fullScreen />
        </div>
      </main>
    )
  }

  if (!session) {
    return null
  }

  if (!player) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <ErrorState
            title="Profile not found"
            message="Unable to load your profile. Please try again."
            onRetry={fetchProfile}
            fullScreen
          />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                <img 
                  src="/APP LOGO.png" 
                  alt="League Ladder Logo" 
                  className="h-12 w-12 object-contain"
                  loading="eager"
                />
                My Profile
              </h1>
              <p className="text-gray-300 mt-2">Manage your profile and view your statistics</p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </header>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onDismiss={() => setError("")} />
          </div>
        )}

        {success && (
          <div className="mb-6">
            <SuccessMessage message={success} onDismiss={() => setSuccess("")} />
          </div>
        )}

        {/* Profile Edit Section */}
        <div className="bg-gray-900 p-6 rounded-lg shadow mb-8 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-white">Profile Information</h2>
            {!editing && (
              <Button onClick={handleEdit} variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                Edit Username
              </Button>
            )}
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-base font-medium text-white mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-gray-700 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your username"
                  maxLength={100}
                  disabled={updating}
                />
                <p className="text-sm text-gray-400 mt-1">
                  Your username will be visible to other players. Must be unique.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  disabled={updating || !newName.trim() || newName.trim() === player.name}
                  className="min-w-[100px]"
                >
                  {updating ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  disabled={updating}
                  className="text-white border-white hover:bg-white hover:text-black"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div>
                <span className="text-gray-400 text-sm">Username:</span>
                <p className="text-white text-lg font-medium">{player.name}</p>
              </div>
              {player.email && (
                <div>
                  <span className="text-gray-400 text-sm">Email:</span>
                  <p className="text-white text-lg">{player.email}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Player Profile Stats */}
        {player && (
          <PlayerProfile
            player={{
              id: player.id,
              user_id: player.id,
              name: player.name,
              email: player.email,
              avatar: player.avatar,
              created_at: player.createdAt
            }}
            ratings={ratings}
            matches={matches}
            adminActivities={[]}
          />
        )}
      </div>
    </main>
  )
}
