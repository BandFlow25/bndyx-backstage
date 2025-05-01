# bndy Platform Build To-Do List

This to-do list provides a strict technical build task list to construct the bndy platform from scratch, based on the Product Requirements Document (PRD). Tasks are organized into phases for setup, development, testing, and deployment, covering all components (`bndy.landing`, `bndy.live`, `bndy.core`, `bndy.ui`). 

## Phase 1: Project Setup and Infrastructure

### 1.1 Initialize Project Structure

- Create four separate Git repositories:
  - `bndy.landing`: Authentication hub and static pages. 
  - `bndy.live`: Event discovery platform.
  - `bndy.core`: BAV management platform.
  - `bndy.ui`: Shared UI components and auth logic (NPM package).
- In each repo, create a `README.md` with:
  - Purpose per PRD Section 1.2.
  - Setup instructions (e.g., install dependencies, configure environment variables).
  - Deployment instructions (e.g., deploy to Vercel).
- Configure GitHub Actions for CI:
  - Run linting and unit tests on pull requests.
  - Fail PR if tests or linting fail.

### 1.2 Configure Development Environment

- Set up Node.js and npm in each repo per PRD Section 3.7.
- Initialize with TypeScript and React for frontend, Firebase Functions for backend.
- Install dependencies per PRD Section 3.7:
  - All repos: Firebase SDK (auth, Firestore, Storage), Emotion (CSS-in-JS).
  - `bndy.live`: Leaflet (maps), Google Places API client.
  - `bndy.core`: Spotify Web API client.
  - `bndy.ui`: Testing tools (e.g., Jest, React Testing Library).
- Create `.env` files for API keys (Firebase, Google Places, Spotify, WhatsApp), ensuring no hard-coded keys.

### 1.3 Set Up Firebase

- Create a Firebase project (`bndy-platform`).
- Enable Firebase Auth per PRD Section 3.2:
  - Email/password provider.
  - Google OAuth (`email`, `profile` scopes).
  - Facebook OAuth (`email`, `public_profile`, `manage_pages` scopes).
- Configure Firestore with collections per PRD Sections 2.1-2.4 (data requirements):
  - `users`, `bands`, `venues`, `events`, `invites`.
  - Add indexes for efficient queries (e.g., `events` by date and location).
- Set Firestore RLS rules per PRD Section 3.3:
  - `user`: Read events/profiles, write to own favorites/notifications.
  - `profile_owner`: Read/write own profile, calendar, setlists, events, invitations (admin role for invite management).
  - `builder`: Full read/write access.
- Enable Firebase Storage for avatars (1MB limit, images only).
- Set Firebase Blaze plan with a $100/month budget alert per PRD Section 3.1.

### 1.4 Configure Domains and Deployment

- Register domains: `bndy.co.uk` and `bndy.live`.
- Configure DNS per `updated-deployment-architecture.mermaid`:
  - `bndy.co.uk` and `www.bndy.co.uk` for `bndy.landing`.
  - `bndy.live` for `bndy.live`.
  - `my.bndy.co.uk` for `bndy.core`.
- Set up Vercel projects for each code base per PRD Section 3.5.
- Enable Vercel WAF attack challenge mode per PRD Section 3.3.
- Publish `bndy.ui` as an NPM package and import into other apps per PRD Section 3.5.

## Phase 2: Develop bndy.ui (Shared Components)

### 2.1 Develop UI Components

- Build shared UI components per PRD Sections 2.1-2.3:
  - `EventCard`: For sidebar/feed (artist/venue avatar, title, time, distance).
  - `Datepicker`: For date selectors (supports presets: Today, Tomorrow, etc.).
  - `Button`: For CTAs (primary, secondary, outline variants).
  - `Wizard`: Multi-step form for event submission (venue, artist(s), date/time, details).
- Style components per `bndy-style-guide.md` (e.g., colors, typography, layouts).
- Write unit tests:
  - `EventCard`: Renders all fields, clickable.
  - `Datepicker`: Selects dates, applies presets.
  - `Button`: Renders variants, responds to clicks.
  - `Wizard`: Steps transition, validates inputs, submits data.

### 2.2 Develop Authentication Components

- Build auth components per PRD Section 3.2 and `updated-auth-flow.mermaid`:
  - Context provider: Manage auth state (user, role, token).
  - `LoginForm`, `SignUpForm`, `ResetPasswordForm`, `ConfirmResetForm`: Support email/password and OAuth (Google, Facebook).
  - Protected route component: Restrict access by role.
  - Cross-app redirect utility: Preserve token during redirects.
