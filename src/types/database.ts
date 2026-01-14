export interface Player {
    id: string
    user_id?: string
    name: string
    email?: string
    avatar?: string
    created_at: string
  }
  
  export interface League {
    id: string
    name: string
    game_type: 'table-tennis' | 'fifa'
    created_at: string
  }
  
  export interface PlayerRating {
    id: string
    player_id: string
    league_id: string
    rating: number
    games_played: number
    wins: number
    losses: number
    draws: number
    updated_at: string
  }
  
  export interface Challenge {
    id: string
    challenger_id: string
    challengee_id: string
    league_id: string
    status: 'pending' | 'accepted' | 'declined' | 'completed'
    created_at: string
    expires_at?: string
    challenger_name?: string
    challengee_name?: string
    league_name?: string
  }
  
  export interface Match {
    id: string
    challenge_id?: string
    player1_id: string
    player2_id: string
    league_id: string
    player1_score: number
    player2_score: number
    winner_id?: string
    status: 'pending' | 'completed' | 'voided'
    played_at: string
    confirmed_at?: string
  }
  
  export interface LeaderboardEntry {
    id: string
    name: string
    avatar?: string
    email?: string
    rating: number
    games_played: number
    wins: number
    losses: number
    draws: number
  }