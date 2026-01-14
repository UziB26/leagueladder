# Player Statistics & Rating Tracking

## Overview
The app tracks player ratings and win/loss statistics for each league they join.

## Initial Seed Rating

When a player joins a league:
- **Initial Rating**: 1000 (seed rating)
- **Games Played**: 0
- **Wins**: 0
- **Losses**: 0
- **Draws**: 0

This is implemented in `/app/api/leagues/join/route.ts`:

```typescript
db.prepare(`
  INSERT INTO player_ratings (
    id, player_id, league_id, rating, 
    games_played, wins, losses, draws
  ) 
  VALUES (?, ?, ?, 1000, 0, 0, 0, 0)
`).run(ratingId, player.id, leagueId)
```

## Statistics Tracking

### Database Schema
The `player_ratings` table stores:
- `rating` - Current Elo rating (starts at 1000)
- `games_played` - Total number of matches
- `wins` - Number of wins
- `losses` - Number of losses
- `draws` - Number of draws
- `updated_at` - Last update timestamp

### Updating Stats After Matches

The `src/lib/stats.ts` module provides functions to update statistics:

#### `updatePlayerStats(playerId, leagueId, result)`
Updates a single player's statistics after a match:
- Increments `games_played`
- Increments `wins`, `losses`, or `draws` based on result
- Updates `updated_at` timestamp

#### `recordMatchResult(player1Id, player2Id, leagueId, player1Score, player2Score, newPlayer1Rating, newPlayer2Rating)`
Complete match recording function that:
1. Determines winner/loser/draw based on scores
2. Updates stats for both players
3. Updates ratings for both players (after Elo calculation)

## Usage Example

```typescript
import { recordMatchResult } from '@/lib/stats'
import { elo } from '@/lib/elo'

// After calculating new ratings with Elo
const result = elo.calculateForMatch(
  player1Rating, 
  player2Rating, 
  player1Score, 
  player2Score
)

// Record the match and update all stats
recordMatchResult(
  player1Id,
  player2Id,
  leagueId,
  player1Score,
  player2Score,
  result.newRatingA,
  result.newRatingB
)
```

## Verification

To verify stats are being tracked:
1. Join a league - check that rating is 1000 and all stats are 0
2. Record a match - check that:
   - `games_played` increments for both players
   - `wins`/`losses`/`draws` update correctly
   - `rating` updates based on Elo calculation
   - `updated_at` timestamp is current

## Database Query Examples

```sql
-- Get player stats for a league
SELECT rating, games_played, wins, losses, draws
FROM player_ratings
WHERE player_id = ? AND league_id = ?

-- Get leaderboard with stats
SELECT 
  p.name,
  pr.rating,
  pr.games_played,
  pr.wins,
  pr.losses,
  pr.draws
FROM players p
JOIN player_ratings pr ON p.id = pr.player_id
WHERE pr.league_id = ?
ORDER BY pr.rating DESC
```