- Add CAPTCHA to login/signup forms per PRD Section 3.3.
- Style per `bndy-style-guide.md`.
- Write unit tests:
  - Context provider: Updates state on login/logout.
  - Forms: Render, validate, submit, handle OAuth.
  - Protected routes: Redirect unauthorized users, allow authorized.
  - Redirect utility: Preserves token, redirects correctly.

### 2.3 Publish bndy.ui

- Publish `bndy.ui` as an NPM package (`@bndy/ui`) for use in other apps.

## Phase 3: Develop bndy.landing (Authentication Hub)

### 3.1 Static Pages

- Build static pages on `bndy.co.uk` per PRD Section 2.3:
  - Landing page: Overview of bndy platform, CTA to `bndy.live`.
  - About, T&Cs, Contact pages: Basic content, contact form (submits to admin email, manual for MVP).
- Style per `bndy-style-guide.md`.

### 3.2 Authentication Flows

- Implement Firebase Auth per PRD Section 3.2 and `updated-auth-flow.mermaid`:
  - Email/password login/signup.
  - Google and Facebook OAuth.
- Add routes: `/login`, `/register`, `/reset-password`, `/confirm-reset`.
- Use `bndy.ui` auth components.
- Pre-fill profile data (optional) from OAuth per PRD Section 3.4.
- Redirect users to originating app with token per `updated-auth-flow.mermaid`.
- Style per `bndy-style-guide.md`.

### 3.3 Claim Process

- Build `/claim` route per PRD Section 2.3:
  - Form: Email (required), Facebook URL (optional).
  - CAPTCHA on submission.
  - Store claim request in Firestore for builder review.
- Notify builders for review (manual process for MVP).
- Update user role to `profile_owner` upon approval, redirect to `my.bndy.co.uk`.

### 3.4 Team Invitation System

- Build invitation system per PRD Section 2.3 and `updated-auth-flow.mermaid`:
  - Generate unique, secure invite link for bands.
  - Allow admins to activate/deactivate or regenerate links.
  - Track usage history (users who joined, dates).
  - Share link via copy or external messaging apps (e.g., WhatsApp).
  - Joining flow: Redirect to `/register` or `/profile-setup`, add user to band, redirect to `my.bndy.co.uk`.
- Store invites in Firestore per PRD data requirements.

## Phase 4: Develop bndy.live (Frontstage: Event Discovery)

### 4.1 Map View

- Integrate Leaflet for mobile-first map per PRD Section 2.1.
- Load user's local area (geolocation or default to a major UK city).
- Fetch events from Firestore (viewport-based, max 500 events):
  - Query by date and location.
  - Cache events (Redis/Firestore TTL, 1-hour).
- Display clustered gig pins; support zoom, pan, click interactions; tap pin for overlay (title, artist(s), venue, date, time, poster/description, photos, social links, directions, contact info, ticket links, share buttons).
- Style per `bndy-style-guide.md`.

### 4.2 Sidebar/Feed

- Build collapsible sidebar with mini event cards per PRD Section 2.1.
- Use `EventCard` from `bndy.ui`.
- Filter by date range (same as map).
- Style per `bndy-style-guide.md`.

### 4.3 Date Selectors and Filters

- Add date selectors above map per PRD Section 2.1:
  - Presets: Today (default), Tomorrow, This Weekend, Next Weekend.
  - Calendar picker for custom ranges.
- Add sidebar filters: Genre, location, ticketed/free, open mic.
- Use `Datepicker` from `bndy.ui`.
- Style per `bndy-style-guide.md`.

### 4.4 List and Venue Views

- Build toggleable list view using `EventCard` per PRD Section 2.1.
- Build venue view: Toggle to show all venues (pins, distinct markers for future gigs); include overlay (photos, social links, directions, contact info, ticket links, share buttons).
- Style per `bndy-style-guide.md`.

### 4.5 Profiles

- Build artist/band profiles per PRD Section 2.1:
  - Fields: Hometown, genres (array), avatar, social links (including external media links), future gigs list.
  - UI labels based on `type` (artist/band).
- Build venue profiles: Google Place ID, avatar, social links, upcoming gigs.
- Add "Add Event" button (visible to profile owners, admins, builders; redirects to wizard).
- Add "Claim this profile!" link (redirects to `bndy.co.uk/claim`).
- Style per `bndy-style-guide.md`.

### 4.6 Event Wizard

