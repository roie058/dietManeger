/**
 * Date and History Utilities for NutriFlow
 */

export function getTodayDateString() {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDisplayDate(dateStr) {
  if (!dateStr) return ''
  const today = getTodayDateString()
  const d = new Date(dateStr + 'T00:00:00')
  
  const options = { weekday: 'short', month: 'short', day: 'numeric' }
  const formatted = d.toLocaleDateString('en-US', options)
  
  if (dateStr === today) {
    return `Today (${formatted})`
  }
  
  const yesterday = addDays(today, -1)
  if (dateStr === yesterday) {
    return `Yesterday (${formatted})`
  }
  
  const tomorrow = addDays(today, 1)
  if (dateStr === tomorrow) {
    return `Tomorrow (${formatted})`
  }
  
  return formatted
}

export function addDays(dateStr, days) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Generate 14 days of realistic historical nutrition and weight records
 */
export function generateInitialHistory(todayMeals = [], todayWater = 1750, currentWeight = 76.0) {
  const today = getTodayDateString()
  const history = {}
  
  // Base staples to construct realistic past meal days
  const sampleDays = [
    {
      caloriesOffset: -120,
      protein: 172,
      carbs: 220,
      fat: 60,
      water: 3100,
      weightOffset: 0.15,
      meals: [
        { id: 'h1_1', mealType: 'Breakfast', name: 'Greek Yogurt Bowl & Berries', serving: '1 bowl', calories: 380, protein: 32, carbs: 45, fat: 6, time: '08:15', micros: { vit_b12: 1.5, calcium: 300, potassium: 450, magnesium: 60 } },
        { id: 'h1_2', mealType: 'Lunch', name: 'Chicken Breast, Sweet Potato & Broccoli', serving: '1 plate', calories: 540, protein: 52, carbs: 54, fat: 10, time: '12:45', micros: { vit_a: 850, vit_c: 70, zinc: 2.8, iron: 2.4, potassium: 750 } },
        { id: 'h1_3', mealType: 'Snack', name: 'Whey Protein Shake & Almonds', serving: '1 serving', calories: 280, protein: 29, carbs: 8, fat: 14, time: '16:30', micros: { magnesium: 85, calcium: 180, vit_b12: 0.8 } },
        { id: 'h1_4', mealType: 'Dinner', name: 'Grilled Salmon with Jasmine Rice & Asparagus', serving: '1 plate', calories: 590, protein: 44, carbs: 52, fat: 22, time: '19:45', micros: { omega_3: 1900, vit_d: 650, vit_b12: 4.2, potassium: 680 } }
      ]
    },
    {
      caloriesOffset: 80,
      protein: 180,
      carbs: 245,
      fat: 68,
      water: 3350,
      weightOffset: 0.3,
      meals: [
        { id: 'h2_1', mealType: 'Breakfast', name: 'Scrambled Eggs (3) with Sourdough & Avocado', serving: '2 slices', calories: 480, protein: 26, carbs: 38, fat: 24, time: '08:30', micros: { vit_d: 120, vit_a: 240, iron: 2.8, potassium: 480 } },
        { id: 'h2_2', mealType: 'Lunch', name: 'Steak Burrito Bowl (Brown Rice & Black Beans)', serving: '1 bowl', calories: 680, protein: 55, carbs: 68, fat: 20, time: '13:00', micros: { zinc: 5.2, iron: 4.1, magnesium: 110, potassium: 820 } },
        { id: 'h2_3', mealType: 'Dinner', name: 'Turkey Breast Stir-Fry with Quinoa', serving: '1 bowl', calories: 560, protein: 48, carbs: 56, fat: 12, time: '20:00', micros: { vit_b12: 1.8, potassium: 590, magnesium: 95 } }
      ]
    },
    {
      caloriesOffset: -240,
      protein: 168,
      carbs: 195,
      fat: 58,
      water: 2900,
      weightOffset: 0.45,
      meals: [
        { id: 'h3_1', mealType: 'Breakfast', name: 'Protein Oatmeal with Peanut Butter', serving: '1 bowl', calories: 430, protein: 30, carbs: 52, fat: 11, time: '08:00', micros: { magnesium: 120, iron: 3.2, potassium: 410 } },
        { id: 'h3_2', mealType: 'Lunch', name: 'Tuna Salad Wrap with Leafy Greens', serving: '2 wraps', calories: 510, protein: 46, carbs: 42, fat: 14, time: '12:30', micros: { omega_3: 850, vit_b12: 3.5, iron: 2.1 } },
        { id: 'h3_3', mealType: 'Dinner', name: 'Baked Cod, Roasted Potatoes & Green Beans', serving: '1 plate', calories: 490, protein: 42, carbs: 48, fat: 12, time: '19:15', micros: { vit_b12: 2.1, potassium: 710, calcium: 65 } }
      ]
    }
  ]

  // Populate past 13 days
  for (let i = 13; i >= 1; i--) {
    const dateKey = addDays(today, -i)
    const template = sampleDays[i % sampleDays.length]
    // Gradual weight trend (e.g. was 77.2 kg 14 days ago, trending down to 76.0 today)
    const weightVal = Math.round((currentWeight + (i * 0.09) + (Math.sin(i) * 0.15)) * 10) / 10
    
    history[dateKey] = {
      mealLogs: template.meals.map((m, idx) => ({ ...m, id: `hist_${dateKey}_${idx}` })),
      water: template.water,
      weight: weightVal,
      vitamins: ['vit_d', 'magnesium', 'omega_3', 'zinc']
    }
  }

  // Today
  history[today] = {
    mealLogs: todayMeals,
    water: todayWater,
    weight: currentWeight,
    vitamins: ['vit_d', 'magnesium', 'omega_3']
  }

  return history
}
