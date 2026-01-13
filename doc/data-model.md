erDiagram
    players ||--o{ league_memberships : joins
    players ||--o{ player_ratings : has
    players ||--o{ challenges_challenger : "challenges as"
    players ||--o{ challenges_challengee : "challenged as"
    players ||--o{ matches_player1 : "plays as player1"
    players ||--o{ matches_player2 : "plays as player2"
    
    leagues ||--o{ league_memberships : contains
    leagues ||--o{ player_ratings : "ratings for"
    leagues ||--o{ challenges : "challenges in"
    leagues ||--o{ matches : "matches in"
    
    challenges ||--|| matches : "results in"
    
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
        string league_id FK
        int player1_score
        int player2_score
        string winner_id FK
        string status
        datetime played_at
        datetime confirmed_at
    }