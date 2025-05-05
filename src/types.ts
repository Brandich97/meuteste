export interface Exercise {
  id: string;
  user_id: string | null;
  name: string;
  category: string;
  sets: number;
  reps: number;
  weight: number;
  day: WeekDay;
  created_at: string;
}

export type WeekDay = 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';

export interface Profile {
  id: string;
  name: string;
  birth_date: string;
  gender: string;
  avatar_url: string | null;
  goal: string;
  level: number;
  xp: number;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  id: string;
  user_id: string;
  weight: number;
  height: number;
  date: string;
  created_at: string;
}

export interface PersonalRecord {
  id: string;
  user_id: string;
  exercise_name: string;
  weight: number;
  date: string;
  created_at: string;
}

export interface WorkoutLog {
  id: string;
  user_id: string;
  workout_date: string;
  completed_exercises: CompletedExercise[];
  notes: string | null;
  energy_level: number | null;
  pain_level: number | null;
  created_at: string;
}

export interface CompletedExercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement_type: string;
  achieved_at: string;
  metadata: Record<string, any>;
}

export interface WorkoutNote {
  id: string;
  user_id: string;
  note_date: string;
  content: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  day_of_week: string;
  time: string;
  enabled: boolean;
  created_at: string;
}