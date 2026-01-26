# League Ladder - Requirements Document

**Last Updated**: January 2026  
**Status**: MVP Complete ✅  
**Version**: 2.0

---

## MVP Definition

### Minimum Viable Product (MVP)

The League Ladder MVP is a **competitive ranking system** that enables players to:

1. **Join leagues** for different games (Table Tennis and FIFA)
2. **Challenge opponents** within their leagues
3. **Report match results** with score tracking
4. **Confirm matches** through a two-player verification system
5. **View rankings** via real-time leaderboards
6. **Track progress** through match history and rating changes
7. **Admin oversight** for system management and dispute resolution

### MVP Goals

- ✅ Provide a functional competitive league system
- ✅ Ensure match result accuracy through opponent confirmation
- ✅ Maintain fair rankings using Elo rating system
- ✅ Support multiple game types with separate ratings
- ✅ Enable comprehensive administrative oversight and control
- ✅ Provide audit trail for all admin actions

### MVP Success Criteria

- Players can register, join leagues, and participate in matches
- Match results are accurately recorded and confirmed
- Rankings reflect player skill through Elo calculations
- System is secure with input validation and rate limiting
- Admin can manage system, resolve disputes, and maintain data integrity
- All admin actions are logged for accountability
- Voided matches are properly handled and excluded from history

---

## Scope Decisions

### ✅ Included in MVP

#### Core Features
- **Dual League System**: Table Tennis and FIFA leagues with separate ratings
- **User Authentication**: Email/password registration and login via NextAuth.js
- **Player Profiles**: Basic profile creation linked to user accounts
- **League Membership**: Players can join multiple leagues simultaneously
- **Challenge System**: Issue, accept, decline, cancel, and track challenges
- **Challenge Expiration**: Automatic expiration after 7 days
- **Match Reporting**: Report match results with score validation
- **Opponent Confirmation**: Two-player confirmation before rating updates
- **Match Disputes**: Players can dispute incorrect match results
- **Elo Rating System**: Mathematical rankings with margin of victory bonuses (K-factor: 32)
- **Real-time Leaderboards**: Live rankings updated after each match
- **Match History**: Complete game history with rating changes (excluding voided matches)
- **Rating History**: Track rating changes over time per player (excluding voided matches)
- **Player Profiles**: View player statistics, ratings, and match history

#### Administrative Features
- **Admin Dashboard**: Comprehensive system statistics and overview
- **User Management**: View users, toggle admin status, delete users
- **Player Management**: View players, adjust ratings/stats, delete players
- **Match Management**: View all matches, void/un-void matches, edit scores, delete matches
- **League Management**: View league statistics and member counts
- **Admin Action Logging**: All admin actions logged for audit trail
- **Admin Activity Indicators**: Admin changes visible in player profiles and match history
- **Database Cleanup**: Preview and perform database cleanup operations
- **League Selection for Ratings**: When adjusting ratings for multi-league players, admin selects specific league

#### Technical Features
- **Input Sanitization**: Protection against SQL injection and XSS attacks
- **Input Validation**: Zod schema validation for all API requests
- **Rate Limiting**: Multiple rate limiters for different endpoint types
  - `apiRateLimit`: General API endpoints
  - `strictRateLimit`: Admin and sensitive operations
- **Transaction Support**: Prisma database transactions with automatic rollback on errors
- **Error Handling**: Comprehensive error states and messages
- **Loading States**: Consistent loading indicators
- **Empty States**: User-friendly empty state messages
- **Success Feedback**: Success messages for user actions

#### UI/UX Features
- **Mobile-Friendly Design**: Responsive layout optimized for all devices
- **Dark Theme**: Modern dark theme with consistent styling
- **Consistent UI States**: Loading, error, empty, and success states
- **Navigation**: Clear navigation with pending items badges
- **Form Validation**: Client-side and server-side validation
- **PWA Support**: Progressive Web App capabilities

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
- Account recovery mechanisms

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
- Account lockout after failed attempts

