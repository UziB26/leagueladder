# League Ladder Web App
## Table Tennis + FIFA Ranking System

A modern web application for managing competitive leagues with Elo-based rankings. Players can join leagues, challenge opponents, record match results, and climb leaderboards in real-time.

## 🚀 Live Demo
**URL:** [Coming Sooon]

## ✨ Features

### 🎯 Core MVP Features
- **Dual Leagues**: Separate rating ladders for Table Tennis and FIFA
- **Elo Rating System**: Transparent, mathematical rankings with per-league ratings
- **Player Registration**: Simple profile creation with name, email, and optional avatar
- **Challenge System**: Issue challenges, accept/decline, track status
- **Match Reporting**: Enter scores, mark matches complete, auto-update ratings
- **Live Leaderboards**: Real-time ranking updates for each league
- **Match History**: Complete game history per player and per league
- **Mobile-Friendly UI**: Optimized for quick actions on phones and tablets
- **Admin Controls**: Match editing/voiding capabilities

### 🎨 Nice-to-Haves (Coming Soon)
- Opponent confirmation flow
- In-app notifications
- Head-to-head statistics
- Season support with quarterly resets
- Anti-abuse constraints and cooldowns
- Analytics dashboard

## 🏗️ Technical Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with better-sqlite3 (Production: Postgres ready)
- **Authentication**: NextAuth.js
- **Hosting**: Vercel (with AWS deployment planned)


## ⚖️ Ranking System

### Elo Configuration
- **Base Rating**: 1000 for all new players
- **K-factor**: 32 (standard competitive setting)
- **Rating Updates**: Separate ratings maintained for Table Tennis and FIFA
- **Transparency**: Full formula documentation available in `/docs/elo-system.md`

### How Ratings Work
1. New players start at 1000 rating
2. After each match:
   - Winner gains rating points
   - Loser loses rating points
   - Points exchanged based on rating difference
3. Upsets (lower-rated beating higher-rated) yield larger rating changes

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Local Development
```bash
# 1. Clone repository
git clone https://github.com/UziB26/league-ladder.git
cd league-ladder

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# 4. Set up database
npx prisma migrate dev
npx prisma db seed

# 5. Start development server
npm run dev

# Build the application
npm run build

# Start production server
npm start