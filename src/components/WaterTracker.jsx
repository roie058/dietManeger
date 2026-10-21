import React, { useState } from 'react'
import { 
  Droplets, 
  Plus, 
  RotateCcw, 
  Sparkles, 
  CheckCircle, 
  GlassWater, 
  Coffee, 
  Award 
} from 'lucide-react'

export default function WaterTracker({ currentWater, waterGoal, onUpdateWater }) {
  const [customAmount, setCustomAmount] = useState('')

  const percent = Math.min(100, Math.round((currentWater / waterGoal) * 100))
  const remaining = Math.max(0, waterGoal - currentWater)

  const handleAddWater = (amount) => {
    onUpdateWater(Math.max(0, currentWater + amount))
  }

  const handleReset = () => {
    onUpdateWater(0)
  }

  const handleCustomAdd = (e) => {
    e.preventDefault()
    const amt = parseInt(customAmount, 10)
    if (!isNaN(amt) && amt > 0) {
      handleAddWater(amt)
      setCustomAmount('')
    }
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Hydration Hero Card */}
      <div className="glass-panel" style={{
        padding: '28px',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(18, 26, 41, 0.85) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.25)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-blue">Optimal Cellular Hydration</span>
              <span className="badge badge-emerald">Daily Goal: <span className="tabular-nums">{(waterGoal / 1000).toFixed(1)}L</span></span>
            </div>
            
            <h2 className="tabular-nums" style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '4px' }}>
              {currentWater} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: '400' }}>/ {waterGoal} ml</span>
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '16px' }}>
              {remaining > 0 ? (
                <span>Only <strong className="tabular-nums" style={{ color: 'var(--accent-blue)' }}>{remaining} ml</strong> left to hit peak performance!</span>
              ) : (
                <span style={{ color: 'var(--primary-light)', fontWeight: '700' }}>
                  🎉 Awesome job! You’ve satisfied your daily hydration quota!
                </span>
              )}
            </p>

            {/* Progress bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Hydration Level</span>
                <span className="tabular-nums" style={{ fontWeight: '700', color: 'var(--accent-blue)' }}>{percent}%</span>
              </div>
              <div className="progress-container" style={{ height: '12px' }}>
                <div 
                  className="progress-bar" 
                  style={{ 
                    width: `${percent}%`, 
                    background: 'linear-gradient(90deg, #06b6d4 0%, #38bdf8 100%)' 
                  }} 
                />
              </div>
            </div>
          </div>

          {/* Quick Intake Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Log Glass / Bottle
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <button 
                type="button"
                onClick={() => handleAddWater(250)}
                className="btn btn-secondary"
                aria-label="Add 250 ml standard glass of water"
                style={{ padding: '14px', flexDirection: 'column', gap: '4px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={16} color="var(--accent-blue)" aria-hidden="true" />
                  <span className="tabular-nums" style={{ fontWeight: '700', fontSize: '1.05rem' }}>250 ml</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Standard Glass</span>
              </button>

              <button 
                type="button"
                onClick={() => handleAddWater(500)}
                className="btn btn-secondary"
                aria-label="Add 500 ml water bottle"
                style={{ padding: '14px', flexDirection: 'column', gap: '4px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={16} color="var(--accent-blue)" aria-hidden="true" />
                  <span className="tabular-nums" style={{ fontWeight: '700', fontSize: '1.05rem' }}>500 ml</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Water Bottle</span>
              </button>

              <button 
                type="button"
                onClick={() => handleAddWater(750)}
                className="btn btn-secondary"
                aria-label="Add 750 ml sports shaker of water"
                style={{ padding: '14px', flexDirection: 'column', gap: '4px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={16} color="var(--accent-blue)" aria-hidden="true" />
                  <span className="tabular-nums" style={{ fontWeight: '700', fontSize: '1.05rem' }}>750 ml</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Sports Shaker</span>
              </button>

              <button 
                type="button"
                onClick={() => handleAddWater(1000)}
                className="btn btn-secondary"
                aria-label="Add 1000 ml 1 liter jug of water"
                style={{ padding: '14px', flexDirection: 'column', gap: '4px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={16} color="var(--accent-blue)" aria-hidden="true" />
                  <span className="tabular-nums" style={{ fontWeight: '700', fontSize: '1.05rem' }}>1000 ml</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>1 Liter Jug</span>
              </button>
            </div>

            {/* Custom Input & Reset */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px', alignItems: 'center' }}>
              <form onSubmit={handleCustomAdd} style={{ display: 'flex', gap: '8px', flex: 1 }}>
                <input 
                  type="number"
                  id="water-custom-ml"
                  name="customWaterMl"
                  inputMode="numeric"
                  autoComplete="off"
                  aria-label="Custom milliliters of water"
                  placeholder="Custom ml (e.g. 350)…"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="input-field"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                />
                <button type="submit" className="btn btn-primary btn-sm" aria-label="Add custom water amount">Add</button>
              </form>

              <button 
                type="button"
                onClick={handleReset} 
                className="btn btn-ghost"
                aria-label="Reset water intake to 0 ml"
                style={{ 
                  minWidth: '44px',
                  minHeight: '44px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-dim)'
                }}
              >
                <RotateCcw size={16} aria-hidden="true" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Hydration Science & Habit Tips */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Droplets size={18} color="var(--accent-blue)" />
            <h4 style={{ fontWeight: '700', fontSize: '1rem' }}>Morning Kickstarter (500ml)</h4>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            After 7-8 hours of sleep, your body is in mild dehydration. Drinking 500ml upon waking boosts metabolic rate by ~24% for the next 90 minutes and clears digestive toxins.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Sparkles size={18} color="var(--accent-yellow)" />
            <h4 style={{ fontWeight: '700', fontSize: '1rem' }}>Electrolyte Synergy</h4>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Drinking pure water without minerals can dilute sodium/potassium. Add a pinch of Himalayan pink salt or lemon juice during intense workouts or warm weather for rapid cellular hydration.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Award size={18} color="var(--primary-light)" />
            <h4 style={{ fontWeight: '700', fontSize: '1rem' }}>Appetite & Fat Loss</h4>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Thirst signals are frequently misinterpreted by the brain as hunger cravings. Having a glass of water 20 minutes before meals naturally reduces caloric overconsumption.
          </p>
        </div>
      </div>

    </div>
  )
}
