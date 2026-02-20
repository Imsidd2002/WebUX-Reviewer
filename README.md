# Website UX Reviewer

A full-stack AI-powered application that reviews website UX using Groq (Llama 3.1) and Cheerio.

## Features

- **Automated UX Audits**: Scrapes website content and generates structured reviews.
- **AI Analysis**: Uses Groq Llama 3.3 70b to identify clarity, accessibility, and layout issues.
- **Scoring System**: Calculates a 0-100 UX score with visual gauge.
- **Before/After Suggestions**: Provides actionable code/text improvements for top issues.
- **PDF Export**: Download comprehensive audit reports.
- **History**: Tracks the last 5 reviews using Supabase.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, TypeScript, Cheerio, Axios
- **Database**: Supabase (PostgreSQL)
- **AI**: Groq API (llama-3.3-70b-versatile)

## Setup

### Prerequisites
- Node.js (v18+)
- Supabase Account
- Groq API Key

### Environment Variables

1. **Backend**: Copy `backend/.env.example` to `backend/.env` and fill in:
   ```env
   GROQ_API_KEY=gsk_...
   SUPABASE_URL=https://...
   SUPABASE_SERVICE_ROLE_KEY=...
   PORT=3000
   ```

2. **Frontend**: Copy `frontend/.env.example` to `frontend/.env`:
   ```env
   VITE_BACKEND_URL=http://localhost:3000/api
   ```

### Database Setup (Supabase)

Run the following SQL in your Supabase SQL Editor:

```sql
create table reviews (
  id uuid default gen_random_uuid() primary key,
  url text not null,
  extracted_content jsonb,
  ux_review jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### Installation & Running

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:5173`.

## Deployment

- **Frontend**: Deploy to Vercel (Set `VITE_BACKEND_URL` in environment variables).
- **Backend**: Deploy to Render/Railway (Add `GROQ_API_KEY`, `SUPABASE_..` env vars).

