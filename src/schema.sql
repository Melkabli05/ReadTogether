-- =============================
-- ENUM TYPES
-- =============================

-- Room status
DO $$ 
BEGIN
  CREATE TYPE room_status AS ENUM ('pending', 'live', 'ended', 'scheduled', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; 
END $$;

-- Text content type
DO $$ 
BEGIN
  CREATE TYPE text_content_type AS ENUM ('book', 'article', 'short-story', 'script', 'poetry', 'other');
EXCEPTION WHEN duplicate_object THEN NULL; 
END $$;

-- Language proficiency
DO $$ 
BEGIN
  CREATE TYPE language_proficiency AS ENUM ('learning', 'fluent', 'native');
EXCEPTION WHEN duplicate_object THEN NULL; 
END $$;

-- Notification type
DO $$ 
BEGIN
  CREATE TYPE notification_type AS ENUM (
    'invitation', 'accepted', 'message', 'reminder', 'comment',
    'new_follower', 'stage_starting', 'practice_invite', 'club_invite', 'new_club_post'
  );
EXCEPTION WHEN duplicate_object THEN NULL; 
END $$;

-- Audience role
DO $$ 
BEGIN
  CREATE TYPE audience_role AS ENUM ('listener', 'speaker', 'raised_hand');
EXCEPTION WHEN duplicate_object THEN NULL; 
END $$;

-- Club role
DO $$ 
BEGIN
  CREATE TYPE club_role AS ENUM ('member', 'admin', 'owner');
EXCEPTION WHEN duplicate_object THEN NULL; 
END $$;

-- Reading level
DO $$ 
BEGIN
  CREATE TYPE reading_level AS ENUM ('beginner', 'intermediate', 'advanced');
EXCEPTION WHEN duplicate_object THEN NULL; 
END $$;

-- =============================
-- USERS & PROFILES
-- =============================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  profile_picture_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE users IS 'Core user identity table.';

CREATE TABLE IF NOT EXISTS user_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  email TEXT NOT NULL UNIQUE,
  reading_interests TEXT[] NOT NULL DEFAULT '{}',
  languages JSONB NOT NULL DEFAULT '[]', -- [{code: text, proficiency: language_proficiency}]
  followers UUID[] NOT NULL DEFAULT '{}',
  following UUID[] NOT NULL DEFAULT '{}',
  blocked_users UUID[] NOT NULL DEFAULT '{}',
  stats JSONB NOT NULL DEFAULT '{"stagesHosted":0,"kudosReceived":0,"partnersReadWith":0}',
  is_online BOOLEAN NOT NULL DEFAULT FALSE,
  last_active TIMESTAMPTZ,
  badge TEXT,
  badge_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE user_profiles IS 'Extended user profile and preferences.';
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- =============================
-- CLUBS & MEMBERSHIPS
-- =============================

CREATE TABLE IF NOT EXISTS clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_image_url TEXT,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  language TEXT,
  genre TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  weekly_meeting_time TEXT,
  activity_level TEXT,
  membership_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  views INTEGER NOT NULL DEFAULT 0 CHECK (views >= 0),
  likes INTEGER NOT NULL DEFAULT 0 CHECK (likes >= 0),
  rating NUMERIC CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5)),
  currently_reading_title TEXT,
  currently_reading_author TEXT,
  next_meeting TIMESTAMPTZ,
  member_count INTEGER NOT NULL DEFAULT 0 CHECK (member_count >= 0)
);
COMMENT ON TABLE clubs IS 'Book clubs and reading groups.';
COMMENT ON COLUMN clubs.member_count IS 'Denormalized count of active club members. Should be kept in sync with club_memberships.';
CREATE INDEX IF NOT EXISTS idx_clubs_owner_id ON clubs(owner_id);
CREATE INDEX IF NOT EXISTS idx_clubs_language ON clubs(language);
CREATE INDEX IF NOT EXISTS idx_clubs_tags ON clubs USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_clubs_is_public ON clubs(is_public);
CREATE INDEX IF NOT EXISTS idx_clubs_rating ON clubs(rating);

CREATE TABLE IF NOT EXISTS club_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role club_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (club_id, user_id)
);
COMMENT ON TABLE club_memberships IS 'Join table for users and clubs. Each user can have one active membership per club.';
CREATE INDEX IF NOT EXISTS idx_active_club_memberships ON club_memberships(club_id) WHERE is_active;

-- =============================
-- TEXT CONTENT
-- =============================

CREATE TABLE IF NOT EXISTS text_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  type text_content_type NOT NULL,
  genre TEXT,
  reading_level reading_level NOT NULL,
  cover_image_url TEXT,
  uploader_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_public_domain BOOLEAN NOT NULL DEFAULT FALSE,
  word_count INTEGER NOT NULL DEFAULT 0,
  estimated_reading_time INTEGER,
  rating NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE text_contents IS 'Uploaded or curated reading materials.';
