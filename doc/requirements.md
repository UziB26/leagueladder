# League Ladder - Requirements Document

## MVP Definition

### Minimum Viable Product (MVP)

The League Ladder MVP is a **competitive ranking system** that enables players to:

1. **Join leagues** for different games (Table Tennis and FIFA)
2. **Challenge opponents** within their leagues
3. **Report match results** with score tracking
4. **Confirm matches** through a two-player verification system
5. **View rankings** via real-time leaderboards
6. **Track progress** through match history and rating changes

### MVP Goals

- ✅ Provide a functional competitive league system
- ✅ Ensure match result accuracy through opponent confirmation
- ✅ Maintain fair rankings using Elo rating system
- ✅ Support multiple game types with separate ratings
- ✅ Enable administrative oversight and control

### MVP Success Criteria

- Players can register, join leagues, and participate in matches
- Match results are accurately recorded and confirmed
- Rankings reflect player skill through Elo calculations
- System is secure with input validation and rate limiting
- Admin can manage system and resolve disputes

---

## Scope Decisions

### ✅ Included in MVP

#### Core Features
- **Dual League System**: Table Tennis and FIFA leagues with separate ratings
- **User Authentication**: Email/password registration and login via NextAuth
- **Player Profiles**: Basic profile creation linked to user accounts
- **League Membership**: Players can join multiple leagues
- **Challenge System**: Issue, accept, decline, and track challenges
- **Match Reporting**: Report match results with score validation
- **Opponent Confirmation**: Two-player confirmation before rating updates
- **Match Disputes**: Players can dispute incorrect match results
- **Elo Rating System**: Mathematical rankings with margin of victory bonuses
- **Real-time Leaderboards**: Live rankings updated after each match
- **Match History**: Complete game history with rating changes
- **Rating History**: Track rating changes over time per player

#### Administrative Features
- **Admin Dashboard**: System statistics and overview
- **User Management**: View and manage users, toggle admin status
- **Player Management**: View and manage player profiles
- **Match Management**: View all matches, void matches, resolve disputes
- **League Management**: View league statistics and data

#### Technical Features
- **Input Sanitization**: Protection against SQL injection and XSS
- **Input Validation**: Zod schema validation for all API requests
- **Rate Limiting**: Multiple rate limiters for different endpoints
- **Transaction Support**: Database transactions with backup/rollback
- **Database Triggers**: Automatic rating and stats updates
- **Error Handling**: Comprehensive error states and messages
- **Loading States**: Consistent loading indicators
- **Empty States**: User-friendly empty state messages
- **Success Feedback**: Success messages for user actions

#### UI/UX Features
- **Mobile-Friendly Design**: Responsive layout optimized for all devices
- **Consistent UI States**: Loading, error, empty, and success states
- **Navigation**: Clear navigation with pending items badges
- **Form Validation**: Client-side and server-side validation

#### Testing
- **Unit Tests**: Elo calculator tests
- **Integration Tests**: State transition tests
- **Component Tests**: UI component tests

### ❌ Excluded from MVP (Future Enhancements)

#### Authentication Enhancements
- Email verification
- Password reset functionality
- Social login (Google, GitHub, etc.)
- Two-factor authentication (2FA)
- OAuth providers

#### Advanced Features
- In-app notifications system
- Real-time updates via WebSockets
- Head-to-head statistics between players
- Season support with quarterly resets
- Tournament brackets
- Team-based leagues
- Custom league creation by users

#### Anti-Abuse Features
- Advanced cooldowns between matches
- Challenge frequency limits
- Suspicious activity detection
- Automated fraud detection

#### Analytics & Reporting
- Advanced analytics dashboard
- Player performance graphs
- Win/loss streaks tracking
- Detailed statistics per league
- Export data functionality

#### Communication Features
- In-app messaging between players
- Challenge notifications
- Match result notifications
- Email notifications

#### UI Enhancements
- Dark mode
- Custom themes
- Advanced filtering and sorting
- Data visualization charts
- Export/print functionality

### 🔄 Deferred Decisions

