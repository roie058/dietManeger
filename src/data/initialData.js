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
  { 
    id: 'f1', 
    name: 'Grilled Chicken Breast', 
    serving: '150g', 
    calories: 247, 
    protein: 46, 
    carbs: 0, 
    fat: 5, 
    category: 'Protein',
    micros: { vit_b12: 0.6, zinc: 1.5, iron: 1.5, magnesium: 42, potassium: 384, vit_d: 10, vit_c: 0, calcium: 20, omega_3: 120, vit_a: 20 },
    cautions: { transFat: 0, cholesterol: 110, sodium: 120, saturatedFat: 1.2, addedSugar: 0 },
    keyMicros: ['Vit B12', 'Zinc', 'Potassium']
  },
  { 
    id: 'f2', 
    name: 'Rolled Oats with Berries', 
    serving: '80g dry + 50g berries', 
    calories: 340, 
    protein: 12, 
    carbs: 62, 
    fat: 5, 
    category: 'Carbs',
    micros: { magnesium: 110, iron: 3.8, zinc: 2.5, potassium: 360, vit_c: 15, vit_b12: 0, calcium: 60, omega_3: 150, vit_d: 0, vit_a: 35 },
    cautions: { transFat: 0, cholesterol: 0, sodium: 4, saturatedFat: 0.8, addedSugar: 0 },
    keyMicros: ['Magnesium', 'Iron', 'Zinc', 'Vit C']
  },
  { 
    id: 'f3', 
    name: 'Non-Fat Greek Yogurt (0%)', 
    serving: '200g', 
    calories: 120, 
    protein: 20, 
    carbs: 8, 
    fat: 0, 
    category: 'Dairy',
    micros: { calcium: 220, vit_b12: 1.1, potassium: 280, zinc: 1.2, magnesium: 22, iron: 0.1, vit_d: 10, vit_c: 0, omega_3: 0, vit_a: 10 },
    cautions: { transFat: 0, cholesterol: 10, sodium: 65, saturatedFat: 0, addedSugar: 0 },
    keyMicros: ['Calcium', 'Vit B12', 'Potassium']
  },
  { 
    id: 'f4', 
    name: 'Whole Eggs (Poached / Boiled)', 
    serving: '2 large eggs', 
    calories: 144, 
    protein: 12, 
    carbs: 1, 
    fat: 10, 
    category: 'Protein',
    micros: { vit_d: 88, vit_b12: 1.1, iron: 1.8, zinc: 1.3, calcium: 56, magnesium: 12, potassium: 138, vit_a: 160, omega_3: 180, vit_c: 0 },
    cautions: { transFat: 0, cholesterol: 372, sodium: 140, saturatedFat: 3.1, addedSugar: 0 },
    keyMicros: ['Vit D3', 'Vit B12', 'Vit A', 'Iron']
  },
  { 
    id: 'f5', 
    name: 'Steamed Jasmine / Brown Rice', 
    serving: '150g cooked', 
    calories: 195, 
    protein: 4, 
    carbs: 43, 
    fat: 0.5, 
    category: 'Carbs',
    micros: { magnesium: 44, iron: 0.8, zinc: 1.2, potassium: 84, calcium: 10, vit_b12: 0, vit_d: 0, vit_c: 0, omega_3: 30, vit_a: 0 },
    cautions: { transFat: 0, cholesterol: 0, sodium: 2, saturatedFat: 0.1, addedSugar: 0 },
    keyMicros: ['Magnesium', 'Zinc']
  },
  { 
    id: 'f6', 
    name: 'Pan-Seared Atlantic Salmon', 
    serving: '160g fillet', 
    calories: 332, 
    protein: 34, 
    carbs: 0, 
    fat: 20, 
    category: 'Protein',
    micros: { omega_3: 2150, vit_d: 680, vit_b12: 4.8, potassium: 620, magnesium: 46, zinc: 0.9, iron: 0.9, calcium: 24, vit_c: 0, vit_a: 60 },
    cautions: { transFat: 0, cholesterol: 85, sodium: 95, saturatedFat: 3.2, addedSugar: 0 },
    keyMicros: ['Omega-3 (179%)', 'Vit D3 (85%)', 'Vit B12 (200%)']
  },
  { 
    id: 'f7', 
    name: 'Fresh Hass Avocado', 
    serving: 'Half (70g)', 
    calories: 112, 
    protein: 1.5, 
    carbs: 6, 
    fat: 10, 
    category: 'Healthy Fats',
    micros: { potassium: 345, magnesium: 20, vit_c: 7, iron: 0.4, zinc: 0.4, calcium: 9, vit_a: 45, vit_b12: 0, vit_d: 0, omega_3: 75 },
    cautions: { transFat: 0, cholesterol: 0, sodium: 5, saturatedFat: 1.5, addedSugar: 0 },
    keyMicros: ['Potassium', 'Magnesium', 'Vit C']
  },
  { 
    id: 'f8', 
    name: 'Whey Protein Shake (with water)', 
    serving: '1 scoop (30g)', 
    calories: 120, 
    protein: 24, 
    carbs: 2, 
    fat: 1.5, 
    category: 'Supplement',
    micros: { calcium: 140, potassium: 150, magnesium: 25, iron: 0.5, zinc: 0.5, vit_b12: 0.5, vit_d: 15, vit_c: 0, omega_3: 20, vit_a: 20 },
    cautions: { transFat: 0, cholesterol: 35, sodium: 130, saturatedFat: 0.9, addedSugar: 0 },
    keyMicros: ['Calcium', 'Potassium', 'Vit B12']
  },
  { 
    id: 'f9', 
    name: 'Sweet Potato (Baked)', 
    serving: '1 medium (130g)', 
    calories: 112, 
    protein: 2, 
    carbs: 26, 
    fat: 0.1, 
    category: 'Carbs',
    micros: { vit_a: 960, vit_c: 22, potassium: 450, magnesium: 32, iron: 0.8, calcium: 38, zinc: 0.4, vit_d: 0, vit_b12: 0, omega_3: 10 },
    cautions: { transFat: 0, cholesterol: 0, sodium: 72, saturatedFat: 0, addedSugar: 0 },
    keyMicros: ['Vit A (106%)', 'Potassium', 'Vit C']
  },
  { 
    id: 'f10', 
    name: 'Extra Virgin Olive Oil', 
    serving: '1 tbsp (14ml)', 
    calories: 119, 
    protein: 0, 
    carbs: 0, 
    fat: 13.5, 
    category: 'Healthy Fats',
    micros: { omega_3: 110, vit_a: 0, vit_c: 0, vit_d: 0, vit_b12: 0, magnesium: 0, zinc: 0, iron: 0.1, calcium: 0, potassium: 0 },
    cautions: { transFat: 0, cholesterol: 0, sodium: 0, saturatedFat: 1.9, addedSugar: 0 },
    keyMicros: ['Omega-3', 'Polyphenols']
  },
  { 
    id: 'f11', 
    name: 'Organic Almonds', 
    serving: '1 handful (30g)', 
    calories: 173, 
    protein: 6, 
    carbs: 6, 
    fat: 15, 
    category: 'Healthy Fats',
    micros: { magnesium: 78, calcium: 76, iron: 1.1, zinc: 1.0, potassium: 208, vit_c: 0, vit_d: 0, vit_b12: 0, omega_3: 15, vit_a: 1 },
    cautions: { transFat: 0, cholesterol: 0, sodium: 1, saturatedFat: 1.1, addedSugar: 0 },
    keyMicros: ['Magnesium', 'Calcium', 'Iron']
  },
  { 
    id: 'f12', 
    name: 'Large Banana', 
    serving: '1 medium (120g)', 
    calories: 105, 
    protein: 1.3, 
    carbs: 27, 
    fat: 0.3, 
    category: 'Carbs',
    micros: { potassium: 422, vit_c: 10.3, magnesium: 32, iron: 0.3, calcium: 6, zinc: 0.2, vit_a: 8, vit_b12: 0, vit_d: 0, omega_3: 30 },
    cautions: { transFat: 0, cholesterol: 0, sodium: 1, saturatedFat: 0.1, addedSugar: 0 },
    keyMicros: ['Potassium', 'Vit C', 'Magnesium']
  },
  { 
    id: 'f13', 
    name: 'Steamed Baby Spinach & Kale', 
    serving: '1 bowl (100g cooked)', 
    calories: 35, 
    protein: 3, 
    carbs: 5, 
    fat: 0.5, 
    category: 'Produce',
    micros: { vit_a: 750, vit_c: 65, iron: 3.2, magnesium: 70, calcium: 150, potassium: 500, zinc: 0.8, vit_b12: 0, vit_d: 0, omega_3: 180 },
    cautions: { transFat: 0, cholesterol: 0, sodium: 70, saturatedFat: 0.1, addedSugar: 0 },
    keyMicros: ['Vit A', 'Vit C', 'Iron', 'Magnesium']
  },
  { 
    id: 'f14', 
    name: 'Wild Sardines in Olive Oil', 
    serving: '1 tin (90g)', 
    calories: 190, 
    protein: 22, 
    carbs: 0, 
    fat: 11, 
    category: 'Protein',
    micros: { omega_3: 1400, vit_d: 200, vit_b12: 8.0, calcium: 350, iron: 2.5, magnesium: 35, potassium: 360, zinc: 1.3, vit_c: 0, vit_a: 32 },
    cautions: { transFat: 0, cholesterol: 120, sodium: 320, saturatedFat: 2.5, addedSugar: 0 },
    keyMicros: ['Omega-3 (116%)', 'Calcium (35%)', 'Vit B12']
  },
  { 
    id: 'f15', 
    name: 'Raw Pumpkin Seeds (Pepitas)', 
    serving: '1 handful (30g)', 
    calories: 170, 
    protein: 9, 
    carbs: 4, 
    fat: 14, 
    category: 'Healthy Fats',
    micros: { magnesium: 168, zinc: 2.3, iron: 2.6, potassium: 240, calcium: 15, omega_3: 100, vit_c: 0, vit_d: 0, vit_b12: 0, vit_a: 5 },
    cautions: { transFat: 0, cholesterol: 0, sodium: 5, saturatedFat: 2.6, addedSugar: 0 },
    keyMicros: ['Magnesium (42%)', 'Zinc (21%)', 'Iron']
  },
  { 
    id: 'f16', 
    name: 'Complete Daily Multivitamin & Mineral', 
    serving: '1 tablet', 
    calories: 5, 
    protein: 0, 
    carbs: 1, 
    fat: 0, 
    category: 'Supplement',
    micros: { vit_d: 800, vit_b12: 5.0, vit_c: 90, vit_a: 800, zinc: 11, iron: 10, magnesium: 100, calcium: 150, potassium: 100, omega_3: 0 },
    cautions: { transFat: 0, cholesterol: 0, sodium: 0, saturatedFat: 0, addedSugar: 0 },
    keyMicros: ['100% Vit D3', '100% Vit C', '100% Zinc', 'Vit B12']
  },
  { 
    id: 'f17', 
    name: 'Dark Chocolate (85% Cocoa)', 
    serving: '3 squares (30g)', 
    calories: 175, 
    protein: 2.8, 
    carbs: 11, 
    fat: 14, 
    category: 'Snacks & Pantry',
    micros: { magnesium: 65, iron: 3.4, zinc: 1.0, potassium: 215, calcium: 20, vit_d: 0, vit_b12: 0, vit_c: 0, vit_a: 0, omega_3: 10 },
    cautions: { transFat: 0, cholesterol: 1, sodium: 6, saturatedFat: 8.5, addedSugar: 4.2 },
    keyMicros: ['Iron', 'Magnesium']
  },
  { 
    id: 'f18', 
    name: 'Salted Roasted Cashews', 
    serving: '1 handful (30g)', 
    calories: 168, 
    protein: 5.2, 
    carbs: 9, 
    fat: 13, 
    category: 'Snacks & Pantry',
    micros: { magnesium: 82, zinc: 1.7, iron: 1.9, potassium: 187, calcium: 12, vit_d: 0, vit_b12: 0, vit_c: 0, vit_a: 0, omega_3: 18 },
    cautions: { transFat: 0, cholesterol: 0, sodium: 195, saturatedFat: 2.4, addedSugar: 0 },
    keyMicros: ['Magnesium', 'Zinc']
  }
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
    time: '08:30',
    micros: {
      magnesium: 132,
      calcium: 280,
      iron: 3.9,
      zinc: 3.7,
      vit_b12: 1.1,
      vit_c: 15,
      potassium: 640,
      vit_a: 45,
      vit_d: 10,
      omega_3: 150
    },
    cautions: {
      transFat: 0,
      cholesterol: 10,
      sodium: 69,
      saturatedFat: 0.8,
      addedSugar: 0
    }
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
    time: '13:00',
    micros: {
      potassium: 813,
      magnesium: 106,
      zinc: 3.1,
      iron: 2.7,
      vit_b12: 0.6,
      vit_c: 7,
      vit_a: 65,
      vit_d: 10,
      calcium: 39,
      omega_3: 225
    },
    cautions: {
      transFat: 0,
      cholesterol: 110,
      sodium: 127,
      saturatedFat: 2.8,
      addedSugar: 0
    }
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
    time: '16:45',
    micros: {
      potassium: 572,
      calcium: 146,
      magnesium: 57,
      vit_c: 10.3,
      vit_b12: 0.5,
      iron: 0.8,
      zinc: 0.7,
      vit_a: 28,
      vit_d: 15,
      omega_3: 50
    },
    cautions: {
      transFat: 0,
      cholesterol: 35,
      sodium: 131,
      saturatedFat: 1.0,
      addedSugar: 0
    }
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

