/**
 * Curated Whole Foods Database (USDA FoodData Central Standards)
 * Contains staple whole foods with accurate per-100g macros, micronutrients, 
 * cautions, common household portion sizes, and bilingual search terms (English & Hebrew).
 */

export const WHOLE_FOODS_DATABASE = [
  // =========================================================================
  // ===================== LEAFY GREENS & SALAD VEGETABLES ===================
  // =========================================================================
  {
    id: 'wf_lettuce_romaine',
    name: 'Romaine Lettuce, Fresh Raw',
    hebrewName: 'חסה ערבית / רומית',
    aliases: ['lettuce', 'romaine', 'romaine lettuce', 'salad', 'salad greens', 'greens', 'cos lettuce', 'חסה', 'חסה ערבית', 'חסה רומית', 'עלי חסה', 'סלט', 'ירוקים'],
    category: 'Produce',
    icon: '🥬',
    per100g: { calories: 17, protein: 1.2, carbs: 3.3, fat: 0.3, fiber: 2.1, sugar: 1.2 },
    portions: [
      { label: '1 cup shredded (approx 47g)', grams: 47, isDefault: true },
      { label: '1 large outer leaf (~25g)', grams: 25 },
      { label: '1 inner leaf (~10g)', grams: 10 },
      { label: '1 whole head romaine (~626g)', grams: 626 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 247, vit_c: 4.0, vit_b12: 0, magnesium: 14, calcium: 33, iron: 0.97, zinc: 0.23, vit_d: 0, vit_a: 8710, omega_3: 58 },
    cautions: { sodium: 8, cholesterol: 0, transFat: 0, saturatedFat: 0.04, addedSugar: 0 }
  },
  {
    id: 'wf_lettuce_iceberg',
    name: 'Iceberg Lettuce, Fresh Raw',
    hebrewName: 'חסה אמריקאית (אייסברג)',
    aliases: ['lettuce', 'iceberg', 'iceberg lettuce', 'crisphead', 'salad', 'salad greens', 'חסה', 'חסה אייסברג', 'חסה עגולה', 'חסה אמריקאית', 'אייסברג', 'סלט'],
    category: 'Produce',
    icon: '🥬',
    per100g: { calories: 14, protein: 0.9, carbs: 3.0, fat: 0.1, fiber: 1.2, sugar: 2.0 },
    portions: [
      { label: '1 cup shredded (~72g)', grams: 72, isDefault: true },
      { label: '1 large leaf (~15g)', grams: 15 },
      { label: '1 medium head (~539g)', grams: 539 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 141, vit_c: 2.8, vit_b12: 0, magnesium: 7, calcium: 18, iron: 0.41, zinc: 0.15, vit_d: 0, vit_a: 502, omega_3: 20 },
    cautions: { sodium: 10, cholesterol: 0, transFat: 0, saturatedFat: 0.02, addedSugar: 0 }
  },
  {
    id: 'wf_spinach',
    name: 'Baby Spinach, Fresh Raw',
    hebrewName: 'תרד טרי / עלי תרד',
    aliases: ['spinach', 'baby spinach', 'greens', 'salad greens', 'תרד', 'עלי תרד', 'תרד טרי'],
    category: 'Produce',
    icon: '🥬',
    per100g: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, sugar: 0.4 },
    portions: [
      { label: '1 cup fresh leaves (~30g)', grams: 30, isDefault: true },
      { label: 'Large salad bowl (3 cups, ~90g)', grams: 90 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 558, vit_c: 28.1, vit_b12: 0, magnesium: 79, calcium: 99, iron: 2.71, zinc: 0.53, vit_d: 0, vit_a: 9377, omega_3: 138 },
    cautions: { sodium: 79, cholesterol: 0, transFat: 0, saturatedFat: 0.1, addedSugar: 0 }
  },
  {
    id: 'wf_arugula',
    name: 'Arugula / Rocket, Fresh Raw',
    hebrewName: 'רוקט / אורוגולה',
    aliases: ['arugula', 'rocket', 'roquette', 'salad greens', 'greens', 'רוקט', 'אורוגולה', 'עלי רוקט', 'סלט'],
    category: 'Produce',
    icon: '🥗',
    per100g: { calories: 25, protein: 2.6, carbs: 3.7, fat: 0.7, fiber: 1.6, sugar: 2.1 },
    portions: [
      { label: '1 cup fresh leaves (~20g)', grams: 20, isDefault: true },
      { label: '2 cups salad bowl (~40g)', grams: 40 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 369, vit_c: 15.0, vit_b12: 0, magnesium: 47, calcium: 160, iron: 1.46, zinc: 0.47, vit_d: 0, vit_a: 2373, omega_3: 170 },
    cautions: { sodium: 27, cholesterol: 0, transFat: 0, saturatedFat: 0.09, addedSugar: 0 }
  },
  {
    id: 'wf_kale',
    name: 'Kale, Fresh Raw',
    hebrewName: 'קייל טרי',
    aliases: ['kale', 'raw kale', 'curly kale', 'greens', 'קייל', 'עלי קייל'],
    category: 'Produce',
    icon: '🥬',
    per100g: { calories: 35, protein: 2.9, carbs: 4.4, fat: 1.5, fiber: 4.1, sugar: 1.0 },
    portions: [
      { label: '1 cup chopped (~67g)', grams: 67, isDefault: true },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 348, vit_c: 93.4, vit_b12: 0, magnesium: 33, calcium: 254, iron: 1.6, zinc: 0.44, vit_d: 0, vit_a: 4812, omega_3: 180 },
    cautions: { sodium: 53, cholesterol: 0, transFat: 0, saturatedFat: 0.18, addedSugar: 0 }
  },
  {
    id: 'wf_cabbage_green',
    name: 'Green Cabbage, Fresh Raw',
    hebrewName: 'כרוב ירוק / לבן',
    aliases: ['cabbage', 'green cabbage', 'white cabbage', 'coleslaw', 'כרוב', 'כרוב ירוק', 'כרוב לבן'],
    category: 'Produce',
    icon: '🥬',
    per100g: { calories: 25, protein: 1.3, carbs: 5.8, fat: 0.1, fiber: 2.5, sugar: 3.2 },
    portions: [
      { label: '1 cup shredded (~89g)', grams: 89, isDefault: true },
      { label: '1 medium wedge (~150g)', grams: 150 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 170, vit_c: 36.6, vit_b12: 0, magnesium: 12, calcium: 40, iron: 0.47, zinc: 0.18, vit_d: 0, vit_a: 98, omega_3: 100 },
    cautions: { sodium: 18, cholesterol: 0, transFat: 0, saturatedFat: 0.03, addedSugar: 0 }
  },
  {
    id: 'wf_cabbage_red',
    name: 'Red Cabbage, Fresh Raw',
    hebrewName: 'כרוב סגול / אדום',
    aliases: ['red cabbage', 'purple cabbage', 'כרוב סגול', 'כרוב אדום'],
    category: 'Produce',
    icon: '🟣',
    per100g: { calories: 31, protein: 1.4, carbs: 7.4, fat: 0.2, fiber: 2.1, sugar: 3.8 },
    portions: [
      { label: '1 cup shredded (~89g)', grams: 89, isDefault: true },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 243, vit_c: 57.0, vit_b12: 0, magnesium: 16, calcium: 45, iron: 0.8, zinc: 0.22, vit_d: 0, vit_a: 1116, omega_3: 80 },
    cautions: { sodium: 27, cholesterol: 0, transFat: 0, saturatedFat: 0.03, addedSugar: 0 }
  },
  {
    id: 'wf_parsley',
    name: 'Fresh Parsley, Raw',
    hebrewName: 'פטרוזיליה טרייה',
    aliases: ['parsley', 'fresh parsley', 'herbs', 'פטרוזיליה', 'ירק', 'עשבי תיבול'],
    category: 'Produce',
    icon: '🌿',
    per100g: { calories: 36, protein: 3.0, carbs: 6.3, fat: 0.8, fiber: 3.3, sugar: 0.9 },
    portions: [
      { label: '1/2 cup chopped (~30g)', grams: 30, isDefault: true },
      { label: '1 tbsp chopped (~4g)', grams: 4 },
      { label: '1 fresh bunch (~60g)', grams: 60 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 554, vit_c: 133.0, vit_b12: 0, magnesium: 50, calcium: 138, iron: 6.2, zinc: 1.07, vit_d: 0, vit_a: 8424, omega_3: 8 },
    cautions: { sodium: 56, cholesterol: 0, transFat: 0, saturatedFat: 0.1, addedSugar: 0 }
  },
  {
    id: 'wf_cilantro',
    name: 'Fresh Cilantro / Coriander Leaves',
    hebrewName: 'כוסברה טרייה',
    aliases: ['cilantro', 'coriander', 'fresh coriander', 'כוסברה', 'עלי כוסברה'],
    category: 'Produce',
    icon: '🌿',
    per100g: { calories: 23, protein: 2.1, carbs: 3.7, fat: 0.5, fiber: 2.8, sugar: 0.9 },
    portions: [
      { label: '1 cup leaves (~16g)', grams: 16, isDefault: true },
      { label: '1/4 cup (~4g)', grams: 4 },
      { label: '1 bunch (~50g)', grams: 50 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 521, vit_c: 27.0, vit_b12: 0, magnesium: 26, calcium: 67, iron: 1.77, zinc: 0.5, vit_d: 0, vit_a: 6748, omega_3: 10 },
    cautions: { sodium: 46, cholesterol: 0, transFat: 0, saturatedFat: 0.01, addedSugar: 0 }
  },

  // =========================================================================
  // ===================== FRESH VEGETABLES & ROOTS ==========================
  // =========================================================================
  {
    id: 'wf_cucumber',
    name: 'Cucumber with Peel, Raw',
    hebrewName: 'מלפפון עם קליפה',
    aliases: ['cucumber', 'cucumbers', 'salad', 'מלפפון', 'מלפפונים', 'סלט'],
    category: 'Produce',
    icon: '🥒',
    per100g: { calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, sugar: 1.7 },
    portions: [
      { label: '1 medium cucumber (~120g)', grams: 120, isDefault: true },
      { label: '1 large cucumber (~180g)', grams: 180 },
      { label: '1 cup, sliced (~104g)', grams: 104 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 147, vit_c: 2.8, vit_b12: 0, magnesium: 13, calcium: 16, iron: 0.28, zinc: 0.2, vit_d: 0, vit_a: 105, omega_3: 5 },
    cautions: { sodium: 2, cholesterol: 0, transFat: 0, saturatedFat: 0, addedSugar: 0 }
  },
  {
    id: 'wf_tomato',
    name: 'Tomato, Fresh Red Raw',
    hebrewName: 'עגבניה אדומה',
    aliases: ['tomato', 'tomatoes', 'cherry tomato', 'salad', 'עגבניה', 'עגבניות', 'עגבניות שרי', 'סלט'],
    category: 'Produce',
    icon: '🍅',
    per100g: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sugar: 2.6 },
    portions: [
      { label: '1 medium tomato (~123g)', grams: 123, isDefault: true },
      { label: '1 small tomato (~91g)', grams: 91 },
      { label: '1 cup cherry tomatoes (~149g)', grams: 149 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 237, vit_c: 13.7, vit_b12: 0, magnesium: 11, calcium: 10, iron: 0.27, zinc: 0.17, vit_d: 0, vit_a: 833, omega_3: 3 },
    cautions: { sodium: 5, cholesterol: 0, transFat: 0, saturatedFat: 0, addedSugar: 0 }
  },
  {
    id: 'wf_bell_pepper',
    name: 'Red Bell Pepper, Raw',
    hebrewName: 'פלפל אדום / גמבה',
    aliases: ['bell pepper', 'pepper', 'red pepper', 'capsicum', 'פלפל', 'גמבה', 'פלפל אדום'],
    category: 'Produce',
    icon: '🫑',
    per100g: { calories: 31, protein: 1.0, carbs: 6.0, fat: 0.3, fiber: 2.1, sugar: 4.2 },
    portions: [
      { label: '1 medium pepper (~119g)', grams: 119, isDefault: true },
      { label: '1 cup, chopped (~149g)', grams: 149 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 211, vit_c: 127.7, vit_b12: 0, magnesium: 12, calcium: 7, iron: 0.43, zinc: 0.25, vit_d: 0, vit_a: 3131, omega_3: 20 },
    cautions: { sodium: 4, cholesterol: 0, transFat: 0, saturatedFat: 0, addedSugar: 0 }
  },
  {
    id: 'wf_broccoli',
    name: 'Broccoli, Fresh Raw',
    hebrewName: 'ברוקולי טרי',
    aliases: ['broccoli', 'florets', 'ברוקולי', 'פרחי ברוקולי'],
    category: 'Produce',
    icon: '🥦',
    per100g: { calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4, fiber: 2.6, sugar: 1.7 },
    portions: [
      { label: '1 cup chopped florets (~91g)', grams: 91, isDefault: true },
      { label: '1 stalk (~150g)', grams: 150 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 316, vit_c: 89.2, vit_b12: 0, magnesium: 21, calcium: 47, iron: 0.73, zinc: 0.41, vit_d: 0, vit_a: 623, omega_3: 21 },
    cautions: { sodium: 33, cholesterol: 0, transFat: 0, saturatedFat: 0.1, addedSugar: 0 }
  },
  {
    id: 'wf_cauliflower',
    name: 'Cauliflower, Fresh Raw',
    hebrewName: 'כרובית טרייה',
    aliases: ['cauliflower', 'florets', 'כרובית', 'כרוביות', 'פרחי כרובית'],
    category: 'Produce',
    icon: '🥦',
    per100g: { calories: 25, protein: 1.9, carbs: 5.0, fat: 0.3, fiber: 2.0, sugar: 1.9 },
    portions: [
      { label: '1 cup florets (~107g)', grams: 107, isDefault: true },
      { label: '1/2 small head (~250g)', grams: 250 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 299, vit_c: 48.2, vit_b12: 0, magnesium: 15, calcium: 22, iron: 0.42, zinc: 0.27, vit_d: 0, vit_a: 0, omega_3: 37 },
    cautions: { sodium: 30, cholesterol: 0, transFat: 0, saturatedFat: 0.05, addedSugar: 0 }
  },
  {
    id: 'wf_zucchini',
    name: 'Zucchini / Courgette with Skin, Raw',
    hebrewName: 'קישוא / זוקיני',
    aliases: ['zucchini', 'courgette', 'summer squash', 'קישוא', 'קישואים', 'זוקיני'],
    category: 'Produce',
    icon: '🥒',
    per100g: { calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, fiber: 1.0, sugar: 2.5 },
    portions: [
      { label: '1 medium zucchini (~196g)', grams: 196, isDefault: true },
      { label: '1 cup chopped (~124g)', grams: 124 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 261, vit_c: 17.9, vit_b12: 0, magnesium: 18, calcium: 16, iron: 0.37, zinc: 0.32, vit_d: 0, vit_a: 200, omega_3: 40 },
    cautions: { sodium: 8, cholesterol: 0, transFat: 0, saturatedFat: 0.07, addedSugar: 0 }
  },
  {
    id: 'wf_carrot',
    name: 'Carrot, Fresh Raw',
    hebrewName: 'גזר טרי',
    aliases: ['carrot', 'carrots', 'גזר', 'גזרים'],
    category: 'Produce',
    icon: '🥕',
    per100g: { calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, fiber: 2.8, sugar: 4.7 },
    portions: [
      { label: '1 medium carrot (~61g)', grams: 61, isDefault: true },
      { label: '1 large carrot (~72g)', grams: 72 },
      { label: '1 cup chopped (~128g)', grams: 128 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 320, vit_c: 5.9, vit_b12: 0, magnesium: 12, calcium: 33, iron: 0.3, zinc: 0.24, vit_d: 0, vit_a: 16706, omega_3: 2 },
    cautions: { sodium: 69, cholesterol: 0, transFat: 0, saturatedFat: 0, addedSugar: 0 }
  },
  {
    id: 'wf_onion',
    name: 'Yellow Onion, Raw',
    hebrewName: 'בצל צהוב',
    aliases: ['onion', 'onions', 'בצל', 'בצלים', 'בצל יבש'],
    category: 'Produce',
    icon: '🧅',
    per100g: { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7, sugar: 4.2 },
    portions: [
      { label: '1 medium onion (~110g)', grams: 110, isDefault: true },
      { label: '1 cup chopped (~160g)', grams: 160 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 146, vit_c: 7.4, vit_b12: 0, magnesium: 10, calcium: 23, iron: 0.21, zinc: 0.17, vit_d: 0, vit_a: 2, omega_3: 0 },
    cautions: { sodium: 4, cholesterol: 0, transFat: 0, saturatedFat: 0, addedSugar: 0 }
  },
  {
    id: 'wf_mushrooms',
    name: 'White Button Mushrooms, Raw',
    hebrewName: 'פטריות שמפיניון טריות',
    aliases: ['mushrooms', 'mushroom', 'white mushrooms', 'champignon', 'portobello', 'פטריות', 'פטריה', 'פטריית שמפיניון'],
    category: 'Produce',
    icon: '🍄',
    per100g: { calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1.0, sugar: 2.0 },
    portions: [
      { label: '1 cup whole (~96g)', grams: 96, isDefault: true },
      { label: '1 medium mushroom (~18g)', grams: 18 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 318, vit_c: 2.1, vit_b12: 0.04, magnesium: 9, calcium: 3, iron: 0.5, zinc: 0.52, vit_d: 7, vit_a: 0, omega_3: 0 },
    cautions: { sodium: 5, cholesterol: 0, transFat: 0, saturatedFat: 0.05, addedSugar: 0 }
  },
  {
    id: 'wf_garlic',
    name: 'Garlic, Raw Cloves',
    hebrewName: 'שום טרי',
    aliases: ['garlic', 'garlic cloves', 'שום', 'שן שום', 'שיני שום'],
    category: 'Produce',
    icon: '🧄',
    per100g: { calories: 149, protein: 6.4, carbs: 33.1, fat: 0.5, fiber: 2.1, sugar: 1.0 },
    portions: [
      { label: '1 clove (~3g)', grams: 3, isDefault: true },
      { label: '3 cloves (~9g)', grams: 9 },
      { label: '1 tbsp minced (~9g)', grams: 9 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 401, vit_c: 31.2, vit_b12: 0, magnesium: 25, calcium: 181, iron: 1.7, zinc: 1.16, vit_d: 0, vit_a: 9, omega_3: 15 },
    cautions: { sodium: 17, cholesterol: 0, transFat: 0, saturatedFat: 0.09, addedSugar: 0 }
  },
  {
    id: 'wf_celery',
    name: 'Celery Stalks, Fresh Raw',
    hebrewName: 'סלרי / כרפס',
    aliases: ['celery', 'celery stalk', 'סלרי', 'כרפס', 'גבעול סלרי'],
    category: 'Produce',
    icon: '🥬',
    per100g: { calories: 14, protein: 0.7, carbs: 3.0, fat: 0.2, fiber: 1.6, sugar: 1.3 },
    portions: [
      { label: '1 medium stalk (~40g)', grams: 40, isDefault: true },
      { label: '1 cup chopped (~101g)', grams: 101 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 260, vit_c: 3.1, vit_b12: 0, magnesium: 11, calcium: 40, iron: 0.2, zinc: 0.13, vit_d: 0, vit_a: 449, omega_3: 80 },
    cautions: { sodium: 80, cholesterol: 0, transFat: 0, saturatedFat: 0.04, addedSugar: 0 }
  },
  {
    id: 'wf_green_beans',
    name: 'Green String Beans, Boiled / Steamed',
    hebrewName: 'שעועית ירוקה מבושלת',
    aliases: ['green beans', 'string beans', 'snap beans', 'שעועית ירוקה', 'תרמילי שעועית'],
    category: 'Produce',
    icon: '🫛',
    per100g: { calories: 35, protein: 1.9, carbs: 7.9, fat: 0.3, fiber: 3.2, sugar: 1.6 },
    portions: [
      { label: '1 cup (~125g)', grams: 125, isDefault: true },
      { label: '1/2 cup (~63g)', grams: 63 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 209, vit_c: 9.7, vit_b12: 0, magnesium: 18, calcium: 44, iron: 0.65, zinc: 0.24, vit_d: 0, vit_a: 690, omega_3: 71 },
    cautions: { sodium: 6, cholesterol: 0, transFat: 0, saturatedFat: 0.06, addedSugar: 0 }
  },
  {
    id: 'wf_asparagus',
    name: 'Asparagus, Boiled / Steamed',
    hebrewName: 'אספרגוס מבושל / מאודה',
    aliases: ['asparagus', 'אספרגוס'],
    category: 'Produce',
    icon: '🥬',
    per100g: { calories: 22, protein: 2.4, carbs: 4.1, fat: 0.2, fiber: 2.0, sugar: 1.3 },
    portions: [
      { label: '4 medium spears (~60g)', grams: 60, isDefault: true },
      { label: '1 cup pieces (~180g)', grams: 180 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 224, vit_c: 7.7, vit_b12: 0, magnesium: 14, calcium: 23, iron: 0.91, zinc: 0.6, vit_d: 0, vit_a: 1005, omega_3: 12 },
    cautions: { sodium: 14, cholesterol: 0, transFat: 0, saturatedFat: 0.04, addedSugar: 0 }
  },
  {
    id: 'wf_eggplant',
    name: 'Eggplant / Aubergine, Baked / Cooked',
    hebrewName: 'חציל אפוי / מבושל',
    aliases: ['eggplant', 'aubergine', 'חציל', 'חציל אפוי', 'חצילים'],
    category: 'Produce',
    icon: '🍆',
    per100g: { calories: 35, protein: 0.8, carbs: 8.7, fat: 0.2, fiber: 2.5, sugar: 3.2 },
    portions: [
      { label: '1 cup cubed (~99g)', grams: 99, isDefault: true },
      { label: '1/2 medium eggplant (~200g)', grams: 200 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 119, vit_c: 1.3, vit_b12: 0, magnesium: 11, calcium: 6, iron: 0.25, zinc: 0.12, vit_d: 0, vit_a: 23, omega_3: 17 },
    cautions: { sodium: 2, cholesterol: 0, transFat: 0, saturatedFat: 0.05, addedSugar: 0 }
  },
  {
    id: 'wf_beetroot',
    name: 'Beetroot / Beets, Boiled',
    hebrewName: 'סלק אדום מבושל',
    aliases: ['beet', 'beets', 'beetroot', 'סלק', 'סלק אדום', 'סלק מבושל'],
    category: 'Produce',
    icon: '🟣',
    per100g: { calories: 44, protein: 1.7, carbs: 10.0, fat: 0.2, fiber: 2.0, sugar: 8.0 },
    portions: [
      { label: '1 medium beet (~82g)', grams: 82, isDefault: true },
      { label: '1/2 cup sliced (~85g)', grams: 85 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 305, vit_c: 3.6, vit_b12: 0, magnesium: 23, calcium: 16, iron: 0.79, zinc: 0.35, vit_d: 0, vit_a: 35, omega_3: 5 },
    cautions: { sodium: 77, cholesterol: 0, transFat: 0, saturatedFat: 0.03, addedSugar: 0 }
  },

  // =========================================================================
  // ===================== FRESH FRUITS =====================================
  // =========================================================================
  {
    id: 'wf_banana',
    name: 'Banana, Raw',
    hebrewName: 'בננה',
    aliases: ['banana', 'bananas', 'fruit', 'בננה', 'בננות', 'פרי'],
    category: 'Produce',
    icon: '🍌',
    per100g: { calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6, sugar: 12.2 },
    portions: [
      { label: '1 medium (7" to 7-7/8" long, ~118g)', grams: 118, isDefault: true },
      { label: '1 small (6" to 6-7/8" long, ~101g)', grams: 101 },
      { label: '1 large (8" to 8-7/8" long, ~136g)', grams: 136 },
      { label: '1 cup sliced (~150g)', grams: 150 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 358, vit_c: 8.7, vit_b12: 0, magnesium: 27, calcium: 5, iron: 0.3, zinc: 0.15, vit_d: 0, vit_a: 64, omega_3: 27 },
    cautions: { sodium: 1, cholesterol: 0, transFat: 0, saturatedFat: 0.1, addedSugar: 0 }
  },
  {
    id: 'wf_apple',
    name: 'Apple with Skin, Raw',
    hebrewName: 'תפוח עץ עם קליפה',
    aliases: ['apple', 'apples', 'fruit', 'תפוח', 'תפוחים', 'תפוח עץ'],
    category: 'Produce',
    icon: '🍎',
    per100g: { calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2, fiber: 2.4, sugar: 10.4 },
    portions: [
      { label: '1 medium (3" dia, ~182g)', grams: 182, isDefault: true },
      { label: '1 small (2-3/4" dia, ~149g)', grams: 149 },
      { label: '1 large (3-1/4" dia, ~223g)', grams: 223 },
      { label: '1 cup chopped (~125g)', grams: 125 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 107, vit_c: 4.6, vit_b12: 0, magnesium: 5, calcium: 6, iron: 0.12, zinc: 0.04, vit_d: 0, vit_a: 54, omega_3: 9 },
    cautions: { sodium: 1, cholesterol: 0, transFat: 0, saturatedFat: 0, addedSugar: 0 }
  },
  {
    id: 'wf_orange',
    name: 'Orange, Fresh Raw',
    hebrewName: 'תפוז',
    aliases: ['orange', 'oranges', 'citrus', 'תפוז', 'תפוזים'],
    category: 'Produce',
    icon: '🍊',
    per100g: { calories: 47, protein: 0.9, carbs: 11.8, fat: 0.1, fiber: 2.4, sugar: 9.4 },
    portions: [
      { label: '1 medium (2-5/8" dia, ~131g)', grams: 131, isDefault: true },
      { label: '1 large (3-1/16" dia, ~184g)', grams: 184 },
      { label: '1 cup sections (~180g)', grams: 180 },
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
    category: 'Produce',
    icon: '🫐',
    per100g: { calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3, fiber: 2.4, sugar: 9.9 },
    portions: [
      { label: '1 cup (~148g)', grams: 148, isDefault: true },
      { label: '1/2 cup (~74g)', grams: 74 },
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
    aliases: ['strawberries', 'strawberry', 'berries', 'תות', 'תותים', 'תות שדה'],
    category: 'Produce',
    icon: '🍓',
    per100g: { calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2.0, sugar: 4.9 },
    portions: [
      { label: '1 cup whole (approx 8 berries, ~144g)', grams: 144, isDefault: true },
      { label: '1 large strawberry (~18g)', grams: 18 },
      { label: '1 medium strawberry (~12g)', grams: 12 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 153, vit_c: 58.8, vit_b12: 0, magnesium: 13, calcium: 16, iron: 0.41, zinc: 0.14, vit_d: 0, vit_a: 12, omega_3: 65 },
    cautions: { sodium: 1, cholesterol: 0, transFat: 0, saturatedFat: 0, addedSugar: 0 }
  },
  {
    id: 'wf_watermelon',
    name: 'Watermelon, Fresh Raw',
    hebrewName: 'אבטיח',
    aliases: ['watermelon', 'melon', 'אבטיח'],
    category: 'Produce',
    icon: '🍉',
    per100g: { calories: 30, protein: 0.6, carbs: 7.6, fat: 0.2, fiber: 0.4, sugar: 6.2 },
    portions: [
      { label: '1 wedge (~1/16 of melon, 286g)', grams: 286, isDefault: true },
      { label: '1 cup diced (~152g)', grams: 152 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 112, vit_c: 8.1, vit_b12: 0, magnesium: 10, calcium: 7, iron: 0.24, zinc: 0.1, vit_d: 0, vit_a: 569, omega_3: 0 },
    cautions: { sodium: 1, cholesterol: 0, transFat: 0, saturatedFat: 0, addedSugar: 0 }
  },
  {
    id: 'wf_grapes',
    name: 'Grapes (Red / Green), Fresh Raw',
    hebrewName: 'ענבים טריים (אדומים / ירוקים)',
    aliases: ['grapes', 'grape', 'red grapes', 'green grapes', 'fruit', 'ענבים', 'ענב', 'ענבים אדומים', 'ענבים ירוקים'],
    category: 'Produce',
    icon: '🍇',
    per100g: { calories: 69, protein: 0.7, carbs: 18.1, fat: 0.2, fiber: 0.9, sugar: 15.5 },
    portions: [
      { label: '1 cup (approx 32 grapes, ~151g)', grams: 151, isDefault: true },
      { label: 'Small bunch (~100g)', grams: 100 },
      { label: '10 grapes (~50g)', grams: 50 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 191, vit_c: 3.2, vit_b12: 0, magnesium: 7, calcium: 10, iron: 0.36, zinc: 0.07, vit_d: 0, vit_a: 66, omega_3: 11 },
    cautions: { sodium: 2, cholesterol: 0, transFat: 0, saturatedFat: 0.05, addedSugar: 0 }
  },
  {
    id: 'wf_lemon',
    name: 'Lemon Juice, Freshly Squeezed',
    hebrewName: 'מיץ לימון סחוט טרי',
    aliases: ['lemon', 'lemon juice', 'lime', 'citrus', 'לימון', 'מיץ לימון'],
    category: 'Produce',
    icon: '🍋',
    per100g: { calories: 22, protein: 0.4, carbs: 6.9, fat: 0.2, fiber: 0.3, sugar: 2.5 },
    portions: [
      { label: 'Juice of 1 lemon (~47g)', grams: 47, isDefault: true },
      { label: '1 tablespoon (~15g)', grams: 15 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 103, vit_c: 38.7, vit_b12: 0, magnesium: 6, calcium: 6, iron: 0.08, zinc: 0.05, vit_d: 0, vit_a: 6, omega_3: 6 },
    cautions: { sodium: 1, cholesterol: 0, transFat: 0, saturatedFat: 0.02, addedSugar: 0 }
  },
  {
    id: 'wf_mango',
    name: 'Mango, Fresh Raw',
    hebrewName: 'מנגו טרי',
    aliases: ['mango', 'mangos', 'fruit', 'מנגו'],
    category: 'Produce',
    icon: '🥭',
    per100g: { calories: 60, protein: 0.8, carbs: 15.0, fat: 0.4, fiber: 1.6, sugar: 13.7 },
    portions: [
      { label: '1 cup pieces (~165g)', grams: 165, isDefault: true },
      { label: '1 whole mango (without skin/pit, ~200g)', grams: 200 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 168, vit_c: 36.4, vit_b12: 0, magnesium: 10, calcium: 11, iron: 0.16, zinc: 0.09, vit_d: 0, vit_a: 1082, omega_3: 37 },
    cautions: { sodium: 1, cholesterol: 0, transFat: 0, saturatedFat: 0.09, addedSugar: 0 }
  },
  {
    id: 'wf_pineapple',
    name: 'Pineapple, Fresh Raw',
    hebrewName: 'אננס טרי',
    aliases: ['pineapple', 'ananas', 'fruit', 'אננס'],
    category: 'Produce',
    icon: '🍍',
    per100g: { calories: 50, protein: 0.5, carbs: 13.1, fat: 0.1, fiber: 1.4, sugar: 9.9 },
    portions: [
      { label: '1 cup chunks (~165g)', grams: 165, isDefault: true },
      { label: '1 round slice (~84g)', grams: 84 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 109, vit_c: 47.8, vit_b12: 0, magnesium: 12, calcium: 13, iron: 0.29, zinc: 0.12, vit_d: 0, vit_a: 58, omega_3: 17 },
    cautions: { sodium: 1, cholesterol: 0, transFat: 0, saturatedFat: 0.01, addedSugar: 0 }
  },
  {
    id: 'wf_peach',
    name: 'Peach / Nectarine, Fresh Raw',
    hebrewName: 'אפרסק / נקטרינה',
    aliases: ['peach', 'nectarine', 'peaches', 'fruit', 'אפרסק', 'נקטרינה', 'אפרסקים'],
    category: 'Produce',
    icon: '🍑',
    per100g: { calories: 39, protein: 0.9, carbs: 9.5, fat: 0.3, fiber: 1.5, sugar: 8.4 },
    portions: [
      { label: '1 medium peach (~150g)', grams: 150, isDefault: true },
      { label: '1 cup sliced (~154g)', grams: 154 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 190, vit_c: 6.6, vit_b12: 0, magnesium: 9, calcium: 6, iron: 0.25, zinc: 0.17, vit_d: 0, vit_a: 326, omega_3: 10 },
    cautions: { sodium: 0, cholesterol: 0, transFat: 0, saturatedFat: 0.02, addedSugar: 0 }
  },
  {
    id: 'wf_kiwi',
    name: 'Kiwi Fruit, Fresh Raw',
    hebrewName: 'קיווי',
    aliases: ['kiwi', 'kiwifruit', 'קיווי'],
    category: 'Produce',
    icon: '🥝',
    per100g: { calories: 61, protein: 1.1, carbs: 14.7, fat: 0.5, fiber: 3.0, sugar: 9.0 },
    portions: [
      { label: '1 medium kiwi (~69g)', grams: 69, isDefault: true },
      { label: '2 kiwis (~138g)', grams: 138 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 312, vit_c: 92.7, vit_b12: 0, magnesium: 17, calcium: 34, iron: 0.31, zinc: 0.14, vit_d: 0, vit_a: 87, omega_3: 42 },
    cautions: { sodium: 3, cholesterol: 0, transFat: 0, saturatedFat: 0.03, addedSugar: 0 }
  },
  {
    id: 'wf_dates_medjool',
    name: 'Medjool Dates, Dried',
    hebrewName: 'תמר מג׳הול',
    aliases: ['date', 'dates', 'medjool', 'medjool dates', 'תמר', 'תמרים', 'תמר מג\'הול', 'מג\'הול'],
    category: 'Produce',
    icon: '🌴',
    per100g: { calories: 277, protein: 1.8, carbs: 75.0, fat: 0.2, fiber: 6.7, sugar: 66.5 },
    portions: [
      { label: '1 date pitted (~24g)', grams: 24, isDefault: true },
      { label: '2 dates (~48g)', grams: 48 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 696, vit_c: 0, vit_b12: 0, magnesium: 54, calcium: 64, iron: 0.9, zinc: 0.44, vit_d: 0, vit_a: 149, omega_3: 0 },
    cautions: { sodium: 1, cholesterol: 0, transFat: 0, saturatedFat: 0, addedSugar: 0 }
  },

  // =========================================================================
  // ===================== PROTEIN: POULTRY, MEAT & FISH =====================
  // =========================================================================
  {
    id: 'wf_chicken_breast',
    name: 'Chicken Breast, Cooked / Grilled (Skinless)',
    hebrewName: 'חזה עוף מבושל / צלוי ללא עור',
    aliases: ['chicken breast', 'chicken', 'grilled chicken', 'חזה עוף', 'עוף', 'שניצל עוף ללא ציפוי'],
    category: 'Protein',
    icon: '🍗',
    per100g: { calories: 165, protein: 31.0, carbs: 0, fat: 3.6, fiber: 0, sugar: 0 },
    portions: [
      { label: '1 breast fillet (medium, ~150g)', grams: 150, isDefault: true },
      { label: '1 large breast fillet (~200g)', grams: 200 },
      { label: '1 small breast fillet (~120g)', grams: 120 },
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
    id: 'wf_turkey_breast',
    name: 'Turkey Breast, Cooked (Skinless)',
    hebrewName: 'חזה הודו מבושל / צלוי ללא עור',
    aliases: ['turkey', 'turkey breast', 'roast turkey', 'הודו', 'חזה הודו', 'פסטרמה ביתית'],
    category: 'Protein',
    icon: '🦃',
    per100g: { calories: 135, protein: 30.1, carbs: 0, fat: 0.7, fiber: 0, sugar: 0 },
    portions: [
      { label: '1 fillet / portion (~150g)', grams: 150, isDefault: true },
      { label: 'Large portion (~200g)', grams: 200 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 293, vit_c: 0, vit_b12: 1.0, magnesium: 28, calcium: 14, iron: 1.4, zinc: 1.5, vit_d: 5, vit_a: 0, omega_3: 50 },
    cautions: { sodium: 55, cholesterol: 68, transFat: 0, saturatedFat: 0.2, addedSugar: 0 }
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
    id: 'wf_egg_whole',
    name: 'Whole Egg, Boiled or Poached',
    hebrewName: 'ביצה שלמה קשה / שלוקה',
    aliases: ['egg', 'eggs', 'hard boiled egg', 'ביצה', 'ביצים', 'ביצה קשה'],
    category: 'Protein',
    icon: '🥚',
    per100g: { calories: 155, protein: 12.6, carbs: 1.1, fat: 10.6, fiber: 0, sugar: 1.1 },
    portions: [
      { label: '1 large egg (~50g)', grams: 50, isDefault: true },
      { label: '2 large eggs (~100g)', grams: 100 },
      { label: '3 large eggs (~150g)', grams: 150 },
      { label: '1 extra large egg (~56g)', grams: 56 },
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
      { label: 'White of 1 large egg (~33g)', grams: 33, isDefault: true },
      { label: 'Whites of 3 large eggs (~100g)', grams: 100 },
      { label: '1 cup liquid egg whites (~243g)', grams: 243 },
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
    id: 'wf_white_fish',
    name: 'White Fish Fillet (Tilapia / Cod), Baked',
    hebrewName: 'פילה דג לבן (אמנון / בקלה) אפוי',
    aliases: ['white fish', 'tilapia', 'cod', 'fish fillet', 'דג לבן', 'אמנון', 'בקלה', 'פילה דג', 'דניס', 'מוסר'],
    category: 'Protein',
    icon: '🐟',
    per100g: { calories: 105, protein: 22.0, carbs: 0, fat: 1.7, fiber: 0, sugar: 0 },
    portions: [
      { label: '1 medium fillet (~130g)', grams: 130, isDefault: true },
      { label: '1 large fillet (~180g)', grams: 180 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 380, vit_c: 0, vit_b12: 1.9, magnesium: 34, calcium: 14, iron: 0.6, zinc: 0.5, vit_d: 124, vit_a: 15, omega_3: 240 },
    cautions: { sodium: 56, cholesterol: 57, transFat: 0, saturatedFat: 0.6, addedSugar: 0 }
  },
  {
    id: 'wf_sardines',
    name: 'Canned Sardines in Olive Oil (Drained)',
    hebrewName: 'סרדינים בשמן זית (מסוננים)',
    aliases: ['sardines', 'sardine', 'canned sardines', 'סרדינים', 'סרדין'],
    category: 'Protein',
    icon: '🐟',
    per100g: { calories: 208, protein: 24.6, carbs: 0, fat: 11.5, fiber: 0, sugar: 0 },
    portions: [
      { label: '1 standard can drained (~85g)', grams: 85, isDefault: true },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 397, vit_c: 0, vit_b12: 8.9, magnesium: 39, calcium: 382, iron: 2.9, zinc: 1.3, vit_d: 193, vit_a: 108, omega_3: 1480 },
    cautions: { sodium: 505, cholesterol: 142, transFat: 0, saturatedFat: 1.5, addedSugar: 0 }
  },
  {
    id: 'wf_shrimp',
    name: 'Shrimp / Prawns, Cooked',
    hebrewName: 'שרימפס / חסילונים מבושל',
    aliases: ['shrimp', 'prawns', 'seafood', 'שרימפס', 'חסילונים'],
    category: 'Protein',
    icon: '🦐',
    per100g: { calories: 99, protein: 24.0, carbs: 0.2, fat: 0.3, fiber: 0, sugar: 0 },
    portions: [
      { label: '1 cup (~145g)', grams: 145, isDefault: true },
      { label: '6 large shrimp (~42g)', grams: 42 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 259, vit_c: 0, vit_b12: 1.2, magnesium: 33, calcium: 70, iron: 0.5, zinc: 1.6, vit_d: 15, vit_a: 0, omega_3: 540 },
    cautions: { sodium: 111, cholesterol: 189, transFat: 0, saturatedFat: 0.1, addedSugar: 0 }
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
      { label: '1 portion (1/3 block, ~100g)', grams: 100, isDefault: true },
      { label: '1/2 block (~150g)', grams: 150 },
      { label: 'Full block (~300g)', grams: 300 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 237, vit_c: 0, vit_b12: 0, magnesium: 58, calcium: 683, iron: 2.7, zinc: 1.6, vit_d: 0, vit_a: 35, omega_3: 580 },
    cautions: { sodium: 14, cholesterol: 0, transFat: 0, saturatedFat: 1.3, addedSugar: 0 }
  },
  {
    id: 'wf_edamame',
    name: 'Edamame (Green Soybeans), Steamed in Pods',
    hebrewName: 'אדממה (פולי סויה) מאודה',
    aliases: ['edamame', 'soybeans', 'soya', 'soy beans', 'אדממה', 'פולי סויה', 'סויה'],
    category: 'Protein',
    icon: '🫛',
    per100g: { calories: 121, protein: 11.9, carbs: 8.9, fat: 5.2, fiber: 5.2, sugar: 2.2 },
    portions: [
      { label: '1 cup shelled beans (~155g)', grams: 155, isDefault: true },
      { label: '1/2 cup (~78g)', grams: 78 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 436, vit_c: 6.1, vit_b12: 0, magnesium: 64, calcium: 63, iron: 2.27, zinc: 1.37, vit_d: 0, vit_a: 175, omega_3: 360 },
    cautions: { sodium: 6, cholesterol: 0, transFat: 0, saturatedFat: 0.6, addedSugar: 0 }
  },
  {
    id: 'wf_seitan',
    name: 'Seitan (Vital Wheat Gluten, Cooked)',
    hebrewName: 'סייטן (חלבון חיטה)',
    aliases: ['seitan', 'wheat gluten', 'gluten', 'plant protein', 'סייטן', 'חלבון חיטה'],
    category: 'Protein',
    icon: '🌾',
    per100g: { calories: 148, protein: 24.8, carbs: 5.3, fat: 1.9, fiber: 1.5, sugar: 0 },
    portions: [
      { label: '1 cutlet / slice (~100g)', grams: 100, isDefault: true },
      { label: 'Medium portion (~150g)', grams: 150 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 100, vit_c: 0, vit_b12: 0, magnesium: 25, calcium: 142, iron: 5.2, zinc: 0.8, vit_d: 0, vit_a: 0, omega_3: 0 },
    cautions: { sodium: 29, cholesterol: 0, transFat: 0, saturatedFat: 0.3, addedSugar: 0 }
  },
  {
    id: 'wf_whey_protein',
    name: 'Whey Protein Powder (80% Concentrate)',
    hebrewName: 'אבקת חלבון מי גבינה',
    aliases: ['whey', 'whey protein', 'protein powder', 'scoop', 'shake', 'אבקת חלבון', 'חלבון מי גבינה', 'שייק חלבון'],
    category: 'Protein',
    icon: '🥤',
    per100g: { calories: 390, protein: 78.0, carbs: 6.0, fat: 6.0, fiber: 0, sugar: 4.0 },
    portions: [
      { label: '1 standard scoop (~30g)', grams: 30, isDefault: true },
      { label: '1.5 scoops (~45g)', grams: 45 },
      { label: '2 scoops (~60g)', grams: 60 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 500, vit_c: 0, vit_b12: 1.5, magnesium: 60, calcium: 450, iron: 0.5, zinc: 1.2, vit_d: 10, vit_a: 50, omega_3: 100 },
    cautions: { sodium: 180, cholesterol: 60, transFat: 0, saturatedFat: 3.0, addedSugar: 0 }
  },

  // =========================================================================
  // ===================== GRAINS, STARCHES & LEGUMES ========================
  // =========================================================================
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
    id: 'wf_quinoa_cooked',
    name: 'Quinoa, Cooked',
    hebrewName: 'קינואה מבושלת',
    aliases: ['quinoa', 'cooked quinoa', 'קינואה', 'קינואה מבושלת'],
    category: 'Carbs',
    icon: '🌾',
    per100g: { calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9, fiber: 2.8, sugar: 0.9 },
    portions: [
      { label: '1 cup cooked (~185g)', grams: 185, isDefault: true },
      { label: '1/2 cup cooked (~93g)', grams: 93 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 172, vit_c: 0, vit_b12: 0, magnesium: 64, calcium: 17, iron: 1.49, zinc: 1.09, vit_d: 0, vit_a: 5, omega_3: 96 },
    cautions: { sodium: 7, cholesterol: 0, transFat: 0, saturatedFat: 0.23, addedSugar: 0 }
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
      { label: '1 medium potato (~173g)', grams: 173, isDefault: true },
      { label: '1 small potato (~138g)', grams: 138 },
      { label: '1 large potato (~299g)', grams: 299 },
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
      { label: '1 medium sweet potato (~114g)', grams: 114, isDefault: true },
      { label: '1 large sweet potato (~180g)', grams: 180 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 475, vit_c: 19.6, vit_b12: 0, magnesium: 27, calcium: 38, iron: 0.69, zinc: 0.32, vit_d: 0, vit_a: 19218, omega_3: 6 },
    cautions: { sodium: 36, cholesterol: 0, transFat: 0, saturatedFat: 0, addedSugar: 0 }
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
  {
    id: 'wf_whole_wheat_bread',
    name: 'Whole Wheat Bread',
    hebrewName: 'לחם חיטה מלאה',
    aliases: ['bread', 'whole wheat bread', 'toast', 'לחם', 'לחם מלא', 'פרוסת לחם', 'טוסט'],
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
    id: 'wf_pita_whole_wheat',
    name: 'Whole Wheat Pita Pocket',
    hebrewName: 'פיתה מקמח מלא',
    aliases: ['pita', 'whole wheat pita', 'pocket bread', 'פיתה', 'פיתה מלאה', 'פיתה קלה'],
    category: 'Carbs',
    icon: '🫓',
    per100g: { calories: 247, protein: 9.8, carbs: 50.0, fat: 1.7, fiber: 7.0, sugar: 2.0 },
    portions: [
      { label: '1 standard pita (~60g)', grams: 60, isDefault: true },
      { label: '1 large pita (~80g)', grams: 80 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 230, vit_c: 0, vit_b12: 0, magnesium: 60, calcium: 65, iron: 2.1, zinc: 1.4, vit_d: 0, vit_a: 0, omega_3: 40 },
    cautions: { sodium: 420, cholesterol: 0, transFat: 0, saturatedFat: 0.3, addedSugar: 0 }
  },
  {
    id: 'wf_tortilla_corn',
    name: 'Corn Tortilla',
    hebrewName: 'טורטייה תירס',
    aliases: ['tortilla', 'corn tortilla', 'wrap', 'taco', 'טורטייה', 'טורטיה', 'ראפ'],
    category: 'Carbs',
    icon: '🌮',
    per100g: { calories: 218, protein: 5.7, carbs: 44.6, fat: 2.8, fiber: 6.3, sugar: 0.8 },
    portions: [
      { label: '1 medium tortilla (~28g)', grams: 28, isDefault: true },
      { label: '2 tortillas (~56g)', grams: 56 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 206, vit_c: 0, vit_b12: 0, magnesium: 53, calcium: 84, iron: 1.3, zinc: 1.0, vit_d: 0, vit_a: 0, omega_3: 20 },
    cautions: { sodium: 45, cholesterol: 0, transFat: 0, saturatedFat: 0.4, addedSugar: 0 }
  },
  {
    id: 'wf_sweet_corn',
    name: 'Sweet Corn, Yellow Boiled / Steamed',
    hebrewName: 'גרגרי תירס מתוק מבושל',
    aliases: ['corn', 'sweet corn', 'corn on cob', 'תירס', 'גרגרי תירס', 'קלח תירס'],
    category: 'Carbs',
    icon: '🌽',
    per100g: { calories: 96, protein: 3.4, carbs: 21.0, fat: 1.5, fiber: 2.4, sugar: 4.5 },
    portions: [
      { label: '1 cup kernels (~164g)', grams: 164, isDefault: true },
      { label: '1 medium cob (~100g edible)', grams: 100 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 218, vit_c: 5.5, vit_b12: 0, magnesium: 26, calcium: 3, iron: 0.45, zinc: 0.62, vit_d: 0, vit_a: 71, omega_3: 20 },
    cautions: { sodium: 1, cholesterol: 0, transFat: 0, saturatedFat: 0.2, addedSugar: 0 }
  },
  {
    id: 'wf_chickpeas_cooked',
    name: 'Chickpeas / Garbanzo, Boiled / Cooked',
    hebrewName: 'גרגרי חומוס מבושלים',
    aliases: ['chickpeas', 'garbanzo', 'chana', 'legumes', 'beans', 'חומוס', 'גרגרי חומוס', 'חמצה'],
    category: 'Carbs',
    icon: '🧆',
    per100g: { calories: 164, protein: 8.9, carbs: 27.4, fat: 2.6, fiber: 7.6, sugar: 4.8 },
    portions: [
      { label: '1 cup cooked (~164g)', grams: 164, isDefault: true },
      { label: '1/2 cup cooked (~82g)', grams: 82 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 291, vit_c: 1.3, vit_b12: 0, magnesium: 48, calcium: 49, iron: 2.89, zinc: 1.53, vit_d: 0, vit_a: 27, omega_3: 43 },
    cautions: { sodium: 7, cholesterol: 0, transFat: 0, saturatedFat: 0.27, addedSugar: 0 }
  },
  {
    id: 'wf_lentils_cooked',
    name: 'Lentils (Brown / Green), Boiled / Cooked',
    hebrewName: 'עדשים חומות / ירוקות מבושלות',
    aliases: ['lentils', 'lentil', 'brown lentils', 'green lentils', 'legumes', 'עדשים', 'עדשים מבושלות', 'עדשים חומות', 'עדשים ירוקות'],
    category: 'Carbs',
    icon: '🍲',
    per100g: { calories: 116, protein: 9.0, carbs: 20.1, fat: 0.4, fiber: 7.9, sugar: 1.8 },
    portions: [
      { label: '1 cup cooked (~198g)', grams: 198, isDefault: true },
      { label: '1/2 cup cooked (~99g)', grams: 99 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 369, vit_c: 1.5, vit_b12: 0, magnesium: 36, calcium: 19, iron: 3.33, zinc: 1.27, vit_d: 0, vit_a: 8, omega_3: 27 },
    cautions: { sodium: 2, cholesterol: 0, transFat: 0, saturatedFat: 0.05, addedSugar: 0 }
  },
  {
    id: 'wf_black_beans_cooked',
    name: 'Black Beans, Boiled / Cooked',
    hebrewName: 'שעועית שחורה מבושלת',
    aliases: ['black beans', 'beans', 'legumes', 'שעועית שחורה', 'שעועית'],
    category: 'Carbs',
    icon: '🫘',
    per100g: { calories: 132, protein: 8.9, carbs: 23.7, fat: 0.5, fiber: 8.7, sugar: 0.3 },
    portions: [
      { label: '1 cup cooked (~172g)', grams: 172, isDefault: true },
      { label: '1/2 cup cooked (~86g)', grams: 86 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 355, vit_c: 0, vit_b12: 0, magnesium: 70, calcium: 27, iron: 2.1, zinc: 1.12, vit_d: 0, vit_a: 0, omega_3: 90 },
    cautions: { sodium: 1, cholesterol: 0, transFat: 0, saturatedFat: 0.1, addedSugar: 0 }
  },
  {
    id: 'wf_hummus_spread',
    name: 'Hummus Spread (Chickpeas & Tahini Dip)',
    hebrewName: 'חומוס למריחה (ממרח חומוס וטחינה)',
    aliases: ['hummus', 'houmous', 'hummous', 'chickpea spread', 'ממרח חומוס', 'חומוס למריחה', 'סלט חומוס'],
    category: 'Carbs',
    icon: '🧆',
    per100g: { calories: 166, protein: 7.9, carbs: 14.3, fat: 9.6, fiber: 6.0, sugar: 0.3 },
    portions: [
      { label: '2 tablespoons (~30g)', grams: 30, isDefault: true },
      { label: '1/4 cup (~60g)', grams: 60 },
      { label: '1 tablespoon (~15g)', grams: 15 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 228, vit_c: 0, vit_b12: 0, magnesium: 71, calcium: 38, iron: 2.4, zinc: 1.8, vit_d: 0, vit_a: 10, omega_3: 80 },
    cautions: { sodium: 379, cholesterol: 0, transFat: 0, saturatedFat: 1.4, addedSugar: 0 }
  },

  // =========================================================================
  // ===================== HEALTHY FATS, NUTS & SEEDS ========================
  // =========================================================================
  {
    id: 'wf_avocado',
    name: 'Avocado, Raw',
    hebrewName: 'אבוקדו',
    aliases: ['avocado', 'avocados', 'healthy fat', 'אבוקדו'],
    category: 'Healthy Fats',
    icon: '🥑',
    per100g: { calories: 160, protein: 2.0, carbs: 8.5, fat: 14.7, fiber: 6.7, sugar: 0.7 },
    portions: [
      { label: '1/2 medium avocado (~100g)', grams: 100, isDefault: true },
      { label: '1 whole medium avocado (~200g)', grams: 200 },
      { label: '1/4 avocado slice (~50g)', grams: 50 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 485, vit_c: 10, vit_b12: 0, magnesium: 29, calcium: 12, iron: 0.55, zinc: 0.64, vit_d: 0, vit_a: 146, omega_3: 110 },
    cautions: { sodium: 7, cholesterol: 0, transFat: 0, saturatedFat: 2.1, addedSugar: 0 }
  },
  {
    id: 'wf_olive_oil',
    name: 'Extra Virgin Olive Oil',
    hebrewName: 'שמן זית כתית מעולה',
    aliases: ['olive oil', 'oil', 'extra virgin olive oil', 'evoo', 'שמן זית', 'שמן'],
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
    id: 'wf_raw_tahini',
    name: 'Pure Raw Tahini (100% Ground Sesame Seeds)',
    hebrewName: 'טחינה גולמית טהורה 100%',
    aliases: ['tahini', 'raw tahini', 'sesame paste', 'sesame butter', 'טחינה', 'טחינה גולמית', 'טחינה משומשום מלא'],
    category: 'Healthy Fats',
    icon: '🫙',
    per100g: { calories: 595, protein: 17.0, carbs: 21.2, fat: 53.8, fiber: 9.3, sugar: 0.5 },
    portions: [
      { label: '1 tablespoon (15g)', grams: 15, isDefault: true },
      { label: '2 tablespoons (30g)', grams: 30 },
      { label: '1 teaspoon (5g)', grams: 5 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 414, vit_c: 0, vit_b12: 0, magnesium: 95, calcium: 426, iron: 8.95, zinc: 4.62, vit_d: 0, vit_a: 67, omega_3: 160 },
    cautions: { sodium: 115, cholesterol: 0, transFat: 0, saturatedFat: 7.5, addedSugar: 0 }
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
      { label: '1 handful (approx 23 almonds, ~28g)', grams: 28, isDefault: true },
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
    aliases: ['walnuts', 'walnut', 'nuts', 'אגוזי מלך', 'אגוז מלך', 'אגוזים'],
    category: 'Healthy Fats',
    icon: '🌰',
    per100g: { calories: 654, protein: 15.2, carbs: 13.7, fat: 65.2, fiber: 6.7, sugar: 2.6 },
    portions: [
      { label: '1 handful (approx 7 walnuts, ~28g)', grams: 28, isDefault: true },
      { label: '1/4 cup halves (~30g)', grams: 30 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 441, vit_c: 1.3, vit_b12: 0, magnesium: 158, calcium: 98, iron: 2.91, zinc: 3.09, vit_d: 0, vit_a: 20, omega_3: 9080 },
    cautions: { sodium: 2, cholesterol: 0, transFat: 0, saturatedFat: 6.1, addedSugar: 0 }
  },
  {
    id: 'wf_cashews',
    name: 'Cashews, Raw Whole',
    hebrewName: 'אגוזי קשיו טבעיים',
    aliases: ['cashews', 'cashew', 'nuts', 'קשיו', 'אגוזי קשיו'],
    category: 'Healthy Fats',
    icon: '🥜',
    per100g: { calories: 553, protein: 18.2, carbs: 30.2, fat: 43.8, fiber: 3.3, sugar: 5.9 },
    portions: [
      { label: '1 handful (approx 18 cashews, ~28g)', grams: 28, isDefault: true },
      { label: '1/4 cup whole (~32g)', grams: 32 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 660, vit_c: 0.5, vit_b12: 0, magnesium: 292, calcium: 37, iron: 6.68, zinc: 5.78, vit_d: 0, vit_a: 0, omega_3: 60 },
    cautions: { sodium: 12, cholesterol: 0, transFat: 0, saturatedFat: 7.8, addedSugar: 0 }
  },
  {
    id: 'wf_pumpkin_seeds',
    name: 'Pumpkin Seeds (Pepitas), Raw Whole',
    hebrewName: 'גרעיני דלעת לא קלויים',
    aliases: ['pumpkin seeds', 'pepitas', 'seeds', 'גרעיני דלעת', 'דלעת'],
    category: 'Healthy Fats',
    icon: '🎃',
    per100g: { calories: 559, protein: 30.2, carbs: 10.7, fat: 49.1, fiber: 6.0, sugar: 1.4 },
    portions: [
      { label: '1 handful (~28g)', grams: 28, isDefault: true },
      { label: '1 tablespoon (~10g)', grams: 10 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 809, vit_c: 1.9, vit_b12: 0, magnesium: 592, calcium: 46, iron: 8.82, zinc: 7.81, vit_d: 0, vit_a: 16, omega_3: 120 },
    cautions: { sodium: 7, cholesterol: 0, transFat: 0, saturatedFat: 8.7, addedSugar: 0 }
  },
  {
    id: 'wf_chia_seeds',
    name: 'Chia Seeds, Dried',
    hebrewName: 'זרעי צ׳יה',
    aliases: ['chia', 'chia seeds', 'seeds', 'צ\'יה', 'זרעי צ\'יה', 'צ׳יה'],
    category: 'Healthy Fats',
    icon: '🌱',
    per100g: { calories: 486, protein: 16.5, carbs: 42.1, fat: 30.7, fiber: 34.4, sugar: 0.8 },
    portions: [
      { label: '1 tablespoon (~12g)', grams: 12, isDefault: true },
      { label: '2 tablespoons (~24g)', grams: 24 },
      { label: '1 teaspoon (~4g)', grams: 4 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 407, vit_c: 1.6, vit_b12: 0, magnesium: 335, calcium: 631, iron: 7.72, zinc: 4.58, vit_d: 0, vit_a: 54, omega_3: 17830 },
    cautions: { sodium: 16, cholesterol: 0, transFat: 0, saturatedFat: 3.3, addedSugar: 0 }
  },
  {
    id: 'wf_flaxseeds',
    name: 'Flaxseeds / Linseeds, Ground Raw',
    hebrewName: 'זרעי פשתן טחונים',
    aliases: ['flax', 'flaxseeds', 'linseeds', 'seeds', 'פשתן', 'זרעי פשתן'],
    category: 'Healthy Fats',
    icon: '🌱',
    per100g: { calories: 534, protein: 18.3, carbs: 28.9, fat: 42.2, fiber: 27.3, sugar: 1.5 },
    portions: [
      { label: '1 tablespoon ground (~7g)', grams: 7, isDefault: true },
      { label: '2 tablespoons (~14g)', grams: 14 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 813, vit_c: 0.6, vit_b12: 0, magnesium: 392, calcium: 255, iron: 5.73, zinc: 4.34, vit_d: 0, vit_a: 0, omega_3: 22810 },
    cautions: { sodium: 30, cholesterol: 0, transFat: 0, saturatedFat: 3.7, addedSugar: 0 }
  },
  {
    id: 'wf_peanut_butter',
    name: 'Natural Peanut Butter (100% Peanuts)',
    hebrewName: 'חמאת בוטנים טבעית 100%',
    aliases: ['peanut butter', 'pb', 'peanuts', 'חמאת בוטנים', 'חמאת בוטנים טבעית'],
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
    id: 'wf_butter',
    name: 'Butter, Pure Dairy Unsalted',
    hebrewName: 'חמאה',
    aliases: ['butter', 'unsalted butter', 'חמאה', 'חמאה טהורה'],
    category: 'Healthy Fats',
    icon: '🧈',
    per100g: { calories: 717, protein: 0.9, carbs: 0.1, fat: 81.1, fiber: 0, sugar: 0.1 },
    portions: [
      { label: '1 pat / slice (~10g)', grams: 10, isDefault: true },
      { label: '1 tablespoon (~14g)', grams: 14 },
      { label: '1 teaspoon (~5g)', grams: 5 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 24, vit_c: 0, vit_b12: 0.17, magnesium: 2, calcium: 24, iron: 0.02, zinc: 0.09, vit_d: 60, vit_a: 2499, omega_3: 320 },
    cautions: { sodium: 11, cholesterol: 215, transFat: 3.3, saturatedFat: 51.4, addedSugar: 0 }
  },

  // =========================================================================
  // ===================== DAIRY & PLANT ALTERNATIVES ========================
  // =========================================================================
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
    aliases: ['cottage cheese', 'cottage', 'cheese', 'קוטג', 'קוטג׳', 'גבינת קוטג'],
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
    id: 'wf_white_cheese_5',
    name: 'White Soft Cheese 5% (Gvina Levana)',
    hebrewName: 'גבינה לבנה 5% שומן',
    aliases: ['white cheese', 'gvina levana', 'quark', 'soft cheese', 'cheese', 'גבינה לבנה', 'גבינה 5%', 'גבינה לבנה 5%'],
    category: 'Dairy',
    icon: '🧀',
    per100g: { calories: 90, protein: 9.5, carbs: 3.8, fat: 5.0, fiber: 0, sugar: 3.8 },
    portions: [
      { label: '2 tablespoons (~50g)', grams: 50, isDefault: true },
      { label: '1/2 tub (~125g)', grams: 125 },
      { label: '1 full tub (~250g)', grams: 250 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 120, vit_c: 0, vit_b12: 0.5, magnesium: 10, calcium: 100, iron: 0.1, zinc: 0.4, vit_d: 5, vit_a: 110, omega_3: 10 },
    cautions: { sodium: 180, cholesterol: 15, transFat: 0.1, saturatedFat: 3.1, addedSugar: 0 }
  },
  {
    id: 'wf_feta_5',
    name: 'Feta / Bulgarian White Cheese 5% Fat',
    hebrewName: 'גבינה בולגרית / פטה 5%',
    aliases: ['feta', 'bulgarian cheese', 'feta 5%', 'brined cheese', 'פטה', 'בולגרית', 'גבינה בולגרית', 'פטה 5%'],
    category: 'Dairy',
    icon: '🧀',
    per100g: { calories: 118, protein: 13.0, carbs: 4.0, fat: 5.0, fiber: 0, sugar: 3.0 },
    portions: [
      { label: '1 slice (~40g)', grams: 40, isDefault: true },
      { label: '2 slices (~80g)', grams: 80 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 90, vit_c: 0, vit_b12: 0.8, magnesium: 12, calcium: 350, iron: 0.2, zinc: 1.2, vit_d: 8, vit_a: 120, omega_3: 15 },
    cautions: { sodium: 680, cholesterol: 18, transFat: 0.1, saturatedFat: 3.2, addedSugar: 0 }
  },
  {
    id: 'wf_mozzarella',
    name: 'Mozzarella Cheese, Part-Skim',
    hebrewName: 'גבינת מוצרלה',
    aliases: ['mozzarella', 'pizza cheese', 'cheese', 'מוצרלה', 'גבינת מוצרלה'],
    category: 'Dairy',
    icon: '🧀',
    per100g: { calories: 254, protein: 24.3, carbs: 2.8, fat: 15.9, fiber: 0, sugar: 1.2 },
    portions: [
      { label: '1 slice (~28g)', grams: 28, isDefault: true },
      { label: '1 cup shredded (~112g)', grams: 112 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 120, vit_c: 0, vit_b12: 1.5, magnesium: 20, calcium: 731, iron: 0.3, zinc: 2.8, vit_d: 15, vit_a: 550, omega_3: 90 },
    cautions: { sodium: 627, cholesterol: 54, transFat: 0.5, saturatedFat: 10.1, addedSugar: 0 }
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
  },
  {
    id: 'wf_soy_milk',
    name: 'Soy Milk, Plain Unsweetened',
    hebrewName: 'משקה סויה ללא סוכר',
    aliases: ['soy milk', 'soymilk', 'plant milk', 'חלב סויה', 'משקה סויה', 'סויה'],
    category: 'Dairy',
    icon: '🥛',
    per100g: { calories: 33, protein: 2.8, carbs: 1.8, fat: 1.6, fiber: 0.5, sugar: 0.6 },
    portions: [
      { label: '1 cup glass (240ml / ~245g)', grams: 245, isDefault: true },
      { label: '1/2 cup (120ml / ~122g)', grams: 122 },
      { label: 'Splash for coffee (~30g)', grams: 30 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 120, vit_c: 0, vit_b12: 0.4, magnesium: 19, calcium: 120, iron: 0.6, zinc: 0.3, vit_d: 40, vit_a: 75, omega_3: 150 },
    cautions: { sodium: 38, cholesterol: 0, transFat: 0, saturatedFat: 0.2, addedSugar: 0 }
  },
  {
    id: 'wf_almond_milk',
    name: 'Almond Milk, Plain Unsweetened',
    hebrewName: 'משקה שקדים ללא סוכר',
    aliases: ['almond milk', 'plant milk', 'חלב שקדים', 'משקה שקדים', 'שקדים'],
    category: 'Dairy',
    icon: '🥛',
    per100g: { calories: 15, protein: 0.6, carbs: 0.3, fat: 1.2, fiber: 0.3, sugar: 0.1 },
    portions: [
      { label: '1 cup glass (240ml / ~245g)', grams: 245, isDefault: true },
      { label: 'Splash for coffee (~30g)', grams: 30 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 65, vit_c: 0, vit_b12: 0.3, magnesium: 6, calcium: 180, iron: 0.3, zinc: 0.1, vit_d: 40, vit_a: 75, omega_3: 5 },
    cautions: { sodium: 68, cholesterol: 0, transFat: 0, saturatedFat: 0.1, addedSugar: 0 }
  },

  // =========================================================================
  // ===================== PANTRY & NATURAL CONDIMENTS =======================
  // =========================================================================
  {
    id: 'wf_honey',
    name: 'Pure Natural Bee Honey',
    hebrewName: 'דבש טבעי טהור',
    aliases: ['honey', 'raw honey', 'bee honey', 'sweetener', 'דבש', 'דבש טהור', 'דבש דבורים'],
    category: 'Carbs',
    icon: '🍯',
    per100g: { calories: 304, protein: 0.3, carbs: 82.4, fat: 0, fiber: 0.2, sugar: 82.1 },
    portions: [
      { label: '1 tablespoon (21g)', grams: 21, isDefault: true },
      { label: '1 teaspoon (7g)', grams: 7 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 52, vit_c: 0.5, vit_b12: 0, magnesium: 2, calcium: 6, iron: 0.42, zinc: 0.22, vit_d: 0, vit_a: 0, omega_3: 0 },
    cautions: { sodium: 4, cholesterol: 0, transFat: 0, saturatedFat: 0, addedSugar: 0 }
  },
  {
    id: 'wf_maple_syrup',
    name: 'Pure Maple Syrup (Grade A)',
    hebrewName: 'סירופ מייפל טבעי 100%',
    aliases: ['maple', 'maple syrup', 'pure maple syrup', 'מייפל', 'סירופ מייפל'],
    category: 'Carbs',
    icon: '🍁',
    per100g: { calories: 260, protein: 0.0, carbs: 67.0, fat: 0.1, fiber: 0, sugar: 60.5 },
    portions: [
      { label: '1 tablespoon (20g)', grams: 20, isDefault: true },
      { label: '2 tablespoons (40g)', grams: 40 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 212, vit_c: 0, vit_b12: 0, magnesium: 21, calcium: 102, iron: 1.2, zinc: 1.47, vit_d: 0, vit_a: 0, omega_3: 0 },
    cautions: { sodium: 12, cholesterol: 0, transFat: 0, saturatedFat: 0, addedSugar: 0 }
  },
  {
    id: 'wf_dark_chocolate_85',
    name: 'Dark Chocolate (85% Cocoa Solids)',
    hebrewName: 'שוקולד מריר 85% מוצקי קקאו',
    aliases: ['dark chocolate', 'chocolate 85%', 'chocolate', 'cacao', 'שוקולד מריר', 'שוקולד', 'קקאו'],
    category: 'Healthy Fats',
    icon: '🍫',
    per100g: { calories: 598, protein: 7.8, carbs: 36.1, fat: 46.3, fiber: 10.9, sugar: 13.9 },
    portions: [
      { label: '2 squares (~20g)', grams: 20, isDefault: true },
      { label: '1 square (~10g)', grams: 10 },
      { label: '1 full bar (~100g)', grams: 100 },
      { label: '100g standard', grams: 100 }
    ],
    micros: { potassium: 715, vit_c: 0, vit_b12: 0.28, magnesium: 228, calcium: 73, iron: 12.0, zinc: 3.3, vit_d: 1, vit_a: 48, omega_3: 80 },
    cautions: { sodium: 20, cholesterol: 3, transFat: 0, saturatedFat: 28.0, addedSugar: 13.0 }
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
    const catLower = (food.category || '').toLowerCase()
    const aliases = (food.aliases || []).map(a => a.toLowerCase())

    let score = 0

    // Exact matches
    if (nameLower === clean || hebLower === clean) {
      score += 100
    } else if (nameLower.startsWith(clean) || hebLower.startsWith(clean)) {
      score += 60
    } else if (aliases.includes(clean)) {
      score += 50
    }

    // Token inclusion
    let matchesAllTokens = true
    for (const t of tokens) {
      const matchInName = nameLower.includes(t)
      const matchInHeb = hebLower.includes(t)
      const matchInCat = catLower.includes(t)
      const matchInAlias = aliases.some(a => a.includes(t))

      if (matchInName || matchInHeb || matchInAlias || matchInCat) {
        score += 15
        if (matchInName && nameLower.startsWith(t)) score += 10
        if (matchInHeb && hebLower.startsWith(t)) score += 10
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
