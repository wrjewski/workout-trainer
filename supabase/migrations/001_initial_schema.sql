-- workout_sessions: one session per calendar day per user
CREATE TABLE workout_sessions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_key        TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  started_at     TIMESTAMPTZ,
  completed_at   TIMESTAMPTZ,
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX ON workout_sessions(user_id, scheduled_date);
CREATE INDEX ON workout_sessions(user_id, scheduled_date DESC);

-- exercise_sets: individual set rows, generated on session creation
CREATE TABLE exercise_sets (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_key TEXT NOT NULL,
  set_number   SMALLINT NOT NULL,
  target_reps  SMALLINT NOT NULL,
  actual_reps  SMALLINT,
  weight_lbs   NUMERIC(6,2),
  completed    BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON exercise_sets(session_id, exercise_key);

-- body_weight_logs: daily body weight tracking
CREATE TABLE body_weight_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  logged_date DATE NOT NULL,
  weight_lbs  NUMERIC(5,2) NOT NULL,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX ON body_weight_logs(user_id, logged_date);
CREATE INDEX ON body_weight_logs(user_id, logged_date DESC);

-- progress_photos: photo storage references
CREATE TABLE progress_photos (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_date   DATE NOT NULL,
  storage_path TEXT NOT NULL,
  angle        TEXT,
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON progress_photos(user_id, photo_date DESC);

-- user_exercise_weights: materialized current working weight per exercise
CREATE TABLE user_exercise_weights (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_key       TEXT NOT NULL,
  current_weight_lbs NUMERIC(6,2) NOT NULL,
  updated_at         TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, exercise_key)
);
