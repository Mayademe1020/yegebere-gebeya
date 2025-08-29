-- Extend existing listings table to support multiple categories
-- This should be run as a migration to extend the current structure

-- Add category and attributes columns to existing listings table
ALTER TABLE listings ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'livestock';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS attributes JSONB DEFAULT '{}';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS verification_tier VARCHAR(50) DEFAULT 'free';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS negotiable BOOLEAN DEFAULT true;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS media TEXT[] DEFAULT '{}';

-- Create index for category filtering
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_verification ON listings(verification_tier);

-- Create enum types for categories and verification tiers
DO $$ BEGIN
    CREATE TYPE listing_category AS ENUM ('livestock', 'machinery', 'equipment', 'feed', 'vet_supplies', 'accessories');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_tier AS ENUM ('free', 'video', 'vet', 'dealer', 'lab', 'mechanic');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update the category column to use the enum (optional, for type safety)
-- ALTER TABLE listings ALTER COLUMN category TYPE listing_category USING category::listing_category;
-- ALTER TABLE listings ALTER COLUMN verification_tier TYPE verification_tier USING verification_tier::verification_tier;
