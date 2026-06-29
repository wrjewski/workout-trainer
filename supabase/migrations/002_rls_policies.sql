ALTER TABLE workout_sessions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_sets          ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_weight_logs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_photos        ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_exercise_weights  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own sessions" ON workout_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Own sets" ON exercise_sets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM workout_sessions ws
      WHERE ws.id = session_id AND ws.user_id = auth.uid()
    )
  );

CREATE POLICY "Own body logs" ON body_weight_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Own photos" ON progress_photos
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Own weights" ON user_exercise_weights
  FOR ALL USING (auth.uid() = user_id);

-- Storage bucket RLS (run after creating the 'progress-photos' bucket)
-- CREATE POLICY "Users access own photos" ON storage.objects
--   FOR ALL USING (
--     bucket_id = 'progress-photos'
--     AND (storage.foldername(name))[1] = auth.uid()::text
--   );
