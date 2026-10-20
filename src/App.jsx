import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import MacroDashboard from './components/MacroDashboard'
import TdeeCalculator from './components/TdeeCalculator'
import VitaminGuide from './components/VitaminGuide'
import WaterTracker from './components/WaterTracker'
import MealPlanner from './components/MealPlanner'
import FoodDatabaseView from './components/FoodDatabaseView'
import ShoppingList from './components/ShoppingList'

import { 
  DEFAULT_USER_PROFILE, 
  DEFAULT_MEAL_LOGS, 
  DEFAULT_SHOPPING_LIST,
  COMMON_FOOD_LIBRARY,
  DEFAULT_RECIPES
} from './data/initialData'
import { loadStorage, saveStorage } from './utils/storage'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  // Persistent States
  const [profile, setProfile] = useState(() => 
    loadStorage('nutriflow_profile', DEFAULT_USER_PROFILE)
  )

  const [mealLogs, setMealLogs] = useState(() => 
    loadStorage('nutriflow_meals', DEFAULT_MEAL_LOGS)
  )

  const [currentWater, setCurrentWater] = useState(() => 
    loadStorage('nutriflow_water', 1750)
  )

  const [dailyVitaminsCovered, setDailyVitaminsCovered] = useState(() => 
    loadStorage('nutriflow_vitamins', ['vit_d', 'magnesium', 'omega_3'])
  )

  const [shoppingItems, setShoppingItems] = useState(() => 
    loadStorage('nutriflow_shopping', DEFAULT_SHOPPING_LIST)
  )

  const [streakCount, setStreakCount] = useState(() => 
    loadStorage('nutriflow_streak', 6)
  )

  // Centralized Food Library state
  const [foodLibrary, setFoodLibrary] = useState(() => 
    loadStorage('nutriflow_food_library', COMMON_FOOD_LIBRARY)
  )

  // Centralized Recipes state
  const [recipes, setRecipes] = useState(() => 
    loadStorage('nutriflow_recipes', DEFAULT_RECIPES)
  )

  // Sync to localStorage
  useEffect(() => {
    saveStorage('nutriflow_profile', profile)
  }, [profile])

  useEffect(() => {
    saveStorage('nutriflow_meals', mealLogs)
  }, [mealLogs])

  useEffect(() => {
    saveStorage('nutriflow_water', currentWater)
  }, [currentWater])

  useEffect(() => {
    saveStorage('nutriflow_vitamins', dailyVitaminsCovered)
  }, [dailyVitaminsCovered])

  useEffect(() => {
    saveStorage('nutriflow_shopping', shoppingItems)
  }, [shoppingItems])

  useEffect(() => {
    saveStorage('nutriflow_food_library', foodLibrary)
  }, [foodLibrary])

  useEffect(() => {
    saveStorage('nutriflow_recipes', recipes)
  }, [recipes])

  // --- Actions ---
  const handleAddMeal = (newMeal) => {
    setMealLogs([newMeal, ...mealLogs])
  }

  const handleDeleteMeal = (id) => {
    setMealLogs(mealLogs.filter(m => m.id !== id))
  }

  const handleUpdateProfile = (updated) => {
    setProfile(updated)
  }

  const handleToggleVitamin = (id) => {
    if (dailyVitaminsCovered.includes(id)) {
      setDailyVitaminsCovered(dailyVitaminsCovered.filter(v => v !== id))
    } else {
      setDailyVitaminsCovered([...dailyVitaminsCovered, id])
    }
  }

  const handleUpdateWater = (newAmount) => {
    setCurrentWater(newAmount)
  }

  const handleToggleShopping = (id) => {
    setShoppingItems(shoppingItems.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const handleAddShoppingItem = (item) => {
    setShoppingItems([item, ...shoppingItems])
  }

  const handleDeleteShoppingItem = (id) => {
    setShoppingItems(shoppingItems.filter(i => i.id !== id))
  }

  const handleClearCompletedShopping = () => {
    setShoppingItems(shoppingItems.filter(i => !i.completed))
  }

  const handleAddBatchToShopping = (items) => {
    const newItems = items.map((text, idx) => ({
      id: 's_batch_' + Date.now() + '_' + idx,
      text,
      category: 'Produce & Staples',
      completed: false
    }))
    setShoppingItems([...newItems, ...shoppingItems])
    setActiveTab('shopping')
  }

  // Food Library Handlers
  const handleAddNewFoodToLibrary = (newFood) => {
    setFoodLibrary(prev => {
      const filtered = prev.filter(f => f.id !== newFood.id)
      return [newFood, ...filtered]
    })
  }

  const handleDeleteFoodFromLibrary = (foodId) => {
    setFoodLibrary(prev => prev.filter(f => f.id !== foodId))
  }

  // Recipe Handlers
  const handleSaveRecipe = (recipeData) => {
    setRecipes(prev => {
      const exists = prev.some(r => r.id === recipeData.id)
      if (exists) {
        return prev.map(r => r.id === recipeData.id ? recipeData : r)
      }
      return [recipeData, ...prev]
    })
  }

  const handleDeleteRecipe = (recipeId) => {
    setRecipes(prev => prev.filter(r => r.id !== recipeId))
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        streakCount={streakCount} 
      />

      <main style={{
        maxWidth: '1360px',
        width: '100%',
        margin: '0 auto',
        padding: '24px',
        flex: 1
      }}>
        {activeTab === 'dashboard' && (
          <MacroDashboard 
            profile={profile}
            mealLogs={mealLogs}
            onAddMeal={handleAddMeal}
            onDeleteMeal={handleDeleteMeal}
            dailyVitaminsCovered={dailyVitaminsCovered}
            onToggleVitamin={handleToggleVitamin}
            foodLibrary={foodLibrary}
            onAddNewFoodToLibrary={handleAddNewFoodToLibrary}
          />
        )}

        {activeTab === 'tdee' && (
          <TdeeCalculator 
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {activeTab === 'mealprep' && (
          <MealPlanner 
            recipes={recipes}
            onSaveRecipe={handleSaveRecipe}
            onDeleteRecipe={handleDeleteRecipe}
            foodLibrary={foodLibrary}
            onAddNewFoodToLibrary={handleAddNewFoodToLibrary}
            onAddIngredientsToShoppingList={handleAddBatchToShopping}
            onLogMeal={handleAddMeal}
          />
        )}

        {activeTab === 'foodlibrary' && (
          <FoodDatabaseView 
            foodLibrary={foodLibrary}
            onAddFood={handleAddNewFoodToLibrary}
            onDeleteFood={handleDeleteFoodFromLibrary}
            onQuickLogMeal={handleAddMeal}
          />
        )}

        {activeTab === 'vitamins' && (
          <VitaminGuide 
            dailyVitaminsCovered={dailyVitaminsCovered}
            onToggleVitamin={handleToggleVitamin}
            mealLogs={mealLogs}
          />
        )}

        {activeTab === 'water' && (
          <WaterTracker 
            currentWater={currentWater}
            waterGoal={profile.waterGoal || 3200}
            onUpdateWater={handleUpdateWater}
          />
        )}

        {activeTab === 'shopping' && (
          <ShoppingList 
            shoppingItems={shoppingItems}
            onToggleItem={handleToggleShopping}
            onAddItem={handleAddShoppingItem}
            onDeleteItem={handleDeleteShoppingItem}
            onClearCompleted={handleClearCompletedShopping}
          />
        )}
      </main>

      {/* Modern Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '24px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        marginTop: 'auto',
        background: 'rgba(10, 15, 24, 0.6)'
      }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <strong>NutriFlow</strong> • Science-Based Diet, Macros, Micronutrients & Lifestyle System
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            All metabolic and dietary data stored securely in your local browser cache.
          </div>
        </div>
      </footer>
    </div>
  )
}