#### Analytics & Reporting
- Advanced analytics dashboard with graphs
- Player performance graphs and charts
- Win/loss streaks tracking
- Detailed statistics per league
- Export data functionality
- Rating trend visualizations

#### Communication Features
- In-app messaging between players
- Challenge notifications
- Match result notifications
- Email notifications
- Browser push notifications

#### UI Enhancements
- Theme customization (light/dark toggle)
- Advanced filtering and sorting
- Data visualization charts
- Export/print functionality
- Print-friendly views

### 🔄 Deferred Decisions

#### Database
- **Current**: PostgreSQL with Prisma ORM (production-ready, persistent)
- **Previous**: SQLite (file-based, ephemeral on Vercel) - ✅ Migrated to PostgreSQL
- **Decision**: PostgreSQL provides persistent storage and better scalability for production

#### Hosting
- **Current**: Vercel (serverless) with PostgreSQL
- **Future**: Consider AWS Amplify or other platforms for additional deployment options
- **Decision**: Vercel sufficient for MVP deployment with persistent PostgreSQL database

#### Real-time Updates
- **Current**: Polling/refresh on navigation
- **Future**: WebSocket/Server-Sent Events for real-time updates
- **Decision**: Polling sufficient for MVP, real-time for future enhancement

#### Business Logic Location
- **Current**: All business logic in application layer (Prisma transactions)
- **Previous Consideration**: Database triggers for automatic updates
- **Decision**: Application-layer logic provides better control, testability, and maintainability

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
- Player profile is automatically created upon first league join
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
- Session is created and maintained via NextAuth.js
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
- League statistics (member count) are displayed

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
- Player profile is created if it doesn't exist

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
- League membership status is clearly indicated

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
- Expired challenges are clearly marked

**Status**: ✅ Complete

---

#### ✅ US-009: View Outgoing Challenges
**As a** player  
**I want to** see challenges I've sent  
**So that** I can track their status

**Acceptance Criteria:**
- Player can see all challenges where they are the challenger
- Challengee name and league are displayed
- Challenge status (pending, accepted, declined, expired, completed) is shown
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
- Expired challenges cannot be accepted

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

#### ✅ US-012: Cancel a Challenge
**As a** player  
**I want to** cancel a challenge I created  
**So that** I can withdraw if circumstances change

**Acceptance Criteria:**
- Challenger can cancel pending challenges
- Challenge is removed from system
- Challengee no longer sees the challenge
- Cancellation is immediate

**Status**: ✅ Complete

---

### Match Reporting

#### ✅ US-013: Report a Match Result
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
- Reporter is tracked in match record

**Status**: ✅ Complete

---

#### ✅ US-014: Report Match from Challenge
**As a** player  
**I want to** report a match result from an accepted challenge  
**So that** the challenge is completed and ratings are updated

**Acceptance Criteria:**
- Player can report match directly from accepted challenge
- Challenge is automatically linked to match
- Challenge status updates to 'completed' when match is confirmed
- All validation rules apply
- Only one match can be created per challenge

**Status**: ✅ Complete

---

### Match Confirmation

#### ✅ US-015: View Pending Confirmations
**As a** player  
**I want to** see matches awaiting my confirmation  
**So that** I can verify and confirm match results

**Acceptance Criteria:**
- Player sees all matches where they are participant but not reporter
- Match status is 'pending_confirmation'
- Reported scores are displayed
- Reporter name is shown
- Player can confirm or dispute the match
- League information is displayed

**Status**: ✅ Complete

---

#### ✅ US-016: Confirm a Match
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
- Confirmation is logged

**Status**: ✅ Complete

---

#### ✅ US-017: Dispute a Match
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
- Dispute is logged

**Status**: ✅ Complete

---

### Leaderboards & Rankings

#### ✅ US-018: View League Leaderboard
**As a** player  
**I want to** see the leaderboard for my league  
**So that** I can see my ranking and compare with other players

