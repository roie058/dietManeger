/**
 * Nutrition and Metabolic Health Calculators
 */
import { CAUTION_NUTRIENTS } from '../data/cautionNutrients'

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

/**
 * US Navy Circumference Method for Body Fat % Estimation
 * Standardized scientific method using tape measurements (cm)
 */
export function calculateBodyFatNavy({ gender = 'male', height = 175, waist = 82, neck = 38, hip = 95 }) {
  const h = parseFloat(height) || 175
  const w = parseFloat(waist) || 82
  const n = parseFloat(neck) || 38
  const hp = parseFloat(hip) || 95

  if (gender === 'female') {
    // Females formula uses waist + hip - neck
    const diff = w + hp - n
    if (diff <= 0 || h <= 0) return 22.0
    const val = 495 / (1.29579 - 0.35004 * Math.log10(diff) + 0.22100 * Math.log10(h)) - 450
    return Math.max(8, Math.min(60, Math.round(val * 10) / 10))
  } else {
    // Males formula uses waist - neck
    const diff = w - n
    if (diff <= 0 || h <= 0) return 15.0
    const val = 495 / (1.0324 - 0.19077 * Math.log10(diff) + 0.15456 * Math.log10(h)) - 450
    return Math.max(3, Math.min(55, Math.round(val * 10) / 10))
  }
}

export function getBodyFatCategory(bfPercent, gender = 'male') {
  const bf = parseFloat(bfPercent) || 15
  if (gender === 'female') {
    if (bf < 14) return { label: 'Essential Fat', color: 'var(--accent-yellow)', badge: 'badge-amber', range: '< 14%' }
    if (bf < 21) return { label: 'Athletic', color: 'var(--primary-light)', badge: 'badge-emerald', range: '14 - 20%' }
    if (bf < 25) return { label: 'Fitness & Lean', color: 'var(--primary-light)', badge: 'badge-emerald', range: '21 - 24%' }
    if (bf < 32) return { label: 'Average / Healthy', color: 'var(--accent-blue)', badge: 'badge-blue', range: '25 - 31%' }
    return { label: 'Above Average', color: 'var(--accent-red)', badge: 'badge-rose', range: '32%+' }
  } else {
    if (bf < 6) return { label: 'Essential Fat', color: 'var(--accent-yellow)', badge: 'badge-amber', range: '< 6%' }
    if (bf < 14) return { label: 'Athletic / Shredded', color: 'var(--primary-light)', badge: 'badge-emerald', range: '6 - 13%' }
    if (bf < 18) return { label: 'Fitness & Defined', color: 'var(--primary-light)', badge: 'badge-emerald', range: '14 - 17%' }
    if (bf < 25) return { label: 'Average / Healthy', color: 'var(--accent-blue)', badge: 'badge-blue', range: '18 - 24%' }
    return { label: 'Above Average', color: 'var(--accent-red)', badge: 'badge-rose', range: '25%+' }
  }
}

export function calculateBodyComposition({ weight = 75, bodyFatPercent = 15 }) {
  const w = parseFloat(weight) || 75
  const bf = parseFloat(bodyFatPercent) || 15
  const fatMassKg = Math.round(w * (bf / 100) * 10) / 10
  const leanMassKg = Math.round((w - fatMassKg) * 10) / 10
  const leanMassPercent = Math.round((100 - bf) * 10) / 10

  return {
    weightKg: w,
    bodyFatPercent: bf,
    fatMassKg,
    leanMassKg,
    leanMassPercent
  }
}

/**
 * Standard Atwater general factor calculation for calories from macros
 * Protein: 4 kcal/g, Carbs: 4 kcal/g, Fat: 9 kcal/g
 */
export function calculateCaloriesFromMacros(protein = 0, carbs = 0, fat = 0) {
  const p = parseFloat(protein) || 0
  const c = parseFloat(carbs) || 0
  const f = parseFloat(fat) || 0
  return Math.round(p * 4 + c * 4 + f * 9)
}

/**
 * Aggregate daily or list-based meal macronutrients
 */
