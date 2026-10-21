import React, { useState } from 'react'
import { 
  Pill, 
  Sparkles, 
  CheckCircle, 
  Circle, 
  AlertTriangle, 
  Info, 
  Search, 
  ShieldCheck 
} from 'lucide-react'
import { MICRONUTRIENTS_DATA } from '../data/vitaminsMinerals'

export default function VitaminGuide({ dailyVitaminsCovered, onToggleVitamin, mealLogs = [] }) {
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = ['All', 'Vitamin', 'Mineral', 'Fatty Acid', 'Electrolyte']

  // Food intake calculation per micronutrient
  const foodIntakes = React.useMemo(() => {
    return MICRONUTRIENTS_DATA.reduce((acc, item) => {
      const sum = mealLogs.reduce((total, meal) => {
        return total + (parseFloat(meal.micros?.[item.id]) || 0)
      }, 0)
      acc[item.id] = Math.round(sum * 10) / 10
      return acc
    }, {})
  }, [mealLogs])

  const filteredData = MICRONUTRIENTS_DATA.filter((item) => {
    const matchesCat = selectedFilter === 'All' || item.category === selectedFilter
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sources.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.function.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  // Covered if manually checked OR food intake >= targetValue
  const isItemCovered = (item) => {
    return dailyVitaminsCovered.includes(item.id) || (foodIntakes[item.id] || 0) >= (item.targetValue || 1)
  }

  const coveredCount = MICRONUTRIENTS_DATA.filter(item => isItemCovered(item)).length
  const coveredPercent = Math.round((coveredCount / MICRONUTRIENTS_DATA.length) * 100)

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header & Coverage Tracker */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(18, 26, 41, 0.8) 100%)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-emerald">Micronutrient Science</span>
              <span className="badge badge-blue">RDA & Longevity Targets</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>
              Essential Vitamins & Minerals Guide
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '650px', marginTop: '4px' }}>
              Optimize your cellular metabolism, nervous system recovery, and hormone regulation. Check off micronutrients fulfilled through whole food nutrition or daily supplements.
            </p>
          </div>

          {/* Daily Micro Score Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            minWidth: '220px'
          }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              TODAY'S COVERAGE
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-purple)' }}>
                {coveredCount} / {MICRONUTRIENTS_DATA.length}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--primary-light)', fontWeight: '600' }}>
                {coveredPercent}%
              </span>
            </div>
            <div className="progress-container" style={{ marginTop: '8px', height: '6px' }}>
              <div className="progress-bar" style={{ width: `${coveredPercent}%`, background: 'var(--accent-purple)' }} />
            </div>
          </div>
        </div>

        {/* Filter Tabs & Search */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-color)'
        }}>
          {/* Categories */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`btn btn-sm ${selectedFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={15} aria-hidden="true" style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            <input 
              type="text"
              id="vitamin-search"
              name="vitaminSearch"
              autoComplete="off"
              aria-label="Search vitamin, food, or symptom"
              placeholder="Search vitamin, food, or symptom…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '36px', padding: '8px 12px 8px 36px', fontSize: '0.85rem' }}
            />
          </div>
        </div>
      </div>

      {/* Grid of Micronutrients */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '20px'
      }}>
        {filteredData.map((item) => {
          const isCovered = isItemCovered(item)
          const intake = foodIntakes[item.id] || 0
          const intakePct = Math.round((intake / (item.targetValue || 1)) * 100)
          const isFoodMet = intake >= (item.targetValue || 1)

          return (
            <div 
              key={item.id}
              className="glass-panel"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isCovered ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {isCovered && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, transparent 50%, rgba(16, 185, 129, 0.25) 50%)',
                  pointerEvents: 'none'
                }} />
              )}

              <div>
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="badge badge-purple">{item.category}</span>
                      <span className="badge badge-emerald">{item.tag}</span>
                      {isFoodMet && (
                        <span className="badge badge-blue" style={{ fontSize: '0.68rem' }}>
                          🍽️ Met from Food
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>{item.name}</h3>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={isCovered}
                    aria-label={`Mark ${item.name} as ${isCovered ? 'not covered' : 'covered today'}`}
                    onClick={() => onToggleVitamin(item.id)}
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
                      padding: 0
                    }}
                  >
                    {isCovered ? (
                      <CheckCircle size={24} color="var(--primary-light)" aria-hidden="true" />
                    ) : (
                      <Circle size={24} color="var(--text-dim)" aria-hidden="true" />
                    )}
                  </button>
                </div>

                {/* RDA & Target */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '10px',
                  fontSize: '0.82rem'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Daily RDA: </span>
                    <strong style={{ color: '#fff' }}>{item.rda}</strong>
                  </div>
                  <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '12px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Optimal: </span>
                    <strong style={{ color: 'var(--primary-light)' }}>{item.optimalTarget}</strong>
                  </div>
                </div>

                {/* Real-time food intake bar */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 12px',
                  marginBottom: '14px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Logged Food Intake Today:</span>
                    <strong style={{ color: isFoodMet ? 'var(--primary-light)' : '#fff' }}>
                      {intake} / {item.targetValue} {item.unit} ({intakePct}%)
                    </strong>
                  </div>
                  <div className="progress-container" style={{ height: '5px' }}>
                    <div 
                      className="progress-bar" 
                      style={{ 
                        width: `${Math.min(100, intakePct)}%`,
                        background: isFoodMet ? 'var(--primary-light)' : (item.color || 'var(--accent-purple)')
                      }} 
                    />
                  </div>
                </div>

                {/* Biological Function */}
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.45 }}>
                  {item.function}
                </p>

                {/* Food Sources */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Rich Whole Food Sources
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {item.sources.map((source, idx) => (
                      <span 
                        key={idx}
                        style={{
                          fontSize: '0.78rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-color)',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          color: '#e2e8f0'
                        }}
                      >
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Deficiency & Alert */}
              <div style={{
                background: 'rgba(244, 63, 94, 0.06)',
                border: '1px solid rgba(244, 63, 94, 0.18)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                fontSize: '0.78rem',
                marginTop: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-red)', fontWeight: '600' }}>
                  <AlertTriangle size={13} />
                  <span>Deficiency Signs & Tip</span>
                </div>
                <div style={{ color: 'var(--text-muted)' }}>
                  {item.deficiencyRisk}
                </div>
                {item.dietaryAlert && (
                  <div style={{ color: 'var(--accent-yellow)', fontSize: '0.74rem', marginTop: '2px' }}>
                    💡 {item.dietaryAlert}
                  </div>
                )}
              </div>

            </div>
          )
        })}
      </div>

    </div>
  )
}