**Acceptance Criteria:**
- Leaderboard shows all players in the league
- Players are ranked by Elo rating (highest first)
- Current rating, games played, wins, losses, draws are displayed
- Leaderboard updates after match confirmations
- Player's own position can be identified

**Status**: ✅ Complete

---

#### ✅ US-019: View Player Profile
**As a** player  
**I want to** see other players' ratings and statistics  
**So that** I can assess competition level

**Acceptance Criteria:**
- Player can view any player's profile
- Rating, games played, win/loss/draw stats are shown per league
- Rating history can be viewed
- Match history can be viewed
- Admin activity indicators are shown if applicable
- Recent activity includes admin adjustments

**Status**: ✅ Complete

---

### Match History

#### ✅ US-020: View My Match History
**As a** player  
**I want to** see my complete match history  
**So that** I can track my performance over time

**Acceptance Criteria:**
- Player can view all their matches
- Matches are displayed chronologically (newest first)
- Match details include: opponent, scores, result, rating change, date
- Matches can be filtered by league
- Match status (completed, pending, disputed) is shown
- Voided matches are excluded from history
- Admin adjustments are indicated when present

**Status**: ✅ Complete

---

#### ✅ US-021: View Rating History
**As a** player  
**I want to** see my rating changes over time  
**So that** I can track my progress

**Acceptance Criteria:**
- Player can view rating history per league
- Each rating change shows: old rating, new rating, change amount, match, date
- History is displayed chronologically
- Rating trends can be observed
- Voided matches are excluded from rating history
- Opponent information is included

**Status**: ✅ Complete

---

### Administrative Features

#### ✅ US-022: View System Statistics
**As an** administrator  
**I want to** view system-wide statistics  
**So that** I can monitor the health and usage of the system

**Acceptance Criteria:**
- Admin can view total users, players, leagues, matches, challenges
- Statistics include match status breakdown (completed, pending, voided)
- Statistics include challenge status breakdown
- System activity metrics are displayed (recent matches, challenges, users)
- Top players are displayed
- League statistics are shown

**Status**: ✅ Complete

---

#### ✅ US-023: Manage Users
**As an** administrator  
**I want to** view and manage user accounts  
**So that** I can maintain system integrity

**Acceptance Criteria:**
- Admin can view all users
- Admin can toggle admin status for users
- Admin can view user details
- Admin can delete users (with cascade to players)
- Cannot delete own account
- User management actions are logged

**Status**: ✅ Complete

---

#### ✅ US-024: Manage Players
**As an** administrator  
**I want to** view and manage player profiles  
**So that** I can maintain player data

**Acceptance Criteria:**
- Admin can view all players
- Admin can view player statistics across all leagues
- Admin can view player details including all league ratings
- Admin can delete players (with cascade to related data)
- Player management actions are logged

**Status**: ✅ Complete

---

#### ✅ US-025: Adjust Player Rating
**As an** administrator  
**I want to** manually adjust a player's rating  
**So that** I can correct errors or make fair adjustments

**Acceptance Criteria:**
- Admin can adjust rating for a specific player and league
- If player is in multiple leagues, admin must select which league to adjust
- Rating must be between 0 and 5000
- Old and new ratings are logged
- Admin can provide reason for adjustment
- Adjustment is visible in player's profile and match history
- Action is logged in admin actions

**Status**: ✅ Complete

---

#### ✅ US-026: Adjust Player Statistics
**As an** administrator  
**I want to** manually adjust a player's statistics (wins, losses, draws, games played)  
**So that** I can correct errors in record keeping

**Acceptance Criteria:**
- Admin can adjust stats for a specific player and league
- Admin can update wins, losses, draws, and games played independently
- All stat values must be non-negative
- Old and new stats are logged
- Admin can provide reason for adjustment
- Adjustment is visible in player's profile
- Action is logged in admin actions

**Status**: ✅ Complete

---

#### ✅ US-027: Void a Match
**As an** administrator  
**I want to** void incorrect matches  
**So that** I can correct errors and maintain rating accuracy

