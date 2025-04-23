# bndy Platform Product Requirements Document

## 1. Introduction

### 1.1 Purpose 

This PRD defines the Minimum Viable Product (MVP) for the bndy platform, a grassroots live music discovery and management solution for the UK. bndy aims to replace ad-heavy, cluttered platforms with a clean, map-based experience for gig-goers and powerful tools for bands, artists, and venues (BAVs). The strapline "Keeping Live Music Alive" reflects its community-driven mission to empower local music scenes.

### 1.2 Scope

The MVP includes two core areas:

- **bndy.live (Frontstage)**: A public-facing, mobile-first map for discovering local gigs (OBOV - One Band, One Venue, Open Mic, Multi-Artist, Event Series), with profiles, event submission, and a feed of nearby events. Deploys to `https://bndy.live`.
- **bndy.core (Backstage)**: A BAV platform for managing profiles, calendars, playbooks, setlists, and song pipelines, with streamlined event creation. Deploys to `https://my.bndy.co.uk`.

**Out of Scope for MVP**:

- Practice studio booking system (fast follower).
- AI-driven posters, gig recommendations, audience analysis, live streaming, POS integration.
- Musician dep hub, band formation, marketplace, ticketing, non-music discovery.
- Blockchain-based rewards, gamification, email/in-app notifications for team invitations, native app versions, builder invitation system.

### 1.3 Personas

- **Gig-Goers (Non-Registered)**:
  - **Demographics**: All ages (18-70+), diverse tastes (indie, 80s, death metal, ukulele, open mic).
  - **Motivations**: Instantly discover local gigs for spontaneous nights out or weekend planning, support venues, avoid ads/feed fatigue.
  - **Pain Points**: Missing gigs (must follow bands/venues), unreliable info (e.g., unupdated cancellations), disparate sources (e.g., multiple Facebook groups), no instant search.
  - **Needs**: Open `bndy.live` to see their local area's gigs in the selected date range (default: today) on a slick, ad-free map with reliable details.
- **Gig-Goers (Registered)**:
  - **Demographics**: Same as non-registered, but willing to create a bndy account for enhanced features.
  - **Motivations**: Personalize discovery by following/favoriting bands/venues, view a tailored gig list (favorites only or widened), save filters for convenience.
  - **Pain Points**: Lack of personalized tools on other platforms, repetitive searches for preferred artists/venues.
  - **Needs**: Follow/favorite BAVs, access a personalized gig list, and save custom filters, with potential premium features (post-MVP).
- **Bands/Artists**:
  - **Profile**: Hobbyists with day jobs, £200-£300 gigs, ages 20-70, varied tech-savviness (WhatsApp to tablets). Can be solo artists or bands with multiple members.
  - **Motivations**: Easy setlist/playbook tools, wider visibility without followers, ad-free management, team collaboration.
  - **Pain Points**: Clunky song pipelines (e.g., fag packets, Excel), poor event posts (e.g., missing details), promoting to non-followers, coordinating members.
  - **Needs**: Drag-and-drop setlists with AI suggestions, simple event entry, exposure on `bndy.live` map, shared calendar for gigs and private events, invite system for team members.
- **Venues**:
  - **Profile**: Pubs, wine bars, jazz cafes, owners/managers, ages 20-60, low to high tech-savvy (basic Facebook to CMS).
  - **Motivations**: Attract gig-goers, streamline event listings, build standout profiles.
  - **Pain Points**: No dedicated tools (just Facebook, calls, WhatsApp), updating cancellations across platforms, verifying bookings, reaching new audiences.
  - **Needs**: Easy event creation, gig verification notifications, profile with upcoming gigs, and calendar for planning.

**User Roles in the System**:

- **user**: Standard registered gig-goer with ability to follow/favorite bands/venues, view personalized gig lists, and receive notifications.
- **profile_owner**: Claimed band, artist, or venue profile with management access (covers solo artists, bands, and venues, distinguished by `type` field in profile metadata: `band`, `artist`, or `venue`).
- **builder**: Administrative role for bndy platform maintainers with ability to verify claims, review events, and manage content.

