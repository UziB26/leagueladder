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