- Build wizard at `bndy.live/add-event` as a standalone page per PRD Section 2.1:
  - Steps: Venue, artist(s) (2-5, headliner option), date/time (Event Series option), details (title, poster URL, description).
  - Support OBOV, Open Mic (with special visual treatment per style guide), Multi-Artist, Event Series.
  - CAPTCHA for anonymous users, optional email/mobile for notifications.
  - Add "See all events on bndy.live!" CTA linking to `bndy.live` homepage.
- Share URL (`bndy.live/add-event`) in Facebook groups for event submissions.
- Add AI keyword checks to flag non-music events.
- Store events in Firestore per PRD data requirements.
- Style per `bndy-style-guide.md`.

### 4.7 Registered Features

- Implement follow/favorite for bands/venues per PRD Section 2.1.
- Build personalized gig list (favorites only or widened).
- Allow saving custom filters.
- Store in Firestore per PRD data requirements.
- Style per `bndy-style-guide.md`.

### 4.8 User Actions

- Add sharing for events/venues via Web Share API per PRD Section 2.1.
- Enable clicking to view artist/venue profiles.
- Style per `bndy-style-guide.md`.

## Phase 5: Develop bndy.core (Backstage: BAV Management)

### 5.1 Profile Management

- Build artist/band profile editor on `my.bndy.co.uk` per PRD Section 2.2:
  - Fields: Hometown, genres (array), avatar, social links (including external media links), shows.
  - Required: `displayName`, `fullName`, `postcode`, `instruments`.
  - UI labels based on `type` (artist/band).
- Build venue profile editor: Google Place ID, avatar, social links, upcoming gigs list.
- Style per `bndy-style-guide.md`.

### 5.2 Playbook and Setlists

- Build playbook editor per PRD Section 2.2:
  - Add songs, notes, chord charts, lyrics.
  - Enrich with MusicBrainz/Spotify metadata (key, tempo, duration).
- Build setlist editor: Drag-and-drop songs, multiple sets, duration alerts, setup notes, segues, encore/extra container; ensure touch-friendly interactions for mobile devices; support save, share, and export functionality.
- Add "bndy.ai Suggest Setlist" per PRD Section 2.2:
  - Option 1: Input duration/vibe, generate setlist (rules: high-tempo start, set 2 peaks, big finish).
  - Option 2: Select songs, suggest run order.
  - Editable output, toaster ("Crafting your perfect gig!").
- Style per `bndy-style-guide.md`.

### 5.3 Song Pipeline

- Build song suggestion workflow per PRD Section 2.2:
  - Suggest songs, vote 0-5, highlight for review (practice, playbook, park, bin).
  - Practice list: RAG status per member, notes.
- Style per `bndy-style-guide.md`.

### 5.4 Shared Calendar

- Build calendar for private events (including practice sessions) and public gigs per PRD Section 2.2.
- Flag gigs for `bndy.live` map, include details (who, where, when, setlist, logistics).
- Display gig list and availability.
- Style per `bndy-style-guide.md`.

### 5.5 Band Member Management

- Build "Band Members" section per PRD Section 2.2:
  - List members (display name, instruments, role).
  - Actions for admins: Update roles, remove members.
  - UI links to invitation system on `bndy.co.uk`.
- Style per `bndy-style-guide.md`.

### 5.6 Vacancy Board

- Build vacancy board per PRD Section 2.2:
  - Create/manage posts (e.g., "Need a drummer").
  - Visible to other users on `bndy.core`.
- Style per `bndy-style-guide.md`.

### 5.7 Event Wizard

- Build wizard mirroring `bndy.live` but auto-fills artist/venue per PRD Section 2.2.
- Use `Wizard` component from `bndy.ui`.
- Style per `bndy-style-guide.md`.

### 5.8 Spotify Sync

- Implement manual, bidirectional sync of playbook/setlists to Spotify playlists per PRD Section 2.2.
- Cache metadata to limit API calls (<5,000/day free tier).

## Phase 6: Develop WhatsApp Integration

### 6.1 Event Capture via WhatsApp

- Set up WhatsApp Business API for event submissions per PRD Section 2.4 (MVP priority).
- Build conversational robot to guide users:
  - Parse messages for event details.
  - Confirm details with user (Y/N prompts).
  - Handle ambiguity (e.g., venue clarification).
  - Final confirmation and submission.
  - Post-submission: Offer to add another or link to `bndy.live`.
- Recognize frequent submitters (hashed phone number) to streamline submissions.
- Allow opt-in for notifications (request email).
- Rate-limit submissions (10 messages/min), store hashed phone numbers.
- Forward events to Firestore for builder review.

