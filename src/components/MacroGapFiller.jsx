import React, { useState, useMemo } from 'react'
import { 
  Sparkles, 
  Plus, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  Zap, 
  Utensils, 
  Award,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react'

export default function MacroGapFiller({
  targetCalories,
  targetProtein,
  targetCarbs,
  targetFat,
  currentCalories,
  currentProtein,
  currentCarbs,
  currentFat,
  foodLibrary = [],
  onLogMeal
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [targetMealSlot, setTargetMealSlot] = useState('Snack')
  const [portionMultipliers, setPortionMultipliers] = useState({}) // { [foodId]: 1 }

  const calRemaining = Math.max(0, targetCalories - Math.round(currentCalories))
  const proteinRemaining = Math.max(0, targetProtein - Math.round(currentProtein))
  const carbsRemaining = Math.max(0, targetCarbs - Math.round(currentCarbs))
  const fatRemaining = Math.max(0, targetFat - Math.round(currentFat))

  // Determine Primary Need
  const isGoalMet = calRemaining <= 60 && proteinRemaining <= 5
  const isProteinPriority = proteinRemaining >= 15
  const isLowCalorieZone = calRemaining <= 250 && calRemaining > 0

  // Calculate smart suggestions from food library
  const suggestions = useMemo(() => {
    if (isGoalMet || foodLibrary.length === 0) return []

    const scored = foodLibrary.map(food => {
      const c = Number(food.calories) || 1
      const p = Number(food.protein) || 0
      const cb = Number(food.carbs) || 0
      const f = Number(food.fat) || 0

      // Skip if single serving blows past remaining calories significantly
      if (calRemaining > 60 && c > calRemaining * 1.25) {
        return null
      }

      let score = 0
      let tag = 'Balanced'
      let tagColor = 'badge-blue'

      if (isProteinPriority) {
        // High protein density score
        const proteinRatio = (p * 4) / c
        score += proteinRatio * 45
        if (proteinRemaining > 0) {
          const proteinMatch = 1 - Math.abs(p - proteinRemaining) / (proteinRemaining || 1)
          score += Math.max(0, proteinMatch) * 35
        }
        if (p >= 20) {
          tag = 'High Protein Finisher'
          tagColor = 'badge-purple'
        } else {
          tag = 'Protein Boost'
          tagColor = 'badge-emerald'
        }
      } else if (isLowCalorieZone) {
        // Low calorie density score
        score += (1 / (c || 1)) * 1000
        if (p > 10) score += 30
        tag = 'Lean Light Finisher'
        tagColor = 'badge-amber'
      } else {
        // General balanced coverage
        const cMatch = 1 - Math.abs(c - calRemaining) / (calRemaining || 1)
        const pMatch = 1 - Math.abs(p - proteinRemaining) / (proteinRemaining || 1)
        score += Math.max(0, cMatch) * 40 + Math.max(0, pMatch) * 40
        tag = 'Nutrient Balanced'
        tagColor = 'badge-blue'
      }

      // Bonus if it provides good micronutrients
      if (food.keyMicros && food.keyMicros.length > 0) {
        score += food.keyMicros.length * 3
      }

      return {
        food,
        score,
        tag,
        tagColor,
        calories: c,
        protein: p,
        carbs: cb,
        fat: f
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

    return scored
  }, [foodLibrary, calRemaining, proteinRemaining, carbsRemaining, fatRemaining, isGoalMet, isProteinPriority, isLowCalorieZone])

  const handleQuickLog = (item, multiplier = 1) => {
    const p = Math.round(item.protein * multiplier * 10) / 10
    const cb = Math.round(item.carbs * multiplier * 10) / 10
    const f = Math.round(item.fat * multiplier * 10) / 10
    const cals = Math.round(item.calories * multiplier)

    // Calculate scaled micros if present
    const scaledMicros = {}
    if (item.food.micros) {
      Object.keys(item.food.micros).forEach(key => {
        scaledMicros[key] = Math.round((item.food.micros[key] || 0) * multiplier * 10) / 10
      })
    }

    const servingText = multiplier === 1 
      ? item.food.serving 
      : `${multiplier}x (${item.food.serving})`

    const newMeal = {
      id: 'm_suggest_' + Date.now(),
      mealType: targetMealSlot,
      name: item.food.name,
      serving: servingText,
      calories: cals,
      protein: p,
      carbs: cb,
      fat: f,
      micros: scaledMicros,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    onLogMeal(newMeal)
  }

  return (
    <div className="glass-panel" style={{
      padding: '20px 24px',
      background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.06) 0%, rgba(18, 26, 41, 0.85) 100%)',
      border: '1px solid rgba(56, 189, 248, 0.25)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: '0 6px 24px rgba(0, 0, 0, 0.2)'
    }}>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(56, 189, 248, 0.4)'
          }}>
            <Sparkles size={17} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>
                Smart Macro Gap Filler
              </h3>
              <span className="badge badge-blue">AI Suggestion</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {isGoalMet 
                ? 'Targets satisfied for today! Great adherence.'
                : `Need ${proteinRemaining}g protein, ${carbsRemaining}g carbs, ${fatRemaining}g fat (${calRemaining} kcal left)`
              }
            </p>
          </div>
        </div>

        {/* Target Meal Selector & Expand toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!isGoalMet && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Log into:</span>
              <select
                value={targetMealSlot}
                onChange={e => setTargetMealSlot(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '0.78rem',
                  padding: '4px 8px'
                }}
              >
                <option value="Snack">Snack</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Breakfast">Breakfast</option>
              </select>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn-ghost"
            style={{ padding: '6px', borderRadius: '6px' }}
            aria-label={isExpanded ? 'Collapse suggestions' : 'Expand suggestions'}
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Expanded Suggestions List */}
      {isExpanded && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          {isGoalMet ? (
            <div style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <CheckCircle2 size={24} color="var(--primary-light)" />
              <div>
                <strong style={{ color: '#fff', fontSize: '0.92rem' }}>Macro Goals Hit Successfully!</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '2px' }}>
                  You are within optimal target ranges for calories and macros today. Excellent job staying consistent!
                </p>
              </div>
            </div>
          ) : suggestions.length === 0 ? (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '12px' }}>
              No exact food matches for remaining balance. You can log custom food or select from the Food Database.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '14px'
            }}>
              {suggestions.map((item) => {
                const multiplier = portionMultipliers[item.food.id] || 1
                const displayP = Math.round(item.protein * multiplier * 10) / 10
                const displayC = Math.round(item.carbs * multiplier * 10) / 10
                const displayF = Math.round(item.fat * multiplier * 10) / 10
                const displayCal = Math.round(item.calories * multiplier)

                const proteinCoverage = proteinRemaining > 0 
                  ? Math.min(100, Math.round((displayP / proteinRemaining) * 100))
                  : 100

                return (
                  <div
                    key={item.food.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '10px',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div>
                      {/* Badge and Name */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <div>
                          <span className={`badge ${item.tagColor}`} style={{ fontSize: '0.68rem', marginBottom: '4px' }}>
                            {item.tag}
                          </span>
                          <h4 style={{ fontSize: '0.96rem', fontWeight: '700', color: '#fff' }}>
                            {item.food.name}
                          </h4>
                          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                            {item.food.serving}
                          </span>
                        </div>
                      </div>

                      {/* Macros delivered */}
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        marginTop: '6px'
                      }}>
                        <span style={{ color: '#fff', fontWeight: '700' }}>{displayCal} kcal</span>
                        <span style={{ color: 'var(--accent-purple)' }}>• {displayP}g P</span>
                        <span style={{ color: 'var(--accent-blue)' }}>• {displayC}g C</span>
                        <span style={{ color: 'var(--accent-yellow)' }}>• {displayF}g F</span>
                      </div>

                      {/* Why it fits tag */}
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '8px' }}>
                        💡 Fulfills <strong>{proteinCoverage}%</strong> of remaining protein goal
                      </div>
                    </div>

                    {/* Portion Buttons & 1-Click Log */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '8px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      gap: '6px'
                    }}>
                      {/* Portion Multiplier buttons */}
                      <div style={{ display: 'flex', gap: '3px' }}>
                        {[0.5, 1, 1.5].map(scale => (
                          <button
                            key={scale}
                            type="button"
                            onClick={() => setPortionMultipliers(prev => ({ ...prev, [item.food.id]: scale }))}
                            style={{
                              fontSize: '0.7rem',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              border: multiplier === scale ? '1px solid var(--primary-light)' : '1px solid rgba(255, 255, 255, 0.08)',
                              background: multiplier === scale ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                              color: multiplier === scale ? '#fff' : 'var(--text-dim)',
                              cursor: 'pointer'
                            }}
                          >
                            {scale}x
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleQuickLog(item, multiplier)}
                        className="btn btn-sm btn-primary"
                        style={{ fontSize: '0.76rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Plus size={13} />
                        Log This
                      </button>
                    </div>

                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