**Acceptance Criteria:**
- Admin can void any completed match
- Rating changes are reverted when match is voided
- Player stats are updated accordingly (decremented)
- Match status changes to 'voided'
- Voided matches are excluded from player match history
- Voided matches are excluded from rating history
- Void action is logged

**Status**: ✅ Complete

---

#### ✅ US-028: Un-void a Match
**As an** administrator  
**I want to** restore a voided match  
**So that** I can correct mistakes in voiding

**Acceptance Criteria:**
- Admin can un-void any voided match
- Ratings are recalculated and updated
- Player stats are updated accordingly (incremented)
- Match status changes to 'completed'
- Match is restored to match history
- Rating updates are recreated
- Un-void action is logged

**Status**: ✅ Complete

---

#### ✅ US-029: Edit Match Scores
**As an** administrator  
**I want to** edit match scores  
**So that** I can correct reporting errors

**Acceptance Criteria:**
- Admin can edit scores for any match
- If match was completed, old ratings are reverted first
- New ratings are calculated based on new scores
- Player stats are updated accordingly
- Rating updates are recalculated
- Admin can provide reason for edit
- Edit action is logged
- Match score edit is indicated in player match history

**Status**: ✅ Complete

---

#### ✅ US-030: Delete a Match
**As an** administrator  
**I want to** permanently delete a match  
**So that** I can remove incorrect or test data

**Acceptance Criteria:**
- Admin can delete any match
- Match and all related data (confirmations, rating updates) are deleted
- If match was completed, ratings should be reverted first (or match voided instead)
- Delete action is logged

**Status**: ✅ Complete

---

#### ✅ US-031: Resolve Disputed Matches
**As an** administrator  
**I want to** review and resolve disputed matches  
**So that** I can ensure match accuracy

**Acceptance Criteria:**
- Admin can view all disputed matches
- Admin can see dispute reason and corrected scores (if provided)
- Admin can approve match (confirm) or void match
- Admin can edit scores if needed
- Resolution action is logged

**Status**: ✅ Complete

---

#### ✅ US-032: View Admin Action Log
**As an** administrator  
**I want to** view a log of all admin actions  
**So that** I can maintain accountability and audit system changes

**Acceptance Criteria:**
- All admin actions are automatically logged
- Log includes: admin user, action type, target, details, timestamp
- Actions are visible in player profiles where applicable
- Admin activity is indicated in match history

**Status**: ✅ Complete

---

#### ✅ US-033: Database Cleanup
**As an** administrator  
**I want to** clean up orphaned records and expired data  
**So that** I can maintain database health

**Acceptance Criteria:**
- Admin can preview what will be cleaned up
- Admin can perform database cleanup
- Orphaned records are identified and can be deleted
- Expired challenges can be cleaned up
- Cleanup actions are logged

**Status**: ✅ Complete

---

### UI/UX Features

#### ✅ US-034: Responsive Design
**As a** user  
**I want to** use the application on mobile devices  
**So that** I can access it anywhere

**Acceptance Criteria:**
- Application is fully functional on mobile browsers
- UI adapts to different screen sizes
- Touch interactions work correctly
- Forms are mobile-friendly
- Navigation is accessible on small screens

**Status**: ✅ Complete

---

#### ✅ US-035: Dark Theme
**As a** user  
**I want to** use the application with a dark theme  
**So that** I have a modern, comfortable viewing experience

**Acceptance Criteria:**
- Application uses a consistent dark theme
- All pages and components follow the dark theme
- Text is readable with good contrast
- UI elements are clearly visible

**Status**: ✅ Complete

---

#### ✅ US-036: Loading States
**As a** user  
**I want to** see loading indicators during operations  
**So that** I know the system is processing my request

**Acceptance Criteria:**
- Loading states are shown during API calls
- Loading indicators are consistent across the app
- Users understand what is being loaded
- Skeleton loaders are used where appropriate

**Status**: ✅ Complete

---

#### ✅ US-037: Error Handling
**As a** user  
**I want to** see clear error messages  
**So that** I understand what went wrong and how to fix it