## 2. Functional Requirements

### 2.1 bndy.live (Frontstage: Event Discovery Platform)

- **Map View**:
  - Mobile-first, Leaflet-based map with clustered gig pins, loading gigs in the user's local area (via geolocation or default to a major UK city, e.g., Manchester).
  - Viewport-based queries (max 500 events) for performance.
  - Supports zoom, pan, and click interactions.
  - Tap cluster to zoom, tap pin for event overlay (title, artist(s), venue, date, time, poster/description if provided, photos, social links, directions, contact info, ticket links, share buttons).
  - Date selectors above map: "Today" (default), "Tomorrow," "This Weekend," "Next Weekend," with a calendar picker for custom ranges.
  - Filters in sidebar: Genre, location, ticketed/free, open mic.
- **Sidebar/Feed**:
  - Collapsible panel with mini event cards ("Next Live Gigs in Your Area!" or "Tonight's Gigs!") showing nearby events in the selected date range.
  - Cards include artist/venue avatar, title, time, and distance (LiveBeat-inspired layout).
- **List View**:
  - Toggleable list of gigs, same filters as map, displayed as event cards.
- **Venue View**:
  - Toggle to show all venues (pins, distinct markers for those with future gigs).
  - Venue info overlay includes photos, social links, directions, contact info, ticket links, share buttons.
- **Profiles**:
  - **Artist/Band**: Hometown (mandatory for uniqueness), genres (array of strings, e.g., ["Rock", "Indie"]), avatar (fetched from Facebook/Google if possible, else uploaded or default), social links (including external media links to platforms like Facebook, YouTube), future gigs list. UI labels as "Artist Profile" or "Band Profile" based on `type` (artist/band).
  - **Venue**: Google Place ID, avatar, social links, upcoming gigs list.
  - "Add Event" button for profile owners, admins, or bndy builders (links to wizard).
  - Unowned profiles show "Claim this profile!" link (form on `bndy.co.uk` with email, optional Facebook URL).
- **Event Wizard**:
  - Accessible via `bndy.live/add-event` for builders, non-registered users, profile owners, and admins as a standalone page, shareable in Facebook groups to replace Google Forms (e.g., builders post "Add your gig here: bndy.live/add-event").
  - Includes a prominent "See all events on bndy.live!" CTA linking to `bndy.live` to drive traffic to the main platform after submission.
  - Steps:
    1. Venue (Google Places autocomplete, deduplicates multiple Place IDs by name/proximity).
    2. Artist(s) (search existing or add new with hometown, checkbox for 2-5 artists, optional headliner flag).
    3. Date/time (calendar picker, Event Series option for weekly/monthly, max 12 instances).
    4. Details: Title (defaults to "[artist] at [venue] on [date]", editable), poster URL (optional), description (e.g., "4-band rock extravaganza!").
  - CAPTCHA for anonymous submissions, optional email/mobile for notifications/reminders (e.g., "Gig tomorrow – confirm or cancel?").
  - AI keyword checks (e.g., "band," "gig") flag non-music events for admin review.
- **Gig Types**:
  - **OBOV (One Band, One Venue)**: The default and simplest event type—one band performing at one venue.
  - **Open Mic**: Optional host artist, standard event rules (e.g., can have ticket price). Displayed as "Open Mic" or "Open Mic with [Host]" when a host artist is specified, with special visual treatment per style guide.
  - **Multi-Artist**: Support for 2-5 bands at a single event. Configurable as either equal billing or headliner with supporting acts. All artists searchable and linked to their profiles' future gigs list (e.g., searching "Band X" finds "Rock Night").
  - **Event Series**: Branded recurring events (e.g., "Jazz at the Railway," "Checkley Rockz") that follow weekly, monthly, or specific patterns (e.g., every 2nd Friday), up to 12 instances. Each instance can feature different artists while maintaining the series branding and venue. Series events appear on the map with both series branding and the specific artist for that date.
- **Search**:
  - Artist/venue search focuses map on matching events, including all multi-artist bands, with partial match handling (e.g., "The Vanz" matches "The Vanz Rockers").
