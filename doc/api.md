# League Ladder API Documentation

This document describes all available API endpoints for the League Ladder application.

## Base URL

All API endpoints are prefixed with `/api`
http://192.168.1.53:3000

---

## Authentication

Most endpoints require authentication via NextAuth.js. Authentication is handled through session cookies.

---

## Endpoints

### Health Check

#### `GET /api/health`

Check if the API is running.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "league-ladder-api"
}
```

**Status Codes:**
- `200` - Service is healthy

---

### Leagues

#### `GET /api/leagues`

Get all available leagues.

**Authentication:** Not required

**Response:**
```json
{
  "leagues": [
    {
      "id": "fifa_league",
      "name": "FIFA League",
      "game_type": "fifa",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "tt_league",
      "name": "Table Tennis League",
      "game_type": "table-tennis",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

#### `POST /api/leagues/join`

Join a league. Creates a player profile if one doesn't exist and initializes rating at 1000.

**Authentication:** Required

**Request Body:**
```json
{
  "leagueId": "fifa_league"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully joined league"
}
```

**Error Responses:**

```json
{
  "error": "Unauthorized"
}
```
Status: `401` - User not authenticated

```json
{
  "error": "League ID is required"
}
```
Status: `400` - Missing leagueId

```json
{
  "error": "User not found"
}
```
Status: `404` - User doesn't exist in database

```json
{
  "error": "Already joined this league"
}
```
Status: `400` - Player is already a member

```json
{
  "error": "Failed to join league"
}
```
Status: `500` - Server error

---

#### `GET /api/leagues/[leagueId]/membership`

Check if the current authenticated user is a member of a specific league.

**Authentication:** Optional (returns `isMember: false` if not authenticated)

**Path Parameters:**
- `leagueId` - The ID of the league (e.g., `fifa_league`, `tt_league`)

**Response:**
```json
{
  "isMember": true
}
```

**Status Codes:**
- `200` - Success (always returns, even if not authenticated)

---

#### `GET /api/leagues/[leagueId]/stats`

Get statistics for a specific league.

**Authentication:** Not required

**Path Parameters:**
- `leagueId` - The ID of the league (e.g., `fifa_league`, `tt_league`)

**Response:**
```json
{
  "playerCount": 15
}
```

**Status Codes:**
- `200` - Success

---

### Leaderboard

#### `GET /api/leaderboard/[leagueId]`

Get the leaderboard for a specific league with player rankings.

**Authentication:** Not required

**Path Parameters:**
- `leagueId` - The ID of the league (e.g., `fifa_league`, `tt_league`)

**Response:**
```json
{
  "league": {
    "id": "fifa_league",
    "name": "FIFA League",
    "game_type": "fifa",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "players": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": null,
      "rating": 1250,
      "games_played": 10,
      "wins": 7,
      "losses": 3,
      "draws": 0
    }
  ],
  "count": 15,
  "totalRating": 15000,
  "totalGames": 120
}
```

**Error Responses:**

```json
{
  "error": "League not found"
}
```
Status: `404` - League doesn't exist

```json
{
  "error": "Failed to fetch leaderboard"
}
```
Status: `500` - Server error

---

### Players

#### `GET /api/players/[playerId]`

Get detailed information about a specific player, including ratings across all leagues and match history.

**Authentication:** Not required

**Path Parameters:**
- `playerId` - The UUID of the player

**Response:**
```json
{
  "player": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "660e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": null,
    "created_at": "2024-01-10T10:00:00.000Z"
  },
  "ratings": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "player_id": "550e8400-e29b-41d4-a716-446655440000",
      "league_id": "fifa_league",
      "rating": 1250,
      "games_played": 10,
      "wins": 7,
      "losses": 3,
      "draws": 0,
      "updated_at": "2024-01-15T10:00:00.000Z",
      "league_name": "FIFA League",
      "game_type": "fifa"
    }
  ],
  "matches": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440000",
      "challenge_id": null,
      "player1_id": "550e8400-e29b-41d4-a716-446655440000",
      "player2_id": "990e8400-e29b-41d4-a716-446655440000",
      "league_id": "fifa_league",
      "player1_score": 3,
      "player2_score": 1,
      "winner_id": "550e8400-e29b-41d4-a716-446655440000",
      "status": "completed",
      "played_at": "2024-01-15T09:00:00.000Z",
      "confirmed_at": "2024-01-15T09:05:00.000Z",
      "league_name": "FIFA League",
      "player1_name": "John Doe",
      "player2_name": "Jane Smith"
    }
  ],
  "stats": {
    "totalGames": 10,
    "totalWins": 7,
    "totalLosses": 3,
    "totalDraws": 0
  }
}
```

**Error Responses:**

```json
{
  "error": "Player not found"
}
```
Status: `404` - Player doesn't exist

```json
{
  "error": "Failed to fetch player data"
}
```
Status: `500` - Server error

---

### Authentication

#### `GET /api/auth/[...nextauth]`
#### `POST /api/auth/[...nextauth]`

NextAuth.js authentication endpoints. Handles login, logout, and session management.

**Endpoints:**
- `GET /api/auth/signin` - Sign in page
- `POST /api/auth/signin` - Sign in request
- `GET /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session
- `GET /api/auth/csrf` - Get CSRF token

**Request Example (Sign In):**
```json
POST /api/auth/signin/credentials
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "redirect": false
}
```

**Response Example:**
```json
{
  "ok": true,
  "status": 200,
  "url": null,
  "error": null
}
```

---

## Data Models

### League
```typescript
{
  id: string;              // Unique league identifier (e.g., "fifa_league")
  name: string;           // Display name (e.g., "FIFA League")
  game_type: string;      // "fifa" or "table-tennis"
  created_at: string;     // ISO 8601 timestamp
}
```

### Player
```typescript
{
  id: string;             // UUID
  user_id: string;       // UUID - links to users table
  name: string;          // Display name
  email: string | null;  // Email address (optional)
  avatar: string | null; // Avatar URL (optional)
  created_at: string;     // ISO 8601 timestamp
}
```

### Player Rating
```typescript
{
  id: string;            // UUID
  player_id: string;     // UUID
  league_id: string;     // League ID
  rating: number;        // Elo rating (starts at 1000)
  games_played: number;  // Total games in this league
  wins: number;          // Wins in this league
  losses: number;        // Losses in this league
  draws: number;         // Draws in this league
  updated_at: string;    // ISO 8601 timestamp
}
```

### Match
```typescript
{
  id: string;                    // UUID
  challenge_id: string | null;   // UUID of related challenge (optional)
  player1_id: string;            // UUID
  player2_id: string;            // UUID
  league_id: string;             // League ID
  player1_score: number;         // Score for player 1
  player2_score: number;         // Score for player 2
  winner_id: string | null;      // UUID of winner (optional)
  status: string;                // "pending", "completed", "cancelled"
  played_at: string;             // ISO 8601 timestamp
  confirmed_at: string | null;   // ISO 8601 timestamp (optional)
}
```

---

## Error Handling

All endpoints return JSON responses. Error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (authentication required)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Rate Limiting

Currently, there are no rate limits implemented. This may change in future versions.

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- All UUIDs follow the standard UUID v4 format
- Player ratings start at 1000 when joining a league
- When a player joins a league, their initial stats (games_played, wins, losses, draws) are set to 0
- The `/api/players/[playerId]` endpoint returns up to 20 most recent completed matches
