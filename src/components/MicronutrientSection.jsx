import React, { useState, useMemo } from 'react'
import { 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Pill, 
  AlertCircle, 
  Plus 
} from 'lucide-react'
import { MICRONUTRIENTS_DATA } from '../data/vitaminsMinerals'

export default function MicronutrientSection({
  microStats = [],
  dailyVitaminsCovered = [],
  onToggleVitamin,
  onNavigateTab,
  foodLibrary = [],
  onQuickAddFood
}) {
  const [microCategoryFilter, setMicroCategoryFilter] = useState('All')

  // Summary counts
  const totalMicrosCount = microStats.length
  const foodMetCount = microStats.filter(m => m.isMet).length
  const supplementedCount = microStats.filter(m => m.isSupplemented).length
  const totalCoveredCount = microStats.filter(m => m.isCovered).length
  const uncheckFoodMetMicros = microStats.filter(m => m.isMet && !m.isSupplemented)

  // Deficient nutrients for recommendation (< 50% target)
  const lowMicros = microStats.filter(m => !m.isCovered && m.percent < 50)

  // Smart food recommendation based on lowest nutrients
  const recommendedFoods = useMemo(() => {
    if (lowMicros.length === 0) return []
    const lowIds = lowMicros.map(m => m.id)
    return foodLibrary.filter(food => {
      if (!food.micros) return false
      return lowIds.some(id => {
        const val = food.micros[id] || 0
        const microMeta = MICRONUTRIENTS_DATA.find(m => m.id === id)
        return microMeta && (val / microMeta.targetValue) >= 0.25
      })
    }).slice(0, 3)
  }, [lowMicros, foodLibrary])

  // Filtered Micronutrients by Category
  const filteredMicros = microStats.filter(micro => {
    if (microCategoryFilter === 'All') return true
    if (microCategoryFilter === 'Vitamins') return micro.category === 'Vitamin'
    if (microCategoryFilter === 'Minerals') return micro.category === 'Mineral'
    if (microCategoryFilter === 'Electrolytes') return micro.category === 'Electrolyte'
    if (microCategoryFilter === 'Fatty Acids') return micro.category === 'Fatty Acid'
    return true
  })

  return (
    <div className="glass-panel" style={{
      padding: '24px 28px',
      background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.06) 0%, rgba(18, 26, 41, 0.9) 100%)',
      border: '1px solid rgba(168, 85, 247, 0.2)'
    }}>
      {/* Header & Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span className="badge badge-purple">
              <Sparkles size={13} /> Micronutrient Science
            </span>
            <span className="badge badge-emerald">
              <ShieldCheck size={13} /> Daily RDA Tracking
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Daily Vitamins & Minerals Intake
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '680px', marginTop: '4px' }}>
            Track real-time micronutrient totals fulfilled by your logged foods and meals against clinical Recommended Dietary Allowances (RDA).
          </p>
        </div>

        {/* Micronutrient Score Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          minWidth: '280px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              DAILY MICRONUTRIENT COVERAGE
            </span>
            <span className={`badge ${totalCoveredCount >= 8 ? 'badge-emerald' : totalCoveredCount >= 5 ? 'badge-blue' : 'badge-amber'}`}>
              {totalCoveredCount >= 8 ? 'Optimal Coverage' : `${totalCoveredCount} of ${totalMicrosCount} Met`}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>
              {totalCoveredCount} / {totalMicrosCount}
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '500' }}>
              ({foodMetCount} food, {supplementedCount} supps)
            </span>
          </div>
          <div className="progress-container" style={{ marginTop: '8px', height: '6px' }}>
            <div 
              className="progress-bar" 
              style={{ 
                width: `${Math.round((totalCoveredCount / totalMicrosCount) * 100)}%`, 
                background: totalCoveredCount >= 8 
                  ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)' 
                  : 'linear-gradient(90deg, #a855f7 0%, #38bdf8 100%)' 
              }} 
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            {uncheckFoodMetMicros.length > 0 && onToggleVitamin && (
              <button
                type="button"
                onClick={() => uncheckFoodMetMicros.forEach(m => onToggleVitamin(m.id))}
                className="btn btn-sm btn-secondary"
                style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                title="Mark all 100% food-met nutrients in your supplement checklist"
              >
                ⚡ Auto-check {uncheckFoodMetMicros.length} food-met
              </button>
            )}
            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('vitamins')}
                className="btn-ghost"
                style={{ fontSize: '0.74rem', color: 'var(--primary-light)', padding: '2px 6px' }}
              >
                Clinical Guide & Sources →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Category Pills */}
      <div style={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border-color)'
      }}>
        {['All', 'Vitamins', 'Minerals', 'Electrolytes', 'Fatty Acids'].map(category => (
          <button
            key={category}
            onClick={() => setMicroCategoryFilter(category)}
            className={`btn btn-sm ${microCategoryFilter === category ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.8rem', padding: '5px 12px' }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Micronutrients Progress Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
        gap: '14px'
      }}>
        {filteredMicros.map(micro => {
          const isMet = micro.isMet
          const isCovered = micro.isCovered
          const displayPercent = Math.min(200, micro.percent)

          return (
            <div
              key={micro.id}
              style={{
                background: isCovered ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                border: isCovered ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '8px',
                transition: 'var(--transition)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        background: micro.color || 'var(--primary)' 
                      }} />
                      <span style={{ fontSize: '0.92rem', fontWeight: '700', color: '#fff' }}>
                        {micro.shortName}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginLeft: '14px' }}>
                      {micro.category}
                    </span>
                  </div>

                  {isMet && micro.isSupplemented ? (
                    <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                      <Check size={11} /> Food + Supp
                    </span>
                  ) : isMet ? (
                    <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                      <Check size={11} /> {micro.percent}% Food
                    </span>
                  ) : micro.isSupplemented ? (
                    <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>
                      <Pill size={11} /> Supp ({micro.percent}%)
                    </span>
                  ) : micro.percent >= 60 ? (
                    <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>
                      {micro.percent}% Food
                    </span>
                  ) : (
                    <span className="badge badge-rose" style={{ fontSize: '0.68rem' }}>
                      {micro.percent}% Food
                    </span>
                  )}
                </div>

                {/* Amount / RDA */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '8px 0 6px 0' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: '800', color: isMet ? 'var(--primary-light)' : '#fff' }}>
                    {micro.current}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    / {micro.target} {micro.unit} RDA
                  </span>
                </div>

                {/* Progress bar */}
                <div className="progress-container" style={{ height: '6px', marginBottom: '8px' }}>
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${Math.min(100, displayPercent)}%`, 
                      background: isMet ? 'var(--primary-light)' : (micro.color || 'var(--accent-purple)')
                    }} 
                  />
                </div>

                {/* Supplement Toggle */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => onToggleVitamin && onToggleVitamin(micro.id)}
                    style={{
                      fontSize: '0.72rem',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: micro.isSupplemented ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                      background: micro.isSupplemented ? 'rgba(168, 85, 247, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                      color: micro.isSupplemented ? '#d8b4fe' : 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Pill size={11} />
                    {micro.isSupplemented ? 'Supplement Taken ✓' : '+ Supplement'}
                  </button>
                  <span style={{ fontSize: '0.72rem', color: isMet ? 'var(--primary-light)' : 'var(--text-dim)' }}>
                    {isMet ? 'Target Satisfied' : `${Math.max(0, Math.round((micro.target - micro.current) * 10) / 10)} ${micro.unit} to goal`}
                  </span>
                </div>
              </div>

              {/* Subtitle / Contributor info */}
              <div style={{ 
                fontSize: '0.74rem', 
                color: 'var(--text-muted)', 
                borderTop: '1px solid rgba(255, 255, 255, 0.05)', 
                paddingTop: '6px', 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                {micro.topContributor ? (
                  <span title={`Main source: ${micro.topContributor.name} (+${micro.topContributor.amount} ${micro.unit})`}>
                    Top: <strong style={{ color: '#cbd5e1' }}>{micro.topContributor.name.slice(0, 15)}…</strong>
                  </span>
                ) : (
                  <span style={{ color: 'var(--text-dim)' }}>No foods logged yet</span>
                )}
                <span style={{ color: micro.color || 'var(--text-dim)', fontWeight: '600' }}>
                  {micro.tag}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Dynamic Deficiency Alert & Smart Food Recommendation */}
      {lowMicros.length > 0 && (
        <div style={{
          marginTop: '20px',
          padding: '16px 20px',
          background: 'rgba(244, 63, 94, 0.06)',
          border: '1px solid rgba(244, 63, 94, 0.25)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-red)', fontWeight: '700', fontSize: '0.9rem' }}>
            <AlertCircle size={17} />
            <span>Micronutrient Attention Needed Today</span>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
            You are currently under 50% RDA for: {' '}
            <strong style={{ color: '#f8fafc' }}>
              {lowMicros.map(m => `${m.shortName} (${m.percent}%)`).join(', ')}
            </strong>.
            Add nutrient-dense whole foods to optimize your cellular recovery and energy.
          </p>

          {recommendedFoods.length > 0 && (
            <div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700', marginBottom: '8px' }}>
                Recommended Foods From Library to Bridge the Gap:
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {recommendedFoods.map(food => (
                  <button
                    key={food.id}
                    onClick={() => onQuickAddFood && onQuickAddFood(food)}
                    className="btn btn-secondary btn-sm"
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    title={`Quick log ${food.name}`}
                  >
                    <Plus size={13} color="var(--primary-light)" />
                    <span>{food.name}</span>
                    <span className="badge badge-emerald" style={{ padding: '1px 6px', fontSize: '0.68rem' }}>
                      {food.calories} cal
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
