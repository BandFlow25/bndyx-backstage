# bndy-core: BAV Management Platform

bndy-core is the backstage management platform for bands, artists, and venues (BAVs) within the bndy ecosystem. It provides powerful tools for profile management, setlist creation, song pipelines, calendar management, and more.

## Features

- **Profile Management**: Create and manage artist/band/venue profiles
- **Playbook & Setlists**: Manage songs with notes, chord charts, and lyrics
- **Drag-and-Drop Setlists**: Create and organize setlists with AI suggestions
- **Song Pipeline**: Suggest songs, vote, and manage practice lists
- **Shared Calendar**: Manage private events and public gigs
- **Band Member Management**: Manage band members and their roles
- **Vacancy Board**: Create and manage vacancy posts
- **Event Creation**: Streamlined event creation for the bndy.live platform
- **Spotify Integration**: Sync playbook/setlists with Spotify playlists

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Copy `.env.local.example` to `.env.local` and fill in your Firebase configuration:
```bash
cp .env.local.example .env.local
```

3. Link to bndy-ui package (for local development):
```bash
npm link bndy-ui
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3002](http://localhost:3002) in your browser.

## Environment Variables

- `NEXT_PUBLIC_FIREBASE_API_KEY`: Firebase API Key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Firebase Auth Domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Firebase Project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Firebase Storage Bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Firebase Messaging Sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID`: Firebase App ID
- `NEXT_PUBLIC_SPOTIFY_CLIENT_ID`: Spotify Client ID
- `NEXT_PUBLIC_SPOTIFY_REDIRECT_URI`: Spotify Redirect URI

## Authentication

This project uses Firebase Authentication via the central bndy authentication service. Users must sign in through bndy.co.uk and will be redirected back to bndy-core with their authentication token.

## Deployment

This project is deployed on Vercel and served at my.bndy.co.uk.

## Related Projects

- [bndy-ui](https://github.com/bndy/bndy-ui): Shared UI components and authentication library
- [bndy-landing](https://github.com/bndy/bndy-landing): Authentication hub and static pages
- [bndy-live](https://github.com/bndy/bndy-live): Events discovery platform