export const DEFAULT_RECIPES = [
  {
    id: 'r1',
    title: 'High-Protein Paprika Chicken & Sweet Potato Bowl',
    category: 'Lunch',
    servings: 4,
    prepTime: '35 mins',
    instructions: '1. Season chicken breasts with smoked paprika, garlic, salt and 1 tbsp olive oil.\n2. Dice sweet potatoes and bake at 200°C for 25 minutes.\n3. Pan-sear chicken breast fillets for 6-7 minutes on each side until golden and cooked through.\n4. Lightly steam baby spinach and divide evenly into 4 glass meal-prep bowls.',
    tips: 'Seal tightly in glass meal prep containers. Keeps fresh in refrigerator for 4-5 days.',
    ingredients: [
      { foodId: 'f1', foodName: 'Grilled Chicken Breast', amountGrams: 600, servingDesc: '600g' },
      { foodId: 'f9', foodName: 'Sweet Potato (Baked)', amountGrams: 520, servingDesc: '4 medium (520g)' },
      { foodId: 'f13', foodName: 'Steamed Baby Spinach & Kale', amountGrams: 200, servingDesc: '200g' },
      { foodId: 'f10', foodName: 'Extra Virgin Olive Oil', amountGrams: 28, servingDesc: '2 tbsp (28ml)' }
    ]
  },
  {
    id: 'r2',
    title: 'Omega-3 Salmon, Rice & Avocado Power Plate',
    category: 'Dinner',
    servings: 3,
    prepTime: '25 mins',
    instructions: '1. Season wild salmon fillets with sea salt, black pepper and a squeeze of fresh lemon.\n2. Sear on a hot non-stick skillet skin-side down for 4 minutes, flip and cook 3 minutes more.\n3. Plate with warm steamed brown/jasmine rice, sliced avocado and wilted greens.',
    tips: 'Super high in natural Omega-3 fatty acids, Potassium and Vitamin D3.',
    ingredients: [
      { foodId: 'f6', foodName: 'Pan-Seared Atlantic Salmon', amountGrams: 480, servingDesc: '3 fillets (480g)' },
      { foodId: 'f5', foodName: 'Steamed Jasmine / Brown Rice', amountGrams: 450, servingDesc: '450g cooked' },
      { foodId: 'f7', foodName: 'Fresh Hass Avocado', amountGrams: 140, servingDesc: '1 whole avocado' },
      { foodId: 'f13', foodName: 'Steamed Baby Spinach & Kale', amountGrams: 150, servingDesc: '150g' }
    ]
  },
  {
    id: 'r3',
    title: 'Overnight Protein Oats with Berries & Greek Yogurt',
    category: 'Breakfast',
    servings: 2,
    prepTime: '10 mins',
    instructions: '1. In mason jars, mix rolled oats, Greek yogurt, whey protein and 150ml water or unsweetened almond milk.\n2. Stir until smooth, seal and refrigerate overnight (minimum 4 hours).\n3. Before serving, top with sliced banana and crunchy almonds.',
    tips: 'The ultimate grab-and-go morning meal with slow-digesting complex carbs and 38g of protein per serving.',
    ingredients: [
      { foodId: 'f2', foodName: 'Rolled Oats with Berries', amountGrams: 160, servingDesc: '160g' },
      { foodId: 'f3', foodName: 'Non-Fat Greek Yogurt (0%)', amountGrams: 300, servingDesc: '300g' },
      { foodId: 'f8', foodName: 'Whey Protein Shake (with water)', amountGrams: 60, servingDesc: '2 scoops (60g)' },
      { foodId: 'f11', foodName: 'Organic Almonds', amountGrams: 30, servingDesc: '1 handful (30g)' },
      { foodId: 'f12', foodName: 'Large Banana', amountGrams: 120, servingDesc: '1 medium (120g)' }
    ]
  }
]

