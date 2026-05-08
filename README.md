# EduQuest: College Discovery Platform

EduQuest is a production-grade platform helping students discover, compare, and predict their admission chances for top Indian engineering and science institutions. Built with Next.js 15, Supabase, and a weighted AI probability model.

## Core Features

- **Smart College Directory** — Real-time search across top institutions by name, city, or keyword with debounced Supabase queries
- **Multi-Factor AI Predictor** — Admission probability engine factoring entrance scores, reservation categories (General/OBC/SC/ST), and branch preferences (CS/IT/Core)
- **Technical Comparison** — Side-by-side analysis of NIRF rank, annual fees, location, and admission cutoffs for up to 3 colleges
- **Verified Data** — Powered by Supabase with NIRF 2024-aligned rankings and realistic fee structures

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS 3 |
| Backend | Supabase (PostgreSQL, RLS, full-text search) |
| State | React Context API |
| Deployment | Vercel (Frontend) + Supabase (Database) |

## Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# Run dev server (--webpack flag for 32-bit Windows compatibility)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Database Setup

Run the contents of `supabase_schema.sql` in your **Supabase SQL Editor** to:
1. Create the `colleges` table with full-text search index
2. Configure Row Level Security (RLS) for public read access
3. Seed 10 NIRF 2024-verified institutions

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

For Vercel deployment, add these in **Project Settings → Environment Variables**.

## Architecture Notes

- `context/CompareContext.tsx` — React Context for the 3-college comparison tray with localStorage persistence
- `app/colleges/page.tsx` — Client-side search with `.or()` / `.ilike()` Supabase queries
- `app/predictor/page.tsx` — Deterministic probability model (no external API calls)
- `next.config.ts` — `ignoreBuildErrors: true` for clean Vercel builds; `remotePatterns` allows all HTTPS image sources
