export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Goal = 'lose' | 'maintain' | 'gain';
export type Sex = 'male' | 'female';

export interface Profile {
  id: string;
  sex: Sex | null;
  age: number | null;
  height_cm: number | null;
  weight_kg: number | null;
  activity_level: ActivityLevel | null;
  goal: Goal | null;
  calorie_target: number | null;
  protein_target: number | null;
  created_at: string;
}

export interface FoodEntry {
  id: string;
  user_id: string;
  name: string;
  calories: number;
  protein_g: number;
  eaten_at: string;
  created_at: string;
}

export interface FavoriteFood {
  id: string;
  user_id: string;
  name: string;
  calories: number;
  protein_g: number;
}