- **Registered Features**:
  - Follow/favorite bands/venues, view personalized gig list (favorites only or widened).
  - Save custom filters (e.g., "Rock gigs within 10 miles").
- **User Actions**:
  - Share events/venues via Web Share API (e.g., share to social media, messaging apps).
  - Click to view artist/venue profile pages.

### 2.2 bndy.core (Backstage: BAV Management Platform)

- **Artist/Band Features**:
  - **Playbook & Setlists**:
    - Manage active songs with notes, chord charts, lyrics (enriched with key, tempo, duration via MusicBrainz/Spotify, cached).
    - Drag-and-drop setlists (multiple sets, duration alerts, setup notes, segues), ensuring touch-friendly interactions for mobile devices; support save, share, and export functionality (e.g., to PDF, email, or external apps).
    - "bndy.ai Suggest Setlist" button:
      - Option 1: Input duration/vibe (e.g., "High energy, 45 mins"), generates setlist (AI/LLM or rules: high-tempo start, set 2 peaks, big finish).
      - Option 2: Select songs (e.g., 20), suggest run order per best practices.
      - Encore/extra songs in a separate container.
      - Output editable (drag to reorder), with toaster ("Crafting your perfect gig!").
  - **Song Pipeline**:
    - Suggest songs, members vote 0-5, highlight when all votes in for review (move to practice, playbook, park, or bin).
    - Practice list: RAG status per member, notes (e.g., "A Major, big ending").
  - **Shared Calendar**:
    - Private events: Practice sessions (tagged with venue via Google Places), holidays, unavailability.
    - Public gigs: "Gig" type or "Show on bndy.live" flag appears on map, listed in profile's future gigs; include details like who (band members), where (venue), when (date/time), setlist, and logistics (e.g., setup instructions, contact info).
    - Gig list and availability (e.g., specific dates for monthly gigs or open calendar for frequent giggers).
  - **Band Member Management**:
    - Profile owners with "admin" role (initial claimant or promoted member) can manage band members:
      - View member list (display name, instruments, role).
      - Update roles (admin/member) or remove members.
    - UI includes a "Band Members" section visible only for bands (not solo artists), showing members and actions (role change, removal).
  - **Vacancy Board**:
    - Create and manage vacancy posts (e.g., "Need a drummer for gig on 20/5/25"), visible to other users on `bndy.core`.
  - **Profile**:
    - Hometown (mandatory for uniqueness), genres (array of strings, e.g., ["Rock", "Indie"]), avatar (fetched from Facebook/Google if possible, else uploaded), social links (including external media links to platforms like Facebook, YouTube), shows (variants like "Acoustic Duo").
    - UI labels as "Artist Profile" or "Band Profile" based on `type` (artist/band); "Band Members" section visible only for bands.
    - Required fields: `displayName`, `fullName`, `postcode`, `instruments`.
- **Venue Features**:
  - **Calendar**: Gigs, internal planning events.
  - **Profile**: Google Place ID, avatar, social links, upcoming gigs list.
- **Event Wizard**:
  - Same as bndy.live but auto-fills artist/venue based on logged-in user's context.
  - Supports all event types: OBOV (default), Open Mic (with/without host), Multi-Artist, and Event Series.
  - Maintains OBOV as the primary, simplified path while offering clear options for specialized event types.
- **Spotify Sync**:
  - Bidirectional, manual sync of playbook/setlists to Spotify playlists (cached to limit API calls).

### 2.3 bndy.landing (Authentication and Invitation Flows)

- **Claim Process**:
  - Unowned profiles/events editable only by the event author (if logged-in) or bndy builders.
  - Claim via form on `bndy.co.uk/claim` (email, optional Facebook URL), admin review within 24 hours.
  - Audit logs track all edits/claims, "Report issue" link (to "Contact us" form) for disputes.
  - Outreach:
    - Auto-comment on Facebook events (e.g., "Your gig's on bndy! Claim at bndy.live!") post-MVP.
    - Manual outreach by bndy builders to known contacts.
    - Organic discovery via `bndy.live` map visibility.
