"use client"
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Select from 'react-select'

interface Player {
  id: string
  name: string
  rating: number
}

interface League {
  id: string
  name: string
  game_type: string
}

interface CreateChallengeFormProps {
  currentPlayerId: string
  onSuccess?: () => void
}

export function CreateChallengeForm({ currentPlayerId, onSuccess }: CreateChallengeFormProps) {
  const [players, setPlayers] = useState<Player[]>([])
  const [leagues, setLeagues] = useState<League[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null)
  const [selectedLeague, setSelectedLeague] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchLeagues()
  }, [])

  useEffect(() => {
    fetchPlayers()
  }, [selectedLeague, currentPlayerId])

  const fetchPlayers = async () => {
    try {
      const url = selectedLeague 
        ? `/api/players/available?leagueId=${selectedLeague.value}`
        : '/api/players/available'
      const response = await fetch(url)
      
      // Check if response is OK and is JSON
      if (!response.ok) {
        const text = await response.text()
        console.error('API Error:', response.status, text)
        setError(`Failed to load players: ${response.status}`)
        setPlayers([])
        return
      }
      
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Non-JSON response:', text.substring(0, 200))
        setError('Server returned invalid response')
        setPlayers([])
        return
      }
      
      const data = await response.json()
      // Filter out current player and ensure we have valid data
      const filteredPlayers = (data.players || []).filter((p: Player) => p.id !== currentPlayerId)
      setPlayers(filteredPlayers)
      setError("") // Clear any previous errors
    } catch (error: any) {
      console.error('Error fetching players:', error)
      setError(`Error: ${error.message || 'Failed to fetch players'}`)
      setPlayers([])
    }
  }

  const fetchLeagues = async () => {
    try {
      const response = await fetch('/api/leagues')
      
      if (!response.ok) {
        const text = await response.text()
        console.error('API Error:', response.status, text)
        return
      }
      
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Non-JSON response:', text.substring(0, 200))
        return
      }
      
      const data = await response.json()
      setLeagues(data.leagues || [])
    } catch (error: any) {
      console.error('Error fetching leagues:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPlayer || !selectedLeague) {
      setError("Please select both a player and a league")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeeId: selectedPlayer.value,
          leagueId: selectedLeague.value
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create challenge')
      }

      setSuccess('Challenge created successfully!')
      setSelectedPlayer(null)
      setSelectedLeague(null)
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const playerOptions = players.map(player => ({
    value: player.id,
    label: `${player.name} (Rating: ${player.rating})`
  }))

  const leagueOptions = leagues.map(league => ({
    value: league.id,
    label: `${league.name} (${league.game_type})`
  }))

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 text-blue-600">Create New Challenge</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select League
          </label>
          <Select
            options={leagueOptions}
            value={selectedLeague}
            onChange={(newLeague) => {
              setSelectedLeague(newLeague)
              setSelectedPlayer(null) // Clear player selection when league changes
            }}
            placeholder="Choose a league..."
            isClearable
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Challenge Player
          </label>
          <Select
            options={playerOptions}
            value={selectedPlayer}
            onChange={setSelectedPlayer}
            placeholder="Select a player to challenge..."
            isClearable
            className="react-select-container"
            classNamePrefix="react-select"
          />
          <p className="text-sm text-gray-500 mt-1">
            {selectedLeague 
              ? `Players in ${selectedLeague.label}`
              : 'Select a league to see players in that league, or see all players'}
          </p>
          {players.length === 0 && (
            <p className="text-sm text-red-500 mt-1">
              No players available. Make sure you've joined a league.
            </p>
          )}
        </div>

        <div className="pt-4 border-t">
          <Button
            type="submit"
            className="w-full"
            disabled={loading || !selectedPlayer || !selectedLeague}
          >
            {loading ? 'Creating Challenge...' : 'Send Challenge'}
          </Button>
        </div>
      </form>
    </div>
  )
}