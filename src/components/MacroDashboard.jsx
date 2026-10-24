import React, { useState, useMemo } from 'react'
import { 
  TrendingUp,
  Droplets,
  Plus,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Activity,
  Lightbulb,
  Pill
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
  onToggleNetMode,
  currentWater = 0,
  waterGoal = 3000,
  onUpdateWater,
  showUndoToast
}) {
  const [previewFood, setPreviewFood] = useState(null)
  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false)
  const [addFoodModalMode, setAddFoodModalMode] = useState('manual')

  // Progressive Disclosure: Insights accordion & active pill
  const [isInsightsExpanded, setIsInsightsExpanded] = useState(false)
  const [activeInsight, setActiveInsight] = useState('micros') // 'micros' | 'cautions' | 'gaps' | 'workouts'

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

  const waterPercent = Math.min(100, Math.round((currentWater / waterGoal) * 100))

  // Micronutrient stats across meal logs
  const microStats = useMemo(() => {
    return computeMicronutrientStats(mealLogs, dailyVitaminsCovered, MICRONUTRIENTS_DATA)
  }, [mealLogs, dailyVitaminsCovered])

  // Count vitamins covered >= 100%
  const coveredVitaminsCount = Object.values(microStats).filter(s => s.percent >= 100).length

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

  const openCustomModal = (defaultMealType = 'Snack') => {
    setAddFoodModalMode('manual')
    setIsAddFoodModalOpen(true)
  }

  const handleQuickAddWater = () => {
    if (!onUpdateWater) return
    const prevWater = currentWater
    const newWater = currentWater + 250
    onUpdateWater(newWater)
    if (showUndoToast) {
      showUndoToast('+250 ml water logged', () => onUpdateWater(prevWater))
    }
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* PWA Mobile & Desktop Install Prompt */}
      <PwaInstallBanner />

      {/* Primary Hero: Daily Nutrition Budget & Macro Allocation */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        alignItems: 'center',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.09) 0%, rgba(18, 26, 41, 0.85) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.2)'
      }}>
        {/* Main Calorie Summary */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-emerald">
                {selectedDate ? formatDisplayDate(selectedDate) : 'Today'}
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
                aria-label="View multi-day nutrition analytics and trends"
              >
                <TrendingUp size={12} color="var(--primary-light)" />
                <span>Multi-Day Trends</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <h2 className="tabular-nums" style={{ fontSize: '2.1rem', fontWeight: '800' }}>
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
              <span className="tabular-nums" style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>
                ({grossCalories} in - {totalBurnedCalories} out)
              </span>
            )}
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            {calRemaining > 0 ? (
              <span style={{ color: 'var(--primary-light)', fontWeight: '600' }}>
                <strong className="tabular-nums">{calRemaining} kcal</strong> remaining {isNetMode ? '(Net after workouts)' : 'today'}
              </span>
            ) : (
              <span style={{ color: 'var(--accent-yellow)', fontWeight: '600' }}>
                Daily calorie target reached!
              </span>
            )}
          </p>

          <div style={{ marginTop: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Daily Caloric Progress</span>
              <span className="tabular-nums" style={{ fontWeight: '700', color: 'var(--primary-light)' }}>{calPercent}%</span>
            </div>
            <div className="progress-container" style={{ height: '9px' }}>
              <div 
                className="progress-bar"
                style={{ 
                  width: `${calPercent}%`, 
                  background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)' 
                }}
              />
            </div>
          </div>

          {/* Integrated Compact Water Widget */}
          <div style={{
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Droplets size={16} color="var(--accent-blue)" />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Hydration:</span>
              <span className="tabular-nums" style={{ fontSize: '0.86rem', fontWeight: '700', color: '#fff' }}>
                {currentWater} / {waterGoal} ml
              </span>
              <span className="tabular-nums" style={{ fontSize: '0.74rem', color: 'var(--accent-blue)' }}>
                ({waterPercent}%)
              </span>
            </div>

            <button
              type="button"
              onClick={handleQuickAddWater}
              className="btn btn-secondary btn-sm"
              style={{
                fontSize: '0.75rem',
                padding: '4px 10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                borderColor: 'rgba(56, 189, 248, 0.3)'
              }}
              title="Add 1 glass (250 ml) of water"
            >
              <Plus size={13} color="var(--accent-blue)" />
              <span>+250ml Glass</span>
            </button>
          </div>
        </div>

        {/* Macro Bars Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px'
        }}>
          {/* Protein */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            border: '1px solid rgba(56, 189, 248, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--accent-blue)', fontWeight: '700' }}>PROTEIN</span>
              <span className="tabular-nums" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{proteinPercent}%</span>
            </div>
            <div className="tabular-nums" style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', marginBottom: '2px' }}>
              {Math.round(totals.protein)}g
            </div>
            <div className="tabular-nums" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Goal: {targetProtein}g
            </div>
            <div className="progress-container" style={{ height: '5px' }}>
              <div className="progress-bar" style={{ width: `${proteinPercent}%`, background: 'var(--macro-protein)' }} />
            </div>
          </div>

          {/* Carbs */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            border: '1px solid rgba(251, 191, 36, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--accent-yellow)', fontWeight: '700' }}>CARBS</span>
              <span className="tabular-nums" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{carbsPercent}%</span>
            </div>
            <div className="tabular-nums" style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', marginBottom: '2px' }}>
              {Math.round(totals.carbs)}g
            </div>
            <div className="tabular-nums" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Goal: {targetCarbs}g
            </div>
            <div className="progress-container" style={{ height: '5px' }}>
              <div className="progress-bar" style={{ width: `${carbsPercent}%`, background: 'var(--macro-carbs)' }} />
            </div>
          </div>

          {/* Fats */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            border: '1px solid rgba(244, 63, 94, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--accent-red)', fontWeight: '700' }}>FAT</span>
              <span className="tabular-nums" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{fatPercent}%</span>
            </div>
            <div className="tabular-nums" style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', marginBottom: '2px' }}>
              {Math.round(totals.fat)}g
            </div>
            <div className="tabular-nums" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Goal: {targetFat}g
            </div>
            <div className="progress-container" style={{ height: '5px' }}>
              <div className="progress-bar" style={{ width: `${fatPercent}%`, background: 'var(--macro-fat)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid: Today's Food Log & Quick Food Picker */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '22px',
        alignItems: 'start'
      }}>
        {/* Left: Today's Food Log with Guided Empty State */}
        <MealLogList 
          mealLogs={mealLogs}
          onOpenScanModal={openScanModal}
          onOpenCustomModal={openCustomModal}
          onDeleteMeal={onDeleteMeal}
          remainingCalories={calRemaining}
          targetCalories={targetCal}
        />

        {/* Right: Quick Food Library & Favorites */}
        <QuickFoodPicker 
          foodLibrary={foodLibrary}
          onQuickAddFood={handleQuickAdd}
          onPreviewFood={setPreviewFood}
          onOpenAddFoodModal={openCustomModal}
        />
      </div>

      {/* Progressive Disclosure Section: Daily Health & Nutrient Deep-Dive */}
      <div className="glass-panel" style={{
        padding: '20px 24px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        background: 'rgba(15, 23, 42, 0.65)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="var(--primary-light)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>
                Daily Health & Nutrient Deep-Dive
              </h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Progressive analysis of essential micronutrients, health cautions, calorie gap suggestions, and workouts.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setIsInsightsExpanded(!isInsightsExpanded)}
              className="btn btn-secondary btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                fontSize: '0.82rem',
                borderColor: isInsightsExpanded ? 'var(--primary)' : 'var(--border-color)'
              }}
              aria-expanded={isInsightsExpanded}
            >
              <span>{isInsightsExpanded ? 'Hide Deep-Dive' : 'View Deep-Dive'}</span>
              {isInsightsExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>
        </div>

        {/* Summary Badges Row (Always Visible as Scannable Glance) */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginTop: '14px',
          overflowX: 'auto',
          paddingBottom: '2px',
          flexWrap: 'wrap'
        }}>
          <button
            type="button"
            onClick={() => {
              setActiveInsight('micros')
              setIsInsightsExpanded(true)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '999px',
              background: activeInsight === 'micros' && isInsightsExpanded ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              border: activeInsight === 'micros' && isInsightsExpanded ? '1px solid var(--accent-purple)' : '1px solid var(--border-color)',
              color: '#fff',
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            <Pill size={14} color="var(--accent-purple)" />
            <span>Micronutrients: <strong className="tabular-nums" style={{ color: 'var(--accent-purple)' }}>{coveredVitaminsCount}/10 Covered</strong></span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveInsight('cautions')
              setIsInsightsExpanded(true)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '999px',
              background: activeInsight === 'cautions' && isInsightsExpanded ? 'rgba(244, 63, 94, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              border: activeInsight === 'cautions' && isInsightsExpanded ? '1px solid var(--accent-red)' : '1px solid var(--border-color)',
              color: '#fff',
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            <ShieldAlert size={14} color="var(--accent-red)" />
            <span>Health Habits & Cautions</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveInsight('gaps')
              setIsInsightsExpanded(true)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '999px',
              background: activeInsight === 'gaps' && isInsightsExpanded ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              border: activeInsight === 'gaps' && isInsightsExpanded ? '1px solid var(--accent-yellow)' : '1px solid var(--border-color)',
              color: '#fff',
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            <Lightbulb size={14} color="var(--accent-yellow)" />
            <span>Macro Gap Advice</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveInsight('workouts')
              setIsInsightsExpanded(true)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '999px',
              background: activeInsight === 'workouts' && isInsightsExpanded ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              border: activeInsight === 'workouts' && isInsightsExpanded ? '1px solid var(--primary)' : '1px solid var(--border-color)',
              color: '#fff',
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            <Activity size={14} color="var(--primary-light)" />
            <span>Workouts: <strong className="tabular-nums" style={{ color: 'var(--primary-light)' }}>{totalBurnedCalories} kcal</strong></span>
          </button>
        </div>

        {/* Expanded Deep-Dive Content */}
        {isInsightsExpanded && (
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            
            {/* Segmented Switcher */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '18px',
              overflowX: 'auto',
              paddingBottom: '2px'
            }}>
              <button
                type="button"
                onClick={() => setActiveInsight('micros')}
                className={`btn btn-sm ${activeInsight === 'micros' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Pill size={14} />
                <span>Vitamins & Micronutrients</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveInsight('cautions')}
                className={`btn btn-sm ${activeInsight === 'cautions' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ShieldAlert size={14} />
                <span>Habits & Cautions</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveInsight('gaps')}
                className={`btn btn-sm ${activeInsight === 'gaps' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Lightbulb size={14} />
                <span>Macro Gap Recommendations</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveInsight('workouts')}
                className={`btn btn-sm ${activeInsight === 'workouts' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Activity size={14} />
                <span>Exercise & Activity Tracker</span>
              </button>
            </div>

            {/* Active Insight Panel */}
            <div className="animate-fade-in">
              {activeInsight === 'micros' && (
                <MicronutrientSection 
                  microStats={microStats}
                  dailyVitaminsCovered={dailyVitaminsCovered}
                  onToggleVitamin={onToggleVitamin}
                  onNavigateTab={onNavigateTab}
                  foodLibrary={foodLibrary}
                  onQuickAddFood={handleQuickAdd}
                />
              )}

              {activeInsight === 'cautions' && (
                <HealthCautionTracker 
                  mealLogs={mealLogs}
                  userGender={profile.gender || 'male'}
                  onQuickLogMeal={onAddMeal}
                />
              )}

              {activeInsight === 'gaps' && (
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
              )}

              {activeInsight === 'workouts' && (
                <ExerciseTracker 
                  workouts={workouts}
                  onAddWorkout={onAddWorkout}
                  onDeleteWorkout={onDeleteWorkout}
                  isNetMode={isNetMode}
                  onToggleNetMode={onToggleNetMode}
                  userWeight={profile.weight || 75}
                />
              )}
            </div>

          </div>
        )}
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
