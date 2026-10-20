export const DEFAULT_USER_PROFILE = {
  name: 'Alex',
  age: 28,
  gender: 'male',
  height: 178, // cm
  weight: 76,  // kg
  targetWeight: 72, // kg
  activityLevel: 'moderate',
  goal: 'lose_weight_steady',
  macroPreset: 'high_protein',
  bmr: 1720,
  tdee: 2666,
  targetCalories: 2350,
  targetProtein: 175,
  targetCarbs: 235,
  targetFat: 65,
  waterGoal: 3200 // ml
}

export const COMMON_FOOD_LIBRARY = [
  { id: 'f1', name: 'Grilled Chicken Breast', serving: '150g', calories: 247, protein: 46, carbs: 0, fat: 5, category: 'Protein' },
  { id: 'f2', name: 'Rolled Oats with Berries', serving: '80g dry + 50g berries', calories: 340, protein: 12, carbs: 62, fat: 5, category: 'Carbs' },
  { id: 'f3', name: 'Non-Fat Greek Yogurt (0%)', serving: '200g', calories: 120, protein: 20, carbs: 8, fat: 0, category: 'Dairy' },
  { id: 'f4', name: 'Whole Eggs (Poached / Boiled)', serving: '2 large eggs', calories: 144, protein: 12, carbs: 1, fat: 10, category: 'Protein' },
  { id: 'f5', name: 'Steamed Jasmine / Brown Rice', serving: '150g cooked', calories: 195, protein: 4, carbs: 43, fat: 0.5, category: 'Carbs' },
  { id: 'f6', name: 'Pan-Seared Atlantic Salmon', serving: '160g fillet', calories: 332, protein: 34, carbs: 0, fat: 20, category: 'Protein' },
  { id: 'f7', name: 'Fresh Hass Avocado', serving: 'Half (70g)', calories: 112, protein: 1.5, carbs: 6, fat: 10, category: 'Healthy Fats' },
  { id: 'f8', name: 'Whey Protein Shake (with water)', serving: '1 scoop (30g)', calories: 120, protein: 24, carbs: 2, fat: 1.5, category: 'Supplement' },
  { id: 'f9', name: 'Sweet Potato (Baked)', serving: '1 medium (130g)', calories: 112, protein: 2, carbs: 26, fat: 0.1, category: 'Carbs' },
  { id: 'f10', name: 'Extra Virgin Olive Oil', serving: '1 tbsp (14ml)', calories: 119, protein: 0, carbs: 0, fat: 13.5, category: 'Healthy Fats' },
  { id: 'f11', name: 'Organic Almonds', serving: '1 handful (30g)', calories: 173, protein: 6, carbs: 6, fat: 15, category: 'Healthy Fats' },
  { id: 'f12', name: 'Large Banana', serving: '1 medium (120g)', calories: 105, protein: 1.3, carbs: 27, fat: 0.3, category: 'Carbs' }
]

export const DEFAULT_MEAL_LOGS = [
  {
    id: 'm1',
    mealType: 'Breakfast',
    name: 'Protein Oatmeal & Greek Yogurt Bowl',
    serving: '1 bowl',
    calories: 460,
    protein: 32,
    carbs: 65,
    fat: 6,
    time: '08:30'
  },
  {
    id: 'm2',
    mealType: 'Lunch',
    name: 'Chicken Rice Bowl with Avocado',
    serving: '1 bowl',
    calories: 554,
    protein: 51.5,
    carbs: 49,
    fat: 15.5,
    time: '13:00'
  },
  {
    id: 'm3',
    mealType: 'Snack',
    name: 'Whey Protein & Banana',
    serving: 'Post-workout',
    calories: 225,
    protein: 25.3,
    carbs: 29,
    fat: 1.8,
    time: '16:45'
  }
]

export const DEFAULT_SHOPPING_LIST = [
  { id: 's1', text: 'Chicken breast fillets (1kg)', category: 'Poultry & Meat', completed: false },
  { id: 's2', text: 'Wild salmon fillets (400g)', category: 'Fish & Seafood', completed: false },
  { id: 's3', text: 'Organic baby spinach & kale', category: 'Fresh Produce', completed: true },
  { id: 's4', text: 'Hass Avocados (bag of 4)', category: 'Fresh Produce', completed: false },
  { id: 's5', text: 'Sweet potatoes & broccoli', category: 'Fresh Produce', completed: false },
  { id: 's6', text: '0% Plain Greek Yogurt', category: 'Dairy & Eggs', completed: true },
  { id: 's7', text: 'Free-range eggs (12-pack)', category: 'Dairy & Eggs', completed: false },
  { id: 's8', text: 'Rolled oats (1kg)', category: 'Pantry & Grains', completed: true },
  { id: 's9', text: 'Jasmine rice or quinoa', category: 'Pantry & Grains', completed: false },
  { id: 's10', text: 'Extra virgin olive oil', category: 'Oils & Condiments', completed: false }
]

export const DEFAULT_MEAL_PREP_TEMPLATES = [
  {
    day: 'Monday - Wednesday',
    batchTitle: 'Lean High-Protein Power Prep',
    servings: '6 meals',
    prepTime: '45 mins',
    macroBreakdown: '520 kcal | 48g Protein | 45g Carbs | 14g Fat',
    recipe: 'Baked paprika-garlic chicken breast, roasted sweet potato wedges, and steamed garlic broccoli.',
    tips: 'Cool completely before sealing in airtight glass containers. Keeps fresh for 4 days.'
  },
  {
    day: 'Thursday - Friday',
    batchTitle: 'Omega-3 Salmon & Quinoa Harvest',
    servings: '4 meals',
    prepTime: '30 mins',
    macroBreakdown: '560 kcal | 42g Protein | 40g Carbs | 22g Fat',
    recipe: 'Pan-seared Atlantic salmon fillets with lemon-dill quinoa, roasted asparagus, and cherry tomatoes.',
    tips: 'Store salmon with a wedge of lemon. Warm gently or enjoy chilled over greens.'
  }
]
