/**
 * Curated Whole Foods Database (USDA FoodData Central Standards)
 * Contains staple whole foods with accurate per-100g macros, micronutrients, 
 * cautions, common household portion sizes, and bilingual search terms (English & Hebrew).
 */

export const WHOLE_FOODS_DATABASE = [
  // ===================== FRUITS =====================
  {
    id: 'wf_banana',
    name: 'Banana, Raw',
    hebrewName: 'בננה',
    aliases: ['banana', 'bananas', 'בננה', 'בננות'],
    category: 'Carbs',
    icon: '🍌',
    per100g: { calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6, sugar: 12.2 },
    portions: [
      { label: '1 medium (7" to 7-7/8" long)', grams: 118, isDefault: true },
      { label: '1 small (6" to 6-7/8" long)', grams: 101 },
      { label: '1 large (8" to 8-7/8" long)', grams: 136 },
      { label: '1 cup, sliced', grams: 150 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 358, vit_c: 8.7, vit_b12: 0, magnesium: 27, calcium: 5, iron: 0.3, zinc: 0.15, vit_d: 0, vit_a: 64, omega_3: 27 },
    cautions: { sodium: 1, cholesterol: 0, transFat: 0, saturatedFat: 0.1, addedSugar: 0 }
  },
  {
    id: 'wf_apple',
    name: 'Apple with Skin, Raw',
    hebrewName: 'תפוח עץ עם קליפה',
    aliases: ['apple', 'apples', 'תפוח', 'תפוחים', 'תפוח עץ'],
    category: 'Carbs',
    icon: '🍎',
    per100g: { calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2, fiber: 2.4, sugar: 10.4 },
    portions: [
      { label: '1 medium (3" dia)', grams: 182, isDefault: true },
      { label: '1 small (2-3/4" dia)', grams: 149 },
      { label: '1 large (3-1/4" dia)', grams: 223 },
      { label: '1 cup, chopped', grams: 125 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 107, vit_c: 4.6, vit_b12: 0, magnesium: 5, calcium: 6, iron: 0.12, zinc: 0.04, vit_d: 0, vit_a: 54, omega_3: 9 },
    cautions: { sodium: 1, cholesterol: 0, transFat: 0, saturatedFat: 0, addedSugar: 0 }
  },
  {
    id: 'wf_orange',
    name: 'Orange, Fresh Raw',
    hebrewName: 'תפוז',
    aliases: ['orange', 'oranges', 'תפוז', 'תפוזים'],
    category: 'Carbs',
    icon: '🍊',
    per100g: { calories: 47, protein: 0.9, carbs: 11.8, fat: 0.1, fiber: 2.4, sugar: 9.4 },
    portions: [
      { label: '1 medium (2-5/8" dia)', grams: 131, isDefault: true },
      { label: '1 large (3-1/16" dia)', grams: 184 },
      { label: '1 cup sections', grams: 180 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 181, vit_c: 53.2, vit_b12: 0, magnesium: 10, calcium: 40, iron: 0.1, zinc: 0.07, vit_d: 0, vit_a: 225, omega_3: 7 },
    cautions: { sodium: 0, cholesterol: 0, transFat: 0, saturatedFat: 0, addedSugar: 0 }
  },
  {
    id: 'wf_berries',
    name: 'Blueberries, Fresh Raw',
    hebrewName: 'אוכמניות טריות',
    aliases: ['blueberries', 'blueberry', 'berries', 'אוכמניות', 'פירות יער'],
    category: 'Carbs',
    icon: '🫐',
    per100g: { calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3, fiber: 2.4, sugar: 9.9 },
    portions: [
      { label: '1 cup', grams: 148, isDefault: true },
      { label: '1/2 cup', grams: 74 },
      { label: 'Handful (~50g)', grams: 50 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 77, vit_c: 9.7, vit_b12: 0, magnesium: 6, calcium: 6, iron: 0.28, zinc: 0.16, vit_d: 0, vit_a: 54, omega_3: 58 },
    cautions: { sodium: 1, cholesterol: 0, transFat: 0, saturatedFat: 0, addedSugar: 0 }
  },
  {
    id: 'wf_strawberries',
    name: 'Strawberries, Fresh Raw',
    hebrewName: 'תות שדה טרי',
    aliases: ['strawberries', 'strawberry', 'תות', 'תותים', 'תות שדה'],
    category: 'Carbs',
    icon: '🍓',
    per100g: { calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2.0, sugar: 4.9 },
    portions: [
      { label: '1 cup whole (approx 8 berries)', grams: 144, isDefault: true },
      { label: '1 large strawberry', grams: 18 },
      { label: '1 medium strawberry', grams: 12 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 153, vit_c: 58.8, vit_b12: 0, magnesium: 13, calcium: 16, iron: 0.41, zinc: 0.14, vit_d: 0, vit_a: 12, omega_3: 65 },
    cautions: { sodium: 1, cholesterol: 0, transFat: 0, saturatedFat: 0, addedSugar: 0 }
  },
  {
    id: 'wf_avocado',
    name: 'Avocado, Raw',
    hebrewName: 'אבוקדו',
    aliases: ['avocado', 'avocados', 'אבוקדו'],
    category: 'Healthy Fats',
    icon: '🥑',
    per100g: { calories: 160, protein: 2.0, carbs: 8.5, fat: 14.7, fiber: 6.7, sugar: 0.7 },
    portions: [
      { label: '1/2 medium avocado', grams: 100, isDefault: true },
      { label: '1 whole medium avocado', grams: 200 },
      { label: '1/4 avocado (slice)', grams: 50 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 485, vit_c: 10, vit_b12: 0, magnesium: 29, calcium: 12, iron: 0.55, zinc: 0.64, vit_d: 0, vit_a: 146, omega_3: 110 },
    cautions: { sodium: 7, cholesterol: 0, transFat: 0, saturatedFat: 2.1, addedSugar: 0 }
  },
  {
    id: 'wf_watermelon',
    name: 'Watermelon, Fresh Raw',
    hebrewName: 'אבטיח',
    aliases: ['watermelon', 'melon', 'אבטיח'],
    category: 'Carbs',
    icon: '🍉',
    per100g: { calories: 30, protein: 0.6, carbs: 7.6, fat: 0.2, fiber: 0.4, sugar: 6.2 },
    portions: [
      { label: '1 wedge (~1/16 of melon)', grams: 286, isDefault: true },
      { label: '1 cup, diced', grams: 152 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 112, vit_c: 8.1, vit_b12: 0, magnesium: 10, calcium: 7, iron: 0.24, zinc: 0.1, vit_d: 0, vit_a: 569, omega_3: 0 },
    cautions: { sodium: 1, cholesterol: 0, transFat: 0, saturatedFat: 0, addedSugar: 0 }
  },

  // ===================== VEGETABLES =====================
  {
    id: 'wf_cucumber',
    name: 'Cucumber with Peel, Raw',
    hebrewName: 'מלפפון עם קליפה',
    aliases: ['cucumber', 'cucumbers', 'מלפפון', 'מלפפונים'],
    category: 'Carbs',
    icon: '🥒',
    per100g: { calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, sugar: 1.7 },
    portions: [
      { label: '1 medium cucumber', grams: 120, isDefault: true },
      { label: '1 large cucumber', grams: 180 },
      { label: '1 cup, sliced', grams: 104 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 147, vit_c: 2.8, vit_b12: 0, magnesium: 13, calcium: 16, iron: 0.28, zinc: 0.2, vit_d: 0, vit_a: 105, omega_3: 5 },
    cautions: { sodium: 2, cholesterol: 0, transFat: 0, saturatedFat: 0, addedSugar: 0 }
  },
  {
    id: 'wf_tomato',
    name: 'Tomato, Fresh Red Raw',
    hebrewName: 'עגבניה אדומה',
    aliases: ['tomato', 'tomatoes', 'עגבניה', 'עגבניות'],
    category: 'Carbs',
    icon: '🍅',
    per100g: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sugar: 2.6 },
    portions: [
      { label: '1 medium tomato', grams: 123, isDefault: true },
      { label: '1 small tomato', grams: 91 },
      { label: '1 cup cherry tomatoes', grams: 149 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 237, vit_c: 13.7, vit_b12: 0, magnesium: 11, calcium: 10, iron: 0.27, zinc: 0.17, vit_d: 0, vit_a: 833, omega_3: 3 },
    cautions: { sodium: 5, cholesterol: 0, transFat: 0, saturatedFat: 0, addedSugar: 0 }
  },
  {
    id: 'wf_broccoli',
    name: 'Broccoli, Fresh Raw',
    hebrewName: 'ברוקולי טרי',
    aliases: ['broccoli', 'ברוקולי'],
    category: 'Carbs',
    icon: '🥦',
    per100g: { calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4, fiber: 2.6, sugar: 1.7 },
    portions: [
      { label: '1 cup chopped florets', grams: 91, isDefault: true },
      { label: '1 stalk', grams: 150 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 316, vit_c: 89.2, vit_b12: 0, magnesium: 21, calcium: 47, iron: 0.73, zinc: 0.41, vit_d: 0, vit_a: 623, omega_3: 21 },
    cautions: { sodium: 33, cholesterol: 0, transFat: 0, saturatedFat: 0.1, addedSugar: 0 }
  },
  {
    id: 'wf_spinach',
    name: 'Baby Spinach, Raw',
    hebrewName: 'תרד טרי / עלי תרד',
    aliases: ['spinach', 'baby spinach', 'תרד', 'עלי תרד'],
    category: 'Carbs',
    icon: '🥬',
    per100g: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, sugar: 0.4 },
    portions: [
      { label: '1 cup fresh leaves', grams: 30, isDefault: true },
      { label: 'Large bowl (3 cups)', grams: 90 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 558, vit_c: 28.1, vit_b12: 0, magnesium: 79, calcium: 99, iron: 2.71, zinc: 0.53, vit_d: 0, vit_a: 9377, omega_3: 138 },
    cautions: { sodium: 79, cholesterol: 0, transFat: 0, saturatedFat: 0.1, addedSugar: 0 }
  },
  {
    id: 'wf_carrot',
    name: 'Carrot, Fresh Raw',
    hebrewName: 'גזר טרי',
    aliases: ['carrot', 'carrots', 'גזר', 'גזרים'],
    category: 'Carbs',
    icon: '🥕',
    per100g: { calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, fiber: 2.8, sugar: 4.7 },
    portions: [
      { label: '1 medium carrot', grams: 61, isDefault: true },
      { label: '1 large carrot', grams: 72 },
      { label: '1 cup, chopped', grams: 128 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 320, vit_c: 5.9, vit_b12: 0, magnesium: 12, calcium: 33, iron: 0.3, zinc: 0.24, vit_d: 0, vit_a: 16706, omega_3: 2 },
    cautions: { sodium: 69, cholesterol: 0, transFat: 0, saturatedFat: 0, addedSugar: 0 }
  },
  {
    id: 'wf_bell_pepper',
    name: 'Red Bell Pepper, Raw',
    hebrewName: 'פלפל אדום / גמבה',
    aliases: ['bell pepper', 'pepper', 'red pepper', 'פלפל', 'גמבה', 'פלפל אדום'],
    category: 'Carbs',
    icon: '🫑',
    per100g: { calories: 31, protein: 1.0, carbs: 6.0, fat: 0.3, fiber: 2.1, sugar: 4.2 },
    portions: [
      { label: '1 medium pepper', grams: 119, isDefault: true },
      { label: '1 cup, chopped', grams: 149 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 211, vit_c: 127.7, vit_b12: 0, magnesium: 12, calcium: 7, iron: 0.43, zinc: 0.25, vit_d: 0, vit_a: 3131, omega_3: 20 },
    cautions: { sodium: 4, cholesterol: 0, transFat: 0, saturatedFat: 0, addedSugar: 0 }
  },
  {
    id: 'wf_onion',
    name: 'Yellow Onion, Raw',
    hebrewName: 'בצל צהוב',
    aliases: ['onion', 'onions', 'בצל', 'בצלים'],
    category: 'Carbs',
    icon: '🧅',
    per100g: { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7, sugar: 4.2 },
    portions: [
      { label: '1 medium onion', grams: 110, isDefault: true },
      { label: '1 cup, chopped', grams: 160 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 146, vit_c: 7.4, vit_b12: 0, magnesium: 10, calcium: 23, iron: 0.21, zinc: 0.17, vit_d: 0, vit_a: 2, omega_3: 0 },
    cautions: { sodium: 4, cholesterol: 0, transFat: 0, saturatedFat: 0, addedSugar: 0 }
  },
  {
    id: 'wf_potato',
    name: 'Potato, Baked or Boiled (Flesh & Skin)',
    hebrewName: 'תפוח אדמה מבושל / אפוי',
    aliases: ['potato', 'potatoes', 'baked potato', 'תפוח אדמה', 'תפוד'],
    category: 'Carbs',
    icon: '🥔',
    per100g: { calories: 87, protein: 1.9, carbs: 20.1, fat: 0.1, fiber: 1.8, sugar: 0.9 },
    portions: [
      { label: '1 medium potato', grams: 173, isDefault: true },
      { label: '1 small potato', grams: 138 },
      { label: '1 large potato', grams: 299 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 421, vit_c: 19.7, vit_b12: 0, magnesium: 23, calcium: 12, iron: 0.78, zinc: 0.29, vit_d: 0, vit_a: 0, omega_3: 10 },
    cautions: { sodium: 6, cholesterol: 0, transFat: 0, saturatedFat: 0, addedSugar: 0 }
  },
  {
    id: 'wf_sweet_potato',
    name: 'Sweet Potato, Baked',
    hebrewName: 'בטטה אפויה',
    aliases: ['sweet potato', 'yam', 'בטטה', 'בטטות'],
    category: 'Carbs',
    icon: '🍠',
    per100g: { calories: 90, protein: 2.0, carbs: 20.7, fat: 0.2, fiber: 3.3, sugar: 6.5 },
    portions: [
      { label: '1 medium sweet potato', grams: 114, isDefault: true },
      { label: '1 large sweet potato', grams: 180 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 475, vit_c: 19.6, vit_b12: 0, magnesium: 27, calcium: 38, iron: 0.69, zinc: 0.32, vit_d: 0, vit_a: 19218, omega_3: 6 },
    cautions: { sodium: 36, cholesterol: 0, transFat: 0, saturatedFat: 0, addedSugar: 0 }
  },

  // ===================== PROTEIN: POULTRY, MEAT & FISH =====================
  {
    id: 'wf_chicken_breast',
    name: 'Chicken Breast, Cooked / Grilled (Skinless)',
    hebrewName: 'חזה עוף מבושל / צלוי ללא עור',
    aliases: ['chicken breast', 'chicken', 'grilled chicken', 'חזה עוף', 'עוף', 'שניצל עוף ללא ציפוי'],
    category: 'Protein',
    icon: '🍗',
    per100g: { calories: 165, protein: 31.0, carbs: 0, fat: 3.6, fiber: 0, sugar: 0 },
    portions: [
      { label: '1 breast fillet (medium)', grams: 150, isDefault: true },
      { label: '1 large breast fillet', grams: 200 },
      { label: '1 small breast fillet', grams: 120 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 334, vit_c: 0, vit_b12: 0.34, magnesium: 29, calcium: 15, iron: 1.04, zinc: 1.0, vit_d: 5, vit_a: 21, omega_3: 60 },
    cautions: { sodium: 74, cholesterol: 85, transFat: 0, saturatedFat: 1.0, addedSugar: 0 }
  },
  {
    id: 'wf_chicken_thigh',
    name: 'Chicken Thigh, Cooked (Skinless, Boneless)',
    hebrewName: 'פרגית / כרעיים עוף ללא עור ועצם',
    aliases: ['chicken thigh', 'dark meat', 'פרגית', 'פרגיות', 'ירך עוף'],
    category: 'Protein',
    icon: '🍗',
    per100g: { calories: 209, protein: 26.0, carbs: 0, fat: 10.9, fiber: 0, sugar: 0 },
    portions: [
      { label: '1 thigh fillet (~120g)', grams: 120, isDefault: true },
      { label: '2 thighs (~240g)', grams: 240 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 270, vit_c: 0, vit_b12: 0.5, magnesium: 24, calcium: 12, iron: 1.3, zinc: 2.1, vit_d: 8, vit_a: 25, omega_3: 80 },
    cautions: { sodium: 86, cholesterol: 95, transFat: 0, saturatedFat: 3.0, addedSugar: 0 }
  },
  {
    id: 'wf_egg_whole',
    name: 'Whole Egg, Boiled or Poached',
    hebrewName: 'ביצה שלמה קשה / שלוקה',
    aliases: ['egg', 'eggs', 'hard boiled egg', 'ביצה', 'ביצים', 'ביצה קשה'],
    category: 'Protein',
    icon: '🥚',
    per100g: { calories: 155, protein: 12.6, carbs: 1.1, fat: 10.6, fiber: 0, sugar: 1.1 },
    portions: [
      { label: '1 large egg', grams: 50, isDefault: true },
      { label: '2 large eggs', grams: 100 },
      { label: '3 large eggs', grams: 150 },
      { label: '1 extra large egg', grams: 56 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 126, vit_c: 0, vit_b12: 1.1, magnesium: 12, calcium: 50, iron: 1.75, zinc: 1.29, vit_d: 87, vit_a: 540, omega_3: 102 },
    cautions: { sodium: 124, cholesterol: 373, transFat: 0, saturatedFat: 3.3, addedSugar: 0 }
  },
  {
    id: 'wf_egg_whites',
    name: 'Egg White, Cooked',
    hebrewName: 'חלבון ביצה מבושל (חלבון בלבד)',
    aliases: ['egg white', 'egg whites', 'חלבון ביצה'],
    category: 'Protein',
    icon: '🍳',
    per100g: { calories: 52, protein: 10.9, carbs: 0.7, fat: 0.2, fiber: 0, sugar: 0.7 },
    portions: [
      { label: 'White of 1 large egg', grams: 33, isDefault: true },
      { label: 'Whites of 3 large eggs', grams: 100 },
      { label: '1 cup liquid egg whites', grams: 243 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 163, vit_c: 0, vit_b12: 0.09, magnesium: 11, calcium: 7, iron: 0.08, zinc: 0.03, vit_d: 0, vit_a: 0, omega_3: 0 },
    cautions: { sodium: 166, cholesterol: 0, transFat: 0, saturatedFat: 0, addedSugar: 0 }
  },
  {
    id: 'wf_salmon',
    name: 'Atlantic Salmon, Cooked / Baked',
    hebrewName: 'סלמון אפוי / צלוי',
    aliases: ['salmon', 'fish', 'סלמון', 'דג סלמון'],
    category: 'Protein',
    icon: '🐟',
    per100g: { calories: 206, protein: 22.1, carbs: 0, fat: 12.3, fiber: 0, sugar: 0 },
    portions: [
      { label: '1 fillet (medium, ~150g)', grams: 150, isDefault: true },
      { label: '1 small fillet (~110g)', grams: 110 },
      { label: '1 large fillet (~200g)', grams: 200 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 384, vit_c: 0, vit_b12: 2.8, magnesium: 30, calcium: 15, iron: 0.34, zinc: 0.45, vit_d: 526, vit_a: 50, omega_3: 2260 },
    cautions: { sodium: 61, cholesterol: 63, transFat: 0, saturatedFat: 2.5, addedSugar: 0 }
  },
  {
    id: 'wf_canned_tuna',
    name: 'Canned Tuna in Water (Drained)',
    hebrewName: 'טונה במים משומרת (מסוננת)',
    aliases: ['canned tuna', 'tuna in water', 'tuna', 'טונה', 'טונה במים'],
    category: 'Protein',
    icon: '🥫',
    per100g: { calories: 116, protein: 25.5, carbs: 0, fat: 0.8, fiber: 0, sugar: 0 },
    portions: [
      { label: '1 standard can drained (~112g)', grams: 112, isDefault: true },
      { label: '1/2 can drained (~56g)', grams: 56 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 237, vit_c: 0, vit_b12: 2.5, magnesium: 27, calcium: 11, iron: 1.5, zinc: 0.9, vit_d: 82, vit_a: 20, omega_3: 240 },
    cautions: { sodium: 338, cholesterol: 44, transFat: 0, saturatedFat: 0.2, addedSugar: 0 }
  },
  {
    id: 'wf_lean_beef',
    name: 'Lean Ground Beef (90% Lean / 10% Fat, Cooked)',
    hebrewName: 'בשר בקר טחון רזה (90% רזה, מבושל)',
    aliases: ['ground beef', 'beef', 'lean beef', 'mince', 'בקר', 'בשר טחון', 'בשר בקר'],
    category: 'Protein',
    icon: '🥩',
    per100g: { calories: 217, protein: 26.1, carbs: 0, fat: 11.8, fiber: 0, sugar: 0 },
    portions: [
      { label: '1 cooked patty (~120g)', grams: 120, isDefault: true },
      { label: '1 cup cooked crumbles (~140g)', grams: 140 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 351, vit_c: 0, vit_b12: 2.6, magnesium: 22, calcium: 18, iron: 2.7, zinc: 6.2, vit_d: 4, vit_a: 0, omega_3: 50 },
    cautions: { sodium: 70, cholesterol: 82, transFat: 0.6, saturatedFat: 4.8, addedSugar: 0 }
  },
  {
    id: 'wf_tofu',
    name: 'Firm Tofu, Raw or Pan-Seared',
    hebrewName: 'טופו מוצק',
    aliases: ['tofu', 'firm tofu', 'טופו', 'טופו מוצק'],
    category: 'Protein',
    icon: '🧊',
    per100g: { calories: 144, protein: 15.6, carbs: 2.8, fat: 8.7, fiber: 2.3, sugar: 0.6 },
    portions: [
      { label: '1 block (1/3 block, ~100g)', grams: 100, isDefault: true },
      { label: '1/2 block (~150g)', grams: 150 },
      { label: 'Full block (~300g)', grams: 300 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 237, vit_c: 0, vit_b12: 0, magnesium: 58, calcium: 683, iron: 2.7, zinc: 1.6, vit_d: 0, vit_a: 35, omega_3: 580 },
    cautions: { sodium: 14, cholesterol: 0, transFat: 0, saturatedFat: 1.3, addedSugar: 0 }
  },

  // ===================== GRAINS & STARCHES =====================
  {
    id: 'wf_white_rice',
    name: 'White Rice, Long-Grain Cooked',
    hebrewName: 'אורז לבן מבושל',
    aliases: ['white rice', 'rice', 'cooked rice', 'אורז', 'אורז לבן'],
    category: 'Carbs',
    icon: '🍚',
    per100g: { calories: 130, protein: 2.7, carbs: 28.2, fat: 0.3, fiber: 0.4, sugar: 0.1 },
    portions: [
      { label: '1 cup cooked (~158g)', grams: 158, isDefault: true },
      { label: '1/2 cup cooked (~79g)', grams: 79 },
      { label: '1 large bowl (~250g)', grams: 250 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 35, vit_c: 0, vit_b12: 0, magnesium: 12, calcium: 10, iron: 1.2, zinc: 0.5, vit_d: 0, vit_a: 0, omega_3: 15 },
    cautions: { sodium: 1, cholesterol: 0, transFat: 0, saturatedFat: 0.1, addedSugar: 0 }
  },
  {
    id: 'wf_brown_rice',
    name: 'Brown Rice, Long-Grain Cooked',
    hebrewName: 'אורז מלא מבושל',
    aliases: ['brown rice', 'cooked brown rice', 'אורז מלא'],
    category: 'Carbs',
    icon: '🍚',
    per100g: { calories: 123, protein: 2.7, carbs: 25.6, fat: 1.0, fiber: 1.6, sugar: 0.2 },
    portions: [
      { label: '1 cup cooked (~195g)', grams: 195, isDefault: true },
      { label: '1/2 cup cooked (~98g)', grams: 98 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 86, vit_c: 0, vit_b12: 0, magnesium: 44, calcium: 10, iron: 0.56, zinc: 1.0, vit_d: 0, vit_a: 0, omega_3: 20 },
    cautions: { sodium: 4, cholesterol: 0, transFat: 0, saturatedFat: 0.2, addedSugar: 0 }
  },
  {
    id: 'wf_rolled_oats',
    name: 'Rolled Oats, Dry Raw',
    hebrewName: 'שיבולת שועל (קוואקר) יבשה',
    aliases: ['oats', 'oatmeal', 'rolled oats', 'קוואקר', 'שיבולת שועל', 'שיבולת'],
    category: 'Carbs',
    icon: '🥣',
    per100g: { calories: 379, protein: 13.2, carbs: 67.7, fat: 6.5, fiber: 10.1, sugar: 1.0 },
    portions: [
      { label: '1/2 cup dry (~40g)', grams: 40, isDefault: true },
      { label: '1 cup dry (~80g)', grams: 80 },
      { label: '1/3 cup dry (~27g)', grams: 27 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 362, vit_c: 0, vit_b12: 0, magnesium: 138, calcium: 52, iron: 4.25, zinc: 3.64, vit_d: 0, vit_a: 0, omega_3: 110 },
    cautions: { sodium: 6, cholesterol: 0, transFat: 0, saturatedFat: 1.1, addedSugar: 0 }
  },
  {
    id: 'wf_whole_wheat_bread',
    name: 'Whole Wheat Bread',
    hebrewName: 'לחם חיטה מלאה',
    aliases: ['bread', 'whole wheat bread', 'לחם', 'לחם מלא', 'פרוסת לחם'],
    category: 'Carbs',
    icon: '🍞',
    per100g: { calories: 247, protein: 13.0, carbs: 41.3, fat: 3.4, fiber: 7.0, sugar: 6.0 },
    portions: [
      { label: '1 slice (~36g)', grams: 36, isDefault: true },
      { label: '2 slices sandwich (~72g)', grams: 72 },
      { label: '1 thick slice (~45g)', grams: 45 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 254, vit_c: 0, vit_b12: 0, magnesium: 75, calcium: 161, iron: 2.5, zinc: 1.8, vit_d: 0, vit_a: 0, omega_3: 180 },
    cautions: { sodium: 450, cholesterol: 0, transFat: 0, saturatedFat: 0.7, addedSugar: 4.0 }
  },
  {
    id: 'wf_pasta_cooked',
    name: 'Pasta / Spaghetti, Cooked',
    hebrewName: 'פסטה / ספגטי מבושל',
    aliases: ['pasta', 'spaghetti', 'cooked pasta', 'noodles', 'פסטה', 'ספגטי', 'אטריות'],
    category: 'Carbs',
    icon: '🍝',
    per100g: { calories: 158, protein: 5.8, carbs: 30.9, fat: 0.9, fiber: 1.8, sugar: 0.6 },
    portions: [
      { label: '1 cup cooked (~140g)', grams: 140, isDefault: true },
      { label: '1 large plate (~220g)', grams: 220 },
      { label: '1/2 cup cooked (~70g)', grams: 70 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 44, vit_c: 0, vit_b12: 0, magnesium: 18, calcium: 7, iron: 1.28, zinc: 0.53, vit_d: 0, vit_a: 0, omega_3: 20 },
    cautions: { sodium: 1, cholesterol: 0, transFat: 0, saturatedFat: 0.2, addedSugar: 0 }
  },

  // ===================== DAIRY & HEALTHY FATS =====================
  {
    id: 'wf_olive_oil',
    name: 'Extra Virgin Olive Oil',
    hebrewName: 'שמן זית כתית מעולה',
    aliases: ['olive oil', 'oil', 'extra virgin olive oil', 'שמן זית', 'שמן'],
    category: 'Healthy Fats',
    icon: '🫒',
    per100g: { calories: 884, protein: 0, carbs: 0, fat: 100.0, fiber: 0, sugar: 0 },
    portions: [
      { label: '1 tablespoon (14g)', grams: 14, isDefault: true },
      { label: '1 teaspoon (4.5g)', grams: 4.5 },
      { label: '2 tablespoons (28g)', grams: 28 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 1, vit_c: 0, vit_b12: 0, magnesium: 0, calcium: 1, iron: 0.56, zinc: 0, vit_d: 0, vit_a: 0, omega_3: 760 },
    cautions: { sodium: 2, cholesterol: 0, transFat: 0, saturatedFat: 14.0, addedSugar: 0 }
  },
  {
    id: 'wf_almonds',
    name: 'Almonds, Raw Whole',
    hebrewName: 'שקדים טבעיים לא קלויים',
    aliases: ['almonds', 'almond', 'nuts', 'שקדים', 'שקד'],
    category: 'Healthy Fats',
    icon: '🥜',
    per100g: { calories: 579, protein: 21.2, carbs: 21.6, fat: 49.9, fiber: 12.5, sugar: 4.4 },
    portions: [
      { label: '1 handful (approx 23 almonds, 28g)', grams: 28, isDefault: true },
      { label: '10 almonds (~12g)', grams: 12 },
      { label: '1/4 cup whole (~35g)', grams: 35 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 733, vit_c: 0, vit_b12: 0, magnesium: 270, calcium: 269, iron: 3.71, zinc: 3.12, vit_d: 0, vit_a: 2, omega_3: 6 },
    cautions: { sodium: 1, cholesterol: 0, transFat: 0, saturatedFat: 3.8, addedSugar: 0 }
  },
  {
    id: 'wf_walnuts',
    name: 'Walnuts, Raw Halves',
    hebrewName: 'אגוזי מלך טבעיים',
    aliases: ['walnuts', 'walnut', 'אגוזי מלך', 'אגוז מלך', 'אגוזים'],
    category: 'Healthy Fats',
    icon: '🌰',
    per100g: { calories: 654, protein: 15.2, carbs: 13.7, fat: 65.2, fiber: 6.7, sugar: 2.6 },
    portions: [
      { label: '1 handful (approx 7 walnuts, 28g)', grams: 28, isDefault: true },
      { label: '1/4 cup halves (~30g)', grams: 30 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 441, vit_c: 1.3, vit_b12: 0, magnesium: 158, calcium: 98, iron: 2.91, zinc: 3.09, vit_d: 0, vit_a: 20, omega_3: 9080 },
    cautions: { sodium: 2, cholesterol: 0, transFat: 0, saturatedFat: 6.1, addedSugar: 0 }
  },
  {
    id: 'wf_peanut_butter',
    name: 'Natural Peanut Butter (100% Peanuts)',
    hebrewName: 'חמאת בוטנים טבעית 100%',
    aliases: ['peanut butter', 'pb', 'חמאת בוטנים', 'חמאת בוטנים טבעית'],
    category: 'Healthy Fats',
    icon: '🥜',
    per100g: { calories: 588, protein: 25.1, carbs: 20.0, fat: 50.4, fiber: 8.0, sugar: 6.0 },
    portions: [
      { label: '1 tablespoon (16g)', grams: 16, isDefault: true },
      { label: '2 tablespoons (32g)', grams: 32 },
      { label: '1 teaspoon (5g)', grams: 5 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 649, vit_c: 0, vit_b12: 0, magnesium: 154, calcium: 43, iron: 1.9, zinc: 2.9, vit_d: 0, vit_a: 0, omega_3: 0 },
    cautions: { sodium: 17, cholesterol: 0, transFat: 0, saturatedFat: 9.5, addedSugar: 0 }
  },
  {
    id: 'wf_greek_yogurt_0',
    name: 'Greek Yogurt 0% Fat, Plain',
    hebrewName: 'יוגורט יווני 0% שומן טבעי',
    aliases: ['greek yogurt', 'yogurt 0%', 'יוגורט יווני', 'יוגורט 0', 'יוגורט'],
    category: 'Dairy',
    icon: '🥛',
    per100g: { calories: 59, protein: 10.2, carbs: 3.6, fat: 0.4, fiber: 0, sugar: 3.2 },
    portions: [
      { label: '1 standard tub (~200g)', grams: 200, isDefault: true },
      { label: '1 cup (~227g)', grams: 227 },
      { label: '1/2 cup (~113g)', grams: 113 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 141, vit_c: 0, vit_b12: 0.75, magnesium: 11, calcium: 110, iron: 0.05, zinc: 0.52, vit_d: 5, vit_a: 5, omega_3: 0 },
    cautions: { sodium: 36, cholesterol: 5, transFat: 0, saturatedFat: 0.1, addedSugar: 0 }
  },
  {
    id: 'wf_cottage_cheese_5',
    name: 'Cottage Cheese 5% Fat',
    hebrewName: 'גבינת קוטג׳ 5% שומן',
    aliases: ['cottage cheese', 'cottage', 'קוטג', 'קוטג׳', 'גבינת קוטג'],
    category: 'Dairy',
    icon: '🧀',
    per100g: { calories: 95, protein: 11.0, carbs: 2.5, fat: 5.0, fiber: 0, sugar: 2.5 },
    portions: [
      { label: '1/2 tub (~125g)', grams: 125, isDefault: true },
      { label: '1 standard tub (~250g)', grams: 250 },
      { label: '2 tablespoons (~50g)', grams: 50 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 104, vit_c: 0, vit_b12: 0.6, magnesium: 9, calcium: 83, iron: 0.1, zinc: 0.4, vit_d: 4, vit_a: 140, omega_3: 15 },
    cautions: { sodium: 364, cholesterol: 17, transFat: 0.1, saturatedFat: 3.1, addedSugar: 0 }
  },
  {
    id: 'wf_milk_3',
    name: 'Cow Milk 3% Fat (Whole)',
    hebrewName: 'חלב תנובה / בקר 3% שומן',
    aliases: ['milk', 'cow milk', 'חלב', 'חלב 3'],
    category: 'Dairy',
    icon: '🥛',
    per100g: { calories: 60, protein: 3.2, carbs: 4.8, fat: 3.2, fiber: 0, sugar: 4.8 },
    portions: [
      { label: '1 cup glass (240ml / ~245g)', grams: 245, isDefault: true },
      { label: '1/2 cup (120ml / ~122g)', grams: 122 },
      { label: 'Splash for coffee (~30g)', grams: 30 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 132, vit_c: 0, vit_b12: 0.45, magnesium: 10, calcium: 113, iron: 0.03, zinc: 0.38, vit_d: 40, vit_a: 162, omega_3: 40 },
    cautions: { sodium: 43, cholesterol: 10, transFat: 0.1, saturatedFat: 1.9, addedSugar: 0 }
  }
]

/**
 * Fast client-side search in whole foods database
 * Matches English names, Hebrew names, categories, and keyword aliases.
 */
export function searchWholeFoods(query) {
  if (!query || typeof query !== 'string') return []
  const clean = query.trim().toLowerCase()
  if (clean.length < 1) return []

  const tokens = clean.split(/\s+/).filter(Boolean)

  const scored = []

  for (const food of WHOLE_FOODS_DATABASE) {
    const nameLower = food.name.toLowerCase()
    const hebLower = (food.hebrewName || '').toLowerCase()
    const aliases = (food.aliases || []).map(a => a.toLowerCase())

    let score = 0

    // Exact matches
    if (nameLower === clean || hebLower === clean) {
      score += 100
    } else if (nameLower.startsWith(clean) || hebLower.startsWith(clean)) {
      score += 50
    } else if (aliases.includes(clean)) {
      score += 45
    }

    // Token inclusion
    let matchesAllTokens = true
    for (const t of tokens) {
      const matchInName = nameLower.includes(t)
      const matchInHeb = hebLower.includes(t)
      const matchInAlias = aliases.some(a => a.includes(t))

      if (matchInName || matchInHeb || matchInAlias) {
        score += 15
      } else {
        matchesAllTokens = false
        break
      }
    }

    if (matchesAllTokens && score > 0) {
      scored.push({ food, score })
    }
  }

  // Sort highest score first
  scored.sort((a, b) => b.score - a.score)
  return scored.map(item => item.food)
}

/**
 * Calculates scaled nutrients for a selected whole food given a specific weight in grams
 */
export function scaleWholeFoodPortion(food, targetGrams) {
  if (!food || !food.per100g || targetGrams <= 0) return null
  const factor = targetGrams / 100

  const round1 = (val) => Math.round(val * 10) / 10
  const round0 = (val) => Math.round(val)

  const scaled = {
    ...food,
    selectedGrams: targetGrams,
    serving: `${targetGrams}g`,
    calories: round0((food.per100g.calories || 0) * factor),
    protein: round1((food.per100g.protein || 0) * factor),
    carbs: round1((food.per100g.carbs || 0) * factor),
    fat: round1((food.per100g.fat || 0) * factor),
    fiber: round1((food.per100g.fiber || 0) * factor),
    sugar: round1((food.per100g.sugar || 0) * factor),
    micros: {},
    cautions: {}
  }

  if (food.micros) {
    for (const [k, v] of Object.entries(food.micros)) {
      scaled.micros[k] = round1((v || 0) * factor)
    }
  }

  if (food.cautions) {
    for (const [k, v] of Object.entries(food.cautions)) {
      scaled.cautions[k] = round1((v || 0) * factor)
    }
  }

  return scaled
}