#### Database
- **Current**: PostgreSQL with Prisma ORM (production-ready, persistent)
- **Previous**: SQLite (file-based, ephemeral on Vercel) - ✅ Migrated
- **Decision**: PostgreSQL provides persistent storage and better scalability for production

#### Hosting
- **Current**: Vercel (serverless)
- **Future**: Consider AWS/Railway for persistent database
- **Decision**: Vercel sufficient for MVP deployment

#### Real-time Updates
- **Current**: Polling/refresh on navigation
- **Future**: WebSocket/Server-Sent Events for real-time
- **Decision**: Polling sufficient for MVP, real-time for future

---

## User Stories

### Authentication & User Management

#### ✅ US-001: User Registration
**As a** new user  
**I want to** register with my email and password  
**So that** I can create an account and participate in leagues

**Acceptance Criteria:**
- User can register with valid email and password (min 8 characters)
- Email must be unique
- Password is validated and sanitized
- User account is created in database
- Player profile is automatically created
- User is redirected to dashboard after registration

**Status**: ✅ Complete

---

#### ✅ US-002: User Login
**As a** registered user  
**I want to** log in with my email and password  
**So that** I can access my account and participate in leagues

**Acceptance Criteria:**
- User can log in with correct credentials
- Invalid credentials show error message
- Session is created and maintained
- User is redirected to dashboard after login
- Rate limiting prevents brute force attacks

**Status**: ✅ Complete

---

#### ✅ US-003: User Logout
**As a** logged-in user  
**I want to** log out of my account  
**So that** I can securely end my session

**Acceptance Criteria:**
- User can log out from any page
- Session is terminated
- User is redirected to home page
- User cannot access protected routes after logout

**Status**: ✅ Complete

---

### League Management

#### ✅ US-004: View Available Leagues
**As a** user  
**I want to** see available leagues (Table Tennis and FIFA)  
**So that** I can decide which leagues to join

**Acceptance Criteria:**
- All available leagues are displayed
- League name and game type are shown
- User can see which leagues they've already joined

**Status**: ✅ Complete

---

#### ✅ US-005: Join a League
**As a** player  
**I want to** join a league (Table Tennis or FIFA)  
**So that** I can participate in matches and compete for rankings

**Acceptance Criteria:**
- Player can join any available league
- Player can join multiple leagues
- Initial Elo rating of 1000 is assigned
- Player stats are initialized (0 games, 0 wins, 0 losses, 0 draws)
- Player appears in league leaderboard after joining

**Status**: ✅ Complete

---

#### ✅ US-006: View My Leagues
**As a** player  
**I want to** see which leagues I've joined  
**So that** I can track my participation

**Acceptance Criteria:**
- Dashboard shows all leagues player has joined
- League name, game type, and current rating are displayed
- Player can navigate to league-specific pages

**Status**: ✅ Complete

---

### Challenge System

#### ✅ US-007: Issue a Challenge
**As a** player  
**I want to** challenge another player in my league  
**So that** I can arrange a match

**Acceptance Criteria:**
- Player can select an opponent from their league
- Cannot challenge self
- Cannot challenge if pending challenge already exists
- Challenge is created with status 'pending'
- Challenge expires after 7 days if not accepted
- Challengee receives notification (via pending count badge)

**Status**: ✅ Complete

---

#### ✅ US-008: View Incoming Challenges
**As a** player  
**I want to** see challenges sent to me  
**So that** I can respond to them

**Acceptance Criteria:**
- Player can see all pending challenges where they are the challengee
- Challenger name and league are displayed
- Challenge creation date and expiration date are shown
- Player can accept or decline challenges

**Status**: ✅ Complete

---

#### ✅ US-009: View Outgoing Challenges
**As a** player  
**I want to** see challenges I've sent  
**So that** I can track their status

**Acceptance Criteria:**
- Player can see all challenges where they are the challenger
- Challengee name and league are displayed
- Challenge status (pending, accepted, declined, expired) is shown
- Player can cancel pending challenges

**Status**: ✅ Complete

---

#### ✅ US-010: Accept a Challenge
**As a** player  
**I want to** accept a challenge  
**So that** I can proceed to play the match

