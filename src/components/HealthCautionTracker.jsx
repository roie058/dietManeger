import React, { useState, useMemo } from 'react'
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Heart, 
  Moon, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Zap
} from 'lucide-react'
import { computeCautionTotals } from '../utils/calculators'

export default function HealthCautionTracker({ 
  mealLogs = [], 
  userGender = 'male',
  onQuickLogMeal
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeNutrientModal, setActiveNutrientModal] = useState(null)

  // Compute daily caution totals and health habit metrics
  const cautionData = useMemo(() => {
    return computeCautionTotals(mealLogs, userGender)
  }, [mealLogs, userGender])

  const {
    totals,
    items,
    totalPotassium,
    naKRatio,
    lateNightMeals,
    lateNightCalories,
    habitScore
  } = cautionData

  // Summary counts
  const exceededCount = items.filter(i => i.status === 'exceeded').length
  const cautionCount = items.filter(i => i.status === 'caution').length
  const isLateNightIssue = lateNightCalories > 350

  // Status color for overall habit score
  const getScoreTheme = (score) => {
    if (score >= 85) return { color: '#10b981', badge: 'badge-emerald', label: 'Optimal Heart Shield', bg: 'rgba(16, 185, 129, 0.1)' }
    if (score >= 65) return { color: '#f59e0b', badge: 'badge-amber', label: 'Moderate Caution', bg: 'rgba(245, 158, 11, 0.1)' }
    return { color: '#f43f5e', badge: 'badge-rose', label: 'High Cardiovascular Caution', bg: 'rgba(244, 63, 94, 0.12)' }
  }

  const scoreTheme = getScoreTheme(habitScore)

  return (
    <div 
      className="glass-panel" 
      style={{
        padding: '22px 26px',
        border: exceededCount > 0 
          ? '1px solid rgba(244, 63, 94, 0.35)' 
          : '1px solid var(--border-color)',
        background: exceededCount > 0
          ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.05) 0%, rgba(18, 26, 41, 0.85) 100%)'
          : 'linear-gradient(135deg, rgba(16, 185, 129, 0.04) 0%, rgba(18, 26, 41, 0.75) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle background glow */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        background: exceededCount > 0 ? 'rgba(244, 63, 94, 0.08)' : 'rgba(16, 185, 129, 0.08)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />

      {/* Header Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: exceededCount > 0 
              ? 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)' 
              : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: exceededCount > 0 
              ? '0 4px 14px rgba(244, 63, 94, 0.4)' 
              : '0 4px 14px rgba(16, 185, 129, 0.35)',
            color: '#ffffff',
            flexShrink: 0
          }}>
            {exceededCount > 0 ? <ShieldAlert size={22} /> : <ShieldCheck size={22} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.22rem', fontWeight: '800', margin: 0 }}>
                Unhealthy Habits & Caution Watcher
              </h3>
              <span className={`badge ${scoreTheme.badge}`} style={{ fontSize: '0.74rem' }}>
                {scoreTheme.label}
              </span>
              {exceededCount > 0 && (
                <span className="badge badge-rose" style={{ fontSize: '0.74rem', animation: 'pulse 2s infinite' }}>
                  ⚠️ {exceededCount} {exceededCount === 1 ? 'Limit' : 'Limits'} Exceeded
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '3px 0 0 0' }}>
              Tracking Trans Fat, Cholesterol, Sodium/Salt, Saturated Fat, Added Sugars & Circadian Eating
            </p>
          </div>
        </div>

        {/* Habit Safety Score & Collapse Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            textAlign: 'right',
            padding: '6px 14px',
            background: scoreTheme.bg,
            borderRadius: '12px',
            border: `1px solid ${scoreTheme.color}33`
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Habit Safety Score
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: scoreTheme.color, lineHeight: '1.1' }}>
              {habitScore}<span style={{ fontSize: '0.85rem' }}>/100</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-secondary btn-sm"
            style={{
              padding: '8px 12px',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{isExpanded ? 'Simple View' : 'In-Depth Science'}</span>
            {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {/* Main Grid: 5 Caution Nutrients Meters */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px',
        marginBottom: '20px'
      }}>
        {items.map((item) => {
          const isExceeded = item.status === 'exceeded'
          const isCaution = item.status === 'caution'

          // Meter bar fill color
          let barColor = '#10b981'
          let statusText = 'Safe Level'
          let statusBadgeClass = 'badge-emerald'

          if (isExceeded) {
            barColor = '#f43f5e'
            statusText = 'Over Limit!'
            statusBadgeClass = 'badge-rose'
          } else if (isCaution) {
            barColor = '#f59e0b'
            statusText = 'Approaching'
            statusBadgeClass = 'badge-amber'
          }

          const fillWidth = Math.min(100, item.percent)

          return (
            <div
              key={item.key}
              style={{
                background: 'rgba(255, 255, 255, 0.025)',
                border: isExceeded 
                  ? '1px solid rgba(244, 63, 94, 0.4)' 
                  : '1px solid var(--border-color)',
                borderRadius: '14px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onClick={() => setActiveNutrientModal(item)}
              title="Click to view health notes & food sources"
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.92rem' }}>
                      {item.shortLabel}
                    </span>
                    <Info size={13} color="var(--text-muted)" />
                  </div>
                  <span className={`badge ${statusBadgeClass}`} style={{ fontSize: '0.66rem', padding: '1px 6px' }}>
                    {statusText}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.35rem', fontWeight: '800', color: isExceeded ? '#f43f5e' : '#ffffff' }}>
                    {item.value}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    / max {item.effectiveLimit} {item.unit}
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.76rem', fontWeight: '600', color: barColor }}>
                    {item.percent}%
                  </span>
                </div>

                {/* Visual Progress Bar */}
                <div style={{
                  height: '7px',
                  background: 'rgba(255, 255, 255, 0.07)',
                  borderRadius: '999px',
                  overflow: 'hidden',
                  marginBottom: '10px'
                }}>
                  <div style={{
                    width: `${fillWidth}%`,
                    height: '100%',
                    background: barColor,
                    borderRadius: '999px',
                    transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isExceeded ? '0 0 10px rgba(244, 63, 94, 0.7)' : 'none'
                  }} />
                </div>
              </div>

              {/* Top Contributor or Safe State */}
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {item.topContributor ? (
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Main source: <strong>{item.topContributor.name}</strong> ({item.topContributor.amount}{item.unit})
                  </span>
                ) : (
                  <span style={{ color: 'var(--primary-light)' }}>
                    ✓ 0 {item.unit} logged today
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Two Biometric Habit Pillars: Sodium/Potassium Balance + Late Night Circadian Alert */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '16px',
        marginBottom: isExpanded ? '20px' : '0'
      }}>
        {/* Cardiovascular Balance: Sodium-to-Potassium Ratio */}
        <div style={{
          background: 'rgba(56, 189, 248, 0.04)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: '14px',
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Heart size={18} color="#38bdf8" />
                <span style={{ fontWeight: '700', fontSize: '0.92rem' }}>
                  Sodium-to-Potassium Heart Ratio
                </span>
              </div>
              <span className={`badge ${!naKRatio || naKRatio <= 1.0 ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.68rem' }}>
                {!naKRatio ? 'No Data' : naKRatio <= 1.0 ? 'Optimal Heart Balance' : 'High Sodium Ratio'}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Clinical target is <strong>Na:K &le; 1.0</strong>. Adequate potassium cancels out sodium's vasoconstrictive effect on arteries.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)', padding: '10px 14px', borderRadius: '10px' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sodium vs Potassium Intake</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>
                🧂 {totals.sodium} mg <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>vs</span> 🍌 {totalPotassium} mg
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Current Ratio</div>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: '800',
                color: !naKRatio || naKRatio <= 1.0 ? '#10b981' : '#f59e0b'
              }}>
                {naKRatio ? `${naKRatio}:1` : '—'}
              </div>
            </div>
          </div>
        </div>

        {/* Circadian Digestion: Late-Night Eating */}
        <div style={{
          background: isLateNightIssue ? 'rgba(244, 63, 94, 0.05)' : 'rgba(168, 85, 247, 0.04)',
          border: isLateNightIssue ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid rgba(168, 85, 247, 0.2)',
          borderRadius: '14px',
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Moon size={18} color={isLateNightIssue ? '#f43f5e' : '#c084fc'} />
                <span style={{ fontWeight: '700', fontSize: '0.92rem' }}>
                  Circadian Digestive Window
                </span>
              </div>
              <span className={`badge ${isLateNightIssue ? 'badge-rose' : 'badge-emerald'}`} style={{ fontSize: '0.68rem' }}>
                {isLateNightIssue ? 'Late Heavy Meal' : 'Circadian Aligned'}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Eating &gt;350 kcal after 9:00 PM impairs sleep architecture, nocturnal HRV, and fasting insulin levels.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)', padding: '10px 14px', borderRadius: '10px' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Late Night Calories (&gt; 21:00)</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: isLateNightIssue ? '#f43f5e' : '#ffffff' }}>
                {lateNightCalories} kcal ({lateNightMeals.length} {lateNightMeals.length === 1 ? 'meal' : 'meals'})
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Status</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: isLateNightIssue ? '#f43f5e' : '#10b981' }}>
                {isLateNightIssue ? 'Attention Needed' : 'Restful Night ✅'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Science Guide & Actionable Countermeasures */}
      {isExpanded && (
        <div className="animate-fade-in" style={{
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <h4 style={{ fontSize: '0.96rem', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={16} color="var(--primary-light)" />
            <span>Clinical Countermeasures & Health Swaps</span>
          </h4>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '14px'
          }}>
            {items.map((item) => (
              <div 
                key={item.key}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '0.86rem', color: item.accentColor }}>{item.title}</strong>
                  <span className={`badge ${item.badgeColor}`} style={{ fontSize: '0.64rem' }}>
                    Limit: {item.effectiveLimit} {item.unit}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.45', marginBottom: '8px' }}>
                  {item.whyCare}
                </p>
                <div style={{
                  fontSize: '0.74rem',
                  background: 'rgba(16, 185, 129, 0.06)',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(16, 185, 129, 0.15)',
                  color: 'var(--text-light)'
                }}>
                  💡 <strong>Action:</strong> {item.counterMeasure}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal for Selected Caution Nutrient */}
      {activeNutrientModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div className="glass-panel animate-scale-up" style={{
            maxWidth: '480px',
            width: '100%',
            padding: '24px',
            background: 'var(--bg-secondary)',
            border: `1px solid ${activeNutrientModal.accentColor}55`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: `${activeNutrientModal.accentColor}22`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: activeNutrientModal.accentColor
                }}>
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0 }}>
                    {activeNutrientModal.title}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Category: {activeNutrientModal.category}
                  </span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setActiveNutrientModal(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.4rem' }}
              >
                &times;
              </button>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              marginBottom: '16px'
            }}>
              <div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Today's Total</div>
                <div style={{ fontSize: '1.3rem', fontWeight: '800' }}>
                  {activeNutrientModal.value} {activeNutrientModal.unit}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Recommended Upper Limit</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: activeNutrientModal.accentColor }}>
                  &le; {activeNutrientModal.effectiveLimit} {activeNutrientModal.unit} / day
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong style={{ fontSize: '0.84rem', color: '#ffffff' }}>Why keep this low?</strong>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5', marginTop: '4px' }}>
                {activeNutrientModal.whyCare}
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong style={{ fontSize: '0.84rem', color: '#ffffff' }}>Common Hidden Sources:</strong>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5', marginTop: '4px' }}>
                {activeNutrientModal.sources}
              </p>
            </div>

            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              padding: '12px 14px',
              borderRadius: '12px',
              marginBottom: '20px'
            }}>
              <strong style={{ fontSize: '0.82rem', color: 'var(--primary-light)' }}>Clinical Habit Countermeasure:</strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: '1.45', margin: '4px 0 0 0' }}>
                {activeNutrientModal.counterMeasure}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveNutrientModal(null)}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
