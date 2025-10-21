-- Migration: Add Asset Organization and Metadata
-- Purpose: Transform file storage into comprehensive Digital Asset Management (DAM) system
-- Date: 2025-10-20

BEGIN;

-- ============================================
-- 1. CORE ASSET CATEGORIZATION
-- ============================================

-- Primary asset category (replaces simple file_type usage)
ALTER TABLE user_files ADD COLUMN asset_category VARCHAR(50);
COMMENT ON COLUMN user_files.asset_category IS 'Primary asset category: character, object, scene, greenscreen, background, full_video, clip, template, audio';

-- Usage tags for multi-dimensional classification
ALTER TABLE user_files ADD COLUMN usage_tags TEXT[] DEFAULT '{}';
COMMENT ON COLUMN user_files.usage_tags IS 'Multi-select tags: talking, static, animated, with_background, alpha_channel, ai_ready, web_optimized, 4k, hd';

-- ============================================
-- 2. VISUAL ASSET METADATA
-- ============================================

-- Character-specific metadata
ALTER TABLE user_files ADD COLUMN character_names TEXT[] DEFAULT '{}';
COMMENT ON COLUMN user_files.character_names IS 'Array of character names in the asset (e.g., ["Mike the Mascot", "Brand Ambassador"])';

-- Object-specific metadata
ALTER TABLE user_files ADD COLUMN object_description TEXT;
COMMENT ON COLUMN user_files.object_description IS 'Description of objects in asset (e.g., "Blue Ford F-150 with Koolfoam wrap")';

-- Scene-specific metadata
ALTER TABLE user_files ADD COLUMN scene_location TEXT;
COMMENT ON COLUMN user_files.scene_location IS 'Location or setting description (e.g., "Office interior", "Street exterior")';

-- Compositing & technical metadata
ALTER TABLE user_files ADD COLUMN has_alpha_channel BOOLEAN DEFAULT false;
COMMENT ON COLUMN user_files.has_alpha_channel IS 'True if asset has transparency/alpha channel for compositing';

-- ============================================
-- 3. AUDIO ASSET METADATA
-- ============================================

-- Audio-specific categorization
ALTER TABLE user_files ADD COLUMN audio_category VARCHAR(50);
COMMENT ON COLUMN user_files.audio_category IS 'Audio type: jingle, commercial_song, radio_song, voiceover, sfx, background_music';

ALTER TABLE user_files ADD COLUMN audio_duration_seconds INTEGER;
COMMENT ON COLUMN user_files.audio_duration_seconds IS 'Audio duration in seconds (for quick filtering by length)';

ALTER TABLE user_files ADD COLUMN audio_style VARCHAR(100);
COMMENT ON COLUMN user_files.audio_style IS 'Audio style/mood: upbeat, corporate, energetic, calm, dramatic, etc.';

ALTER TABLE user_files ADD COLUMN audio_vocals BOOLEAN DEFAULT false;
COMMENT ON COLUMN user_files.audio_vocals IS 'True if audio includes vocals/singing';

ALTER TABLE user_files ADD COLUMN audio_lyrics TEXT;
COMMENT ON COLUMN user_files.audio_lyrics IS 'Full lyrics or script for audio with vocals';

ALTER TABLE user_files ADD COLUMN audio_tempo INTEGER;
COMMENT ON COLUMN user_files.audio_tempo IS 'Tempo in BPM (beats per minute)';

ALTER TABLE user_files ADD COLUMN audio_key VARCHAR(10);
COMMENT ON COLUMN user_files.audio_key IS 'Musical key (e.g., "C Major", "A Minor")';

-- Voice over specific metadata
ALTER TABLE user_files ADD COLUMN voiceover_type VARCHAR(50);
COMMENT ON COLUMN user_files.voiceover_type IS 'Voice type: male, female, character, narration, announcement';

ALTER TABLE user_files ADD COLUMN voiceover_script TEXT;
COMMENT ON COLUMN user_files.voiceover_script IS 'Full script/transcript for voice over';

-- ============================================
-- 4. AI INTEGRATION METADATA
-- ============================================

-- Flexible JSON metadata for AI tools and future extensions
ALTER TABLE user_files ADD COLUMN ai_metadata JSONB DEFAULT '{}';
COMMENT ON COLUMN user_files.ai_metadata IS 'Flexible JSON metadata for AI integration and advanced features';

-- Example ai_metadata structure:
-- {
--   "is_ai_ready": true,
--   "compositing_data": {
--     "dimensions": "1920x1080",
--     "frame_rate": 30,
--     "codec": "ProRes 4444"
--   },
--   "character_data": {
--     "poses": ["talking", "waving"],
--     "emotions": ["happy", "excited"],
--     "facial_markers": {...}
--   },
--   "scene_data": {
--     "type": "greenscreen",
--     "lighting": "studio",
--     "camera_angle": "front"
--   }
-- }

-- ============================================
-- 5. INDEXES FOR PERFORMANCE
-- ============================================

-- Index on asset_category for fast category filtering
CREATE INDEX idx_user_files_asset_category ON user_files(asset_category);

-- Index on usage_tags using GIN for array searching
CREATE INDEX idx_user_files_usage_tags ON user_files USING GIN(usage_tags);

-- Index on character_names using GIN for array searching
CREATE INDEX idx_user_files_character_names ON user_files USING GIN(character_names);

-- Index on audio_category for audio-specific filtering
CREATE INDEX idx_user_files_audio_category ON user_files(audio_category);

-- Index on ai_metadata using GIN for JSON querying
CREATE INDEX idx_user_files_ai_metadata ON user_files USING GIN(ai_metadata);

-- ============================================
-- 6. MIGRATION DATA
-- ============================================

-- Set default asset_category based on existing file_type
UPDATE user_files
SET asset_category = CASE
  WHEN file_type = 'video' THEN 'clip'
  WHEN file_type = 'image' THEN 'object'
  WHEN file_type = 'audio' THEN 'voiceover'
  ELSE file_type
END
WHERE asset_category IS NULL;

COMMIT;

-- ============================================
-- 7. VALIDATION CONSTRAINTS (Optional)
-- ============================================

-- Add check constraints for valid enum values
ALTER TABLE user_files ADD CONSTRAINT check_asset_category
  CHECK (asset_category IN (
    'character', 'object', 'scene', 'greenscreen', 'background',
    'full_video', 'clip', 'template', 'audio'
  ) OR asset_category IS NULL);

ALTER TABLE user_files ADD CONSTRAINT check_audio_category
  CHECK (audio_category IN (
    'jingle', 'commercial_song', 'radio_song', 'voiceover',
    'sfx', 'background_music'
  ) OR audio_category IS NULL);

ALTER TABLE user_files ADD CONSTRAINT check_voiceover_type
  CHECK (voiceover_type IN (
    'male', 'female', 'character', 'narration', 'announcement'
  ) OR voiceover_type IS NULL);
