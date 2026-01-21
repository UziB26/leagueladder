# League Ladder Web App
## Table Tennis + FIFA Ranking System

A modern web application for managing competitive leagues with Elo-based rankings. Players can join leagues, challenge opponents, record match results, and climb leaderboards in real-time.

## 🚀 Live Demo
**URL:** https://leagueladderapp.vercel.app/

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
- **Database**: PostgreSQL with Prisma ORM
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
├── prisma/               # Prisma schema and migrations
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
└── prisma.config.ts      # Prisma 7 configuration
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
- Prisma and Prisma Client
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

# Database Connection (PostgreSQL)
# For local development, use a local PostgreSQL instance or a service like Supabase
DATABASE_URL=postgresql://user:password@localhost:5432/league_ladder

# Alternative database URL variables (for Vercel Postgres)
# POSTGRES_URL=postgresql://...
# POSTGRES_PRISMA_URL=postgresql://...
# PRISMA_DATABASE_URL=postgresql://... (for Prisma Accelerate)

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

#### 4. Set Up PostgreSQL Database

You need a PostgreSQL database to run the application. You have several options:

**Option A: Local PostgreSQL**
1. Install PostgreSQL on your machine
2. Create a database:
   ```bash
   createdb league_ladder
   ```
3. Update `DATABASE_URL` in `.env.local`:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/league_ladder
   ```

**Option B: Supabase (Free PostgreSQL)**
1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy the connection string from Project Settings → Database
4. Add to `.env.local` as `DATABASE_URL`

**Option C: Other Cloud Providers**
- **Neon**: [neon.tech](https://neon.tech) - Serverless PostgreSQL
- **Railway**: [railway.app](https://railway.app) - PostgreSQL addon
- **Render**: [render.com](https://render.com) - PostgreSQL service

#### 5. Run Database Migrations

After setting up your database, run Prisma migrations to create the schema:

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database (creates tables)
npm run prisma:push

# Or use migrations (recommended for production)
npm run prisma:migrate
```

**Optional: Seed the database** (if you have seed data):
```bash
npm run prisma:seed
```

#### 6. Start Development Server

```bash
npm run dev
```

The application will be available at **http://localhost:3000**

#### 7. Build for Production

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

# Database (Prisma)
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:push      # Push schema changes to database
npm run prisma:studio    # Open Prisma Studio (database GUI)
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

4. **Set Up Vercel Postgres Database**
   - In Vercel Dashboard → Your Project → Storage
   - Click "Create Database" → Select "Postgres"
   - Choose a plan (Hobby plan is free)
   - Wait for the database to be created
   - Vercel will automatically add these environment variables:
     - `POSTGRES_URL`
     - `POSTGRES_PRISMA_URL`
     - `POSTGRES_URL_NON_POOLING`
     - `PRISMA_DATABASE_URL` (if using Prisma Accelerate)

5. **Set Additional Environment Variables**
   In Vercel project settings → Environment Variables, add:
   ```
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your-secret-key-here
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

   **Important Notes:**
   - Use your actual Vercel deployment URL for `NEXTAUTH_URL`
   - Generate a secure `NEXTAUTH_SECRET` (see Local Development section)
   - The PostgreSQL connection strings are automatically set by Vercel when you create the database
   - For Prisma migrations, use `POSTGRES_URL` or `POSTGRES_PRISMA_URL`

6. **Run Database Migrations**
   After the first deployment, you need to run Prisma migrations to create the database schema:
   
   **Option A: Using Vercel CLI (Recommended)**
   ```bash
   # Install Vercel CLI if not already installed
   npm install -g vercel
   
   # Link to your project
   vercel link
   
   # Pull environment variables
   vercel env pull .env.local
   
   # Run migrations
   npx prisma migrate deploy
   ```
   
   **Option B: Using Vercel Dashboard**
   - Go to your project → Settings → Environment Variables
   - Copy the `POSTGRES_URL` value
   - Locally, set it in `.env.local` and run:
     ```bash
     npx prisma migrate deploy
     ```
   
   **Option C: Using Prisma Studio (Alternative)**
   - Connect to your Vercel Postgres database
   - Run the SQL schema manually from `prisma/migrations/`

7. **Deploy**
   - Click "Deploy" (or push a new commit to trigger auto-deployment)
   - Vercel will automatically build and deploy your application
   - Your app will be live at `https://your-app.vercel.app`

#### Post-Deployment

- **Database Schema**: Ensure migrations have been run (see step 6 above)
- **First Admin User**: Create an admin user through the registration flow, then update via Prisma Studio or SQL:
  ```sql
  UPDATE users SET is_admin = true WHERE email = 'admin@example.com';
  ```

### Alternative: Deploying to Other Platforms

#### Railway
1. Connect your GitHub repository
2. Add PostgreSQL service
3. Set environment variables:
   - `DATABASE_URL` (from Railway PostgreSQL service)
   - `NEXTAUTH_URL` and `NEXTAUTH_SECRET`
4. Run migrations: `npx prisma migrate deploy`

#### Render
1. Create a new Web Service from GitHub
2. Add PostgreSQL database
3. Set environment variables
4. Run migrations in the build command or separately

#### AWS (EC2, ECS, or Lambda)
- Use RDS PostgreSQL
- Set `DATABASE_URL` environment variable
- Run Prisma migrations before deployment

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

**Problem**: "Database connection failed" or "Can't reach database server"
- **Solution**: Verify `DATABASE_URL` is set correctly in `.env.local`
- **Solution**: Check PostgreSQL server is running (if using local database)
- **Solution**: Verify database credentials are correct
- **Solution**: For cloud databases, check firewall/network settings

**Problem**: "Prisma schema validation error"
- **Solution**: Run `npx prisma validate` to check schema
- **Solution**: Ensure `prisma.config.ts` exists and is configured correctly
- **Solution**: Check that database URL is set in environment variables

**Problem**: "Table does not exist" errors
- **Solution**: Run database migrations: `npm run prisma:migrate` or `npm run prisma:push`
- **Solution**: Verify migrations have been applied to your database

### Build Issues

**Problem**: Vercel build fails with Prisma errors
- **Solution**: Ensure `PRISMA_DATABASE_URL` or `POSTGRES_URL` is set in Vercel environment variables
- **Solution**: The build process uses a dummy connection string - this is expected
- **Solution**: Verify Prisma Client is generated: `npm run prisma:generate`

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
- Database powered by [Prisma](https://www.prisma.io/) and PostgreSQL

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

