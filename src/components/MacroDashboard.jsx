import React, { useState, useMemo } from 'react'
import { 
  TrendingUp 
} from 'lucide-react'
import { COMMON_FOOD_LIBRARY } from '../data/initialData'
import { MICRONUTRIENTS_DATA } from '../data/vitaminsMinerals'
import { formatDisplayDate } from '../utils/dateUtils'
import { aggregateMacroTotals, computeMicronutrientStats } from '../utils/calculators'

import AddFoodModal from './AddFoodModal'
import FoodPreviewModal from './FoodPreviewModal'
import MicronutrientSection from './MicronutrientSection'
import MealLogList from './MealLogList'
import QuickFoodPicker from './QuickFoodPicker'
import MacroGapFiller from './MacroGapFiller'
import ExerciseTracker from './ExerciseTracker'
import HealthCautionTracker from './HealthCautionTracker'
import PwaInstallBanner from './PwaInstallBanner'

export default function MacroDashboard({ 
  profile, 
  mealLogs = [], 
  onAddMeal, 
  onDeleteMeal,
  dailyVitaminsCovered = [],
  onToggleVitamin,
  foodLibrary = COMMON_FOOD_LIBRARY,
  onAddNewFoodToLibrary,
  onNavigateTab,
  selectedDate,
  onOpenAnalytics,
  workouts = [],
  onAddWorkout,
  onDeleteWorkout,
  isNetMode = false,
  onToggleNetMode
}) {
  const [previewFood, setPreviewFood] = useState(null)
  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false)
  const [addFoodModalMode, setAddFoodModalMode] = useState('manual')

  // Macro Totals
  const totals = useMemo(() => aggregateMacroTotals(mealLogs), [mealLogs])

  const targetCal = profile.targetCalories || 2300
  const targetProtein = profile.targetProtein || 170
  const targetCarbs = profile.targetCarbs || 230
  const targetFat = profile.targetFat || 65

  const totalBurnedCalories = workouts.reduce((sum, w) => sum + (Number(w.caloriesBurned) || 0), 0)
  const grossCalories = Math.round(totals.calories)
  const netCalories = Math.max(0, grossCalories - totalBurnedCalories)
  const effectiveCalories = isNetMode ? netCalories : grossCalories

  const calRemaining = isNetMode 
    ? Math.max(0, targetCal - netCalories) 
    : Math.max(0, targetCal - grossCalories)
  const calPercent = Math.min(100, Math.round((effectiveCalories / targetCal) * 100))
  const proteinPercent = Math.min(100, Math.round((totals.protein / targetProtein) * 100))
  const carbsPercent = Math.min(100, Math.round((totals.carbs / targetCarbs) * 100))
  const fatPercent = Math.min(100, Math.round((totals.fat / targetFat) * 100))

  // Micronutrient stats across meal logs
  const microStats = useMemo(() => {
    return computeMicronutrientStats(mealLogs, dailyVitaminsCovered, MICRONUTRIENTS_DATA)
  }, [mealLogs, dailyVitaminsCovered])

  // Quick Add from Library
  const handleQuickAdd = (food) => {
    const newEntry = {
      id: 'm_' + Date.now() + Math.random().toString(36).substr(2, 4),
      mealType: 'Snack',
      name: food.name,
      serving: food.serving,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      micros: { ...(food.micros || {}) },
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    onAddMeal(newEntry)
  }

  const openScanModal = () => {
    setAddFoodModalMode('barcode')
    setIsAddFoodModalOpen(true)
  }

  const openCustomModal = () => {
    setAddFoodModalMode('manual')
    setIsAddFoodModalOpen(true)
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* PWA Mobile & Desktop Install Prompt */}
      <PwaInstallBanner />

      {/* Top Banner: Calories & Macronutrients */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        alignItems: 'center',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(18, 26, 41, 0.8) 100%)'
      }}>
        {/* Main Calorie Summary */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-emerald">
                {selectedDate ? formatDisplayDate(selectedDate) : 'Daily Nutrition Fuel'}
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Goal: {profile.goal?.replace(/_/g, ' ') || 'Maintain'}
              </span>
            </div>
            {onOpenAnalytics && (
              <button
                type="button"
                onClick={onOpenAnalytics}
                className="btn btn-sm btn-secondary"
                style={{ fontSize: '0.74rem', padding: '3px 8px', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <TrendingUp size={12} color="var(--primary-light)" />
                <span>Multi-Day Trends</span>
              </button>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>
              {effectiveCalories}{' '}
              <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: '400' }}>
                / {targetCal} kcal {isNetMode ? '(Net)' : ''}
              </span>
            </h2>
            {totalBurnedCalories > 0 && (
              <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>
                🔥 {totalBurnedCalories} kcal burned
              </span>
            )}
            {isNetMode && totalBurnedCalories > 0 && (
              <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>
                ({grossCalories} in - {totalBurnedCalories} out)
              </span>
            )}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {calRemaining > 0 ? (
              <span style={{ color: 'var(--primary-light)', fontWeight: '600' }}>
                {calRemaining} kcal remaining {isNetMode ? '(Net after workouts)' : 'today'}
              </span>
            ) : (
              <span style={{ color: 'var(--accent-yellow)', fontWeight: '600' }}>
                Daily calorie target reached!
              </span>
            )}
          </p>

          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Daily Caloric Progress</span>
              <span style={{ fontWeight: '700', color: 'var(--primary-light)' }}>{calPercent}%</span>
            </div>
            <div className="progress-container" style={{ height: '10px' }}>
              <div 
                className="progress-bar"
                style={{ 
                  width: `${calPercent}%`, 
                  background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)' 
                }}
              />
            </div>
          </div>
        </div>

        {/* Macro Bars Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '14px'
        }}>
          {/* Protein */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            border: '1px solid rgba(56, 189, 248, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', fontWeight: '700' }}>PROTEIN</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{proteinPercent}%</span>
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fff', marginBottom: '2px' }}>
              {Math.round(totals.protein)}g
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Goal: {targetProtein}g
            </div>
            <div className="progress-container" style={{ height: '6px' }}>
              <div className="progress-bar" style={{ width: `${proteinPercent}%`, background: 'var(--macro-protein)' }} />
            </div>
          </div>

          {/* Carbs */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            border: '1px solid rgba(251, 191, 36, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-yellow)', fontWeight: '700' }}>CARBS</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{carbsPercent}%</span>
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fff', marginBottom: '2px' }}>
              {Math.round(totals.carbs)}g
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Goal: {targetCarbs}g
            </div>
            <div className="progress-container" style={{ height: '6px' }}>
              <div className="progress-bar" style={{ width: `${carbsPercent}%`, background: 'var(--macro-carbs)' }} />
            </div>
          </div>

          {/* Fats */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            border: '1px solid rgba(244, 63, 94, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-red)', fontWeight: '700' }}>FAT</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{fatPercent}%</span>
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fff', marginBottom: '2px' }}>
              {Math.round(totals.fat)}g
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Goal: {targetFat}g
            </div>
            <div className="progress-container" style={{ height: '6px' }}>
              <div className="progress-bar" style={{ width: `${fatPercent}%`, background: 'var(--macro-fat)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Smart Macro Gap Filler (Intelligent Suggestions) */}
      <MacroGapFiller 
        targetCalories={targetCal}
        targetProtein={targetProtein}
        targetCarbs={targetCarbs}
        targetFat={targetFat}
        currentCalories={totals.calories}
        currentProtein={totals.protein}
        currentCarbs={totals.carbs}
        currentFat={totals.fat}
        foodLibrary={foodLibrary}
        onLogMeal={onAddMeal}
      />

      {/* Unhealthy Food Habits & Caution Nutrients Tracker (Trans fat, Cholesterol, Sodium/Salt, Sat. fat, Added Sugars, Late-night eating) */}
      <HealthCautionTracker 
        mealLogs={mealLogs}
        userGender={profile.gender || 'male'}
        onQuickLogMeal={onAddMeal}
      />

      {/* Daily Micronutrients & Minerals Tracker Section */}
      <MicronutrientSection 
        microStats={microStats}
        dailyVitaminsCovered={dailyVitaminsCovered}
        onToggleVitamin={onToggleVitamin}
        onNavigateTab={onNavigateTab}
        foodLibrary={foodLibrary}
        onQuickAddFood={handleQuickAdd}
      />

      {/* Daily Workout & Calorie Burn Tracker */}
      <ExerciseTracker 
        workouts={workouts}
        onAddWorkout={onAddWorkout}
        onDeleteWorkout={onDeleteWorkout}
        isNetMode={isNetMode}
        onToggleNetMode={onToggleNetMode}
        userWeight={profile.weight || 75}
      />

      {/* Split Grid: Today's Food Log & Quick Food Library */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Left: Today's Food Log */}
        <MealLogList 
          mealLogs={mealLogs}
          onOpenScanModal={openScanModal}
          onOpenCustomModal={openCustomModal}
          onDeleteMeal={onDeleteMeal}
        />

        {/* Right: Quick Food Library */}
        <QuickFoodPicker 
          foodLibrary={foodLibrary}
          onQuickAddFood={handleQuickAdd}
          onPreviewFood={setPreviewFood}
          onOpenAddFoodModal={openCustomModal}
        />
      </div>

      {/* Food Preview Modal */}
      {previewFood && (
        <FoodPreviewModal 
          food={previewFood}
          onClose={() => setPreviewFood(null)}
          onLogFood={handleQuickAdd}
        />
      )}

      {/* Add Food Modal (Barcode / Photo OCR / Manual) */}
      {isAddFoodModalOpen && (
        <AddFoodModal
          isOpen={isAddFoodModalOpen}
          initialMode={addFoodModalMode}
          onClose={() => setIsAddFoodModalOpen(false)}
          onSave={(newFood) => {
            if (onAddNewFoodToLibrary) onAddNewFoodToLibrary(newFood)
            handleQuickAdd(newFood)
            setIsAddFoodModalOpen(false)
          }}
        />
      )}

    </div>
  )
}