CREATE INDEX IF NOT EXISTS idx_text_contents_uploader_id ON text_contents(uploader_id);

-- =============================
-- ROOMS & PARTICIPATION
-- =============================

CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status room_status NOT NULL,
  text_content_id UUID NOT NULL REFERENCES text_contents(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  book_club_id UUID REFERENCES clubs(id) ON DELETE SET NULL,
  current_reader_id UUID REFERENCES users(id) ON DELETE SET NULL, -- FK to users, nullable
  scheduled_time TIMESTAMPTZ NOT NULL,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  audience_count INTEGER NOT NULL DEFAULT 0
);
COMMENT ON TABLE rooms IS 'Live or scheduled reading rooms.';
CREATE INDEX IF NOT EXISTS idx_rooms_text_content_id ON rooms(text_content_id);
CREATE INDEX IF NOT EXISTS idx_rooms_book_club_id ON rooms(book_club_id);
CREATE INDEX IF NOT EXISTS idx_rooms_current_reader_id ON rooms(current_reader_id);

CREATE TABLE IF NOT EXISTS room_hosts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (room_id, user_id)
);
COMMENT ON TABLE room_hosts IS 'Join table for room hosts (moderators/readers).';

CREATE TABLE IF NOT EXISTS audience_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role audience_role NOT NULL DEFAULT 'listener',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (room_id, user_id)
);
COMMENT ON TABLE audience_members IS 'Join table for audience members in rooms.';

CREATE TABLE IF NOT EXISTS reading_turns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  paragraphs_read INTEGER NOT NULL DEFAULT 0
);
COMMENT ON TABLE reading_turns IS 'Tracks each user''s reading turn in a room.';

-- =============================
-- ANNOTATIONS & REACTIONS
-- =============================

CREATE TABLE IF NOT EXISTS annotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('correction', 'note', 'question')),
  text TEXT NOT NULL,
  target_word TEXT,
  position JSONB NOT NULL, -- {start: int, end: int}
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved BOOLEAN NOT NULL DEFAULT FALSE
);
COMMENT ON TABLE annotations IS 'Annotations (notes, corrections, questions) on text.';

CREATE TABLE IF NOT EXISTS reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id UUID NOT NULL, -- can reference room or stage
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  target_paragraph_index INTEGER
);
COMMENT ON TABLE reactions IS 'Emoji reactions to stages or rooms.';

-- =============================
-- NOTIFICATIONS
-- =============================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type notification_type NOT NULL,
  from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_archived BOOLEAN NOT NULL DEFAULT FALSE
);
COMMENT ON TABLE notifications IS 'User notifications.';

-- =============================
-- CHAT MESSAGES
-- =============================

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  context_id UUID NOT NULL, -- FK to room or other context
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  type TEXT DEFAULT 'text'
);
COMMENT ON TABLE chat_messages IS 'Chat messages in rooms or other contexts.';

-- =============================
-- INDEXES & FULL-TEXT SEARCH
-- =============================

ALTER TABLE clubs
  ADD COLUMN IF NOT EXISTS fts tsvector
    GENERATED ALWAYS AS (
      to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''))
    ) STORED;
CREATE INDEX IF NOT EXISTS clubs_fts ON clubs USING gin (fts);

-- =============================
-- TRIGGERS & FUNCTIONS
-- =============================

CREATE OR REPLACE FUNCTION update_club_member_count() RETURNS trigger AS $$
BEGIN
  IF tg_op = 'INSERT' AND new.is_active THEN
    UPDATE clubs SET member_count = member_count + 1 WHERE id = new.club_id;
  ELSIF tg_op = 'UPDATE' THEN
    IF new.is_active AND NOT old.is_active THEN
      UPDATE clubs SET member_count = member_count + 1 WHERE id = new.club_id;
    ELSIF NOT new.is_active AND old.is_active THEN
      UPDATE clubs SET member_count = member_count - 1 WHERE id = new.club_id;
    END IF;
  ELSIF tg_op = 'DELETE' AND old.is_active THEN
    UPDATE clubs SET member_count = member_count - 1 WHERE id = old.club_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql STRICT SECURITY DEFINER;

DO $$
BEGIN
  CREATE TRIGGER trg_update_club_member_count
    AFTER INSERT OR UPDATE OR DELETE ON club_memberships
    FOR EACH ROW EXECUTE FUNCTION update_club_member_count();
EXCEPTION WHEN OTHERS THEN NULL; 
END $$;

COMMENT ON FUNCTION update_club_member_count() IS 'Keeps clubs.member_count in sync with active club_memberships.';

-- =============================
-- END OF SCHEMA
-- =============================