export function aggregateMacroTotals(meals = []) {
  return meals.reduce((acc, item) => ({
    calories: acc.calories + (Number(item.calories) || 0),
    protein: acc.protein + (Number(item.protein) || 0),
    carbs: acc.carbs + (Number(item.carbs) || 0),
    fat: acc.fat + (Number(item.fat) || 0)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 })
}

/**
 * Compute comprehensive micronutrient totals and statistics against RDA targets
 */
export function computeMicronutrientStats(meals = [], dailySupplemented = [], micronutrientsList = []) {
  const microTotals = micronutrientsList.reduce((acc, micro) => {
    const sum = meals.reduce((total, meal) => {
      const val = meal.micros?.[micro.id] || 0
      return total + (parseFloat(val) || 0)
    }, 0)
    acc[micro.id] = Math.round(sum * 10) / 10
    return acc
  }, {})

  return micronutrientsList.map((micro) => {
    const current = microTotals[micro.id] || 0
    const target = micro.targetValue || 100
    const percent = Math.round((current / target) * 100)
    const isMet = current >= target
    const isSupplemented = dailySupplemented.includes(micro.id)
    const isCovered = isMet || isSupplemented

    let topContributor = null
    let maxVal = 0
    meals.forEach(meal => {
      const mVal = parseFloat(meal.micros?.[micro.id]) || 0
      if (mVal > maxVal) {
        maxVal = mVal
        topContributor = { name: meal.name, amount: mVal }
      }
    })

    return {
      ...micro,
      current,
      target,
      percent,
      isMet,
      isSupplemented,
      isCovered,
      topContributor
    }
  })
}

/**
 * Compute daily totals for unhealthy habits and caution nutrients:
 * Trans Fat, Dietary Cholesterol, Sodium/Salt, Saturated Fat, Added Sugar,
 * Late-night eating, and Sodium-to-Potassium cardiovascular balance.
 */
export function computeCautionTotals(meals = [], userGender = 'male') {
  const totals = {
    transFat: 0,
    cholesterol: 0,
    sodium: 0,
    saturatedFat: 0,
    addedSugar: 0
  }
  let totalPotassium = 0
  const lateNightMeals = []
  let lateNightCalories = 0

  meals.forEach(meal => {
    const c = meal.cautions || {}
    totals.transFat += parseFloat(c.transFat ?? meal.transFat ?? 0) || 0
    totals.cholesterol += parseFloat(c.cholesterol ?? meal.cholesterol ?? 0) || 0
    totals.sodium += parseFloat(c.sodium ?? meal.sodium ?? 0) || 0
    totals.saturatedFat += parseFloat(c.saturatedFat ?? meal.saturatedFat ?? 0) || 0
    totals.addedSugar += parseFloat(c.addedSugar ?? meal.addedSugar ?? 0) || 0

    totalPotassium += parseFloat(meal.micros?.potassium || 0) || 0

    // Late night intake detection (meals after 21:00 or before 04:00)
    if (meal.time) {
      const match = String(meal.time).match(/(\d{1,2}):(\d{2})/)
      if (match) {
        let hour = parseInt(match[1], 10)
        if (/pm/i.test(meal.time) && hour < 12) hour += 12
        if (/am/i.test(meal.time) && hour === 12) hour = 0
        if (hour >= 21 || hour < 4) {
          lateNightMeals.push(meal)
          lateNightCalories += parseFloat(meal.calories || 0) || 0
        }
      }
    }
  })

  // Normalize rounded values
  totals.transFat = Math.round(totals.transFat * 10) / 10
  totals.cholesterol = Math.round(totals.cholesterol)
  totals.sodium = Math.round(totals.sodium)
  totals.saturatedFat = Math.round(totals.saturatedFat * 10) / 10
  totals.addedSugar = Math.round(totals.addedSugar * 10) / 10

  const items = Object.entries(CAUTION_NUTRIENTS).map(([key, info]) => {
    const val = totals[key] || 0
    const limit = (key === 'addedSugar' && userGender === 'female') ? info.femaleLimit : info.dailyLimit
    const percent = Math.round((val / limit) * 100)
    let status = 'safe'
    if (percent >= 100) status = 'exceeded'
    else if (percent >= 75) status = 'caution'

    // Find top contributor meal for this caution nutrient
    let topContributor = null
    let maxVal = 0
    meals.forEach(m => {
      const c = m.cautions || {}
      const itemVal = parseFloat(c[key] ?? m[key] ?? 0) || 0
      if (itemVal > maxVal) {
        maxVal = itemVal
        topContributor = { name: m.name, amount: Math.round(itemVal * 10) / 10 }
      }
    })

    return {
      ...info,
      key,
      value: val,
      effectiveLimit: limit,
      percent,
      status,
      topContributor
    }
  })

  // Cardiovascular Sodium-to-Potassium balance ratio (Na:K)
  const naKRatio = totalPotassium > 0 
    ? Math.round((totals.sodium / totalPotassium) * 100) / 100 
    : null

  // Safety score from 100
  let penalty = 0
  items.forEach(item => {
    if (item.status === 'exceeded') {
      penalty += item.severity === 'critical' ? 25 : 15
    } else if (item.status === 'caution') {
      penalty += 6
    }
  })
  if (lateNightCalories > 350) penalty += 12
  if (naKRatio && naKRatio > 1.25) penalty += 10

  const habitScore = Math.max(0, 100 - penalty)

  return {
    totals,
    items,
    totalPotassium,
    naKRatio,
    lateNightMeals,
    lateNightCalories,
    habitScore
  }
}


