import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Plus, X, Sparkles, ShieldAlert } from 'lucide-react'
import { MICRONUTRIENTS_DATA } from '../data/vitaminsMinerals'

export default function FoodPreviewModal({
  food,
  onClose,
  onLogFood
}) {
  useEffect(() => {
    if (!food) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow || 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [food, onClose])

  if (!food) return null

  return createPortal(
    <div 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-food-title"
      className="modal-backdrop"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="modal-card" 
        style={{ maxWidth: '540px' }}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <span className="badge badge-purple">{food.category}</span>
            <h3 id="preview-food-title" style={{ fontSize: '1.25rem', fontWeight: '800', marginTop: '4px', color: '#fff' }}>
              {food.name}
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Portion: {food.serving}
            </span>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close food details dialog"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Macros summary row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
            padding: '14px',
            background: '#0d1527',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>CALORIES</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary-light)' }}>{food.calories}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', fontWeight: '700' }}>PROTEIN</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>{food.protein}g</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--accent-yellow)', fontWeight: '700' }}>CARBS</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>{food.carbs}g</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--accent-red)', fontWeight: '700' }}>FAT</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>{food.fat}g</div>
            </div>
          </div>

          {/* Caution Nutrients Row */}
          {food.cautions && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              padding: '10px 14px',
              background: 'rgba(244, 63, 94, 0.05)',
              border: '1px solid rgba(244, 63, 94, 0.2)',
              borderRadius: 'var(--radius-md)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
                <ShieldAlert size={14} color="#f43f5e" />
                <span style={{ fontSize: '0.74rem', fontWeight: '700', color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Caution Markers Per Serving
                </span>
              </div>
              <span style={{ fontSize: '0.78rem', color: food.cautions.sodium > 600 ? '#f43f5e' : 'var(--text-muted)' }}>
                🧂 Sodium: <strong>{food.cautions.sodium ?? 0}mg</strong>
              </span>
              <span style={{ fontSize: '0.78rem', color: food.cautions.transFat > 0 ? '#f43f5e' : 'var(--text-muted)' }}>
                ⚠️ Trans Fat: <strong>{food.cautions.transFat ?? 0}g</strong>
              </span>
              <span style={{ fontSize: '0.78rem', color: food.cautions.cholesterol > 150 ? '#f59e0b' : 'var(--text-muted)' }}>
                🍳 Cholesterol: <strong>{food.cautions.cholesterol ?? 0}mg</strong>
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                🧈 Sat. Fat: <strong>{food.cautions.saturatedFat ?? 0}g</strong>
              </span>
              {parseFloat(food.cautions.addedSugar) > 0 && (
                <span style={{ fontSize: '0.78rem', color: '#ec4899' }}>
                  🍬 Added Sugar: <strong>{food.cautions.addedSugar}g</strong>
                </span>
              )}
            </div>
          )}

          {/* Full Micronutrients Table */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Sparkles size={16} color="var(--accent-purple)" />
              <h4 style={{ fontSize: '0.98rem', fontWeight: '700', color: '#fff' }}>Vitamins & Minerals Breakdown</h4>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {MICRONUTRIENTS_DATA.map(micro => {
                const val = food.micros?.[micro.id] || 0
                const pct = Math.round((val / micro.targetValue) * 100)

                return (
                  <div 
                    key={micro.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: val > 0 ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      border: val > 0 ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(255, 255, 255, 0.06)'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.88rem', fontWeight: '600', color: val > 0 ? '#fff' : 'var(--text-muted)' }}>
                        {micro.name}
                      </span>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                        RDA: {micro.rda}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.92rem', color: val > 0 ? 'var(--primary-light)' : 'var(--text-dim)' }}>
                        {val} {micro.unit}
                      </span>
                      {val > 0 && (
                        <span style={{ fontSize: '0.76rem', color: pct >= 25 ? 'var(--primary-light)' : 'var(--accent-blue)', marginLeft: '6px' }}>
                          ({pct}% RDA)
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button 
            type="button"
            onClick={onClose} 
            className="btn btn-secondary" 
            style={{ flex: 1 }}
          >
            Close
          </button>
          {onLogFood && (
            <button 
              type="button"
              onClick={() => {
                onLogFood(food)
                onClose()
              }} 
              className="btn btn-primary" 
              style={{ flex: 1.2 }}
            >
              <Plus size={16} /> Log This Food
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
