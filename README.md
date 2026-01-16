# League Ladder Web App
## Table Tennis + FIFA Ranking System

A modern web application for managing competitive leagues with Elo-based rankings. Players can join leagues, challenge opponents, record match results, and climb leaderboards in real-time.

## 🚀 Live Demo
**URL:** [Coming Soon]

---

## 📖 What This App Does

League Ladder is a competitive ranking system that allows players to:

- **Join Multiple Leagues**: Participate in Table Tennis and FIFA leagues with separate ratings
- **Challenge Opponents**: Issue challenges to other players in your league
- **Report Matches**: Record match results with score tracking
- **Opponent Confirmation**: Two-player confirmation system ensures match accuracy
- **Track Ratings**: Elo-based rating system with margin of victory bonuses
- **View Leaderboards**: Real-time rankings for each league
- **Match History**: Complete history of all matches with rating changes
- **Admin Controls**: Administrators can manage players, void matches, and view system statistics

### Key Features

- ✅ **Dual League System**: Separate ratings for Table Tennis and FIFA
- ✅ **Elo Rating System**: Mathematical rankings with margin of victory multipliers
- ✅ **Challenge System**: Issue, accept, and track challenges
- ✅ **Match Reporting**: Report matches with score validation
- ✅ **Opponent Confirmation**: Two-player confirmation before rating updates
- ✅ **Match Disputes**: Players can dispute incorrect match results
- ✅ **Admin Dashboard**: System statistics, player management, and match voiding
- ✅ **Real-time Leaderboards**: Live rankings updated after each match
- ✅ **Match History**: Complete game history with rating changes
- ✅ **Mobile-Friendly UI**: Responsive design optimized for all devices
- ✅ **Loading & Error States**: Consistent UI states across all pages
- ✅ **Data Validation**: Input sanitization and validation throughout
- ✅ **Rate Limiting**: API protection against abuse
- ✅ **Transaction Support**: Database transactions with backup/rollback
- ✅ **Comprehensive Testing**: Unit and integration tests for core functionality

---

## 🏗️ Technical Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with better-sqlite3 (file-based, auto-initialized)
- **Authentication**: NextAuth.js (Credentials Provider)
- **Validation**: Zod schemas for request validation
- **Testing**: Jest + React Testing Library
- **Hosting**: Vercel (serverless deployment)

### Project Structure
```
leagueladder/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/        # User dashboard
│   ├── matches/          # Match management
│   ├── leagues/          # League pages
│   └── api/              # API routes
├── src/
│   ├── components/       # React components
│   │   ├── auth/         # Authentication components
│   │   ├── match/        # Match-related components
│   │   ├── league/       # League components
│   │   ├── layout/       # Layout components
│   │   └── ui/           # Reusable UI components
│   ├── lib/              # Utility libraries
│   │   ├── db/           # Database initialization
│   │   ├── elo.ts        # Elo rating calculator
│   │   ├── auth.ts       # NextAuth configuration
│   │   ├── validation.ts # Zod schemas
│   │   ├── sanitize.ts   # Input sanitization
│   │   └── rate-limit.ts # Rate limiting
│   └── types/            # TypeScript type definitions
├── doc/                  # Documentation
│   ├── Elo_Calculator.md # Elo system documentation
│   └── postmortem.md     # Project postmortem
└── league-ladder.db      # SQLite database (auto-created)
```

---

## ⚖️ Ranking System

### Elo Configuration
- **Base Rating**: 1000 for all new players
- **K-factor**: 32 (standard competitive setting)
- **Margin of Victory**: Enabled (rewards larger victories)
- **Rating Updates**: Separate ratings maintained for each league
- **Transparency**: Full formula documentation in [`doc/Elo_Calculator.md`](doc/Elo_Calculator.md)

### How Ratings Work
1. New players start at **1000 rating** when joining a league
2. After each **confirmed match**:
   - Winner gains rating points
   - Loser loses rating points
   - Points exchanged based on rating difference and margin of victory
3. **Upsets** (lower-rated beating higher-rated) yield larger rating changes
4. **Large victories** receive bonus multipliers (up to 2.0x)

### Match Confirmation Flow
1. Player A reports a match result
2. Match status: `pending_confirmation`
3. Player B confirms or disputes the match
4. If confirmed: Ratings update, match status: `completed`
5. If disputed: Match status: `disputed`, admin review required

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher (or yarn)
- **Git** (for cloning the repository)

### Local Development

#### 1. Clone the Repository
```bash
git clone https://github.com/UziB26/league-ladder.git
cd league-ladder/leagueladder
```

#### 2. Install Dependencies
```bash
npm install
```

This will install all required dependencies including:
- Next.js and React
- TypeScript
- Tailwind CSS
- better-sqlite3
- NextAuth.js
- Testing libraries (Jest, React Testing Library)

#### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy the example file (if it exists)
cp .env.example .env.local
```

Or create `.env.local` manually with:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32

# Database (optional - defaults to ./league-ladder.db)
DATABASE_PATH=./league-ladder.db

# App URL (optional)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Generate a secure NEXTAUTH_SECRET:**
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

#### 4. Initialize Database

The database is **automatically initialized** on first access. No manual setup required!

The SQLite database (`league-ladder.db`) will be created automatically when you:
- Start the development server
- Access any API route that uses the database
- Run tests

**Manual Database Reset** (if needed):
```bash
# Remove existing database
npm run db:reset