- **Team Invitation System**:
  - Profile owners with "admin" role (initial claimant or promoted member) can invite new members to collaboratively manage the band:
    - Generate a unique, secure invitation link for the band.
    - Share the link via copying or external messaging apps (e.g., WhatsApp).
    - Control access by activating/deactivating the invitation or generating a new link (invalidating the old one).
    - View a history of users who joined using the invitation (e.g., names and join dates).
  - Users join via the invitation link on `bndy.co.uk`:
    - If not logged in, redirect to register; if logged in but no profile, redirect to profile setup.
    - After authentication and profile setup, user is added to the band with a default role (e.g., member).
    - Redirect to band management page on `my.bndy.co.uk`.
  - UI on `my.bndy.co.uk` includes a "Band Invite" section with the link, sharing options, controls (toggle, regenerate), and usage history.

### 2.4 Event Capture

- **Wizard** (Primary):
  - Progressive steps, Google Places autocomplete, CAPTCHA for anonymous users, optional email/mobile for notifications.
  - AI keyword checks (e.g., "band," "gig") flag non-music events for admin review.
  - Standalone page at `bndy.live/add-event`, shareable in Facebook groups.
- **Send to bndy via WhatsApp** (MVP):
  - Users send event details via WhatsApp to a dedicated bndy number (e.g., "The Vanz, Artisan Tap, 20/5/25, 8pm").
  - A conversational robot guides users to submit events:
    - Parse initial message and confirm details: "I understood: Band: The Vanz, Venue: Artisan Tap, Date: 20/5/25, Time: 8pm. Is this correct? Reply Y/N."
    - If N, prompt for corrections: "Let's try again. Please provide the band name:" (steps through each field: band, venue, date, time).
    - Handle ambiguity: "Did you mean Artisan Tap in Manchester or Artisan Tap in London? Reply with the city or correct venue."
    - Final confirmation: "Event details: [summary]. Reply 'Submit' to add, or 'Edit' to change."
    - Post-submission: "Event submitted for review! Add another? (Y/N)" or "See all events at bndy.live!" with a link.
  - Additional features:
    - Recognize frequent submitters (hashed phone number) to streamline submissions (e.g., "Welcome back! Adding for The Vanz again?").
    - Allow opt-in for notifications (e.g., "Want a confirmation when your event is live? Reply with your email.").
  - Rate-limited (10 messages/min), stores hashed phone numbers for frequent submitters.
  - Events forwarded to Firestore for builder review.
- **Widget/Facebook Integration**:
  - Post-MVP: Browser plugin, OAuth for page events, Facebook event import.

## 3. Non-Functional Requirements

### 3.1 General

- **Mobile-First**: Responsive design, optimized for iOS/Android browsers.
- **UX**: Clean, slick, dark/light theme, consistent brand colors/buttons (centralized in bndy.ui via Emotion, theme.ts).
- **Cost Control**:
  - Leaflet for maps (free), Google Maps only for Places API (autocomplete, Place ID lookups, ~$25/month for 100 events/day).
  - Firebase-optimized: Cached queries (Redis/Firestore TTL), indexed events (date/location), budget alerts (~$75/month for 250 gigs/day).
  - Minimal Spotify API calls (manual sync, cached metadata, <5,000/day free tier).
  - No OpenAI; use local LLMs (e.g., LLaMA) or rule-based logic for setlist suggestions.
  - Limit media: One avatar per BAV (1MB, compressed), no videos/reels.
- **Performance**:
  - Map loads <2s with 500 events (geo-queries, server-side clustering).
  - Incremental event loading as user pans/zooms.
  - Scalability for thousands of events TBD (pending separate discussion).
- **GDPR**: No data sharing without explicit consent, hashed phone numbers for WhatsApp submissions.

### 3.2 Authentication Structure

- All authentication centralized at `bndy.co.uk` (code base: `bndy.landing`).
- Firebase Auth provides core authentication:
  - Email/password login.
  - Social logins: Google OAuth, Facebook OAuth (permissions: `email`, `public_profile`, `manage_pages` for event fetching if linked).
