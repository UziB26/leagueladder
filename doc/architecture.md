# League Ladder - System Architecture

## High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[Web Browser]
        B[Mobile Browser]
    end
    
    subgraph "Presentation Layer"
        C[Next.js 14 App Router]
        D[React Components]
        E[Tailwind CSS]
        F[NextAuth Session]
    end
    
    subgraph "API Layer"
        G[Next.js API Routes]
        H[Rate Limiting]
        I[Input Sanitization]
        J[Zod Validation]
        K[Authentication Middleware]
    end
    
    subgraph "Business Logic Layer"
        L[Elo Calculator]
        M[Match Confirmation Handler]
        N[Challenge Manager]
        O[Admin Controller]
        P[Transaction Manager]
    end
    
    subgraph "Data Layer"
        Q[SQLite Database]
        R[Database Helpers]
        S[Database Triggers]
    end
    
    A --> C
    B --> C
    C --> D
    D --> E
    C --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L
    K --> M
    K --> N
    K --> O
    L --> P
    M --> P
    N --> P
    O --> P
    P --> R
    R --> Q
    S --> Q
    
    style Q fill:#e1f5e1
    style L fill:#e3f2fd
    style P fill:#fff3e0
    style H fill:#fce4ec
    style I fill:#fce4ec
    style J fill:#fce4ec
```

## Architecture Layers

### 1. Client Layer
- **Web Browser**: Desktop users accessing via Chrome, Firefox, Safari, Edge
- **Mobile Browser**: Mobile users on iOS Safari, Chrome Mobile, etc.
- **Responsive Design**: Single codebase serves all device types

### 2. Presentation Layer
- **Next.js 14 App Router**: Modern React framework with server-side rendering
- **React Components**: Reusable UI components organized by feature
  - Authentication components (`src/components/auth/`)
  - Match components (`src/components/match/`)
  - League components (`src/components/league/`)
  - UI components (`src/components/ui/`)
- **Tailwind CSS**: Utility-first CSS framework for styling
- **NextAuth Session**: Client-side session management

### 3. API Layer
- **Next.js API Routes**: Serverless functions handling HTTP requests
- **Rate Limiting**: Protects endpoints from abuse (multiple rate limiters)
- **Input Sanitization**: Prevents injection attacks (SQL, XSS)
- **Zod Validation**: Schema-based request validation
- **Authentication Middleware**: `createProtectedHandler` for consistent auth checks

### 4. Business Logic Layer
- **Elo Calculator**: Rating calculation with margin of victory
- **Match Confirmation Handler**: Two-player confirmation workflow
- **Challenge Manager**: Challenge creation, acceptance, expiration
- **Admin Controller**: Administrative operations (void matches, manage players)
- **Transaction Manager**: Database transactions with backup/rollback

### 5. Data Layer
- **SQLite Database**: File-based relational database (better-sqlite3)
- **Database Helpers**: Abstraction layer for database operations
- **Database Triggers**: Automatic rating updates, challenge status changes

---

## System Components

### Authentication & Authorization

```mermaid
graph LR
    A[User Request] --> B{Authenticated?}
    B -->|No| C[Redirect to Login]
    B -->|Yes| D{Admin?}
    D -->|Yes| E[Admin Routes]
    D -->|No| F[Player Routes]
    E --> G[Full Access]
    F --> H[Limited Access]
```

**Authentication Flow:**
1. User submits credentials (email/password)
2. NextAuth validates and creates session
3. Session stored in database (`sessions` table)
4. Protected routes check session via middleware
5. Admin routes require `is_admin = true` flag

### Security Features

```mermaid
graph TB
    A[API Request] --> B[Rate Limiter]
    B -->|Allowed| C[Input Sanitizer]
    B -->|Blocked| D[429 Too Many Requests]
    C --> E[Zod Validator]
    E -->|Valid| F[Business Logic]
    E -->|Invalid| G[400 Bad Request]
    F --> H[Transaction Start]
    H --> I[Database Operation]
    I -->|Success| J[Commit Transaction]
    I -->|Error| K[Rollback Transaction]