# View database (requires sqlite3 CLI)
npm run db:view

# Backup database
npm run db:backup
```

#### 5. Start Development Server

```bash
npm run dev
```

The application will be available at **http://localhost:3000**

#### 6. Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier

# Testing
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report

# Database
npm run db:reset     # Remove database and rebuild
npm run db:view      # Open database in sqlite3 CLI
npm run db:backup    # Create timestamped backup
```

---

## 🚀 Deployment

### Deploying to Vercel

League Ladder is optimized for Vercel deployment with serverless functions.

#### Prerequisites
- A [Vercel account](https://vercel.com)
- GitHub repository connected to Vercel (recommended)

#### Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import Project to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Project Settings**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `leagueladder` (if your project is in a subdirectory)
   - **Build Command**: `npm run build` (default)
   - **Install Command**: `npm install` (default)
   - **Output Directory**: `.next` (default)

4. **Set Environment Variables**
   In Vercel project settings → Environment Variables, add:
   ```
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your-secret-key-here
   DATABASE_PATH=/tmp/league-ladder.db
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

   **Important Notes:**
   - Use your actual Vercel deployment URL for `NEXTAUTH_URL`
   - Generate a secure `NEXTAUTH_SECRET` (see Local Development section)
   - For SQLite on Vercel, use `/tmp/` directory (ephemeral storage)
   - **Note**: SQLite on Vercel is ephemeral - data resets on each deployment. For production, consider migrating to PostgreSQL or another persistent database.

5. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application
   - Your app will be live at `https://your-app.vercel.app`

#### Post-Deployment

- **Database Initialization**: The database will be created automatically on first API request
- **First Admin User**: Create an admin user through the registration flow, then manually update the database:
  ```sql
  UPDATE users SET is_admin = 1 WHERE email = 'admin@example.com';
  ```

### Alternative: Deploying to Other Platforms

#### AWS (EC2, ECS, or Lambda)
- Use PostgreSQL or RDS instead of SQLite
- Update database connection in `src/lib/db/index.ts`
- Configure environment variables in your hosting platform

#### Railway / Render
- Similar to Vercel setup
- Use PostgreSQL addon for persistent storage
- Update database connection accordingly

#### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🧪 Testing

The application includes comprehensive test coverage for core functionality.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

- ✅ **Elo Calculator**: Rating calculation logic
- ✅ **State Transitions**: Challenge and match state management
- ✅ **Validation Rules**: Self-challenge prevention, score validation
- ✅ **UI Components**: Button component tests
- ✅ **Integration Tests**: Core workflows

Test files are located in:
- `src/lib/elo.test.ts` - Elo rating calculations
- `src/lib/db/state-transitions.test.ts` - State management
- `src/components/ui/button.test.tsx` - UI component tests

---

## 🔐 Security Features

- **Input Sanitization**: All user inputs are sanitized to prevent injection attacks
- **Rate Limiting**: API endpoints protected with rate limiting
- **Authentication**: Secure session management with NextAuth.js
- **Data Validation**: Zod schemas validate all API requests
- **SQL Injection Protection**: Parameterized queries throughout
- **Transaction Support**: Database operations use transactions with rollback

---

## 📚 Documentation

- **[Elo Calculator Documentation](doc/Elo_Calculator.md)**: Complete guide to the Elo rating system
- **[Postmortem](doc/postmortem.md)**: Project retrospective and lessons learned

---

## 🐛 Troubleshooting

### Database Issues

**Problem**: Database not initializing
- **Solution**: Ensure write permissions in the project directory
- **Solution**: Check `DATABASE_PATH` environment variable

**Problem**: "Database is locked" errors
- **Solution**: Close any other processes accessing the database
- **Solution**: Restart the development server

### Build Issues

**Problem**: Vercel build fails with SQLite errors
- **Solution**: The app uses lazy database initialization - this is expected during build
- **Solution**: Ensure `.npmrc` contains `legacy-peer-deps=true`

**Problem**: TypeScript errors during build
- **Solution**: Run `npm run build` locally to identify issues
- **Solution**: Ensure all dependencies are installed: `npm install`

### Authentication Issues

**Problem**: Can't log in after registration
- **Solution**: Check `NEXTAUTH_SECRET` is set correctly
- **Solution**: Verify `NEXTAUTH_URL` matches your deployment URL

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

MIT Licence 

---

## 👤 Author

**Uzayr Banoo**
- GitHub: [@UziB26](https://github.com/UziB26)

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Authentication by [NextAuth.js](https://next-auth.js.org/)
- Database powered by [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)

---

## 📊 Project Status

**Status**: ✅ Production Ready

All core MVP features are complete and tested:
- ✅ User authentication and registration
- ✅ League joining and management
- ✅ Challenge system
- ✅ Match reporting with opponent confirmation
- ✅ Elo rating system with margin of victory
- ✅ Leaderboards and match history
- ✅ Admin controls and system statistics
- ✅ Comprehensive error handling and validation
- ✅ Mobile-responsive UI
- ✅ Test coverage for core functionality

---

**Last Updated**: January 2026

