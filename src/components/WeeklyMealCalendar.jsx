import React, { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { 
  Calendar, 
  ShoppingCart, 
  Sparkles, 
  Plus, 
  Trash2, 
  Check, 
  RotateCcw, 
  Utensils, 
  Flame, 
  Clock, 
  ChevronRight, 
  X,
  ChefHat,
  ArrowRight
} from 'lucide-react'
import { calculateRecipeNutrition } from '../utils/recipeCalculator'

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const MEAL_SLOTS = [
  { key: 'breakfast', label: 'Breakfast', icon: '🌅', color: 'var(--accent-yellow)' },
  { key: 'lunch', label: 'Lunch', icon: '🥗', color: 'var(--primary-light)' },
  { key: 'dinner', label: 'Dinner', icon: '🍲', color: 'var(--accent-purple)' },
  { key: 'snack', label: 'Snack / Shake', icon: '🍎', color: 'var(--accent-blue)' }
]

const STORAGE_KEY = 'nutriflow_weekly_plan'

// Default sample meal plan when starting fresh
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

export default function WeeklyMealCalendar({
  recipes = [],
  foodLibrary = [],
  onAddIngredientsToShoppingList,
  onLogMeal,
  onLogBatchMeals,
  targetCalories = 2350
}) {
  const [weeklyPlan, setWeeklyPlan] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return DEFAULT_WEEKLY_PLAN
  })

  // Selected slot for assigning a meal modal
  const [assigningSlot, setAssigningSlot] = useState(null) // { day: 'Monday', slotKey: 'lunch' }
  const [assignModalTab, setAssignModalTab] = useState('recipes') // 'recipes' | 'foods' | 'custom'
  const [customMealForm, setCustomMealForm] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '', ingredientsText: '' })
  
  // Shopping preview modal state
  const [isShoppingPreviewOpen, setIsShoppingPreviewOpen] = useState(false)
  const [selectedShoppingItems, setSelectedShoppingItems] = useState({})
  const [actionNotice, setActionNotice] = useState(null)

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(weeklyPlan))
    } catch {
      // ignore
    }
  }, [weeklyPlan])

  // Aggregate ingredients across the whole week
  const aggregatedIngredients = useMemo(() => {
    const list = []
    DAYS_OF_WEEK.forEach(day => {
      const dayMeals = weeklyPlan[day] || {}
      MEAL_SLOTS.forEach(slot => {
        const meal = dayMeals[slot.key]
        if (meal) {
          // If meal has explicit ingredients
          if (Array.isArray(meal.ingredients) && meal.ingredients.length > 0) {
            meal.ingredients.forEach(ing => {
              list.push({
                name: ing.name || ing.foodName || 'Item',
                amount: ing.amount || (ing.amountGrams ? `${ing.amountGrams}g` : ''),
                category: ing.category || 'Pantry & Grains'
              })
            })
          } else if (meal.recipeId) {
            // Find recipe
            const rec = recipes.find(r => r.id === meal.recipeId)
            if (rec && rec.ingredients) {
              rec.ingredients.forEach(ing => {
                list.push({
                  name: ing.foodName || 'Item',
                  amount: ing.amountGrams ? `${Math.round(ing.amountGrams / (rec.servings || 1))}g` : '',
                  category: 'Fresh Produce'
                })
              })
            } else {
              list.push({ name: meal.name, amount: '1 serving', category: 'Pantry & Grains' })
            }
          } else {
            list.push({ name: meal.name, amount: '1 serving', category: 'Pantry & Grains' })
          }
        }
      })
    })

    // Group and consolidate identical items
    const grouped = {}
    list.forEach(item => {
      const key = item.name.toLowerCase().trim()
      if (!grouped[key]) {
        grouped[key] = {
          name: item.name,
          category: item.category || 'Pantry & Grains',
          count: 1,
          amounts: [item.amount].filter(Boolean)
        }
      } else {
        grouped[key].count += 1
        if (item.amount) grouped[key].amounts.push(item.amount)
      }
    })

    // Format display text
    return Object.values(grouped).map((item, idx) => {
      let text = item.name
      if (item.count > 1) {
        text += ` (×${item.count} servings)`
      } else if (item.amounts.length > 0) {
        text += ` (${item.amounts[0]})`
      }
      return {
        id: `agg_${idx}`,
        name: item.name,
        text,
        category: item.category
      }
    })
  }, [weeklyPlan, recipes])

  // Weekly stats
  const weeklyStats = useMemo(() => {
    let totalCal = 0
    let totalPro = 0
    let totalCarbs = 0
    let totalFat = 0
    let plannedSlots = 0
    const totalSlots = DAYS_OF_WEEK.length * MEAL_SLOTS.length

    DAYS_OF_WEEK.forEach(day => {
      const dayMeals = weeklyPlan[day] || {}
      MEAL_SLOTS.forEach(slot => {
        const meal = dayMeals[slot.key]
        if (meal) {
          totalCal += meal.calories || 0
          totalPro += meal.protein || 0
          totalCarbs += meal.carbs || 0
          totalFat += meal.fat || 0
          plannedSlots += 1
        }
      })
    })

    const avgDailyCal = Math.round(totalCal / DAYS_OF_WEEK.length)
    const avgDailyPro = Math.round(totalPro / DAYS_OF_WEEK.length)

    return {
      totalCal,
      totalPro,
      totalCarbs,
      totalFat,
      plannedSlots,
      totalSlots,
      avgDailyCal,
      avgDailyPro
    }
  }, [weeklyPlan])

  // Assign recipe to a slot
  const handleAssignRecipe = (recipe) => {
    if (!assigningSlot) return
    const { day, slotKey } = assigningSlot
    const calc = calculateRecipeNutrition(recipe, foodLibrary)

    const assignedMeal = {
      name: recipe.title,
      calories: calc.perServing.calories,
      protein: calc.perServing.protein,
      carbs: calc.perServing.carbs,
      fat: calc.perServing.fat,
      recipeId: recipe.id,
      ingredients: (recipe.ingredients || []).map(ing => ({
        name: ing.foodName,
        amount: ing.amountGrams ? `${Math.round(ing.amountGrams / (recipe.servings || 1))}g` : '',
        category: 'Fresh Produce'
      }))
    }

    setWeeklyPlan(prev => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        [slotKey]: assignedMeal
      }
    }))
    setAssigningSlot(null)
  }

  // Assign food item to a slot
  const handleAssignFood = (food) => {
    if (!assigningSlot) return
    const { day, slotKey } = assigningSlot

    const assignedMeal = {
      name: food.name,
      calories: food.calories || 0,
      protein: food.protein || 0,
      carbs: food.carbs || 0,
      fat: food.fat || 0,
      ingredients: [{
        name: food.name,
        amount: food.serving || '1 portion',
        category: food.category === 'Protein' ? 'Poultry & Meat' : food.category === 'Dairy' ? 'Dairy & Eggs' : 'Fresh Produce'
      }]
    }

    setWeeklyPlan(prev => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        [slotKey]: assignedMeal
      }
    }))
    setAssigningSlot(null)
  }

  // Custom meal submission
  const handleAssignCustom = (e) => {
    e.preventDefault()
    if (!assigningSlot || !customMealForm.name.trim()) return
    const { day, slotKey } = assigningSlot

    const assignedMeal = {
      name: customMealForm.name.trim(),
      calories: parseInt(customMealForm.calories) || 0,
      protein: parseFloat(customMealForm.protein) || 0,
      carbs: parseFloat(customMealForm.carbs) || 0,
      fat: parseFloat(customMealForm.fat) || 0,
      ingredients: customMealForm.ingredientsText.trim()
        ? customMealForm.ingredientsText.split(',').map(s => ({ name: s.trim(), amount: '', category: 'Pantry & Grains' }))
        : [{ name: customMealForm.name.trim(), amount: '1 serving', category: 'Pantry & Grains' }]
    }

    setWeeklyPlan(prev => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        [slotKey]: assignedMeal
      }
    }))
    setCustomMealForm({ name: '', calories: '', protein: '', carbs: '', fat: '', ingredientsText: '' })
    setAssigningSlot(null)
  }

  // Remove meal from slot
  const handleRemoveMeal = (day, slotKey) => {
    setWeeklyPlan(prev => {
      const dayMeals = { ...(prev[day] || {}) }
      delete dayMeals[slotKey]
      return {
        ...prev,
        [day]: dayMeals
      }
    })
  }

  // Clear entire week
  const handleClearWeek = () => {
    if (window.confirm('Clear all meals planned for this week?')) {
      const empty = {}
      DAYS_OF_WEEK.forEach(d => { empty[d] = {} })
      setWeeklyPlan(empty)
      setActionNotice('Week plan cleared.')
      setTimeout(() => setActionNotice(null), 3000)
    }
  }

  // Reset to default sample week
  const handleLoadSampleWeek = () => {
    setWeeklyPlan(DEFAULT_WEEKLY_PLAN)
    setActionNotice('Loaded balanced high-protein weekly plan!')
    setTimeout(() => setActionNotice(null), 3000)
  }

  // Log all meals of a specific day to user's daily food log
  const handleLogDayToDaily = (day) => {
    const dayMeals = weeklyPlan[day] || {}
    const mealsToLog = []

    MEAL_SLOTS.forEach(slot => {
      const meal = dayMeals[slot.key]
      if (meal) {
        mealsToLog.push({
          id: 'm_wk_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          mealType: slot.label,
          name: meal.name,
          serving: '1 planned portion',
          calories: meal.calories || 0,
          protein: meal.protein || 0,
          carbs: meal.carbs || 0,
          fat: meal.fat || 0,
          micros: {},
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })
      }
    })

    if (mealsToLog.length === 0) {
      alert(`No meals planned for ${day} yet!`)
      return
    }

    if (onLogBatchMeals) {
      onLogBatchMeals(mealsToLog)
    } else if (onLogMeal) {
      mealsToLog.forEach(m => onLogMeal(m))
    }

    setActionNotice(`Logged ${mealsToLog.length} meals from ${day} to today's food log!`)
    setTimeout(() => setActionNotice(null), 3500)
  }

  // Open shopping preview
  const handleOpenShoppingPreview = () => {
    // Select all by default
    const initSelected = {}
    aggregatedIngredients.forEach(item => {
      initSelected[item.id] = true
    })
    setSelectedShoppingItems(initSelected)
    setIsShoppingPreviewOpen(true)
  }

  // Confirm export to shopping list
  const handleConfirmExportShopping = () => {
    const itemsToExport = aggregatedIngredients
      .filter(item => selectedShoppingItems[item.id])
      .map(item => ({
        text: item.text,
        category: item.category
      }))

    if (itemsToExport.length === 0) {
      alert('Please select at least one item to add to your shopping list.')
      return
    }

    if (onAddIngredientsToShoppingList) {
      onAddIngredientsToShoppingList(itemsToExport)
    }

    setIsShoppingPreviewOpen(false)
    setActionNotice(`Successfully added ${itemsToExport.length} grocery items to your shopping list!`)
    setTimeout(() => setActionNotice(null), 3500)
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Action Notification Toast */}
      {actionNotice && (
        <div style={{
          padding: '12px 20px',
          borderRadius: '12px',
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid var(--primary)',
          color: 'var(--primary-light)',
          fontWeight: '700',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Check size={18} />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Top Planner Hub Banner */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-emerald">
              <Calendar size={13} style={{ marginRight: '4px' }} /> 7-Day Meal Architecture
            </span>
            <span className="badge badge-blue">
              {weeklyStats.plannedSlots}/{weeklyStats.totalSlots} Slots Planned
            </span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>
            Weekly Meal Calendar & Auto-Shopping
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '720px', marginTop: '4px' }}>
            Plan your 7-day nutritional rhythm from Monday to Sunday. When your week is set, auto-generate a categorized grocery list with precise ingredient quantities in one click.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={handleOpenShoppingPreview}
            className="btn btn-primary"
            style={{ padding: '12px 22px', fontSize: '0.95rem', boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)' }}
          >
            <ShoppingCart size={18} />
            <span>Export Week to Shopping List ({aggregatedIngredients.length})</span>
          </button>

          <button
            onClick={handleLoadSampleWeek}
            className="btn btn-secondary"
            style={{ padding: '12px 18px', fontSize: '0.9rem' }}
            title="Load ready-to-use high protein balanced weekly menu"
          >
            <Sparkles size={16} />
            <span>Sample Menu</span>
          </button>

          <button
            onClick={handleClearWeek}
            className="btn-ghost"
            style={{ padding: '10px 14px', color: 'var(--text-muted)', fontSize: '0.86rem' }}
            title="Clear all days"
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Weekly Metric Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        <div className="glass-panel" style={{ padding: '16px 20px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Avg Daily Planned Calories
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
            <span style={{ fontSize: '1.7rem', fontWeight: '800', color: 'var(--primary-light)' }}>
              {weeklyStats.avgDailyCal}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              / {targetCalories} kcal target
            </span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 20px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Avg Daily Protein
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
            <span style={{ fontSize: '1.7rem', fontWeight: '800', color: 'var(--accent-blue)' }}>
              {weeklyStats.avgDailyPro}g
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              high-protein intake
            </span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 20px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Unique Grocery Items
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
            <span style={{ fontSize: '1.7rem', fontWeight: '800', color: 'var(--accent-purple)' }}>
              {aggregatedIngredients.length}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              ready for shopping list
            </span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 20px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Adherence Readiness
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
            <span style={{ fontSize: '1.7rem', fontWeight: '800', color: 'var(--accent-yellow)' }}>
              {Math.round((weeklyStats.plannedSlots / weeklyStats.totalSlots) * 100)}%
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              slots filled
            </span>
          </div>
        </div>
      </div>

      {/* 7-Day Board Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {DAYS_OF_WEEK.map(day => {
          const dayMeals = weeklyPlan[day] || {}
          let dayCal = 0
          let dayPro = 0
          let dayCarbs = 0
          let dayFat = 0

          MEAL_SLOTS.forEach(slot => {
            const m = dayMeals[slot.key]
            if (m) {
              dayCal += m.calories || 0
              dayPro += m.protein || 0
              dayCarbs += m.carbs || 0
              dayFat += m.fat || 0
            }
          })

          const isNearTarget = Math.abs(dayCal - targetCalories) <= 200

          return (
            <div
              key={day}
              className="glass-panel"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                border: '1px solid var(--border-color)',
                position: 'relative',
                borderRadius: '16px'
              }}
            >
              {/* Day Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{day}</h3>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem', marginTop: '2px' }}>
                    <span style={{ fontWeight: '700', color: isNearTarget ? 'var(--primary-light)' : 'var(--text-muted)' }}>
                      {dayCal} kcal
                    </span>
                    <span style={{ color: 'var(--text-dim)' }}>•</span>
                    <span style={{ color: 'var(--accent-blue)', fontWeight: '600' }}>{Math.round(dayPro)}g P</span>
                    <span style={{ color: 'var(--text-dim)' }}>•</span>
                    <span style={{ color: 'var(--accent-yellow)' }}>{Math.round(dayCarbs)}g C</span>
                    <span style={{ color: 'var(--text-dim)' }}>•</span>
                    <span style={{ color: 'var(--accent-red)' }}>{Math.round(dayFat)}g F</span>
                  </div>
                </div>

                {/* Log Entire Day Button */}
                <button
                  type="button"
                  onClick={() => handleLogDayToDaily(day)}
                  className="btn-secondary"
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title={`Log all planned meals of ${day} directly to today's food log`}
                >
                  <Utensils size={13} />
                  <span>Log Day</span>
                </button>
              </div>

              {/* Meal Slots List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {MEAL_SLOTS.map(slot => {
                  const meal = dayMeals[slot.key]

                  return (
                    <div
                      key={slot.key}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        background: meal ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.01)',
                        border: meal ? '1px solid rgba(255, 255, 255, 0.07)' : '1px dashed rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        transition: 'var(--transition)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.76rem', color: slot.color, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{slot.icon}</span>
                          <span>{slot.label}</span>
                        </span>

                        {meal && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMeal(day, slot.key)}
                            className="btn-ghost"
                            style={{
                              padding: '2px 6px',
                              color: 'var(--text-dim)',
                              fontSize: '0.72rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '2px'
                            }}
                            title="Remove meal"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>

                      {meal ? (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-main)', lineHeight: '1.3' }}>
                            {meal.name}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary-light)' }}>
                              {meal.calories} kcal
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', fontWeight: '600' }}>
                              {meal.protein}g P
                            </span>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setAssigningSlot({ day, slotKey: slot.key })
                            setAssignModalTab('recipes')
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-muted)',
                            fontSize: '0.82rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            padding: '4px 0',
                            textAlign: 'left'
                          }}
                        >
                          <Plus size={14} color="var(--primary-light)" />
                          <span>Assign Recipe or Food</span>
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>

            </div>
          )
        })}
      </div>

      {/* Assign Meal Modal */}
      {assigningSlot && createPortal(
        <div 
          className="modal-backdrop" 
          onClick={() => setAssigningSlot(null)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="modal-card" 
            onClick={e => e.stopPropagation()} 
            style={{ maxWidth: '640px' }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span className="badge badge-emerald">
                  {assigningSlot.day} • {assigningSlot.slotKey.toUpperCase()}
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '4px' }}>
                  Assign Meal to {assigningSlot.day}
                </h3>
              </div>
              <button
                onClick={() => setAssigningSlot(null)}
                className="btn-ghost"
                style={{ padding: '8px' }}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Subtabs */}
            <div style={{
              padding: '12px 24px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              gap: '10px'
            }}>
              <button
                type="button"
                onClick={() => setAssignModalTab('recipes')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: assignModalTab === 'recipes' ? '700' : '500',
                  background: assignModalTab === 'recipes' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                  color: assignModalTab === 'recipes' ? 'var(--primary-light)' : 'var(--text-muted)',
                  border: assignModalTab === 'recipes' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  cursor: 'pointer'
                }}
              >
                Saved Recipes ({recipes.length})
              </button>
              <button
                type="button"
                onClick={() => setAssignModalTab('foods')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: assignModalTab === 'foods' ? '700' : '500',
                  background: assignModalTab === 'foods' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                  color: assignModalTab === 'foods' ? 'var(--primary-light)' : 'var(--text-muted)',
                  border: assignModalTab === 'foods' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  cursor: 'pointer'
                }}
              >
                Food Database ({foodLibrary.length})
              </button>
              <button
                type="button"
                onClick={() => setAssignModalTab('custom')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: assignModalTab === 'custom' ? '700' : '500',
                  background: assignModalTab === 'custom' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                  color: assignModalTab === 'custom' ? 'var(--primary-light)' : 'var(--text-muted)',
                  border: assignModalTab === 'custom' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  cursor: 'pointer'
                }}
              >
                Custom Quick Item
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {assignModalTab === 'recipes' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {recipes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
                      <ChefHat size={36} style={{ margin: '0 auto 8px' }} />
                      <p>No saved recipes found yet. You can create one in the Recipe Builder or pick from Food Database.</p>
                    </div>
                  ) : (
                    recipes.map(recipe => {
                      const calc = calculateRecipeNutrition(recipe, foodLibrary)
                      return (
                        <div
                          key={recipe.id}
                          onClick={() => handleAssignRecipe(recipe)}
                          style={{
                            padding: '14px 16px',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid var(--border-color)',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'var(--transition)'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>{recipe.category || 'Recipe'}</span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{recipe.servings} Servings</span>
                            </div>
                            <span style={{ fontWeight: '700', fontSize: '0.96rem' }}>{recipe.title}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontWeight: '800', color: 'var(--primary-light)' }}>
                                {calc.perServing.calories} kcal
                              </div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--accent-blue)', fontWeight: '600' }}>
                                {calc.perServing.protein}g protein
                              </div>
                            </div>
                            <ChevronRight size={18} color="var(--primary-light)" />
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              )}

              {assignModalTab === 'foods' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {foodLibrary.slice(0, 16).map(food => (
                    <div
                      key={food.id}
                      onClick={() => handleAssignFood(food)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-color)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                    >
                      <div>
                        <span style={{ fontWeight: '600', fontSize: '0.92rem' }}>{food.name}</span>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{food.serving}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: '700', color: 'var(--primary-light)', fontSize: '0.88rem' }}>
                          {food.calories} kcal
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--accent-blue)' }}>
                          {food.protein}g P
                        </span>
                        <Plus size={16} color="var(--primary-light)" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {assignModalTab === 'custom' && (
                <form onSubmit={handleAssignCustom} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
                      Meal Name *
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Grilled Turkey & Rice Bowl"
                      value={customMealForm.name}
                      onChange={e => setCustomMealForm({ ...customMealForm, name: e.target.value })}
                      required
                      autoFocus
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Calories</label>
                      <input
                        type="number"
                        className="input-field"
                        placeholder="kcal"
                        value={customMealForm.calories}
                        onChange={e => setCustomMealForm({ ...customMealForm, calories: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Protein (g)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="input-field"
                        placeholder="g"
                        value={customMealForm.protein}
                        onChange={e => setCustomMealForm({ ...customMealForm, protein: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Carbs (g)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="input-field"
                        placeholder="g"
                        value={customMealForm.carbs}
                        onChange={e => setCustomMealForm({ ...customMealForm, carbs: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Fat (g)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="input-field"
                        placeholder="g"
                        value={customMealForm.fat}
                        onChange={e => setCustomMealForm({ ...customMealForm, fat: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
                      Ingredients (for auto-shopping generator, comma-separated)
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Ground turkey, Brown rice, Zucchini"
                      value={customMealForm.ingredientsText}
                      onChange={e => setCustomMealForm({ ...customMealForm, ingredientsText: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ marginTop: '8px', padding: '12px' }}>
                    Assign to {assigningSlot.day}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Auto-Shopping List Consolidation Modal */}
      {isShoppingPreviewOpen && createPortal(
        <div 
          className="modal-backdrop" 
          onClick={() => setIsShoppingPreviewOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="modal-card" 
            onClick={e => e.stopPropagation()} 
            style={{ maxWidth: '680px' }}
          >
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span className="badge badge-emerald">Weekly Grocery Optimizer</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '4px' }}>
                  Weekly Ingredients Consolidation
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
                  Aggregated from all 7 days of your meal plan. Uncheck any items you already have at home.
                </p>
              </div>
              <button
                onClick={() => setIsShoppingPreviewOpen(false)}
                className="btn-ghost"
                style={{ padding: '8px' }}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* List */}
            <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.84rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>
                  {Object.values(selectedShoppingItems).filter(Boolean).length} of {aggregatedIngredients.length} items selected
                </span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const all = {}
                      aggregatedIngredients.forEach(i => { all[i.id] = true })
                      setSelectedShoppingItems(all)
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-light)', cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedShoppingItems({})}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              {aggregatedIngredients.map(item => {
                const isChecked = !!selectedShoppingItems[item.id]
                return (
                  <label
                    key={item.id}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '10px',
                      background: isChecked ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      border: isChecked ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={e => setSelectedShoppingItems(prev => ({ ...prev, [item.id]: e.target.checked }))}
                        style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                      />
                      <span style={{ fontWeight: isChecked ? '600' : '400', color: isChecked ? 'var(--text-main)' : 'var(--text-muted)' }}>
                        {item.text}
                      </span>
                    </div>

                    <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>
                      {item.category}
                    </span>
                  </label>
                )
              })}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '18px 24px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                type="button"
                onClick={() => setIsShoppingPreviewOpen(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmExportShopping}
                className="btn btn-primary"
                style={{ padding: '12px 22px' }}
              >
                <ShoppingCart size={17} />
                <span>Add Selected ({Object.values(selectedShoppingItems).filter(Boolean).length}) to Shopping List</span>
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  )
}
