League Ladder - Table Tennis & FIFA Ranking System
A modern web app for managing competitive leagues with Elo-based rankings. Players can join leagues, challenge opponents, record matches, and climb leaderboards.

Features

Dual Leagues: Separate ladders for Table Tennis and FIFA
Elo Rating System: Transparent, mathematical rankings
Challenge System: Challenge players, accept/decline matches
Live Leaderboards: Real-time ranking updates
Match History: Track all games and results
Mobile-Friendly: Works perfectly on phones and tablets


 Tech Stack
Frontend: Next.js 14 (App Router) + TypeScript + Tailwind CSS
Database: SQLite with better-sqlite3
Authentication: NextAuth.js
Rating System: Custom Elo calculator


Installation
# Clone repository
git clone https://github.com/yourusername/league-ladder.git
cd league-ladder

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# Start development server
npm run dev
Open http://localhost:3000 in your browser.



 Project Structure
league-ladder/
├── src/
│   ├── app/              # Next.js pages & API routes
│   ├── components/       # React components
│   ├── lib/             # Utilities (database, Elo)
│   └── types/           # TypeScript definitions
├── prisma/              # Database schema
├── docs/                # Documentation
└── league-ladder.db     # SQLite database

How It Works
Register - Create your player profile
Join League - Choose Table Tennis or FIFA
Challenge - Challenge other players to matches
Play & Record - Play matches and enter scores
Climb - Watch your Elo rating rise on the leaderboard

Database
Uses SQLite for simplicity:
Single file database (league-ladder.db)
Auto-initialized with Table Tennis and FIFA leagues
All tables created on first run
Easy to backup and inspect
Database Commands
# View database
npm run db:view
# Reset database
npm run db:reset
# Create backup
npm run db:backup

Available Scripts
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier

Elo Rating System
Base Rating: 1000 for all new players
K-factor: 32 (standard competitive setting)
Transparent: Formula shown in documentation
Per-league: Separate ratings for Table Tennis and FIFA

Documentation
Requirements - MVP features
Architecture - System design
Database Schema - Tables & relationships
API Reference - Endpoints
Daily Log - Development progress


 Deployment
Build: npm run build
Start: npm run start
Set environment variables in production

License
MIT

Contact
Project Lead: Uzayr
GitHub: UziB26


