/**
 * Recipe & Ingredient Nutritional Calculator
 */

export function parseServingGrams(servingStr) {
  if (!servingStr) return 100
  if (typeof servingStr === 'number') return servingStr

  // Look for patterns like "150g", "200 g", "30g", "14ml"
  const gramMatch = servingStr.match(/(\d+(?:\.\d+)?)\s*(?:g|גרם|ml|מ"ל)/i)
  if (gramMatch) {
    return parseFloat(gramMatch[1]) || 100
  }

  // Look for number of items (e.g. "2 large eggs" -> ~100g, "1 tablet" -> 5g)
  const itemMatch = servingStr.match(/(\d+)/)
  if (itemMatch) {
    const count = parseFloat(itemMatch[1])
    if (/egg/i.test(servingStr) || /ביצ/i.test(servingStr)) return count * 50
    if (/banana/i.test(servingStr) || /בננ/i.test(servingStr)) return count * 120
    if (/scoop/i.test(servingStr) || /כף/i.test(servingStr)) return count * 30
    return count * 100
  }

  return 100
}

/**
 * Calculates nutrition for an ingredient given its amount in grams
 */
export function calculateIngredientNutrition(food, amountGrams) {
  if (!food) {
    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      micros: {}
    }
  }

  const baseWeight = food.servingWeightGrams || parseServingGrams(food.serving)
  const factor = (parseFloat(amountGrams) || baseWeight) / (baseWeight || 100)

  const calories = Math.round((food.calories || 0) * factor)
  const protein = Math.round((food.protein || 0) * factor * 10) / 10
  const carbs = Math.round((food.carbs || 0) * factor * 10) / 10
  const fat = Math.round((food.fat || 0) * factor * 10) / 10

  const micros = {}
  if (food.micros) {
    Object.keys(food.micros).forEach(key => {
      micros[key] = Math.round((food.micros[key] || 0) * factor * 10) / 10
    })
  }

  return {
    calories,
    protein,
    carbs,
    fat,
    micros,
    factor
  }
}

/**
 * Calculates complete recipe nutrition (Total and Per Serving)
 */
export function calculateRecipeNutrition(recipe, foodLibrary = []) {
  const servings = Math.max(1, parseInt(recipe.servings) || 1)
  const ingredients = recipe.ingredients || []

  let totalCalories = 0
  let totalProtein = 0
  let totalCarbs = 0
  let totalFat = 0
  const totalMicros = {}

  const ingredientDetails = ingredients.map(item => {
    const food = foodLibrary.find(f => f.id === item.foodId) || {
      id: item.foodId,
      name: item.foodName || 'Ingredient',
      serving: item.servingDesc || `${item.amountGrams}g`,
      calories: item.calories || 0,
      protein: item.protein || 0,
      carbs: item.carbs || 0,
      fat: item.fat || 0,
      micros: item.micros || {}
    }

    const nutrition = calculateIngredientNutrition(food, item.amountGrams)

    totalCalories += nutrition.calories
    totalProtein += nutrition.protein
    totalCarbs += nutrition.carbs
    totalFat += nutrition.fat

    Object.keys(nutrition.micros).forEach(key => {
      totalMicros[key] = (totalMicros[key] || 0) + nutrition.micros[key]
    })

    return {
      ...item,
      food,
      nutrition
    }
  })

  // Round micronutrient totals
  Object.keys(totalMicros).forEach(k => {
    totalMicros[k] = Math.round(totalMicros[k] * 10) / 10
  })

  const perServing = {
    calories: Math.round(totalCalories / servings),
    protein: Math.round((totalProtein / servings) * 10) / 10,
    carbs: Math.round((totalCarbs / servings) * 10) / 10,
    fat: Math.round((totalFat / servings) * 10) / 10,
    micros: {}
  }

  Object.keys(totalMicros).forEach(key => {
    perServing.micros[key] = Math.round((totalMicros[key] / servings) * 10) / 10
  })

  return {
    total: {
      calories: Math.round(totalCalories),
      protein: Math.round(totalProtein * 10) / 10,
      carbs: Math.round(totalCarbs * 10) / 10,
      fat: Math.round(totalFat * 10) / 10,
      micros: totalMicros
    },
    perServing,
    servings,
    ingredientDetails
  }
}