**Acceptance Criteria:**
- Player can accept pending challenges
- Challenge status changes to 'accepted'
- Both players can now report match results
- Challenge is linked to the match when reported

**Status**: ✅ Complete

---

#### ✅ US-011: Decline a Challenge
**As a** player  
**I want to** decline a challenge  
**So that** I can reject matches I don't want to play

**Acceptance Criteria:**
- Player can decline pending challenges
- Challenge status changes to 'declined'
- Challenge is removed from pending list
- Challenger is notified (via status update)

**Status**: ✅ Complete

---

### Match Reporting

#### ✅ US-012: Report a Match Result
**As a** player  
**I want to** report the result of a match  
**So that** my match can be recorded and ratings can be updated

**Acceptance Criteria:**
- Player can report match with scores for both players
- Scores must be non-negative integers
- Cannot report match against self
- Match is created with status 'pending_confirmation'
- Opponent must confirm before ratings update
- Match can be reported from accepted challenge or standalone

**Status**: ✅ Complete

---

#### ✅ US-013: Report Match from Challenge
**As a** player  
**I want to** report a match result from an accepted challenge  
**So that** the challenge is completed and ratings are updated

**Acceptance Criteria:**
- Player can report match directly from accepted challenge
- Challenge is automatically linked to match
- Challenge status updates to 'completed' when match is confirmed
- All validation rules apply

**Status**: ✅ Complete

---

### Match Confirmation

#### ✅ US-014: View Pending Confirmations
**As a** player  
**I want to** see matches awaiting my confirmation  
**So that** I can verify and confirm match results

**Acceptance Criteria:**
- Player sees all matches where they are participant but not reporter
- Match status is 'pending_confirmation'
- Reported scores are displayed
- Reporter name is shown
- Player can confirm or dispute the match

**Status**: ✅ Complete

---

#### ✅ US-015: Confirm a Match
**As a** player  
**I want to** confirm a match result reported by my opponent  
**So that** the match is finalized and ratings are updated

**Acceptance Criteria:**
- Player can confirm pending matches
- Match status changes to 'completed'
- Elo ratings are calculated and updated
- Player stats (wins/losses/draws) are updated
- Rating changes are recorded in history
- Leaderboard is updated
- Challenge status updates if linked

**Status**: ✅ Complete

---

#### ✅ US-016: Dispute a Match
**As a** player  
**I want to** dispute an incorrect match result  
**So that** errors can be corrected

**Acceptance Criteria:**
- Player can dispute pending matches
- Player must provide dispute reason
- Player can optionally provide corrected scores
- Match status changes to 'disputed'
- Admin is notified for review
- Match does not affect ratings until resolved

**Status**: ✅ Complete

---

### Leaderboards & Rankings

#### ✅ US-017: View League Leaderboard
**As a** player  
**I want to** see the leaderboard for my league  
**So that** I can see my ranking and compare with other players

**Acceptance Criteria:**
- Leaderboard shows all players in the league
- Players are ranked by Elo rating (highest first)
- Current rating, games played, wins, losses, draws are displayed
- Leaderboard updates in real-time after match confirmations
- Player's own position is highlighted

**Status**: ✅ Complete

---

#### ✅ US-018: View Player Ratings
**As a** player  
**I want to** see other players' ratings and statistics  
**So that** I can assess competition level

**Acceptance Criteria:**
- Player can view any player's profile
- Rating, games played, win/loss/draw stats are shown
- Rating history can be viewed
- Match history can be viewed

**Status**: ✅ Complete

---

### Match History

#### ✅ US-019: View My Match History
**As a** player  
**I want to** see my complete match history  
**So that** I can track my performance over time

**Acceptance Criteria:**
- Player can view all their matches
- Matches are displayed chronologically (newest first)
- Match details include: opponent, scores, result, rating change, date
- Matches can be filtered by league
- Match status (completed, pending, disputed) is shown

**Status**: ✅ Complete

---

#### ✅ US-020: View Rating History
**As a** player  
**I want to** see my rating changes over time  
**So that** I can track my progress