```

**Security Layers:**
1. **Rate Limiting**: Multiple limiters for different endpoints
   - `authRateLimit`: Authentication endpoints
   - `apiRateLimit`: General API endpoints
   - `strictRateLimit`: Sensitive operations
   - `loginRateLimit`: Login attempts
   - `registerRateLimit`: Registration attempts

2. **Input Sanitization**: 
   - `sanitizeString()`: Removes dangerous characters
   - `sanitizeEmail()`: Email validation and sanitization
   - `sanitizeUUID()`: UUID format validation
   - Prevents SQL injection and XSS attacks

3. **Validation**:
   - Zod schemas for all API requests
   - Type-safe validation at runtime
   - Clear error messages for invalid input

4. **Transactions**:
   - `createBackup()`: Database backup before operations
   - `restoreBackup()`: Rollback on errors
   - Ensures data consistency

---

## Database Schema

### Entity-Relationship Diagram

```mermaid
erDiagram
    users ||--o| players : "has profile"
    users ||--o{ sessions : "has"
    users ||--o{ accounts : "has"
    users ||--o{ admin_actions : "performs"
    
    players ||--o{ league_memberships : "joins"
    players ||--o{ player_ratings : "has"
    players ||--o{ challenges_challenger : "creates"
    players ||--o{ challenges_challengee : "receives"
    players ||--o{ matches_player1 : "plays as"
    players ||--o{ matches_player2 : "plays as"
    players ||--o{ matches_winner : "wins"
    players ||--o{ matches_reporter : "reports"
    players ||--o{ match_confirmations : "confirms"
    players ||--o{ rating_updates : "receives"
    
    leagues ||--o{ league_memberships : "contains"
    leagues ||--o{ player_ratings : "hosts ratings"
    leagues ||--o{ challenges : "hosts"
    leagues ||--o{ matches : "hosts"
    
    challenges ||--o| matches : "results in"
    
    matches ||--o{ match_confirmations : "has"
    matches ||--o{ rating_updates : "generates"
    
    users {
        string id PK
        string email UK
        string name
        boolean is_admin
        datetime created_at
        datetime updated_at
    }
    
    players {
        string id PK
        string user_id FK
        string name
        string email
        string avatar
        datetime created_at
    }
    
    leagues {
        string id PK
        string name UK
        string game_type
        datetime created_at
    }
    
    league_memberships {
        string id PK
        string player_id FK
        string league_id FK
        datetime joined_at
        boolean is_active
    }
    
    player_ratings {
        string id PK
        string player_id FK
        string league_id FK
        int rating
        int games_played
        int wins
        int losses
        int draws
        datetime updated_at
    }
    
    challenges {
        string id PK
        string challenger_id FK
        string challengee_id FK
        string league_id FK
        string status
        datetime created_at
        datetime expires_at
    }
    
    matches {
        string id PK
        string challenge_id FK
        string player1_id FK
        string player2_id FK
        string winner_id FK
        string reported_by FK
        string league_id FK
        int player1_score
        int player2_score
        string status
        datetime created_at
        datetime confirmed_at
    }
    
    match_confirmations {
        string id PK
        string match_id FK
        string player_id FK
        string action
        int confirmed_score1
        int confirmed_score2
        string dispute_reason
        datetime created_at
    }
    
    rating_updates {
        string id PK
        string match_id FK
        string player_id FK
        string league_id FK
        int old_rating
        int new_rating
        int change
        datetime created_at
    }
    
    admin_actions {
        string id PK
        string user_id FK
        string action
        string target_id
        string details
        datetime created_at
    }
```

### Key Relationships

- **Users → Players**: One-to-one (each user has one player profile)
- **Players → Leagues**: Many-to-many (via `league_memberships`)
- **Players → Ratings**: One-to-many per league (via `player_ratings`)
- **Challenges → Matches**: One-to-one (each challenge can result in one match)
- **Matches → Confirmations**: One-to-many (one confirmation per participant)
- **Matches → Rating Updates**: One-to-many (one update per player per match)

---

## API Architecture

### API Route Structure

```
/api
├── /auth/[...nextauth]          # NextAuth authentication
├── /health                      # Health check endpoint
│
├── /leagues                     # League operations
│   ├── GET                      # List all leagues
│   └── /[leagueId]/matches     # Get league matches
│
├── /challenges                  # Challenge management
│   ├── GET                      # List challenges
│   ├── POST                     # Create challenge
│   ├── /incoming                # Get incoming challenges
│   └── /outgoing                # Get outgoing challenges
│
├── /matches                     # Match operations
│   ├── GET                      # List matches
│   ├── POST                     # Report match
│   ├── /pending-confirmations   # Get pending confirmations
│   ├── /pending-count           # Get count of pending items
│   ├── /from-challenge/[id]     # Report match from challenge
│   └── /[matchId]
│       ├── GET                  # Get match details
│       └── /confirm             # Confirm/dispute match
│
├── /leaderboard/[leagueId]      # Get league leaderboard
│
├── /players                     # Player operations
│   ├── /available               # Get available players
│   ├── /me                      # Get current player
│   └── /[playerId]
│       ├── /matches             # Get player matches
│       └── /rating-history      # Get rating history
│
└── /admin                       # Admin operations
    ├── /stats                   # System statistics
    ├── /users                   # User management
    ├── /players                 # Player management
    ├── /matches                 # Match management
    └── /leagues                 # League management
```

### API Request Flow

```mermaid
sequenceDiagram
    participant Client
    participant API as API Route
    participant Auth as Auth Middleware
    participant RateLimit as Rate Limiter
    participant Sanitize as Input Sanitizer
    participant Validate as Zod Validator
    participant Business as Business Logic
    participant DB as Database
    participant Transaction as Transaction Manager

    Client->>API: HTTP Request
    API->>RateLimit: Check rate limit
    RateLimit-->>API: Allowed/Blocked
    alt Rate Limit Exceeded
        API-->>Client: 429 Too Many Requests
    else Rate Limit OK
        API->>Auth: Verify authentication
        Auth-->>API: Authenticated/Unauthorized
        alt Not Authenticated
            API-->>Client: 401 Unauthorized
        else Authenticated
            API->>Sanitize: Sanitize input
            Sanitize-->>API: Sanitized data
            API->>Validate: Validate schema
            Validate-->>API: Valid/Invalid
            alt Invalid Schema
                API-->>Client: 400 Bad Request
            else Valid Schema
                API->>Transaction: Start transaction
                Transaction->>DB: Create backup
                DB-->>Transaction: Backup created
                Transaction->>Business: Execute business logic
                Business->>DB: Database operations
                DB-->>Business: Results
                Business-->>Transaction: Success/Error
                alt Success
                    Transaction->>DB: Commit
                    DB-->>Transaction: Committed
                    Transaction-->>API: Success
                    API-->>Client: 200 OK + Data
                else Error
                    Transaction->>DB: Rollback
                    DB-->>Transaction: Rolled back
                    Transaction-->>API: Error
                    API-->>Client: 500 Internal Server Error
                end
            end
        end
    end
```

---

## Match Confirmation Flow

### Complete Match Lifecycle

```mermaid
stateDiagram-v2
    [*] --> ChallengeAccepted: Challenge accepted
    
    ChallengeAccepted --> MatchReported: Player reports match
    MatchReported --> PendingConfirmation: Match created (status: pending_confirmation)
    
    PendingConfirmation --> Confirmed: Opponent confirms
    PendingConfirmation --> Disputed: Opponent disputes
    
    Confirmed --> Completed: Ratings updated
    Disputed --> AdminReview: Admin intervention required
    AdminReview --> Completed: Admin resolves
    AdminReview --> Cancelled: Admin voids match
    
    Completed --> [*]: Process complete
    Cancelled --> [*]: Process complete
```

### Match Confirmation Sequence

```mermaid
sequenceDiagram
    participant P1 as Player 1 (Reporter)
    participant UI as Match UI
    participant API as API Route
    participant DB as Database
    participant P2 as Player 2 (Opponent)
    participant Elo as Elo Calculator
    participant Trigger as DB Triggers

    P1->>UI: Report match (11-10)
    UI->>API: POST /api/matches
    API->>DB: Create match (status: pending_confirmation)
    DB->>Trigger: Match inserted
    Trigger->>DB: Set winner_id
    DB-->>API: Match created
    API-->>UI: Success (awaiting confirmation)
    UI-->>P1: Match reported, waiting for confirmation

    Note over P2: Player 2 logs in
    P2->>UI: View pending confirmations
    UI->>API: GET /api/matches/pending-confirmations
    API->>DB: Query pending matches
    DB-->>API: Return match
    API-->>UI: Show match details
    UI-->>P2: Display match (11-10)

    alt Player 2 Confirms
        P2->>UI: Click "Confirm Match"
        UI->>API: POST /api/matches/[id]/confirm (action: confirmed)
        API->>DB: Start transaction
        DB->>DB: Create backup
        API->>DB: Update match status to 'completed'
        DB->>Trigger: Status changed to 'completed'
        Trigger->>DB: Update player stats
        API->>Elo: Calculate new ratings
        Elo-->>API: Rating changes
        API->>DB: Update player_ratings
        API->>DB: Insert rating_updates
        API->>DB: Insert match_confirmation
        API->>DB: Update challenge status
        API->>DB: Commit transaction
        DB-->>API: Success
        API-->>UI: Match confirmed, ratings updated
        UI-->>P2: Confirmation successful
    else Player 2 Disputes
        P2->>UI: Click "Dispute Match"
        UI->>API: POST /api/matches/[id]/confirm (action: disputed)
        API->>DB: Update match status to 'disputed'
        API->>DB: Insert match_confirmation (dispute reason)
        DB-->>API: Dispute recorded
        API-->>UI: Match disputed
        UI-->>P2: Dispute submitted (admin review)
    end
```

---

## Challenge Workflow

### Challenge State Machine

```mermaid
stateDiagram-v2
    [*] --> Pending: Challenge created
    
    Pending --> Accepted: Challengee accepts
    Pending --> Declined: Challengee declines
    Pending --> Cancelled: Challenger cancels
    Pending --> Expired: 7 days pass
    
    Accepted --> Completed: Match reported & confirmed
    Accepted --> Cancelled: Either player cancels
    
    Completed --> [*]: Process complete
    Declined --> [*]: Process complete
    Cancelled --> [*]: Process complete
    Expired --> [*]: Process complete
```

### Challenge Creation Flow

```mermaid
flowchart TD
    A[Player selects opponent] --> B{Validate same league?}
    B -->|No| C[Error: Must be in same league]
    B -->|Yes| D{Self-challenge?}
    D -->|Yes| E[Error: Cannot challenge self]
    D -->|No| F{Existing challenge?}
    F -->|Yes| G[Error: Challenge already exists]
    F -->|No| H[Create challenge record]
    H --> I[Set status: pending]
    I --> J[Set expires in 7 days]
    J --> K[Challenge created successfully]
```

---

## Elo Rating System Integration

### Rating Update Flow

```mermaid
flowchart TD
    A[Match Confirmed] --> B[Get Player Ratings]
    B --> C[Get Match Scores]
    C --> D[Calculate Score Value]
    D --> E[Calculate Margin of Victory]
    E --> F[Calculate Expected Scores]
    F --> G[Apply Margin Multiplier to K-factor]
    G --> H[Calculate Rating Changes]
    H --> I[Update Player Ratings]
    I --> J[Record Rating Updates]
    J --> K[Update Player Stats via Trigger]
    K --> L[Complete]
```

### Database Triggers

The system uses SQLite triggers for automatic updates:

1. **`set_match_winner_on_insert`**: Sets `winner_id` when match is inserted
2. **`set_match_winner`**: Sets `winner_id` when status changes to 'completed'
3. **`update_challenge_on_match_creation`**: Updates challenge status to 'completed' when match is created
4. **`update_player_stats_on_match_insert`**: Updates player stats when match is inserted with 'completed' status
5. **`update_player_stats_on_match_update`**: Updates player stats when match status changes to 'completed'

---

## Admin System

### Admin Capabilities

```mermaid
graph TB
    A[Admin User] --> B[System Statistics]
    A --> C[User Management]
    A --> D[Player Management]
    A --> E[Match Management]
    A --> F[League Management]
    
    B --> B1[View System Stats]
    B --> B2[View Activity Logs]
    
    C --> C1[List All Users]
    C --> C2[Toggle Admin Status]
    C --> C3[View User Details]
    
    D --> D1[List All Players]
    D --> D2[View Player Stats]
    D --> D3[Edit Player Info]
    
    E --> E1[View All Matches]
    E --> E2[Void Matches]
    E --> E3[Resolve Disputes]
    
    F --> F1[View Leagues]
    F --> F2[View League Stats]
```

### Admin Action Flow

```mermaid
sequenceDiagram
    participant Admin
    participant UI as Admin UI
    participant API as Admin API
    participant Auth as Auth Check
    participant DB as Database
    participant Transaction as Transaction Manager

    Admin->>UI: Perform admin action
    UI->>API: POST /api/admin/...
    API->>Auth: Check is_admin flag
    Auth-->>API: Admin verified
    API->>Transaction: Start transaction
    Transaction->>DB: Create backup
    API->>DB: Execute admin action
    DB-->>API: Action result
    API->>DB: Log admin action
    DB-->>API: Logged
    API->>Transaction: Commit
    Transaction->>DB: Commit
    DB-->>API: Committed
    API-->>UI: Success
    UI-->>Admin: Action completed
```

---

## Data Flow Examples

### Example 1: Reporting a Match

1. **Player A** reports match result (21-15) via UI
2. **UI** sends `POST /api/matches` with scores
3. **API Route** validates request (rate limit, auth, sanitize, validate)
4. **Database** creates match record with `status: 'pending_confirmation'`
5. **Trigger** sets `winner_id` automatically
6. **API** returns success to UI
7. **UI** shows "Match reported, awaiting opponent confirmation"
8. **Player B** logs in and sees pending confirmation
9. **Player B** confirms match
10. **API** updates match status to `'completed'`
11. **Trigger** updates player stats
12. **Elo Calculator** calculates new ratings
13. **Database** records rating updates
14. **Leaderboard** updates automatically

### Example 2: Challenge to Match Flow

1. **Player A** creates challenge for **Player B** in Table Tennis league
2. **Database** creates challenge record (`status: 'pending'`)
3. **Player B** accepts challenge
4. **Database** updates challenge (`status: 'accepted'`)
5. **Players** play match
6. **Player A** reports match (11-9)
7. **Database** creates match linked to challenge (`status: 'pending_confirmation'`)
8. **Trigger** updates challenge to `'completed'`
9. **Player B** confirms match
10. **Database** updates match to `'completed'`
11. **Triggers** update player stats and ratings
12. **Leaderboard** reflects new rankings

---

## Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **React Hook Form**: Form management
- **Zod**: Runtime validation
- **NextAuth.js**: Authentication

### Backend
- **Next.js API Routes**: Serverless functions
- **better-sqlite3**: SQLite database driver
- **Zod**: Request validation
- **crypto**: Password hashing (via NextAuth)

### Database
- **SQLite**: File-based relational database
- **Triggers**: Automatic data consistency
- **Foreign Keys**: Referential integrity
- **Transactions**: Atomic operations

### Security
- **Rate Limiting**: Multiple rate limiters
- **Input Sanitization**: XSS and SQL injection prevention
- **Zod Validation**: Schema-based validation
- **Transaction Support**: Backup/rollback mechanism

### Testing
- **Jest**: Test runner
- **React Testing Library**: Component testing
- **ts-jest**: TypeScript support

---

## Deployment Architecture

### Vercel Deployment

```mermaid
graph TB
    A[GitHub Repository] --> B[Vercel Build]
    B --> C[Next.js Build]
    C --> D[Serverless Functions]
    D --> E[API Routes]
    E --> F[SQLite Database]
    F --> G[/tmp/ directory]
    
    H[User Request] --> I[Vercel Edge Network]
    I --> D
    
    style F fill:#ffebee
    style G fill:#ffebee
```

**Note**: SQLite on Vercel uses ephemeral storage (`/tmp/`), so data resets on each deployment. For production, consider migrating to PostgreSQL or another persistent database.

### Production Considerations

1. **Database**: Migrate from SQLite to PostgreSQL for persistence
2. **Caching**: Implement Redis for rate limiting and session storage
3. **CDN**: Static assets served via Vercel Edge Network
4. **Monitoring**: Add error tracking (Sentry) and analytics
5. **Backup**: Automated database backups for production data

---

## Performance Optimizations

1. **Lazy Database Initialization**: Database only initializes on first access
2. **Database Triggers**: Automatic updates reduce application logic
3. **Transaction Batching**: Multiple operations in single transaction
4. **Rate Limiting**: Prevents abuse and ensures fair resource usage
5. **Input Validation**: Early rejection of invalid requests

---

## Security Architecture

### Defense in Depth

```mermaid
graph TB
    A[User Input] --> B[Rate Limiting]
    B --> C[Input Sanitization]
    C --> D[Zod Validation]
    D --> E[Authentication Check]
    E --> F[Authorization Check]
    F --> G[Business Logic]
    G --> H[Transaction with Backup]
    H --> I[Database Operation]
    I --> J[Commit/Rollback]
```

**Security Layers:**
1. **Rate Limiting**: Prevents brute force and DoS
2. **Input Sanitization**: Removes dangerous characters
3. **Validation**: Ensures data format correctness
4. **Authentication**: Verifies user identity
5. **Authorization**: Checks user permissions
6. **Transactions**: Ensures data consistency
7. **Parameterized Queries**: Prevents SQL injection

---

## Summary

The League Ladder architecture follows a **layered, security-first approach**:

- ✅ **Separation of Concerns**: Clear boundaries between layers
- ✅ **Security at Every Layer**: Multiple security checks
- ✅ **Data Consistency**: Transactions and triggers ensure integrity
- ✅ **Scalable Design**: Serverless architecture ready for growth
- ✅ **Type Safety**: TypeScript throughout the stack
- ✅ **Testability**: Clear interfaces for testing

The system is designed to be **maintainable, secure, and scalable** while providing a smooth user experience for competitive league management.
