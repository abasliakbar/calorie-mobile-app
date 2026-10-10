/// <reference types="jest" />
import {
  calculateBMR,
  calculateTDEE,
  calculateCalorieTarget,
  calculateProteinTarget,
  calculateProfileTargets
} from './nutrition';
import type { ActivityLevel, Goal, Sex, Profile } from '../types/database';

describe('Nutrition Calculations', () => {
  describe('calculateBMR', () => {
    it('should calculate BMR for male', () => {
      const result = calculateBMR({
        weightKg: 70,
        heightCm: 175,
        age: 30,
        sex: 'male',
      });
      // Expected: 10*70 + 6.25*175 - 5*30 + 5 = 700 + 1093.75 - 150 + 5 = 1648.75
      expect(result).toBeCloseTo(1649, 0);
    });

    it('should calculate BMR for female', () => {
      const result = calculateBMR({
        weightKg: 60,
        heightCm: 165,
        age: 25,
        sex: 'female',
      });
      // Expected: 10*60 + 6.25*165 - 5*25 - 161 = 600 + 1031.25 - 125 - 161 = 1345.25
      expect(result).toBeCloseTo(1345, 0);
    });
  });

  describe('calculateTDEE', () => {
    it('should calculate TDEE for sedentary activity', () => {
      const result = calculateTDEE({
        bmr: 1500,
        activityLevel: 'sedentary',
      });
      expect(result).toBe(1800); // 1500 * 1.2
    });

    it('should calculate TDEE for light activity', () => {
      const result = calculateTDEE({
        bmr: 1500,
        activityLevel: 'light',
      });
      expect(result).toBeCloseTo(2063, 0); // 1500 * 1.375
    });

    it('should calculate TDEE for moderate activity', () => {
      const result = calculateTDEE({
        bmr: 1500,
        activityLevel: 'moderate',
      });
      expect(result).toBeCloseTo(2325, 0); // 1500 * 1.55
    });

    it('should calculate TDEE for active activity', () => {
      const result = calculateTDEE({
        bmr: 1500,
        activityLevel: 'active',
      });
      expect(result).toBeCloseTo(2588, 0); // 1500 * 1.725
    });

    it('should calculate TDEE for very active activity', () => {
      const result = calculateTDEE({
        bmr: 1500,
        activityLevel: 'very_active',
      });
      expect(result).toBe(2850); // 1500 * 1.9
    });
  });

  describe('calculateCalorieTarget', () => {
    it('should calculate calorie target for weight loss', () => {
      const result = calculateCalorieTarget({
        tdee: 2000,
        goal: 'lose',
      });
      expect(result).toBe(1600); // 2000 * 0.8
    });

    it('should calculate calorie target for maintenance', () => {
      const result = calculateCalorieTarget({
        tdee: 2000,
        goal: 'maintain',
      });
      expect(result).toBe(2000); // 2000 * 1.0
    });

    it('should calculate calorie target for weight gain', () => {
      const result = calculateCalorieTarget({
        tdee: 2000,
        goal: 'gain',
      });
      expect(result).toBe(2200); // 2000 * 1.1
    });
  });

  describe('calculateProteinTarget', () => {
    it('should calculate protein target for weight loss', () => {
      const result = calculateProteinTarget({
        weightKg: 70,
        goal: 'lose',
      });
      expect(result).toBe(154); // 70 * 2.2
    });

    it('should calculate protein target for weight gain', () => {
      const result = calculateProteinTarget({
        weightKg: 70,
        goal: 'gain',
      });
      expect(result).toBe(140); // 70 * 2.0
    });

    it('should calculate protein target for maintenance', () => {
      const result = calculateProteinTarget({
        weightKg: 70,
        goal: 'maintain',
      });
      expect(result).toBe(126); // 70 * 1.8
    });
  });

  describe('calculateProfileTargets', () => {
    it('should return null for incomplete profile', () => {
      const result = calculateProfileTargets({
        sex: 'male',
        age: null, // Missing age
        height_cm: 175,
        weight_kg: 70,
        activity_level: 'moderate',
        goal: 'maintain',
      });
      expect(result.calorieTarget).toBeNull();
      expect(result.proteinTarget).toBeNull();
    });

    it('should calculate complete profile targets for male', () => {
      const result = calculateProfileTargets({
        sex: 'male',
        age: 30,
        height_cm: 175,
        weight_kg: 70,
        activity_level: 'moderate',
        goal: 'lose',
      });

      // Expected: BMR ~1649, TDEE ~2556, Calories ~2045 (2556 * 0.8), Protein ~154 (70 * 2.2)
      expect(result.calorieTarget).toBeCloseTo(2045, 0);
      expect(result.proteinTarget).toBe(154);
    });

    it('should calculate complete profile targets for female', () => {
      const result = calculateProfileTargets({
        sex: 'female',
        age: 25,
        height_cm: 165,
        weight_kg: 60,
        activity_level: 'light',
        goal: 'maintain',
      });

      // Expected: BMR ~1345, TDEE ~1849, Calories ~1849 (1849 * 1.0), Protein ~108 (60 * 1.8)
      expect(result.calorieTarget).toBeCloseTo(1849, 0);
      expect(result.proteinTarget).toBe(108);
    });
  });
});