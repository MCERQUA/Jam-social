-- Jam Social Media - User Storage Database Schema
-- PostgreSQL Schema for file storage and tracking

-- Users storage tracking table
CREATE TABLE IF NOT EXISTS user_storage (
  user_id VARCHAR(255) PRIMARY KEY,  -- Clerk user ID
  total_bytes BIGINT DEFAULT 0,
  max_bytes BIGINT DEFAULT 10737418240, -- 10GB in bytes
  file_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Files metadata table
CREATE TABLE IF NOT EXISTS user_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  file_name VARCHAR(500) NOT NULL,
  original_name VARCHAR(500) NOT NULL,
  file_type VARCHAR(50) NOT NULL, -- 'video', 'image', 'scene', 'project', 'audio'
  mime_type VARCHAR(100) NOT NULL,
  file_size BIGINT NOT NULL,
  file_path VARCHAR(1000) NOT NULL, -- Relative path on volume
  thumbnail_path VARCHAR(1000), -- For videos/images
  resolution VARCHAR(50), -- e.g., "1920x1080"
  duration VARCHAR(20), -- For videos, e.g., "00:02:30"
  package_name VARCHAR(100), -- Which package this belongs to
  tags TEXT[], -- Array of tags
  is_favorite BOOLEAN DEFAULT FALSE,
  upload_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_user_storage FOREIGN KEY (user_id)
    REFERENCES user_storage(user_id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_files_user_id ON user_files(user_id);
CREATE INDEX IF NOT EXISTS idx_user_files_type ON user_files(file_type);
CREATE INDEX IF NOT EXISTS idx_user_files_upload_date ON user_files(upload_date DESC);
CREATE INDEX IF NOT EXISTS idx_user_files_favorite ON user_files(is_favorite) WHERE is_favorite = TRUE;
CREATE INDEX IF NOT EXISTS idx_user_files_tags ON user_files USING gin(tags);

-- Trigger function to update user_storage when files are added/deleted
CREATE OR REPLACE FUNCTION update_user_storage()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Initialize user storage record if it doesn't exist
    INSERT INTO user_storage (user_id, total_bytes, file_count)
    VALUES (NEW.user_id, NEW.file_size, 1)
    ON CONFLICT (user_id) DO UPDATE
    SET total_bytes = user_storage.total_bytes + NEW.file_size,
        file_count = user_storage.file_count + 1,
        updated_at = NOW();
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE user_storage
    SET total_bytes = GREATEST(0, total_bytes - OLD.file_size),
        file_count = GREATEST(0, file_count - 1),
        updated_at = NOW()
    WHERE user_id = OLD.user_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS trigger_update_user_storage ON user_files;
CREATE TRIGGER trigger_update_user_storage
AFTER INSERT OR DELETE ON user_files
FOR EACH ROW EXECUTE FUNCTION update_user_storage();

-- Function to get user storage info
CREATE OR REPLACE FUNCTION get_user_storage(p_user_id VARCHAR)
RETURNS TABLE (
  user_id VARCHAR,
  total_bytes BIGINT,
  max_bytes BIGINT,
  file_count INTEGER,
  percentage NUMERIC(5,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    us.user_id,
    us.total_bytes,
    us.max_bytes,
    us.file_count,
    ROUND((us.total_bytes::NUMERIC / us.max_bytes::NUMERIC) * 100, 2) as percentage
  FROM user_storage us
  WHERE us.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user has enough space
CREATE OR REPLACE FUNCTION check_storage_available(p_user_id VARCHAR, p_file_size BIGINT)
RETURNS BOOLEAN AS $$
DECLARE
  v_total_bytes BIGINT;
  v_max_bytes BIGINT;
BEGIN
  SELECT total_bytes, max_bytes INTO v_total_bytes, v_max_bytes
  FROM user_storage
  WHERE user_id = p_user_id;

  -- If user doesn't exist yet, they have space
  IF NOT FOUND THEN
    RETURN TRUE;
  END IF;

  RETURN (v_total_bytes + p_file_size) <= v_max_bytes;
END;
$$ LANGUAGE plpgsql;

-- Create initial admin/test user (optional)
-- INSERT INTO user_storage (user_id, max_bytes)
-- VALUES ('test_user_id', 10737418240)
-- ON CONFLICT DO NOTHING;
