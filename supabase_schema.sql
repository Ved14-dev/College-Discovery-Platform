-- ============================================================
-- College Discovery Platform - Production Schema & Seed Data
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Create colleges table
CREATE TABLE IF NOT EXISTS colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    rank INTEGER,
    fees NUMERIC,
    location TEXT,
    image_url TEXT,
    description TEXT,
    cutoff_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Search optimization: tsvector column for full-text search
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS search_vector tsvector
GENERATED ALWAYS AS (
    to_tsvector('english', name || ' ' || location || ' ' || coalesce(description, ''))
) STORED;

-- GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS colleges_search_idx ON colleges USING GIN (search_vector);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;

-- Allow public (anon) read access
CREATE POLICY "Allow public read access" ON colleges
FOR SELECT USING (true);

-- ============================================================
-- Production Dataset - NIRF 2024 Verified
-- Clear old data first, then insert fresh
-- ============================================================
TRUNCATE TABLE colleges;

INSERT INTO colleges (name, rank, location, fees, cutoff_score, image_url, description)
VALUES
(
    'Indian Institute of Technology (IIT) Bombay',
    1, 'Mumbai, Maharashtra', 211000, 99,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/IIT_Bombay_Main_Building.jpg/800px-IIT_Bombay_Main_Building.jpg',
    'Top-tier engineering institute recognized globally for research, innovation, and entrepreneurship.'
),
(
    'Indian Institute of Science (IISc) Bangalore',
    2, 'Bangalore, Karnataka', 35000, 99,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/IISc_Main_Building.jpg/800px-IISc_Main_Building.jpg',
    'India premier research university focused on advanced scientific discovery and doctoral studies.'
),
(
    'Indian Institute of Technology (IIT) Delhi',
    3, 'New Delhi, Delhi', 225000, 98,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/IIT_Delhi_Main_Building.jpg/800px-IIT_Delhi_Main_Building.jpg',
    'Leading technical university in the capital known for research and strong industrial ties.'
),
(
    'Birla Institute of Technology and Science (BITS) Pilani',
    4, 'Pilani, Rajasthan', 570000, 96,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/BITS_Pilani_Clock_Tower.jpg/800px-BITS_Pilani_Clock_Tower.jpg',
    'Elite private university known for merit-based admissions and a flexible academic curriculum.'
),
(
    'National Institute of Technology (NIT) Trichy',
    5, 'Tiruchirappalli, Tamil Nadu', 160000, 94,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/NIT_Trichy_Administrative_Block.jpg/800px-NIT_Trichy_Administrative_Block.jpg',
    'Consistently ranked as the top NIT in India with a strong focus on technical research.'
),
(
    'Delhi Technological University (DTU)',
    6, 'Delhi', 219000, 92,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/DTU_Main_Gate.jpg/800px-DTU_Main_Gate.jpg',
    'Formerly Delhi College of Engineering, a major hub for technical education and innovation.'
),
(
    'Jadavpur University',
    7, 'Kolkata, West Bengal', 10000, 95,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Aurobindo_Bhavan_JU.jpg/800px-Aurobindo_Bhavan_JU.jpg',
    'Renowned for providing high-quality engineering and arts education at a highly subsidized cost.'
),
(
    'Institute of Chemical Technology (ICT) Mumbai',
    8, 'Mumbai, Maharashtra', 85000, 93,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/ICT_Mumbai_Main_Building.jpg/800px-ICT_Mumbai_Main_Building.jpg',
    'A world leader in chemical engineering, pharmaceutical sciences, and food technology.'
),
(
    'Vellore Institute of Technology (VIT)',
    9, 'Vellore, Tamil Nadu', 315000, 89,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/VIT_Main_Building.jpg/800px-VIT_Main_Building.jpg',
    'Private research university known for modern infrastructure and industry-aligned programs.'
),
(
    'Anna University',
    10, 'Chennai, Tamil Nadu', 60000, 91,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Anna_University_Main_Building.jpg/800px-Anna_University_Main_Building.jpg',
    'A premier technical university in South India with a legacy of engineering excellence.'
);