**Acceptance Criteria:**
- Error messages are user-friendly
- Error states are displayed consistently
- Users can retry failed operations
- Technical errors are logged for debugging
- Error boundaries prevent app crashes

**Status**: ✅ Complete

---

#### ✅ US-038: Empty States
**As a** user  
**I want to** see helpful messages when there's no data  
**So that** I understand the current state

**Acceptance Criteria:**
- Empty states are shown when lists are empty
- Messages guide users on what to do next
- Empty states are consistent across the app
- Empty states are visually appealing

**Status**: ✅ Complete

---

#### ✅ US-039: Success Feedback
**As a** user  
**I want to** receive confirmation when actions succeed  
**So that** I know my action was completed

**Acceptance Criteria:**
- Success messages are shown after successful operations
- Success feedback is clear and actionable
- Users understand what happened next
- Success states are consistent

**Status**: ✅ Complete

---

#### ✅ US-040: Navigation Badges
**As a** user  
**I want to** see counts of pending items in navigation  
**So that** I know when I have actions to take

**Acceptance Criteria:**
- Navigation shows count of pending challenges
- Navigation shows count of pending match confirmations
- Badges update when items are processed
- Badges are clearly visible

**Status**: ✅ Complete

---

## Feature Status Summary

### ✅ Completed Features (MVP)

#### Authentication & User Management
- ✅ User registration
- ✅ User login/logout
- ✅ Session management (NextAuth.js)
- ✅ Player profile creation (automatic on first league join)

#### League Management
- ✅ League listing
- ✅ League joining
- ✅ League membership tracking
- ✅ Per-league ratings
- ✅ League statistics

#### Challenge System
- ✅ Challenge creation
- ✅ Challenge acceptance/decline/cancel
- ✅ Challenge tracking (incoming/outgoing)
- ✅ Challenge expiration (7 days)
- ✅ Challenge-to-match flow

#### Match Management
- ✅ Match reporting
- ✅ Match confirmation
- ✅ Match disputes
- ✅ Match history (excluding voided)
- ✅ Rating history (excluding voided)
- ✅ Match voiding/un-voiding (admin)
- ✅ Match score editing (admin)
- ✅ Match deletion (admin)

#### Rankings & Leaderboards
- ✅ Real-time leaderboards
- ✅ Elo rating system (K-factor: 32)
- ✅ Margin of victory bonuses (up to 2.0x)
- ✅ Rating updates
- ✅ Per-league rankings

#### Administrative Features
- ✅ Admin dashboard
- ✅ System statistics
- ✅ User management (view, toggle admin, delete)
- ✅ Player management (view, delete)
- ✅ Rating adjustments (with league selection)
- ✅ Stats adjustments (wins, losses, draws, games played)
- ✅ Match management (view, void, un-void, edit scores, delete)
- ✅ League management (view statistics)
- ✅ Admin action logging
- ✅ Admin activity indicators in player profiles
- ✅ Database cleanup (preview and execute)

#### Security & Validation
- ✅ Input sanitization
- ✅ Input validation (Zod)
- ✅ Rate limiting (multiple limiters)
- ✅ Transaction support (Prisma transactions with rollback)
- ✅ Authentication guards
- ✅ Admin authorization (database-verified)

#### UI/UX
- ✅ Responsive design
- ✅ Dark theme
- ✅ Loading states
- ✅ Error states
- ✅ Empty states
- ✅ Success feedback
- ✅ Navigation with badges
- ✅ PWA support

#### Testing
- ✅ Elo calculator tests
- ✅ State transition tests
- ✅ Component tests

### 📋 Future Enhancements (Post-MVP)

#### Authentication
- Email verification
- Password reset
- Social login (OAuth)
- Two-factor authentication

#### Features
- In-app notifications
- Real-time updates (WebSockets)
- Head-to-head statistics
- Season support
- Tournament brackets
- Custom league creation
- Advanced analytics with charts

#### Communication
- In-app messaging
- Email notifications
- Push notifications

