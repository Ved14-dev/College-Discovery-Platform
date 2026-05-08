# EduQuest: College Discovery Platform

EduQuest is a comprehensive platform designed to help students discover, compare, and predict their admission chances for top Indian engineering and science institutions. Built for speed and accuracy, the platform utilizes a weighted AI probability model to provide realistic admission insights.

## Core Features

* **Smart College Directory:** Searchable database of top-tier institutions with real-time filtering by name and location.
* **Multi-Factor AI Predictor:** An admission probability engine that considers entrance scores, reservation categories, and branch preferences.
* **Technical Comparison:** Side-by-side analysis of fees, rankings, and campus facilities.
* **Verified Data:** Integrated with Supabase to provide realistic fee structures and NIRF-aligned rankings for 2026-27.

## Tech Stack

* **Frontend:** Next.js 15 (App Router), Tailwind CSS
* **Backend:** Supabase (PostgreSQL, Row Level Security)
* **Deployment:** Vercel
* **Architecture:** Optimized for high performance and low memory footprints.

## Technical Problem Solving

During development, the project was optimized to run on a 32-bit Windows environment. This required:
* Custom Webpack configurations to manage memory allocation.
* Strict adherence to CSS-based animations to reduce JavaScript main-thread execution.
* Efficient data fetching patterns to prevent ArrayBuffer overflows in limited-memory environments.

## Local Setup

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
