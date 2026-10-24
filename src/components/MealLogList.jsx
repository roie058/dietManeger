import React, { useState } from 'react'
import { 
  Utensils, 
  Barcode, 
  Plus, 
  Trash2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react'
import { MICRONUTRIENTS_DATA } from '../data/vitaminsMinerals'

export default function MealLogList({
  mealLogs = [],
  onOpenScanModal,
  onOpenCustomModal,
  onDeleteMeal
}) {
  const [expandedMealIds, setExpandedMealIds] = useState({})

  const toggleMealExpanded = (id) => {
    setExpandedMealIds(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Utensils size={18} color="var(--primary-light)" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Today's Food Log</h3>
          <span className="badge badge-emerald">{mealLogs.length} logged</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {onOpenScanModal && (
            <button 
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onOpenScanModal}
            >
              <Barcode size={14} color="var(--accent-blue)" />
              <span>Scan Barcode / Label</span>
            </button>
          )}
          {onOpenCustomModal && (
            <button 
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onOpenCustomModal}
            >
              <Plus size={15} /> Log Custom Food
            </button>
          )}
        </div>
      </div>

      {mealLogs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <p>No meals recorded today yet.</p>
          <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Select an item from the Quick Library or log custom macros and vitamins!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mealLogs.map((meal) => {
            const isExpanded = !!expandedMealIds[meal.id]
            const mealMicros = meal.micros || {}
            const microEntries = Object.entries(mealMicros).filter(([_, val]) => Number(val) > 0)

            return (
              <div 
                key={meal.id}
                style={{
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  transition: 'var(--transition)',
                  overflow: 'hidden'
                }}
              >
                {/* Top Row: Basic Info */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: '1 1 200px', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="badge badge-blue">{meal.mealType}</span>
                      <strong style={{ fontSize: '0.95rem', wordBreak: 'break-word' }}>{meal.name}</strong>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {meal.serving} • {meal.time}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, marginLeft: 'auto' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--primary-light)' }}>
                        {meal.calories} kcal
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                        P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                      </div>
                    </div>

                    {/* Micronutrients expand toggle */}
                    {microEntries.length > 0 && (
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        aria-controls={`meal-micros-${meal.id}`}
                        aria-label={`Toggle vitamin and mineral breakdown for ${meal.name}`}
                        onClick={() => toggleMealExpanded(meal.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ 
                          padding: '6px 10px', 
                          minHeight: '44px',
                          fontSize: '0.75rem', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '4px' 
                        }}
                      >
                        <Sparkles size={13} color="var(--accent-purple)" aria-hidden="true" />
                        <span>Micros</span>
                        {isExpanded ? <ChevronUp size={12} aria-hidden="true" /> : <ChevronDown size={12} aria-hidden="true" />}
                      </button>
                    )}

                    <button 
                      type="button"
                      onClick={() => onDeleteMeal(meal.id)}
                      className="btn-ghost"
                      style={{
                        minWidth: '44px',
                        minHeight: '44px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-dim)'
                      }}
                      aria-label={`Delete meal entry for ${meal.name}`}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Expandable Micronutrient Breakdown */}
                {isExpanded && microEntries.length > 0 && (
                  <div 
                    id={`meal-micros-${meal.id}`}
                    style={{
                      padding: '10px 14px 14px 14px',
                      background: 'rgba(0, 0, 0, 0.25)',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                      Vitamins & Minerals in this meal:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {microEntries.map(([microId, val]) => {
                        const meta = MICRONUTRIENTS_DATA.find(m => m.id === microId)
                        if (!meta) return null
                        const pctOfRda = Math.round((Number(val) / meta.targetValue) * 100)
                        const isHigh = pctOfRda >= 25

                        return (
                          <span 
                            key={microId} 
                            className={`micro-pill ${isHigh ? 'highlight' : ''}`}
                            title={`${meta.name}: ${val} ${meta.unit} (${pctOfRda}% of daily RDA)`}
                          >
                            <strong>{meta.shortName}:</strong> {val} {meta.unit}
                            {isHigh && <span style={{ fontSize: '0.68rem', color: 'var(--primary-light)' }}>({pctOfRda}% RDA)</span>}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