**Acceptance Criteria:**
- Player can view rating history per league
- Each rating change shows: old rating, new rating, change amount, match, date
- History is displayed chronologically
- Rating trends can be observed

**Status**: ✅ Complete

---

### Administrative Features

#### ✅ US-021: View System Statistics
**As an** administrator  
**I want to** view system-wide statistics  
**So that** I can monitor the health and usage of the system

**Acceptance Criteria:**
- Admin can view total users, players, leagues, matches
- Statistics include active challenges, pending confirmations
- System activity metrics are displayed
- Admin actions log is available

**Status**: ✅ Complete

---

#### ✅ US-022: Manage Users
**As an** administrator  
**I want to** view and manage user accounts  
**So that** I can maintain system integrity

**Acceptance Criteria:**
- Admin can view all users
- Admin can toggle admin status for users
- Admin can view user details
- User management actions are logged

**Status**: ✅ Complete

---

#### ✅ US-023: Manage Players
**As an** administrator  
**I want to** view and manage player profiles  
**So that** I can maintain player data

**Acceptance Criteria:**
- Admin can view all players
- Admin can view player statistics
- Admin can edit player information if needed
- Player management actions are logged

**Status**: ✅ Complete

---

#### ✅ US-024: Void a Match
**As an** administrator  
**I want to** void incorrect matches  
**So that** I can correct errors and maintain rating accuracy

**Acceptance Criteria:**
- Admin can void any match
- Rating changes are reverted when match is voided
- Player stats are updated accordingly
- Match status changes to 'voided'
- Void action is logged

**Status**: ✅ Complete

---

#### ✅ US-025: Resolve Disputed Matches
**As an** administrator  
**I want to** review and resolve disputed matches  
**So that** I can ensure match accuracy

**Acceptance Criteria:**
- Admin can view all disputed matches
- Admin can see dispute reason and corrected scores (if provided)
- Admin can approve match (confirm) or void match
- Resolution action is logged

**Status**: ✅ Complete

---

### UI/UX Features

#### ✅ US-026: Responsive Design
**As a** user  
**I want to** use the application on mobile devices  
**So that** I can access it anywhere

**Acceptance Criteria:**
- Application is fully functional on mobile browsers
- UI adapts to different screen sizes
- Touch interactions work correctly
- Forms are mobile-friendly

**Status**: ✅ Complete

---

#### ✅ US-027: Loading States
**As a** user  
**I want to** see loading indicators during operations  
**So that** I know the system is processing my request

**Acceptance Criteria:**
- Loading states are shown during API calls
- Loading indicators are consistent across the app
- Users understand what is being loaded

**Status**: ✅ Complete

---

#### ✅ US-028: Error Handling
**As a** user  
**I want to** see clear error messages  
**So that** I understand what went wrong and how to fix it

**Acceptance Criteria:**
- Error messages are user-friendly
- Error states are displayed consistently
- Users can retry failed operations
- Technical errors are logged for debugging

**Status**: ✅ Complete

---

#### ✅ US-029: Empty States
**As a** user  
**I want to** see helpful messages when there's no data  
**So that** I understand the current state

**Acceptance Criteria:**
- Empty states are shown when lists are empty
- Messages guide users on what to do next
- Empty states are consistent across the app

**Status**: ✅ Complete

---

#### ✅ US-030: Success Feedback
**As a** user  
**I want to** receive confirmation when actions succeed  
**So that** I know my action was completed

**Acceptance Criteria:**
- Success messages are shown after successful operations
- Success feedback is clear and actionable
- Users understand what happened next

**Status**: ✅ Complete

---

## Feature Status Summary

### ✅ Completed Features (MVP)

#### Authentication & User Management
- ✅ User registration
- ✅ User login/logout
- ✅ Session management
- ✅ Player profile creation

#### League Management
- ✅ League listing
- ✅ League joining
- ✅ League membership tracking
- ✅ Per-league ratings

#### Challenge System
- ✅ Challenge creation
- ✅ Challenge acceptance/decline
- ✅ Challenge tracking
- ✅ Challenge expiration (7 days)

