// Import existing types
import type { ActivityLevel, Goal, Sex, Profile } from '../types/database';

// BMR Calculation (Mifflin-St Jeor Equation)
export const calculateBMR = (params: {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: Sex;
}): number => {
  if (params.sex === 'male') {
    return 10 * params.weightKg + 6.25 * params.heightCm - 5 * params.age + 5;
  } else {
    return 10 * params.weightKg + 6.25 * params.heightCm - 5 * params.age - 161;
  }
};

// TDEE Calculation
export const calculateTDEE = (params: {
  bmr: number;
  activityLevel: ActivityLevel;
}): number => {
  const activityFactors: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  return params.bmr * activityFactors[params.activityLevel];
};

// Calorie Target Calculation
export const calculateCalorieTarget = (params: {
  tdee: number;
  goal: Goal;
}): number => {
  const goalAdjustments: Record<Goal, number> = {
    lose: 0.8,     // 20% deficit
    maintain: 1.0, // No adjustment
    gain: 1.1,     // 10% surplus
  };

  return Math.round(params.tdee * goalAdjustments[params.goal]);
};

// Protein Target Calculation
export const calculateProteinTarget = (params: {
  weightKg: number;
  goal: Goal;
}): number => {
  // Evidence-based protein recommendations
  let proteinPerKg: number;

  switch (params.goal) {
    case 'lose':
      proteinPerKg = 2.2; // Higher protein to preserve muscle during deficit
      break;
    case 'gain':
      proteinPerKg = 2.0; // Moderate-high for muscle growth
      break;
    case 'maintain':
      proteinPerKg = 1.8; // Moderate for maintenance
      break;
  }

  return Math.round(params.weightKg * proteinPerKg);
};

// Complete Profile Calculation
export const calculateProfileTargets = (profile: Pick<Profile,
  'sex' | 'age' | 'height_cm' | 'weight_kg' | 'activity_level' | 'goal'>): {
  calorieTarget: number | null;
  proteinTarget: number | null;
} => {
  // Check if we have all required fields
  const requiredFields: (keyof Pick<Profile,
    'sex' | 'age' | 'height_cm' | 'weight_kg' | 'activity_level' | 'goal'>)[] =
    ['sex', 'age', 'height_cm', 'weight_kg', 'activity_level', 'goal'];

  for (const field of requiredFields) {
    if (profile[field] === null) {
      return { calorieTarget: null, proteinTarget: null };
    }
  }

  // Calculate targets using existing functions
  const bmr = calculateBMR({
    weightKg: profile.weight_kg!,
    heightCm: profile.height_cm!,
    age: profile.age!,
    sex: profile.sex!,
  });

  const tdee = calculateTDEE({
    bmr,
    activityLevel: profile.activity_level!,
  });

  const calorieTarget = calculateCalorieTarget({
    tdee,
    goal: profile.goal!,
  });

  const proteinTarget = calculateProteinTarget({
    weightKg: profile.weight_kg!,
    goal: profile.goal!,
  });

  return { calorieTarget, proteinTarget };
};