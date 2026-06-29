import type { DayKey, WorkoutDay } from './types'

export const WORKOUT_SCHEDULE: WorkoutDay[] = [
  {
    key: 'push_a',
    label: 'Push A',
    focus: 'Chest / Shoulders / Triceps',
    dayOfWeek: 1,
    exercises: [
      { key: 'smith_bench',         name: 'Smith Machine Bench Press',      sets: 4, reps: 8,        weightType: 'variable', muscleGroup: 'upper' },
      { key: 'smith_incline_press', name: 'Smith Machine Incline Press',    sets: 3, reps: 10,       weightType: 'variable', muscleGroup: 'upper', notes: '~30–45° incline' },
      { key: 'pec_deck_fly',        name: 'Pec Deck Fly',                   sets: 3, reps: 12,       weightType: 'variable', muscleGroup: 'upper', notes: 'Squeeze at peak contraction' },
      { key: 'smith_ohp',           name: 'Smith Machine OHP',              sets: 3, reps: 10,       weightType: 'variable', muscleGroup: 'upper', notes: 'Brace core hard' },
      { key: 'cable_lateral_raise', name: 'Cable Lateral Raise',            sets: 3, reps: 15,       weightType: 'variable', muscleGroup: 'upper', notes: 'Light weight, clean form' },
      { key: 'tricep_pushdown',     name: 'Tricep Cable Pushdown',          sets: 3, reps: 12,       weightType: 'variable', muscleGroup: 'upper', notes: 'Elbows locked at sides' },
    ],
  },
  {
    key: 'pull_a',
    label: 'Pull A',
    focus: 'Back / Biceps',
    dayOfWeek: 2,
    exercises: [
      { key: 'lat_pulldown',        name: 'Lat Pulldown',                   sets: 4, reps: 10,       weightType: 'variable', muscleGroup: 'upper', notes: 'Pull to upper chest, lean slight back' },
      { key: 'seated_cable_row',    name: 'Seated Cable Row',               sets: 4, reps: 10,       weightType: 'variable', muscleGroup: 'upper', notes: 'Chest up, row to belly button' },
      { key: 'smith_bent_row',      name: 'Smith Machine Bent Row',         sets: 3, reps: 10,       weightType: 'variable', muscleGroup: 'upper', notes: 'Hinge at hips, brace lower back' },
      { key: 'cable_face_pull',     name: 'Cable Face Pull',                sets: 3, reps: 15,       weightType: 'variable', muscleGroup: 'upper', notes: 'Elbows high, external rotation' },
      { key: 'preacher_curl',       name: 'Preacher Curl',                  sets: 3, reps: 12,       weightType: 'variable', muscleGroup: 'upper', notes: 'Full extension at bottom' },
      { key: 'db_hammer_curl',      name: 'Alternating DB Hammer Curl',     sets: 3, reps: 12,       weightType: 'fixed',    muscleGroup: 'upper', fixedWeightLbs: 25, notes: 'Each arm — neutral grip, no swinging' },
    ],
  },
  {
    key: 'legs',
    label: 'Legs',
    focus: 'Quads / Hamstrings / Calves / Core',
    dayOfWeek: 3,
    exercises: [
      { key: 'smith_squat',         name: 'Smith Machine Squat',            sets: 4, reps: 10,       weightType: 'variable', muscleGroup: 'lower', notes: 'Feet slightly forward, brace core' },
      { key: 'smith_rdl',           name: 'Smith Machine Romanian DL',      sets: 3, reps: 12,       weightType: 'variable', muscleGroup: 'lower', notes: '⚠️ Lower back: 3-sec eccentric, stop before lumbar rounds' },
      { key: 'leg_extension',       name: 'Leg Extension',                  sets: 3, reps: 15,       weightType: 'variable', muscleGroup: 'lower', notes: 'Full extension, controlled' },
      { key: 'leg_curl',            name: 'Leg Curl',                       sets: 3, reps: 15,       weightType: 'variable', muscleGroup: 'lower', notes: "Don't let hips rise" },
      { key: 'kb_goblet_squat',     name: 'KB Goblet Squat',                sets: 3, reps: 12,       weightType: 'fixed',    muscleGroup: 'lower', fixedWeightLbs: 25, notes: 'Chest tall, knees track toes' },
      { key: 'smith_calf_raise',    name: 'Smith Machine Calf Raise',       sets: 4, reps: 20,       weightType: 'variable', muscleGroup: 'lower', notes: 'Full stretch at bottom' },
      { key: 'plank',               name: 'Plank',                          sets: 3, reps: '45sec',  weightType: 'bodyweight', muscleGroup: 'core', notes: "Neutral spine, don't hold breath" },
    ],
  },
  {
    key: 'push_b',
    label: 'Push B',
    focus: 'Chest / Shoulders / Triceps (Variation)',
    dayOfWeek: 4,
    exercises: [
      { key: 'smith_close_grip',    name: 'Smith Machine Close-Grip Bench', sets: 4, reps: 10,       weightType: 'variable', muscleGroup: 'upper', notes: 'Hands ~shoulder-width, elbows tucked' },
      { key: 'smith_incline_ohp',   name: 'Smith Machine Incline OHP',      sets: 3, reps: 10,       weightType: 'variable', muscleGroup: 'upper', notes: 'Light load, shoulder stability focus' },
      { key: 'low_cable_fly',       name: 'Low Cable Fly',                  sets: 3, reps: 15,       weightType: 'variable', muscleGroup: 'upper', notes: 'Arc upward, slight elbow bend' },
      { key: 'db_lateral_raise',    name: 'DB Lateral Raise',               sets: 4, reps: 20,       weightType: 'fixed',    muscleGroup: 'upper', fixedWeightLbs: 5, notes: 'Slow and controlled burns' },
      { key: 'overhead_cable_ext',  name: 'Overhead Cable Tricep Extension',sets: 3, reps: 12,       weightType: 'variable', muscleGroup: 'upper', notes: 'Full stretch overhead' },
      { key: 'kb_floor_press',      name: 'KB Floor Press',                 sets: 3, reps: 12,       weightType: 'fixed',    muscleGroup: 'upper', fixedWeightLbs: 25, notes: '25lb each hand — great for lower back safety' },
    ],
  },
  {
    key: 'pull_b',
    label: 'Pull B',
    focus: 'Back / Biceps (Variation)',
    dayOfWeek: 5,
    exercises: [
      { key: 'wide_lat_pulldown',   name: 'Wide-Grip Lat Pulldown',         sets: 4, reps: 10,       weightType: 'variable', muscleGroup: 'upper', notes: 'Wider grip = more lat stretch' },
      { key: 'single_arm_row',      name: 'Single-Arm Cable Row',           sets: 3, reps: 12,       weightType: 'variable', muscleGroup: 'upper', notes: 'Each arm — full rotation, good stretch' },
      { key: 'high_face_pull',      name: 'High Cable Face Pull',           sets: 3, reps: 15,       weightType: 'variable', muscleGroup: 'upper', notes: 'Shoulder health staple — never skip' },
      { key: 'cable_curl',          name: 'Cable Curl',                     sets: 3, reps: 12,       weightType: 'variable', muscleGroup: 'upper', notes: 'Constant tension throughout' },
      { key: 'reverse_curl',        name: 'Reverse Curl',                   sets: 3, reps: 12,       weightType: 'fixed',    muscleGroup: 'upper', fixedWeightLbs: 25, notes: 'Trains brachialis and forearms' },
      { key: 'dead_bug',            name: 'Dead Bug',                       sets: 3, reps: 10,       weightType: 'bodyweight', muscleGroup: 'core', notes: 'Each side — lower back rehab/prehab, slow' },
    ],
  },
]

export const DAY_KEY_BY_DOW: Record<number, DayKey> = {
  1: 'push_a',
  2: 'pull_a',
  3: 'legs',
  4: 'push_b',
  5: 'pull_b',
}

export function getWorkoutDay(key: DayKey): WorkoutDay {
  return WORKOUT_SCHEDULE.find((d) => d.key === key)!
}

export function getTodayWorkout(): WorkoutDay | null {
  const dow = new Date().getDay()
  const isoDow = dow === 0 ? 7 : dow
  return WORKOUT_SCHEDULE.find((d) => d.dayOfWeek === isoDow) ?? null
}

export function getTodayDayKey(): DayKey | null {
  const dow = new Date().getDay()
  const isoDow = dow === 0 ? 7 : dow
  return DAY_KEY_BY_DOW[isoDow] ?? null
}

export const LOWER_BACK_CAUTION_KEYS = new Set(['smith_rdl', 'smith_bent_row'])