- Token-based authentication (Firebase JWT) shared across applications:
  - `bndy.live` redirects to `bndy.co.uk/login` or `/register`, returns with token.
  - `my.bndy.co.uk` follows the same flow.
- Role-based access control to features based on user type (`user`, `profile_owner`, `builder`).
- Claim process for profiles handled at `bndy.co.uk/claim` with builder approval (form, email, optional Facebook URL).
- Team invitation system for BAV entities (e.g., band admin invites members) included in MVP, with link-based sharing (copy, WhatsApp); email/in-app notifications deferred to post-MVP.

### 3.3 Security

- **Firestore RLS**: Rules based on roles:
  - `user`: Read access to events, profiles; write access to own favorites/notifications.
  - `profile_owner`: Read/write access to own profile, calendar, setlists, events, and team invitations (admin role required for invite management).
  - `builder`: Full read/write access to all data, including claims and flagged events.
- **Token Verification**: Firebase JWT validated on each request; cross-app redirects (e.g., `bndy.live` to `my.bndy.co.uk`) preserve token via URL params (encrypted).
- **CAPTCHA**: On auth routes (login, signup), claim form, anonymous wizard submissions.
- **Rate-Limiting**: APIs capped at 100 requests/min per IP, WhatsApp at 10 messages/min.
- **Input Sanitization**: Use `DOMPurify` for wizard/WhatsApp inputs to prevent XSS.
- **Vercel WAF**: Attack challenge mode enabled.
- **No Hard-Coded Keys**: Store in `.env`, never commit.

### 3.4 Social Auth Integration

- Google/Facebook OAuth data pre-fills profile creation (optional for MVP):
  - **Google**: Email, name, profile picture (if available) for avatar.
  - **Facebook**: Email, name, profile picture, linked pages (if `manage_pages` granted) to auto-fetch events or verify claims.
- Permissions:
  - Google: `email`, `profile`.
  - Facebook: `email`, `public_profile`, `manage_pages` (for event fetching if user links band/venue page).
- Data stored in Firebase Auth (user record) and Firestore (profile metadata).

### 3.5 Deployment Architecture

- **Code Bases**:
  - `bndy.landing`: Deploys to `https://bndy.co.uk` and `https://www.bndy.co.uk`.
  - `bndy.live`: Deploys to `https://bndy.live`.
  - `bndy.core`: Deploys to `https://my.bndy.co.uk`.
  - `bndy.ui`: Deploys as an NPM package, imported by other apps.
- **Domains**:
  - `bndy.co.uk` and `www.bndy.co.uk`: Main domain for landing/auth (`bndy.landing`).
  - `bndy.live`: Event discovery platform (`bndy.live`).
  - `my.bndy.co.uk`: BAV management platform (`bndy.core`).
- **DNS**: Managed through central domain registrar.
- **Shared Services**:
  - Firebase (Auth, Firestore, Storage) across all apps.
  - External APIs: Google Places (venue autocomplete), Spotify (playlist sync).
- **Integration Services**:
  - WhatsApp for event capture and team invite sharing.
- **Deployment**: Vercel for all apps, GitHub Actions for CI (linting, tests).

### 3.6 bndy.landing and bndy.ui Details

- **bndy.landing** (Code Base, Deploys to `bndy.co.uk`):
  - **Role**: Authentication hub and static content host.
  - **Features**:
    - Authentication flows: Login, signup, OAuth (Google, Facebook), password reset.
    - Static pages: Landing, about, T&Cs, contact.
    - Claim process: Redirects to `bndy.co.uk/claim` for unowned profiles.
    - Invite handling: Validates invites, processes user joining for bands.
  - **Usage**: All user entry points (e.g., login redirects from `bndy.live`), claim form routing, invite processing.
- **bndy.ui** (Code Base, NPM Package):
  - **Role**: Shared UI components and authentication logic.
  - **Components**:
    - UI: Event card, datepicker, wizard, buttons, consistent across apps.
    - Auth: Context provider for auth state, login/signup forms, password reset forms, protected route components, cross-app redirect utilities.
  - **Usage**:
    - Use for reusable UI/auth components across `bndy.live` and `my.bndy.co.uk` (e.g., wizard in both apps).
    - Add to `bndy.ui` if: Component/logic is shared (e.g., event overlay) or enforces brand consistency (e.g., themed buttons).
  - **Styling**: Emotion (CSS-in-JS), theme.ts for brand colors/typography.

