# League Ladder - Architecture Diagram

## System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[Browser]
        B[Mobile Browser]
    end
    
    subgraph "Presentation Layer"
        C[Next.js Pages]
        D[React Components]
        E[Tailwind CSS]
    end
    
    subgraph "API Layer"
        F[Next.js API Routes]
        G[Elo Calculator]
    end
    
    subgraph "Data Layer"
        H[SQLite Database]
        I[Database Helpers]
    end
    
    A --> C
    B --> C
    C --> F
    F --> I
    I --> H
    G --> F
    
    style H fill:#e1f5e1
    style G fill:#e3f2fd
```

## Layer Descriptions

### Client Layer
- **Browser**: Users accessing the application via traditional web browsers (Chrome, Firefox, etc.)
- **Mobile Browser**: Users accessing the application via web browsers on mobile devices

### Presentation Layer
- **Next.js Pages**: Server-rendered or statically generated pages that form the backbone of the application's frontend
- **React Components**: Reusable UI building blocks used within Next.js pages to construct the interactive user interface
- **Tailwind CSS**: Utility-first CSS framework used for styling components and pages, ensuring consistent and responsive design

### API Layer
- **Next.js API Routes**: Backend functions (serverless functions) within the Next.js framework that handle incoming HTTP requests from the Presentation Layer
- **Elo Calculator**: Business logic component responsible for calculating and updating player ratings (Elo scores) after matches

### Data Layer
- **Database Helpers**: Utility functions or modules that abstract direct interaction with the database, providing a cleaner interface for the API Layer
- **SQLite Database**: Relational database where all application data (players, leagues, challenges, matches, ratings) is stored

## Data Flow Example: Creating a Challenge

1. User on Browser/Mobile Browser navigates to a Next.js Page containing the Create Challenge Form (React Component)
2. Form fetches available Leagues and Players by making requests to Next.js API Routes (`/api/leagues`, `/api/players/available`)
3. Next.js API Routes use Database Helpers to query SQLite Database for required player and league data
4. Data is returned through API Layer to Presentation Layer, where dropdowns are populated
5. When user submits form, request is sent to Next.js API Route (`/api/challenges`) to create the challenge
6. API route interacts with Database Helpers to record the new challenge in SQLite Database
7. API responds with success or failure, displayed in Next.js Page via React Components

## Challenge Workflow

```mermaid
sequenceDiagram
    participant UserA as Player A
    participant UI as Challenge UI
    participant API as API Routes
    participant DB as SQLite Database
    participant UserB as Player B

    UserA->>UI: Clicks "Challenge Player"
    UI->>API: POST /api/challenges
    API->>DB: Check if both in same league
    DB-->>API: League membership confirmed
    API->>DB: Create challenge (status: pending)
    DB-->>API: Challenge created
    API-->>UI: Success response
    UI-->>UserA: Challenge sent notification

    Note over UserB: Player B logs in
    UserB->>UI: Visits /challenges
    UI->>API: GET /api/challenges/incoming
    API->>DB: Fetch pending challenges
    DB-->>API: Return challenges
    API-->>UI: Show incoming challenges
    UI-->>UserB: Display challenge from A

    UserB->>UI: Clicks "Accept Challenge"
    UI->>API: POST /api/challenges/:id/accept
    API->>DB: Update status to 'accepted'
    DB-->>API: Update confirmed
    API-->>UI: Success response
    UI-->>UserB: Challenge accepted

    Note over UserA,UserB: Players schedule and play match
    UserA->>UI: Clicks "Report Score"
    UI->>API: POST /api/matches (Day 5)
    API->>DB: Create match record
    API->>DB: Update challenge status to 'completed'
    API->>DB: Calculate new Elo ratings
    DB-->>API: All updates complete
    API-->>UI: Success response
    UI-->>UserA: Match recorded, ratings updated
```

## Challenge Process Flows

### Challenge Creation Flow

```mermaid
flowchart TD
    A[Player selects opponent] --> B{Validate same league}
    B -->|Not in same league| C[Error: Must be in same league]
    B -->|In same league| D{Check no existing challenge}
    D -->|Challenge exists| E[Error: Pending challenge already exists]
    D -->|No existing challenge| F[Create challenge record]
    F --> G[Set expires in 7 days]
    G --> H[Challenge created successfully]
```

### Challenge Response Flow

```mermaid
flowchart TD
    A[Challengee views challenge] --> B{Accept or Decline?}
    B -->|Accept| C[Update status: accepted]
    C --> D[Ready for match reporting]
    B -->|Decline| E[Update status: declined]
    E --> F[Challenge ends]
```

### Match Flow (Day 5)

```mermaid
flowchart TD
    A[Accepted challenge] --> B[Report match score]
    B --> C[Create match record]
    C --> D[Update challenge: completed]
    D --> E[Calculate Elo ratings]
    E --> F[Update leaderboard]
    F --> G[Process complete]
```

## Database Schema (ERD)

```mermaid
erDiagram
    players ||--o{ challenges_challenger : "creates as challenger"
    players ||--o{ challenges_challengee : "receives as challengee"
    players ||--o{ matches_player1 : "plays as player1"
    players ||--o{ matches_player2 : "plays as player2"
    players ||--o{ matches_winner : "wins"
    
    leagues ||--o{ challenges : "hosts"
    leagues ||--o{ matches : "hosts"
    
    challenges ||--o{ matches : "results in"
    
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
        string league_id FK
        int player1_score
        int player2_score
        string winner_id FK
        string status
    }
    
    players {
        string id PK
        string user_id
        string name
        string email
        string avatar
        datetime created_at
    }
    
    leagues {
        string id PK
        string name
        string game_type
        datetime created_at
    }
```

## Challenge State Diagram

```mermaid
stateDiagram-v2
    [*] --> Pending: Challenge created
    
    Pending --> Accepted: Challengee accepts
    Pending --> Declined: Challengee declines
    Pending --> Cancelled: Challenger cancels
    Pending --> Expired: 7 days pass
    
    Accepted --> Completed: Match reported
    Accepted --> Declined: Either player cancels
    
    Completed --> [*]: Process complete
    Declined --> [*]: Process complete
    Cancelled --> [*]: Process complete
    Expired --> [*]: Process complete
```

## State Descriptions

### Challenge States

- **Pending**: Initial state when challenge is created. Challengee can accept, decline, or let it expire.
- **Accepted**: Challenge has been accepted by challengee. Ready for match to be played and reported.
- **Completed**: Match has been played and score reported. Challenge lifecycle complete.
- **Declined**: Challenge was rejected by challengee or cancelled after acceptance.
- **Cancelled**: Challenger revoked the challenge before acceptance.
- **Expired**: Challenge was not acted upon within 7 days and automatically expired.