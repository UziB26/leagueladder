# League Ladder - Requirements

## MVP Features (must-have)

### ✅ Completed:
1. **Player Registration** - Users can register with email/password
2. **Authentication** - Login/logout functionality with NextAuth
3. **League Selection** - Separate Table Tennis and FIFA leagues
4. **League Joining** - Players can join leagues from dashboard
5. **Player Profiles** - Basic profile creation on registration

### 🔄 In Progress:
1. **Leaderboards** - Per league rankings (Day 3)
2. **Challenge System** - Issue/accept challenges (Day 4)
3. **Match Reporting** - Record scores and update ratings (Day 5)

### 📋 Pending:
1. **Match History** - View past matches
2. **Admin Controls** - Edit/void matches
3. **Mobile-Friendly UI** - Optimized for phones

## User Stories Status

### ✅ Completed User Stories:
- "As a new user, I want to register with my email"
- "As a user, I want to log in to my account"
- "As a player, I want to join either Table Tennis or FIFA league"
- "As a user, I want to see my dashboard after logging in"

### 🚧 Current User Stories (Day 2):
- "As a player, I want my Elo rating initialized when I join a league"
- "As a user, I want to see which leagues I've joined"

### 🔜 Next User Stories (Day 3):
- "As a player, I want to see the leaderboard for my league"
- "As a player, I want to see other players' ratings and stats"

## Database Schema

### Tables Created:
1. **users** - NextAuth user accounts
2. **accounts** - Authentication providers
3. **sessions** - User sessions
4. **players** - Player profiles (linked to users)
5. **leagues** - Table Tennis and FIFA leagues
6. **league_memberships** - Which players are in which leagues
7. **player_ratings** - Elo ratings per league (initialized at 1000)

### Relationships:
- One **User** can have one **Player** profile
- One **Player** can be in multiple **Leagues**
- Each **Player+League** combination has one **PlayerRating**

## API Endpoints

### ✅ Implemented:
- `GET /api/leagues` - List all available leagues
- `POST /api/leagues/join` - Join a league (requires auth)
- `POST /api/auth/[...nextauth]` - NextAuth authentication

### 🔜 To Implement (Day 3):
- `GET /api/leaderboard/:leagueId` - Get league leaderboard
- `GET /api/players/:playerId` - Get player profile and stats

## Authentication Flow

### Current Implementation (Simplified):
1. User registers with email/password
2. Account created in `users` table
3. Player profile automatically created
4. Session maintained via NextAuth cookies
5. Protected routes check session status

### Future Enhancements (Day 6):
- Email verification
- Password reset
- Social login (Google, GitHub)
- Proper session validation

## Environment Variables

### Required for Development:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
DATABASE_PATH=./league-ladder.db
NEXT_PUBLIC_APP_URL=http://localhost:3000