### 6.2 WhatsApp for Team Invites

- Enable WhatsApp sharing for team invite links per PRD Section 2.3.

## Phase 7: Testing and Security

### 7.1 Unit Testing

- Write unit tests for critical paths per PRD Section 3.8 (80% coverage):
  - Map rendering, event submission, overlay display (`bndy.live`).
  - Setlist generation, calendar updates, song pipeline, vacancy board, invite processing (`bndy.core`).
  - Shared components (wizard, event card, auth forms in `bndy.ui`).
- Test cases:
  - Map: Loads events, clusters pins, displays overlay with all fields, supports zoom/pan/click.
  - Wizard: Submits event, validates inputs, handles errors.
  - Setlist: Generates suggestions, allows drag-and-drop, touch-friendly, supports save/share/export.
  - Auth: Login/signup works, OAuth redirects, role restrictions enforced.
  - Vacancy Board: Posts vacancy, visible to other users.

### 7.2 Authentication and Security Testing

- Test auth flows per PRD Section 3.8 and `updated-auth-flow.mermaid`:
  - Email/password login, Google/Facebook OAuth (success/error cases).
  - Role-based access: `user` can't access `my.bndy.co.uk`, `profile_owner` can.
  - Claim process: Form submission, builder approval, role assignment.
  - Team invitation: Invite generation, joining, role assignment.
- Test security per PRD Section 3.3:
  - Penetration test auth routes (e.g., brute force prevention).
  - Validate RLS rules (e.g., `user` can't edit profiles).
  - Test CAPTCHA on login/signup, claim form, wizard.
  - Prevent XSS in wizard/WhatsApp inputs (sanitize inputs).

### 7.3 End-to-End Testing

- Manually test flows by bndy builders per PRD Section 3.8:
  - Browse events, register, follow bands (`bndy.live`).
  - Claim profile, manage setlists, invite members (`bndy.core`, `bndy.landing`).
  - Submit events via wizard/WhatsApp.

## Phase 8: Deployment and Launch

### 8.1 Deploy to Vercel

- Deploy per `updated-deployment-architecture.mermaid`:
  - `bndy.landing` to `bndy.co.uk` and `www.bndy.co.uk`.
  - `bndy.live` to `bndy.live`.
  - `bndy.core` to `my.bndy.co.uk`.
- Ensure `bndy.ui` is imported by all apps.

### 8.2 Final Checks

- Verify Firebase RLS rules and budget alerts per PRD Section 3.3.
- Test cross-app redirects per `updated-auth-flow.mermaid`.
- Confirm WhatsApp integration for event capture and invite sharing.
- Monitor Firebase costs (<$100/month target).

### 8.3 Launch

- Seed initial events in North West UK using bndy builders per PRD Section 4.
- Share `bndy.live/add-event` with Facebook groups for submissions.
- Begin manual outreach to bands/venues for profile claims.
- Monitor adoption and engagement metrics.

## Phase 9: Post-Launch Monitoring

### 9.1 Monitor Metrics

- Track metrics per PRD Section 4:
  - Gig-goer adoption, map usage, feedback.
  - BAV registrations, tool usage.
  - Event submission rates, junk submissions (<5%).

### 9.2 Address Scalability

- Implement scalability plan (pending separate discussion).
- Optimize Firebase queries, caching, and clustering.

## 10. Documentation

### 10.1 Developer Documentation

- Update READMEs with setup, deployment, and Firebase configs.

### 10.2 User Documentation

- Create guides for gig-goers and BAVs per PRD Section 2.
- Share on `bndy.co.uk` (e.g., `/help`).

## 11. Revision History

- **v1.0**: Initial to-do list, May 2025, for building bndy platform from scratch.
- **v1.1**: Updated May 2025:
  - Clarified Event Wizard sharing in Facebook groups (Phase 4.6).
  - Detailed WhatsApp robot chat implementation, prioritized as MVP (Phase 6.1).
- **v1.2**: Updated May 2025:
  - Removed implementation details (e.g., schema fields, styling, versions).
  - Added references to PRD, style guide, auth flow, and deployment architecture.
  - Added test cases for clarity.
- **v1.4**: Updated May 2025:
  - Added Web Share API task (Phase 4.8).
  - Added setlist save/share/export task (Phase 5.2).
  - Added touch interaction testing for setlist drag-and-drop (Phase 7.1).
  - Removed Gig Sheets (Phase 5.4), Practice Session Manager (Phase 5.6), and Media Management (Phase 5.7).
  - Updated Shared Calendar task (Phase 5.4) to include gig details.