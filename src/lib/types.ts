export type DayKey = 'push_a' | 'pull_a' | 'legs' | 'push_b' | 'pull_b';
export type WeightType = 'variable' | 'fixed' | 'bodyweight';
export type MuscleGroup = 'upper' | 'lower' | 'core';
export type PhotoAngle = 'front' | 'side' | 'back';

export interface ExerciseDefinition {
  key: string;
  name: string;
  sets: number;
  reps: number | string;
  weightType: WeightType;
  fixedWeightLbs?: number;
  muscleGroup: MuscleGroup;
  notes?: string;
}

export interface WorkoutDay {
  key: DayKey;
  label: string;
  focus: string;
  dayOfWeek: number;
  exercises: ExerciseDefinition[];
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  day_key: DayKey;
  scheduled_date: string;
  started_at: string | null;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface ExerciseSet {
  id: string;
  session_id: string;
  exercise_key: string;
  set_number: number;
  target_reps: number;
  actual_reps: number | null;
  weight_lbs: number | null;
  completed: boolean;
  completed_at: string | null;
}

export interface BodyWeightLog {
  id: string;
  user_id: string;
  logged_date: string;
  weight_lbs: number;
  notes: string | null;
  created_at: string;
}

export interface ProgressPhoto {
  id: string;
  user_id: string;
  photo_date: string;
  storage_path: string;
  angle: PhotoAngle | null;
  notes: string | null;
  created_at: string;
}

export interface UserExerciseWeight {
  id: string;
  user_id: string;
  exercise_key: string;
  current_weight_lbs: number;
  updated_at: string;
}

export interface ProgressionSuggestion {
  exercise_key: string;
  exercise_name: string;
  current_weight_lbs: number;
  suggested_weight_lbs: number;
  increment_lbs: number;
}
