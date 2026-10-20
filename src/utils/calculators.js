/**
 * Nutrition and Metabolic Health Calculators
 */

// BMR using Mifflin-St Jeor Equation
export function calculateBMR({ gender = 'male', weight = 70, height = 175, age = 28 }) {
  const w = parseFloat(weight) || 70
  const h = parseFloat(height) || 175
  const a = parseFloat(age) || 28

  if (gender === 'male') {
    return Math.round(10 * w + 6.25 * h - 5 * a + 5)
  } else {
    return Math.round(10 * w + 6.25 * h - 5 * a - 161)
  }
}

export const ACTIVITY_MULTIPLIERS = {
  sedentary: { label: 'Sedentary (Desk job, little/no exercise)', value: 1.2 },
  light: { label: 'Lightly Active (1-3 days/week exercise)', value: 1.375 },
  moderate: { label: 'Moderately Active (3-5 days/week exercise)', value: 1.55 },
  very_active: { label: 'Very Active (6-7 days/week hard exercise)', value: 1.725 },
  athlete: { label: 'Extra Active (Physical labor or 2x daily training)', value: 1.9 }
}

export function calculateTDEE(bmr, activityLevel = 'moderate') {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel]?.value || 1.55
  return Math.round(bmr * multiplier)
}

export const GOAL_MODIFIERS = {
  lose_weight_fast: { label: 'Aggressive Fat Loss', deficit: -500, desc: 'Target ~0.5kg/week fat reduction' },
  lose_weight_steady: { label: 'Steady Fat Loss', deficit: -300, desc: 'Sustainable & muscle-sparing' },
  maintain: { label: 'Maintain Weight & Body Recomp', deficit: 0, desc: 'Stable energy & weight stability' },
  gain_muscle_lean: { label: 'Lean Bulk / Muscle Gain', deficit: 250, desc: 'Gradual lean muscle gain' },
  gain_muscle_fast: { label: 'Weight & Mass Gain', deficit: 500, desc: 'High energy surplus' }
}

export const MACRO_PRESETS = {
  balanced: {
    name: 'Balanced Fitness (40C / 30P / 30F)',
    carbsRatio: 0.40,
    proteinRatio: 0.30,
    fatRatio: 0.30
  },
  high_protein: {
    name: 'High Protein / Lean Gain (35C / 40P / 25F)',
    carbsRatio: 0.35,
    proteinRatio: 0.40,
    fatRatio: 0.25
  },
  low_carb: {
    name: 'Low Carb Athletic (20C / 45P / 35F)',
    carbsRatio: 0.20,
    proteinRatio: 0.45,
    fatRatio: 0.35
  },
  keto: {
    name: 'Keto Fuel (5C / 25P / 70F)',
    carbsRatio: 0.05,
    proteinRatio: 0.25,
    fatRatio: 0.70
  }
}

export function calculateTargetMacros(calories, presetKey = 'high_protein') {
  const preset = MACRO_PRESETS[presetKey] || MACRO_PRESETS.high_protein
  const proteinCalories = calories * preset.proteinRatio
  const carbsCalories = calories * preset.carbsRatio
  const fatCalories = calories * preset.fatRatio

  return {
    calories: Math.round(calories),
    protein: Math.round(proteinCalories / 4), // 4 kcal per gram
    carbs: Math.round(carbsCalories / 4),    // 4 kcal per gram
    fat: Math.round(fatCalories / 9)          // 9 kcal per gram
  }
}

// Recommended daily water goal based on body weight and activity
export function calculateWaterGoal(weightKg, activityLevel = 'moderate') {
  const baseMl = (parseFloat(weightKg) || 70) * 35 // 35ml per kg
  let extra = 0
  if (activityLevel === 'moderate') extra = 500
  if (activityLevel === 'very_active' || activityLevel === 'athlete') extra = 800
  return Math.round(baseMl + extra)
}
