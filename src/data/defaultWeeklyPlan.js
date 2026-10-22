/**
 * Default sample weekly meal plan with structured nutritional information
 */
export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export const MEAL_SLOTS = [
  { key: 'breakfast', label: 'Breakfast', icon: '🌅', color: 'var(--accent-yellow)' },
  { key: 'lunch', label: 'Lunch', icon: '🥗', color: 'var(--primary-light)' },
  { key: 'dinner', label: 'Dinner', icon: '🍲', color: 'var(--accent-purple)' },
  { key: 'snack', label: 'Snack / Shake', icon: '🍎', color: 'var(--accent-blue)' }
]

export const DEFAULT_WEEKLY_PLAN = {
  Monday: {
    breakfast: { name: 'Rolled Oats with Berries & Greek Yogurt', calories: 460, protein: 32, carbs: 70, fat: 5, ingredients: [{ name: 'Rolled oats', amount: '80g', category: 'Pantry & Grains' }, { name: 'Greek Yogurt 0%', amount: '200g', category: 'Dairy & Eggs' }, { name: 'Mixed berries', amount: '50g', category: 'Fresh Produce' }] },
    lunch: { name: 'High-Protein Paprika Chicken & Sweet Potato Bowl', calories: 520, protein: 48, carbs: 45, fat: 14, recipeId: 'r1', ingredients: [{ name: 'Chicken breast fillets', amount: '150g', category: 'Poultry & Meat' }, { name: 'Sweet potato', amount: '130g', category: 'Fresh Produce' }, { name: 'Baby spinach', amount: '50g', category: 'Fresh Produce' }, { name: 'Olive oil', amount: '7ml', category: 'Oils & Condiments' }] },
    dinner: { name: 'Omega-3 Salmon, Rice & Avocado Power Plate', calories: 560, protein: 42, carbs: 40, fat: 22, recipeId: 'r2', ingredients: [{ name: 'Atlantic salmon fillet', amount: '160g', category: 'Fish & Seafood' }, { name: 'Jasmine rice', amount: '150g', category: 'Pantry & Grains' }, { name: 'Hass avocado', amount: '45g', category: 'Fresh Produce' }] },
    snack: { name: 'Whey Protein Shake & Banana', calories: 230, protein: 26, carbs: 28, fat: 2, ingredients: [{ name: 'Whey Protein powder', amount: '30g', category: 'Pantry & Grains' }, { name: 'Fresh banana', amount: '1 medium', category: 'Fresh Produce' }] }
  },
  Tuesday: {
    breakfast: { name: 'Whole Scrambled Eggs & Avocado Toast', calories: 420, protein: 22, carbs: 32, fat: 22, ingredients: [{ name: 'Free-range eggs', amount: '2 whole', category: 'Dairy & Eggs' }, { name: 'Whole wheat toast', amount: '2 slices', category: 'Pantry & Grains' }, { name: 'Hass avocado', amount: '50g', category: 'Fresh Produce' }] },
    lunch: { name: 'High-Protein Paprika Chicken & Sweet Potato Bowl', calories: 520, protein: 48, carbs: 45, fat: 14, recipeId: 'r1', ingredients: [{ name: 'Chicken breast fillets', amount: '150g', category: 'Poultry & Meat' }, { name: 'Sweet potato', amount: '130g', category: 'Fresh Produce' }, { name: 'Baby spinach', amount: '50g', category: 'Fresh Produce' }] },
    dinner: { name: 'Lean Beef Sirloin Stir Fry with Broccoli & Rice', calories: 580, protein: 46, carbs: 48, fat: 16, ingredients: [{ name: 'Lean beef sirloin', amount: '160g', category: 'Poultry & Meat' }, { name: 'Fresh broccoli florets', amount: '150g', category: 'Fresh Produce' }, { name: 'Brown rice', amount: '150g', category: 'Pantry & Grains' }] },
    snack: { name: '0% Greek Yogurt with Honey & Almonds', calories: 210, protein: 20, carbs: 16, fat: 6, ingredients: [{ name: 'Greek Yogurt 0%', amount: '180g', category: 'Dairy & Eggs' }, { name: 'Raw almonds', amount: '15g', category: 'Pantry & Grains' }] }
  },
  Wednesday: {
    breakfast: { name: 'Rolled Oats with Berries & Greek Yogurt', calories: 460, protein: 32, carbs: 70, fat: 5, ingredients: [{ name: 'Rolled oats', amount: '80g', category: 'Pantry & Grains' }, { name: 'Greek Yogurt 0%', amount: '200g', category: 'Dairy & Eggs' }, { name: 'Mixed berries', amount: '50g', category: 'Fresh Produce' }] },
    lunch: { name: 'High-Protein Paprika Chicken & Sweet Potato Bowl', calories: 520, protein: 48, carbs: 45, fat: 14, recipeId: 'r1', ingredients: [{ name: 'Chicken breast fillets', amount: '150g', category: 'Poultry & Meat' }, { name: 'Sweet potato', amount: '130g', category: 'Fresh Produce' }] },
    dinner: { name: 'Omega-3 Salmon, Rice & Avocado Power Plate', calories: 560, protein: 42, carbs: 40, fat: 22, recipeId: 'r2', ingredients: [{ name: 'Atlantic salmon fillet', amount: '160g', category: 'Fish & Seafood' }, { name: 'Jasmine rice', amount: '150g', category: 'Pantry & Grains' }, { name: 'Hass avocado', amount: '45g', category: 'Fresh Produce' }] },
    snack: { name: 'Whey Protein Shake & Apple', calories: 215, protein: 25, carbs: 24, fat: 1.5, ingredients: [{ name: 'Whey Protein powder', amount: '30g', category: 'Pantry & Grains' }, { name: 'Fresh crisp apple', amount: '1 whole', category: 'Fresh Produce' }] }
  },
  Thursday: {
    breakfast: { name: 'Whole Eggs (3 Poached) & Whole Grain Sourdough', calories: 380, protein: 25, carbs: 28, fat: 16, ingredients: [{ name: 'Free-range eggs', amount: '3 whole', category: 'Dairy & Eggs' }, { name: 'Whole grain sourdough', amount: '2 slices', category: 'Pantry & Grains' }] },
    lunch: { name: 'Grilled Chicken Breast with Steamed Quinoa & Greens', calories: 490, protein: 49, carbs: 42, fat: 10, ingredients: [{ name: 'Chicken breast fillets', amount: '160g', category: 'Poultry & Meat' }, { name: 'Quinoa', amount: '140g', category: 'Pantry & Grains' }, { name: 'Steamed broccoli & kale', amount: '120g', category: 'Fresh Produce' }] },
    dinner: { name: 'Tuna Salad Plate with Olive Oil, Eggs & Greens', calories: 510, protein: 44, carbs: 18, fat: 24, ingredients: [{ name: 'Canned tuna in springwater', amount: '160g', category: 'Fish & Seafood' }, { name: 'Free-range eggs', amount: '2 whole', category: 'Dairy & Eggs' }, { name: 'Extra virgin olive oil', amount: '15ml', category: 'Oils & Condiments' }, { name: 'Mixed salad greens', amount: '100g', category: 'Fresh Produce' }] },
    snack: { name: '0% Greek Yogurt with Chia Seeds & Berries', calories: 230, protein: 22, carbs: 20, fat: 5, ingredients: [{ name: 'Greek Yogurt 0%', amount: '200g', category: 'Dairy & Eggs' }, { name: 'Chia seeds', amount: '10g', category: 'Pantry & Grains' }, { name: 'Blueberries', amount: '40g', category: 'Fresh Produce' }] }
  },
  Friday: {
    breakfast: { name: 'Rolled Oats with Berries & Greek Yogurt', calories: 460, protein: 32, carbs: 70, fat: 5, ingredients: [{ name: 'Rolled oats', amount: '80g', category: 'Pantry & Grains' }, { name: 'Greek Yogurt 0%', amount: '200g', category: 'Dairy & Eggs' }, { name: 'Mixed berries', amount: '50g', category: 'Fresh Produce' }] },
    lunch: { name: 'High-Protein Paprika Chicken & Sweet Potato Bowl', calories: 520, protein: 48, carbs: 45, fat: 14, recipeId: 'r1', ingredients: [{ name: 'Chicken breast fillets', amount: '150g', category: 'Poultry & Meat' }, { name: 'Sweet potato', amount: '130g', category: 'Fresh Produce' }] },
    dinner: { name: 'Omega-3 Salmon, Rice & Avocado Power Plate', calories: 560, protein: 42, carbs: 40, fat: 22, recipeId: 'r2', ingredients: [{ name: 'Atlantic salmon fillet', amount: '160g', category: 'Fish & Seafood' }, { name: 'Jasmine rice', amount: '150g', category: 'Pantry & Grains' }, { name: 'Hass avocado', amount: '45g', category: 'Fresh Produce' }] },
    snack: { name: 'Whey Protein Shake & Rice Cakes with Peanut Butter', calories: 290, protein: 28, carbs: 26, fat: 8, ingredients: [{ name: 'Whey Protein powder', amount: '30g', category: 'Pantry & Grains' }, { name: 'Brown rice cakes', amount: '2 cakes', category: 'Pantry & Grains' }, { name: 'Natural peanut butter', amount: '15g', category: 'Pantry & Grains' }] }
  },
  Saturday: {
    breakfast: { name: 'Fluffy Protein Banana Pancakes', calories: 480, protein: 35, carbs: 62, fat: 8, ingredients: [{ name: 'Rolled oats', amount: '60g', category: 'Pantry & Grains' }, { name: 'Free-range eggs', amount: '2 whole', category: 'Dairy & Eggs' }, { name: 'Fresh banana', amount: '1 whole', category: 'Fresh Produce' }, { name: 'Whey Protein powder', amount: '25g', category: 'Pantry & Grains' }] },
    lunch: { name: 'Grilled Chicken Caesar Salad Bowl with Avocado', calories: 530, protein: 46, carbs: 18, fat: 28, ingredients: [{ name: 'Chicken breast fillets', amount: '160g', category: 'Poultry & Meat' }, { name: 'Romaine lettuce & greens', amount: '150g', category: 'Fresh Produce' }, { name: 'Hass avocado', amount: '50g', category: 'Fresh Produce' }, { name: 'Parmesan cheese', amount: '20g', category: 'Dairy & Eggs' }] },
    dinner: { name: 'Lean Beef Sirloin Steak with Roasted Potatoes & Asparagus', calories: 620, protein: 50, carbs: 45, fat: 22, ingredients: [{ name: 'Lean beef sirloin', amount: '180g', category: 'Poultry & Meat' }, { name: 'Baby potatoes', amount: '180g', category: 'Fresh Produce' }, { name: 'Fresh asparagus', amount: '100g', category: 'Fresh Produce' }] },
    snack: { name: 'Greek Yogurt with Dark Chocolate Chips', calories: 210, protein: 18, carbs: 18, fat: 6, ingredients: [{ name: 'Greek Yogurt 0%', amount: '180g', category: 'Dairy & Eggs' }, { name: 'Dark chocolate 85%', amount: '15g', category: 'Pantry & Grains' }] }
  },
  Sunday: {
    breakfast: { name: 'Sunday Omelette with Spinach, Feta & Sourdough', calories: 440, protein: 28, carbs: 26, fat: 22, ingredients: [{ name: 'Free-range eggs', amount: '3 whole', category: 'Dairy & Eggs' }, { name: 'Baby spinach', amount: '60g', category: 'Fresh Produce' }, { name: 'Feta cheese', amount: '30g', category: 'Dairy & Eggs' }, { name: 'Whole wheat toast', amount: '1 slice', category: 'Pantry & Grains' }] },
    lunch: { name: 'Batch Meal Prep Roast: Chicken, Rice & Veggies', calories: 510, protein: 47, carbs: 48, fat: 12, ingredients: [{ name: 'Chicken breast fillets', amount: '150g', category: 'Poultry & Meat' }, { name: 'Jasmine rice', amount: '150g', category: 'Pantry & Grains' }, { name: 'Mixed roasted vegetables', amount: '150g', category: 'Fresh Produce' }] },
    dinner: { name: 'Baked Salmon with Sweet Potato Mash & Green Beans', calories: 550, protein: 41, carbs: 42, fat: 20, ingredients: [{ name: 'Atlantic salmon fillet', amount: '160g', category: 'Fish & Seafood' }, { name: 'Sweet potato', amount: '160g', category: 'Fresh Produce' }, { name: 'Green beans', amount: '100g', category: 'Fresh Produce' }] },
    snack: { name: 'Casein / Whey Protein Pudding & Berries', calories: 220, protein: 27, carbs: 20, fat: 2, ingredients: [{ name: 'Whey Protein powder', amount: '30g', category: 'Pantry & Grains' }, { name: 'Mixed berries', amount: '60g', category: 'Fresh Produce' }] }
  }
}
