# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Calendar Vote (일정조율 웹사이트) - A web service for N users to coordinate and vote on available dates. See [CLAUDE_CODE.md](CLAUDE_CODE.md) for the complete development specification in Korean.

**Key characteristics:**
- No login required (nickname + browser identification via localStorage UUID)
- Mobile-first responsive design
- Korean language only

## Tech Stack

- **Framework:** Next.js 14.x (Pages Router)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 3.x
- **ORM:** Prisma 5.x
- **Database:** MySQL 8.0 (Docker)
- **ID Generation:** nanoid 5.x
- **Sharing:** Kakao JavaScript SDK
- **Package Manager:** npm

## Development Commands

```bash
# Install dependencies
npm install

# Start MySQL database
docker-compose up -d

# Run Prisma migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Architecture

### Database Models (Prisma)
- **Room** - Voting room with title, date range, host info, status (VOTING/CLOSED/CONFIRMED/EXPIRED)
- **Vote** - Participant vote record linked to a room
- **VoteSelection** - Individual date selections with status (AVAILABLE/MAYBE/UNAVAILABLE)

### Key User Flows
1. **Host flow:** Create room → Set options → Generate link → Vote → Share link → View results → Confirm date
2. **Participant flow:** Access link → Enter nickname → Vote on calendar → Complete → View results

### Core Components
- `CircularProgress.tsx` - SVG circular progress indicator showing vote percentage per date (critical UI element)
- `Calendar.tsx` - Main calendar with month navigation and date cells
- `DateCell.tsx` - Individual date cell with vote status and circular progress

### API Structure (Pages Router)
- `POST /api/rooms` - Create room
- `GET/PATCH /api/rooms/[roomId]` - Get/update room
- `POST /api/rooms/[roomId]/confirm` - Confirm date (host only)
- `POST /api/rooms/[roomId]/close` - Close voting (host only)
- `GET/POST/PUT /api/votes/[roomId]` - Get/submit/update votes

### User Identification
Browser identification via UUID stored in localStorage (`calendar_vote_visitor_id`). Host is identified by matching `visitorId` with `hostVisitorId` in the room.

## Environment Variables

```env
DATABASE_URL="mysql://calendar_user:calendar1234@localhost:3306/calendar_vote"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_KAKAO_JS_KEY="your_kakao_javascript_key"
```
