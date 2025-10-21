-- Migration: Add Asset Organization and Metadata (Basic version without indexes)
-- Purpose: Transform file storage into comprehensive Digital Asset Management (DAM) system

-- Core asset categorization
ALTER TABLE user_files ADD COLUMN IF NOT EXISTS asset_category VARCHAR(50);
ALTER TABLE user_files ADD COLUMN IF NOT EXISTS usage_tags TEXT[] DEFAULT '{}';

-- Visual asset metadata
ALTER TABLE user_files ADD COLUMN IF NOT EXISTS character_names TEXT[] DEFAULT '{}';
ALTER TABLE user_files ADD COLUMN IF NOT EXISTS object_description TEXT;
ALTER TABLE user_files ADD COLUMN IF NOT EXISTS scene_location TEXT;
ALTER TABLE user_files ADD COLUMN IF NOT EXISTS has_alpha_channel BOOLEAN DEFAULT false;

-- Audio asset metadata
ALTER TABLE user_files ADD COLUMN IF NOT EXISTS audio_category VARCHAR(50);
ALTER TABLE user_files ADD COLUMN IF NOT EXISTS audio_duration_seconds INTEGER;
ALTER TABLE user_files ADD COLUMN IF NOT EXISTS audio_style VARCHAR(100);
ALTER TABLE user_files ADD COLUMN IF NOT EXISTS audio_vocals BOOLEAN DEFAULT false;
ALTER TABLE user_files ADD COLUMN IF NOT EXISTS audio_lyrics TEXT;
ALTER TABLE user_files ADD COLUMN IF NOT EXISTS audio_tempo INTEGER;
ALTER TABLE user_files ADD COLUMN IF NOT EXISTS audio_key VARCHAR(10);
ALTER TABLE user_files ADD COLUMN IF NOT EXISTS voiceover_type VARCHAR(50);
ALTER TABLE user_files ADD COLUMN IF NOT EXISTS voiceover_script TEXT;

-- AI integration metadata
ALTER TABLE user_files ADD COLUMN IF NOT EXISTS ai_metadata JSONB DEFAULT '{}';

-- Set default asset_category based on existing file_type
UPDATE user_files
SET asset_category = CASE
  WHEN file_type = 'video' THEN 'clip'
  WHEN file_type = 'image' THEN 'object'
  WHEN file_type = 'audio' THEN 'voiceover'
  ELSE file_type
END
WHERE asset_category IS NULL;
