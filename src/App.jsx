import React, { useState, useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import MacroDashboard from './components/MacroDashboard'
import TdeeCalculator from './components/TdeeCalculator'
import VitaminGuide from './components/VitaminGuide'
import WaterTracker from './components/WaterTracker'
import MealPlanner from './components/MealPlanner'
import FoodDatabaseView from './components/FoodDatabaseView'
import ShoppingList from './components/ShoppingList'
import DateNavigator from './components/DateNavigator'
import HistoricalAnalytics from './components/HistoricalAnalytics'
import { getTodayDateString, generateInitialHistory, addDays, formatDisplayDate } from './utils/dateUtils'

import { 
  DEFAULT_USER_PROFILE, 
  DEFAULT_MEAL_LOGS, 
  DEFAULT_SHOPPING_LIST,
  COMMON_FOOD_LIBRARY,
  DEFAULT_RECIPES
} from './data/initialData'
import { RotateCcw, X, CheckCircle2 } from 'lucide-react'
import { loadStorage, saveStorage, requestPersistentStorage } from './utils/storage'
import CloudSyncModal from './components/CloudSyncModal'
import { 
  getCurrentUser, 
  onAuthStateChange, 
  uploadLocalDataToCloud, 
  isAutoSyncEnabled 
} from './utils/cloudSync'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isCloudSyncOpen, setIsCloudSyncOpen] = useState(false)
  const [cloudUser, setCloudUser] = useState(null)

  // Toast Notification state
  const [undoToast, setUndoToast] = useState(null)
  const toastTimerRef = useRef(null)

  const showUndoToast = (message, onUndo) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setUndoToast({ message, onUndo, id: Date.now() })
    toastTimerRef.current = setTimeout(() => {
      setUndoToast(null)
    }, 6000)
  }

  const handleDismissToast = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setUndoToast(null)
  }

  // Date & View Selection State
  const todayDateStr = getTodayDateString()
  const [selectedDate, setSelectedDate] = useState(() => todayDateStr)
  const [dashboardViewMode, setDashboardViewMode] = useState('day') // 'day' | 'analytics'

  // Persistent States
  const [profile, setProfile] = useState(() => 
    loadStorage('nutriflow_profile', DEFAULT_USER_PROFILE)
  )

  // Centralized Daily History state (date-keyed for multi-day logs and historical analytics)
  const [dailyHistory, setDailyHistory] = useState(() => {
    const saved = loadStorage('nutriflow_history', null)
    if (saved && Object.keys(saved).length > 0) return saved
    const legacyMeals = loadStorage('nutriflow_meals', DEFAULT_MEAL_LOGS)
    const legacyWater = loadStorage('nutriflow_water', 1750)
    const legacyVitamins = loadStorage('nutriflow_vitamins', ['vit_d', 'magnesium', 'omega_3'])
    const initialHist = generateInitialHistory(legacyMeals, legacyWater, DEFAULT_USER_PROFILE.weight || 76)
    if (initialHist[todayDateStr]) {
      initialHist[todayDateStr].vitamins = legacyVitamins
    }
    return initialHist
  })

  // Selected Day's Record
  const currentDayRecord = dailyHistory[selectedDate] || {
    mealLogs: [],
    water: 0,
    weight: profile.weight || 76,
    vitamins: []
  }

  const [shoppingItems, setShoppingItems] = useState(() => 
    loadStorage('nutriflow_shopping', DEFAULT_SHOPPING_LIST)
  )

  const [streakCount, setStreakCount] = useState(() => 
    loadStorage('nutriflow_streak', 6)
  )

  const [isNetCalorieMode, setIsNetCalorieMode] = useState(() => 
    loadStorage('nutriflow_net_mode', false)
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
    saveStorage('nutriflow_net_mode', isNetCalorieMode)
  }, [isNetCalorieMode])

  useEffect(() => {
    saveStorage('nutriflow_history', dailyHistory)
    // Keep legacy single-day keys synchronized for backward compatibility
    if (dailyHistory[todayDateStr]) {
      saveStorage('nutriflow_meals', dailyHistory[todayDateStr].mealLogs || [])
      saveStorage('nutriflow_water', dailyHistory[todayDateStr].water || 0)
      saveStorage('nutriflow_vitamins', dailyHistory[todayDateStr].vitamins || [])
    }
  }, [dailyHistory, todayDateStr])

  useEffect(() => {
    saveStorage('nutriflow_shopping', shoppingItems)
  }, [shoppingItems])

  useEffect(() => {
    saveStorage('nutriflow_food_library', foodLibrary)
  }, [foodLibrary])

  useEffect(() => {
    saveStorage('nutriflow_recipes', recipes)
  }, [recipes])

  // Mount effect: request browser persistent storage and initialize cloud auth listener
  useEffect(() => {
    requestPersistentStorage()

    getCurrentUser().then(user => setCloudUser(user))
    const unsubscribe = onAuthStateChange((event, sessionUser) => {
      setCloudUser(sessionUser)
    })
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  // Background auto-sync to cloud when data changes (debounced by 3.5s)
  useEffect(() => {
    if (!cloudUser || !isAutoSyncEnabled()) return

    const timer = setTimeout(() => {
      uploadLocalDataToCloud().catch(err => {
        console.warn('[NutriFlow] Auto-sync notice:', err.message)
      })
    }, 3500)

    return () => clearTimeout(timer)
  }, [profile, dailyHistory, shoppingItems, foodLibrary, recipes, isNetCalorieMode, streakCount, cloudUser])

  // Reload all state if cloud sync or file import restores data
  const handleReloadAllState = () => {
    setProfile(loadStorage('nutriflow_profile', DEFAULT_USER_PROFILE))
    setDailyHistory(loadStorage('nutriflow_history', dailyHistory))
    setShoppingItems(loadStorage('nutriflow_shopping', DEFAULT_SHOPPING_LIST))
    setFoodLibrary(loadStorage('nutriflow_food_library', COMMON_FOOD_LIBRARY))
    setRecipes(loadStorage('nutriflow_recipes', DEFAULT_RECIPES))
    setIsNetCalorieMode(loadStorage('nutriflow_net_mode', false))
    setStreakCount(loadStorage('nutriflow_streak', 6))
  }

  // --- Actions with Undo Support ---
  const handleAddMeal = (newMeal) => {
    setDailyHistory(prev => {
      const day = prev[selectedDate] || { mealLogs: [], water: 0, weight: profile.weight || 76, vitamins: [] }
      return {
        ...prev,
        [selectedDate]: { ...day, mealLogs: [newMeal, ...day.mealLogs] }
      }
    })
  }

  const handleDeleteMeal = (id) => {
    const day = dailyHistory[selectedDate] || { mealLogs: [], water: 0, weight: profile.weight || 76, vitamins: [] }
    const mealToDelete = day.mealLogs.find(m => m.id === id)
    if (!mealToDelete) return

    setDailyHistory(prev => {
      const d = prev[selectedDate] || { mealLogs: [], water: 0, weight: profile.weight || 76, vitamins: [] }
      return {
        ...prev,
        [selectedDate]: { ...d, mealLogs: d.mealLogs.filter(m => m.id !== id) }
      }
    })

    showUndoToast(`Deleted “${mealToDelete.name}”`, () => {
      setDailyHistory(prev => {
        const d = prev[selectedDate] || { mealLogs: [], water: 0, weight: profile.weight || 76, vitamins: [] }
        return {
          ...prev,
          [selectedDate]: { ...d, mealLogs: [mealToDelete, ...d.mealLogs] }
        }
      })
    })
  }

  const handleUpdateProfile = (updated) => {
    setProfile(updated)
  }

  const handleToggleVitamin = (id) => {
    setDailyHistory(prev => {
      const day = prev[selectedDate] || { mealLogs: [], water: 0, weight: profile.weight || 76, vitamins: [] }
      const currentVits = day.vitamins || []
      const updated = currentVits.includes(id) 
        ? currentVits.filter(v => v !== id) 
        : [...currentVits, id]
      return {
        ...prev,
        [selectedDate]: { ...day, vitamins: updated }
      }
    })
  }

  const handleUpdateWater = (newAmount) => {
    const day = dailyHistory[selectedDate] || { mealLogs: [], water: 0, weight: profile.weight || 76, vitamins: [] }
    const prevWater = day.water || 0

    if (newAmount === 0 && prevWater > 0) {
      setDailyHistory(prev => {
        const d = prev[selectedDate] || { mealLogs: [], water: 0, weight: profile.weight || 76, vitamins: [] }
        return {
          ...prev,
          [selectedDate]: { ...d, water: 0 }
        }
      })
      showUndoToast('Water intake reset to 0 ml', () => {
        setDailyHistory(prev => {
          const d = prev[selectedDate] || { mealLogs: [], water: 0, weight: profile.weight || 76, vitamins: [] }
          return {
            ...prev,
            [selectedDate]: { ...d, water: prevWater }
          }
        })
      })
    } else {
      setDailyHistory(prev => {
        const d = prev[selectedDate] || { mealLogs: [], water: 0, weight: profile.weight || 76, vitamins: [] }
        return {
          ...prev,
          [selectedDate]: { ...d, water: newAmount }
        }
      })
    }
  }

  const handleUpdateWeightForDate = (dateKey, weightVal) => {
    setDailyHistory(prev => {
      const d = prev[dateKey] || { mealLogs: [], water: 0, weight: weightVal, vitamins: [] }
      return {
        ...prev,
        [dateKey]: { ...d, weight: weightVal }
      }
    })
    if (dateKey === selectedDate || dateKey === todayDateStr) {
      setProfile(p => ({ ...p, weight: weightVal }))
    }
  }

  const handleAddWorkout = (newWorkout) => {
    setDailyHistory(prev => {
      const day = prev[selectedDate] || { mealLogs: [], water: 0, weight: profile.weight || 76, vitamins: [], workouts: [] }
      const currentWorkouts = day.workouts || []
      return {
        ...prev,
        [selectedDate]: { ...day, workouts: [newWorkout, ...currentWorkouts] }
      }
    })
  }

  const handleDeleteWorkout = (workoutId) => {
    const day = dailyHistory[selectedDate] || { mealLogs: [], water: 0, weight: profile.weight || 76, vitamins: [], workouts: [] }
    const workoutToDelete = (day.workouts || []).find(w => w.id === workoutId)
    if (!workoutToDelete) return

    setDailyHistory(prev => {
      const d = prev[selectedDate] || { mealLogs: [], water: 0, weight: profile.weight || 76, vitamins: [], workouts: [] }
      return {
        ...prev,
        [selectedDate]: { ...d, workouts: (d.workouts || []).filter(w => w.id !== workoutId) }
      }
    })

    showUndoToast(`Removed workout “${workoutToDelete.name}”`, () => {
      setDailyHistory(prev => {
        const d = prev[selectedDate] || { mealLogs: [], water: 0, weight: profile.weight || 76, vitamins: [], workouts: [] }
        return {
          ...prev,
          [selectedDate]: { ...d, workouts: [workoutToDelete, ...(d.workouts || [])] }
        }
      })
    })
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
    const itemToDelete = shoppingItems.find(i => i.id === id)
    if (!itemToDelete) return
    setShoppingItems(shoppingItems.filter(i => i.id !== id))
    showUndoToast(`Removed “${itemToDelete.text}”`, () => {
      setShoppingItems(prev => [itemToDelete, ...prev])
    })
  }

  const handleClearCompletedShopping = () => {
    const completedItems = shoppingItems.filter(i => i.completed)
    if (completedItems.length === 0) return
    setShoppingItems(shoppingItems.filter(i => !i.completed))
    showUndoToast(`Cleared ${completedItems.length} checked item${completedItems.length > 1 ? 's' : ''}`, () => {
      setShoppingItems(prev => [...completedItems, ...prev])
    })
  }

  const handleAddBatchToShopping = (items) => {
    const newItems = items.map((item, idx) => {
      if (typeof item === 'string') {
        return {
          id: 's_batch_' + Date.now() + '_' + idx,
          text: item,
          category: 'Produce & Staples',
          completed: false
        }
      }
      return {
        id: 's_batch_' + Date.now() + '_' + idx,
        text: item.text || item.name,
        category: item.category || 'Produce & Staples',
        completed: false
      }
    })
    setShoppingItems(prev => [...newItems, ...prev])
    setActiveTab('shopping')
  }

  const handleAddBatchMeals = (meals) => {
    setDailyHistory(prev => {
      const day = prev[selectedDate] || { mealLogs: [], water: 0, weight: profile.weight || 76, vitamins: [], workouts: [] }
      return {
        ...prev,
        [selectedDate]: { ...day, mealLogs: [...meals, ...(day.mealLogs || [])] }
      }
    })
  }

  // Food Library Handlers
  const handleAddNewFoodToLibrary = (newFood) => {
    setFoodLibrary(prev => {
      const filtered = prev.filter(f => f.id !== newFood.id)
      return [newFood, ...filtered]
    })
  }

  const handleDeleteFoodFromLibrary = (foodId) => {
    const foodToDelete = foodLibrary.find(f => f.id === foodId)
    if (!foodToDelete) return
    setFoodLibrary(prev => prev.filter(f => f.id !== foodId))
    showUndoToast(`Deleted “${foodToDelete.name}” from database`, () => {
      setFoodLibrary(prev => [foodToDelete, ...prev])
    })
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
    const recipeToDelete = recipes.find(r => r.id === recipeId)
    if (!recipeToDelete) return
    setRecipes(prev => prev.filter(r => r.id !== recipeId))
    showUndoToast(`Deleted recipe “${recipeToDelete.title}”`, () => {
      setRecipes(prev => [recipeToDelete, ...prev])
    })
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Accessible Skip to Main Content Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        streakCount={streakCount} 
        onOpenCloudSync={() => setIsCloudSyncOpen(true)}
        isCloudUser={Boolean(cloudUser)}
      />

      <main 
        id="main-content"
        tabIndex="-1"
        style={{
          maxWidth: '1360px',
          width: '100%',
          margin: '0 auto',
          padding: '24px',
          flex: 1,
          outline: 'none'
        }}
      >
        {activeTab === 'dashboard' && (
          <div>
            <DateNavigator 
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              viewMode={dashboardViewMode}
              onChangeViewMode={setDashboardViewMode}
              streakCount={streakCount}
            />

            {dashboardViewMode === 'day' ? (
              <MacroDashboard 
                profile={profile}
                mealLogs={currentDayRecord.mealLogs || []}
                onAddMeal={handleAddMeal}
                onDeleteMeal={handleDeleteMeal}
                dailyVitaminsCovered={currentDayRecord.vitamins || []}
                onToggleVitamin={handleToggleVitamin}
                foodLibrary={foodLibrary}
                onAddNewFoodToLibrary={handleAddNewFoodToLibrary}
                onNavigateTab={setActiveTab}
                selectedDate={selectedDate}
                onOpenAnalytics={() => setDashboardViewMode('analytics')}
                workouts={currentDayRecord.workouts || []}
                onAddWorkout={handleAddWorkout}
                onDeleteWorkout={handleDeleteWorkout}
                isNetMode={isNetCalorieMode}
                onToggleNetMode={() => setIsNetCalorieMode(!isNetCalorieMode)}
              />
            ) : (
              <HistoricalAnalytics 
                dailyHistory={dailyHistory}
                profile={profile}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                onUpdateWeightForDate={handleUpdateWeightForDate}
                onSwitchToDayView={() => setDashboardViewMode('day')}
              />
            )}
          </div>
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
            onLogBatchMeals={handleAddBatchMeals}
            targetCalories={profile.targetCalories || 2350}
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
            dailyVitaminsCovered={currentDayRecord.vitamins || []}
            onToggleVitamin={handleToggleVitamin}
            mealLogs={currentDayRecord.mealLogs || []}
          />
        )}

        {activeTab === 'water' && (
          <WaterTracker 
            currentWater={currentDayRecord.water || 0}
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
            <strong>NutriFlow PRO</strong> • Science-Based Diet, Macros, Micronutrients & Lifestyle System
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            All metabolic and dietary data stored securely in your local browser cache.
          </div>
        </div>
      </footer>

      {/* Accessible Undo Toast Notification */}
      {undoToast && (
        <div className="undo-toast-container" aria-live="polite">
          <div className="undo-toast">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={18} color="var(--primary-light)" aria-hidden="true" />
              <span>{undoToast.message}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {undoToast.onUndo && (
                <button 
                  type="button" 
                  onClick={() => {
                    undoToast.onUndo()
                    handleDismissToast()
                  }}
                  className="undo-toast-btn"
                  aria-label="Undo recent action"
                >
                  <RotateCcw size={14} aria-hidden="true" />
                  <span>Undo</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleDismissToast}
                className="undo-toast-dismiss"
                aria-label="Dismiss notification"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cloud Sync & Backup Modal */}
      <CloudSyncModal 
        isOpen={isCloudSyncOpen}
        onClose={() => setIsCloudSyncOpen(false)}
        onDataRestored={handleReloadAllState}
      />
    </div>
  )
}