#### Match Management
- ✅ Match reporting
- ✅ Match confirmation
- ✅ Match disputes
- ✅ Match history
- ✅ Rating history

#### Rankings & Leaderboards
- ✅ Real-time leaderboards
- ✅ Elo rating system
- ✅ Margin of victory bonuses
- ✅ Rating updates

#### Administrative Features
- ✅ Admin dashboard
- ✅ System statistics
- ✅ User management
- ✅ Player management
- ✅ Match management (void, resolve disputes)
- ✅ League management

#### Security & Validation
- ✅ Input sanitization
- ✅ Input validation (Zod)
- ✅ Rate limiting
- ✅ Transaction support
- ✅ Database triggers

#### UI/UX
- ✅ Responsive design
- ✅ Loading states
- ✅ Error states
- ✅ Empty states
- ✅ Success feedback
- ✅ Navigation with badges

#### Testing
- ✅ Elo calculator tests
- ✅ State transition tests
- ✅ Component tests

### 📋 Future Enhancements (Post-MVP)

- Email verification
- Password reset
- Social login
- In-app notifications
- Real-time updates (WebSockets)
- Head-to-head statistics
- Season support
- Tournament brackets
- Advanced analytics
- In-app messaging

---

## Technical Requirements

### Performance Requirements
- Page load time: < 2 seconds
- API response time: < 500ms
- Database queries: Optimized with indexes
- Rate limiting: Prevents abuse

### Security Requirements
- Input sanitization on all user inputs
- SQL injection prevention (parameterized queries)
- XSS prevention (input sanitization)
- Rate limiting on all API endpoints
- Authentication required for protected routes
- Authorization checks for admin routes

### Data Requirements
- Database transactions for data consistency
- Backup/rollback mechanism for critical operations
- Database triggers for automatic updates
- Foreign key constraints for data integrity

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design for all screen sizes

---

## Non-Functional Requirements

### Usability
- Intuitive navigation
- Clear error messages
- Consistent UI patterns
- Mobile-friendly interface

### Reliability
- Database transactions ensure data consistency
- Error handling prevents data corruption
- Backup/rollback for critical operations

### Maintainability
- TypeScript for type safety
- Modular component structure
- Comprehensive test coverage
- Clear code documentation

### Scalability
- Serverless architecture (Vercel)
- PostgreSQL database (production-ready, persistent storage)
- Prisma ORM for efficient database queries
- Stateless API design

---

## Constraints

### Technical Constraints
- PostgreSQL database (via Vercel Postgres or external provider)
- Serverless functions (30s timeout on Vercel)
- Prisma ORM for database access
- Database migrations required for schema changes

### Business Constraints
- MVP must be deployable quickly
- Must support at least 2 game types (Table Tennis, FIFA)
- Must support multiple leagues per game type

### Resource Constraints
- Single developer
- Limited time for MVP
- Free tier hosting (Vercel)

---

## Assumptions

1. **User Base**: Small to medium-sized group of players (10-100 users)
2. **Match Frequency**: Moderate (1-10 matches per player per week)
3. **Database Size**: Small to medium (thousands of records)
4. **Concurrent Users**: Low to moderate (1-50 simultaneous users)
5. **Network**: Reliable internet connection for all users

---

## Dependencies

### External Dependencies
- Next.js 14 (App Router)
- NextAuth.js (Authentication)
- Prisma (Database ORM)
- PostgreSQL (Database)
- Zod (Validation)
- Tailwind CSS (Styling)

### Internal Dependencies
- Elo Calculator (Rating system)
- Database Schema (All tables and triggers)
- API Routes (All endpoints)
- UI Components (Reusable components)

---

## Success Metrics

### MVP Success Metrics
- ✅ All core user stories implemented
- ✅ System is functional and deployable
- ✅ Security measures in place
- ✅ Data integrity maintained
- ✅ User experience is smooth

### Future Success Metrics (Post-MVP)
- User engagement (matches per week)
- System reliability (uptime, error rate)
- User satisfaction (feedback)
- Performance metrics (response times)

---


**Last Updated**: January 2026  
**Status**: MVP Complete ✅