### 3.7 Tech Stack

- **Backend**: Node.js (v18+), Firebase Functions (serverless).
- **Frontend**: React (v18+), TypeScript, Material-UI (TBC), Emotion (CSS-in-JS).
- **Database/Hosting**: Firebase Firestore (RLS), Storage (avatars), Vercel (deployments).
- **Libraries**:
  - Leaflet (maps, free).
  - Firebase SDK (auth, database).
  - Spotify Web API (playlist sync, cached).
  - MusicBrainz (song metadata, free).
- **Tools**: ESLint (linting), Jest + React Testing Library (unit tests), GitHub Actions (CI), Vercel (CD).

### 3.8 Testing

- **Functional Testing**:
  - Unit tests (Jest/React Testing Library) for critical paths:
    - Map rendering, event submission, overlay display (`bndy.live`).
    - Setlist generation, calendar updates, song pipeline voting, team invite processing (`bndy.core`).
    - Shared components (datepicker, event card, auth forms in `bndy.ui`).
  - Target ~80% coverage for core logic to catch regressions.
- **Authentication Testing**:
  - Test email/password login, Google/Facebook OAuth flows (successful login, error handling).
  - Validate role-based access (e.g., `user` can't access `my.bndy.co.uk` dashboard, `profile_owner` can).
  - Test claim process (form submission, builder approval, role assignment).
  - Test team invitation flow (invite generation, joining, role assignment, member management).
- **Security Testing**:
  - Penetration tests for auth routes (e.g., brute force login attempts).
  - Validate RLS rules (e.g., `user` can't write to profiles, `profile_owner` can't access other profiles).
  - Test CAPTCHA on login/signup, claim form, and wizard.
  - Ensure no XSS vulnerabilities in wizard/WhatsApp inputs (via sanitization).
- **Manual Testing**: End-to-end testing by bndy builders for MVP (e.g., map UX, profile setup, invite flow).

## 4. Success Metrics

- **Gig-Goers**: High adoption in North West UK, majority using map over list view, positive feedback on ad-free UX.
- **BAVs**: Significant registrations, active use of setlist/calendar/invite tools.
- **Engagement**: Most events submitted via wizard/WhatsApp, minimal junk submissions (<5% flagged).
- **Performance**: Map loads <2s, Firebase costs within budget (<$100/month).

## 5. Risks and Mitigations

- **Bad Actors**: Locked edits (author/builders only), audit logs, admin claim review, "Report issue" link.
- **Data Quality**: Google Places autocomplete, AI keyword flags, user notifications for updates/cancellations.
- **Costs**: Cache events, limit media (1MB avatars), manual Spotify sync, Firebase budget alerts.
- **Scalability**: Geo-queries and clustering in place; thousands-of-events plan TBD (separate discussion).

## 6. Assumptions

- No monetization for MVP; costs covered by you or supporters (venues, breweries, charities).
- North West UK focus, organic expansion to other areas (e.g., Sheffield, London).
- Users have good intentions; bad actors rare but manageable via admin controls.

## 7. Future Considerations

- Practice studio booking system (open-source platform, room/equipment configuration, including management for rooms, equipment, dates, band bookings).
- AI-driven posters, gig recommendations, audience analysis, live streaming, POS integration.
- Musician dep hub, band formation, music gear marketplace, ticketing integration.
- Non-music discovery (e.g., dog services).
- Blockchain-based tokens/assets for rewarding accurate gig submissions (e.g., verified events earn points).
- Gamification: Badges, leaderboards, or community status (e.g., "Top Gig Submitter").
- Email/in-app notifications for team invitations (MVP uses link-based sharing via copy/WhatsApp).
- Native app versions for iOS/Android (specific auth considerations, e.g., OAuth redirect handling).
- Enhanced claim process: Detailed evidence requirements, notification flows for builders/claimants.
- Enhanced Event Series management with support for series-specific branding, images, and promotional materials.
- Builder invitation system for `bndy.live`: Trusted builders can invite others to join as builders, with permissions to submit events in specific areas.
- Scalability enhancements for thousands of events (TBD).
- AI-powered gear recommendations in the gear marketplace.
- Real-time event notifications and automated scheduling.
- Smart reminders for setlist practice or upcoming gigs.
- iPad/touch-optimized gig sheets.
- AI to analyze crowd feedback or track popularity.
- Suggested events based on user location and history.
- **Monetization**:
  - Premium band or venue profiles.
  - Smart marketing tools for venues and bands.
  - Optional tipping or merch sales integration.
  - Marketplace for gear and equipment sales/rentals.

## 8. Revision History

- **v1.0**: Initial MVP PRD, April 2025, covering bndy.live and bndy.core.
- **v1.1**: Updated May 2025:
  - Split gig-goer personas (non-registered/registered).
  - Added sidebar/feed, LiveBeat-inspired UX.
  - Generalized numbers (e.g., removed "100-250 gigs").
  - Clarified bndy.landing/bndy.ui roles and usage.
  - Added blockchain rewards, gamification to future scope.
- **v1.2**: Updated May 2025:
  - Added team invitation system to MVP (link-based sharing, WhatsApp integration).
  - Consolidated artist/band roles, clarified UI presentation ("Artist/Band Profile").
  - Corrected code base vs. domain naming (e.g., `bndy.live` → `live.bndy.co.uk`).
  - Added authentication updates: Google/Facebook logins, RLS details, testing requirements.
- **v1.3**: Updated May 2025:
  - Revised Team Invitation System to remove implementation details, focusing on product owner intent.
- **v1.4**: Updated May 2025:
  - Moved Team Invitation System to bndy.landing (Section 2.3), kept member management in bndy.core.
  - Added builder invitation system to future considerations.
  - Updated gig types: OBOV (default), Open Mic (with/without host), Multi-Artist (2-5 bands), Event Series (branded recurring events).
  - Added Event Series enhancements to future considerations.
- **v1.5**: Updated May 2025:
  - Refined Event Wizard (Section 2.1) to clarify sharing in Facebook groups and add "See all events on bndy.live!" CTA.
  - Enhanced WhatsApp event capture (Section 2.4) with detailed conversational flow, confirmed as MVP.
- **v1.6**: Updated May 2025:
  - Updated artist/band profile to make `genres` an array of strings (Sections 2.1, 2.2).
- **v1.7**: Updated May 2025:
  - Corrected domain references from `live.bndy.co.uk` to `bndy.live` throughout (Sections 1.2, 2.1, 2.3, 2.4, 3.2, 3.5).
- **v1.8**: Updated May 2025:
  - Added "Frontstage" and "Backstage" terminology to Section 1.2.
  - Updated Section 2.1 (Map View) to include zoom/pan/click interactions, enhance overlays with photos, social links, directions, contact info, ticket links, share buttons (Web Share API), and note special visual treatment for Open Mic.
  - Updated Section 2.1 (User Actions) to include Web Share API.
  - Updated Section 2.2 (Artist/Band Features) to include Gig Sheets, Practice Session Manager, Media Management, Vacancy Board, and note drag-and-drop touch issue for setlists.
  - Updated Section 7 with additional future features and monetization ideas.
- **v1.9**: Updated May 2025:
  - Removed Gig Sheets and Practice Session Manager from Section 2.2 (Artist/Band Features).
  - Updated Section 2.2 (Shared Calendar) to include gig details (who, where, when, setlist, logistics) and confirm practice sessions are managed as private events.
  - Updated Section 2.2 (Artist/Band Features - Profile) to clarify media is limited to avatars, with external links for other media (e.g., Facebook, YouTube).
  - Updated Section 2.1 (Profiles) to include external media links.
  - Updated Section 2.2 (Playbook & Setlists) to include save/share/export functionality.
  - Updated Section 7 to include Suggested Events based on location/history.
  - Pending scalability updates post-separate discussion.