#### UI/UX
- Theme customization (light/dark toggle)
- Advanced filtering
- Data visualization
- Export functionality

---

## Technical Requirements

### Performance Requirements
- Page load time: < 2 seconds
- API response time: < 500ms
- Database queries: Optimized with indexes
- Rate limiting: Prevents abuse
- Connection pooling: Managed by Prisma

### Security Requirements
- Input sanitization on all user inputs
- SQL injection prevention (Prisma parameterized queries)
- XSS prevention (input sanitization)
- Rate limiting on all API endpoints
- Authentication required for protected routes
- Authorization checks for admin routes (database-verified)
- Admin action logging for audit trail

### Data Requirements
- Database transactions for data consistency (Prisma `$transaction`)
- Automatic rollback on errors
- Foreign key constraints for data integrity
- Unique constraints to prevent duplicates
- Cascade deletes for referential integrity

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design for all screen sizes
- PWA support for mobile installation

---

## Non-Functional Requirements

### Usability
- Intuitive navigation
- Clear error messages
- Consistent UI patterns
- Mobile-friendly interface
- Dark theme for modern appearance

### Reliability
- Database transactions ensure data consistency
- Error handling prevents data corruption
- Automatic rollback on transaction errors
- Prisma connection pooling for reliability

### Maintainability
- TypeScript for type safety
- Modular component structure
- Comprehensive test coverage
- Clear code documentation
- Prisma ORM for type-safe database access

### Scalability
- Serverless architecture (Vercel)
- PostgreSQL database (production-ready, persistent storage)
- Prisma ORM for efficient database queries
- Stateless API design
- Connection pooling for database efficiency

---

## Constraints

### Technical Constraints
- PostgreSQL database (via Vercel Postgres or external provider)
- Serverless functions (30s timeout on Vercel)
- Prisma ORM for database access
- Database migrations required for schema changes
- No database triggers (all logic in application layer)

### Business Constraints
- MVP must be deployable quickly
- Must support at least 2 game types (Table Tennis, FIFA)
- Must support multiple leagues per game type
- Must provide admin oversight capabilities

### Resource Constraints
- Single developer
- Limited time for MVP
- Free tier hosting (Vercel)
- PostgreSQL database (managed service)

---

## Assumptions

1. **User Base**: Small to medium-sized group of players (10-100 users)
2. **Match Frequency**: Moderate (1-10 matches per player per week)
3. **Database Size**: Small to medium (thousands of records)
4. **Concurrent Users**: Low to moderate (1-50 simultaneous users)
5. **Network**: Reliable internet connection for all users
6. **Admin Access**: Limited number of trusted administrators

---

## Dependencies

### External Dependencies
- Next.js 14 (App Router)
- NextAuth.js (Authentication)
- Prisma (Database ORM)
- PostgreSQL (Database)
- Zod (Validation)
- Tailwind CSS (Styling)
- React 19
- TypeScript

### Internal Dependencies
- Elo Calculator (Rating system)
- Database Schema (All tables and relationships)
- API Routes (All endpoints)
- UI Components (Reusable components)
- Rate Limiting (Security)
- Input Sanitization (Security)

---

## Success Metrics

### MVP Success Metrics
- ✅ All core user stories implemented (40 user stories)
- ✅ System is functional and deployable
- ✅ Security measures in place
- ✅ Data integrity maintained
- ✅ User experience is smooth
- ✅ Admin capabilities comprehensive
- ✅ All admin actions logged
- ✅ Production deployment successful

### Future Success Metrics (Post-MVP)
- User engagement (matches per week)
- System reliability (uptime, error rate)
- User satisfaction (feedback)
- Performance metrics (response times)
- Admin action frequency
- Database growth patterns

---

## MVP Completion Status

**Status**: ✅ **MVP Complete - Production Ready**

All MVP features have been implemented, tested, and deployed to production. The system is fully functional and ready for real-world use.

**Completion Date**: January 2026

---

**Last Updated**: January 2026  
**Document Version**: 2.0  
**Status**: MVP Complete ✅
