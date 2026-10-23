import React, { useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { 
  TrendingDown, 
  TrendingUp, 
  Calendar, 
  Scale, 
  Flame, 
  Zap, 
  Target
} from 'lucide-react'
import { formatDisplayDate, addDays, getTodayDateString } from '../utils/dateUtils'

export default function HistoricalAnalytics({ 
  dailyHistory = {}, 
  profile = {}, 
  selectedDate,
  onSelectDate,
  onUpdateWeightForDate,
  onSwitchToDayView
}) {
  const [timeRange, setTimeRange] = useState(14) // 7, 14, or 30 days
  const [weightInput, setWeightInput] = useState('')
  const [showWeightModal, setShowWeightModal] = useState(false)

  const todayStr = getTodayDateString()
  const targetCalories = profile.targetCalories || 2300
  const targetProtein = profile.targetProtein || 170
  const targetCarbs = profile.targetCarbs || 230
  const targetFat = profile.targetFat || 65
  const waterGoal = profile.waterGoal || 3200

  // Build sorted array of dates for the selected time range ending today
  const rangeData = useMemo(() => {
    const list = []
    for (let i = timeRange - 1; i >= 0; i--) {
      const dateKey = addDays(todayStr, -i)
      const dayRecord = dailyHistory[dateKey] || { mealLogs: [], water: 0, weight: null }
      
      const totalCals = dayRecord.mealLogs.reduce((sum, m) => sum + (Number(m.calories) || 0), 0)
      const totalProtein = Math.round(dayRecord.mealLogs.reduce((sum, m) => sum + (Number(m.protein) || 0), 0))
      const totalCarbs = Math.round(dayRecord.mealLogs.reduce((sum, m) => sum + (Number(m.carbs) || 0), 0))
      const totalFat = Math.round(dayRecord.mealLogs.reduce((sum, m) => sum + (Number(m.fat) || 0), 0))
      const water = dayRecord.water || 0
      const weight = dayRecord.weight ? parseFloat(dayRecord.weight) : null

      list.push({
        date: dateKey,
        displayDate: formatDisplayDate(dateKey),
        shortDate: new Date(dateKey + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weekday: new Date(dateKey + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'narrow' }),
        calories: totalCals,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat,
        water,
        weight,
        hasLogs: dayRecord.mealLogs.length > 0
      })
    }
    return list
  }, [dailyHistory, timeRange, todayStr])

  // Aggregate Averages
  const activeDays = rangeData.filter(d => d.hasLogs || d.calories > 0)
  const avgCalories = activeDays.length > 0 
    ? Math.round(activeDays.reduce((sum, d) => sum + d.calories, 0) / activeDays.length) 
    : 0
  const avgProtein = activeDays.length > 0 
    ? Math.round(activeDays.reduce((sum, d) => sum + d.protein, 0) / activeDays.length) 
    : 0
  const avgCarbs = activeDays.length > 0 
    ? Math.round(activeDays.reduce((sum, d) => sum + d.carbs, 0) / activeDays.length) 
    : 0
  const avgFat = activeDays.length > 0 
    ? Math.round(activeDays.reduce((sum, d) => sum + d.fat, 0) / activeDays.length) 
    : 0
  const avgWater = activeDays.length > 0 
    ? Math.round(activeDays.reduce((sum, d) => sum + d.water, 0) / activeDays.length) 
    : 0

  // Weight analytics
  const weightRecords = rangeData.filter(d => d.weight !== null)
  const firstWeight = weightRecords.length > 0 ? weightRecords[0].weight : (profile.weight || 76)
  const latestWeight = weightRecords.length > 0 ? weightRecords[weightRecords.length - 1].weight : (profile.weight || 76)
  const weightDiff = Math.round((latestWeight - firstWeight) * 10) / 10

  // Calorie deficit calculation: TDEE - consumed
  const tdee = profile.tdee || 2600
  const avgDeficit = tdee - avgCalories

  const handleSaveWeight = (e) => {
    e.preventDefault()
    const val = parseFloat(weightInput)
    if (!val || val <= 30 || val >= 300) return
    onUpdateWeightForDate(selectedDate || todayStr, val)
    setShowWeightModal(false)
    setWeightInput('')
  }

  // Max calories for scaling bar chart
  const maxCalInChart = Math.max(targetCalories * 1.25, ...rangeData.map(d => d.calories), 2500)

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header with Range Filter & Weight Logger */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, rgba(18, 26, 41, 0.8) 100%)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-blue">Historical Trends</span>
              <span className="badge badge-emerald">Analytics & Insights</span>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>
              Nutrition & Body Weight Progression
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
              Analyze your multi-day caloric consistency, macro splits, hydration adherence, and weight trendline over time.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Time range pills */}
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '3px'
            }}>
              {[7, 14, 30].map(days => (
                <button
                  key={days}
                  onClick={() => setTimeRange(days)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '7px',
                    border: 'none',
                    background: timeRange === days ? 'var(--primary)' : 'transparent',
                    color: timeRange === days ? '#fff' : 'var(--text-muted)',
                    fontWeight: '600',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  {days} Days
                </button>
              ))}
            </div>

            {/* Quick Weight Check-In Button */}
            <button
              onClick={() => {
                setWeightInput(latestWeight.toString())
                setShowWeightModal(true)
              }}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
            >
              <Scale size={15} color="var(--primary-light)" />
              <span>Log Weight ({latestWeight} kg)</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        {/* Average Calories */}
        <div className="glass-panel" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              AVG DAILY CALORIES
            </span>
            <Flame size={16} color="var(--accent-orange)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>
              {avgCalories}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              / {targetCalories} kcal
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', marginTop: '6px', color: avgCalories <= targetCalories ? 'var(--primary-light)' : 'var(--accent-yellow)' }}>
            {avgCalories <= targetCalories 
              ? `✓ On track (${targetCalories - avgCalories} kcal under budget)` 
              : `⚠️ ${avgCalories - targetCalories} kcal above target`}
          </div>
        </div>

        {/* Average Protein */}
        <div className="glass-panel" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              AVG PROTEIN INTAKE
            </span>
            <Zap size={16} color="var(--accent-purple)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-purple)' }}>
              {avgProtein}g
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              / {targetProtein}g
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', marginTop: '6px', color: avgProtein >= targetProtein ? 'var(--primary-light)' : 'var(--text-muted)' }}>
            {avgProtein >= targetProtein 
              ? `✓ Protein goal exceeded (+${avgProtein - targetProtein}g)` 
              : `${targetProtein - avgProtein}g below daily target`}
          </div>
        </div>

        {/* Net Deficit / Fat Loss Rate */}
        <div className="glass-panel" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              ESTIMATED DEFICIT
            </span>
            <Target size={16} color="var(--primary-light)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: '800', color: avgDeficit > 0 ? 'var(--primary-light)' : 'var(--accent-red)' }}>
              {avgDeficit > 0 ? `-${avgDeficit}` : `+${Math.abs(avgDeficit)}`}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              kcal / day
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', marginTop: '6px', color: 'var(--text-muted)' }}>
            ~{Math.abs(Math.round((avgDeficit * 7 / 7700) * 10) / 10)} kg fat change / week
          </div>
        </div>

        {/* Weight Trend */}
        <div className="glass-panel" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {timeRange}-DAY WEIGHT TREND
            </span>
            {weightDiff <= 0 ? <TrendingDown size={16} color="var(--primary-light)" /> : <TrendingUp size={16} color="var(--accent-orange)" />}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>
              {latestWeight} kg
            </span>
            <span style={{ 
              fontSize: '0.9rem', 
              fontWeight: '700', 
              color: weightDiff <= 0 ? 'var(--primary-light)' : 'var(--accent-orange)' 
            }}>
              {weightDiff <= 0 ? `${weightDiff} kg` : `+${weightDiff} kg`}
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', marginTop: '6px', color: 'var(--text-muted)' }}>
            Starting: {firstWeight} kg → Current: {latestWeight} kg
          </div>
        </div>
      </div>

      {/* Calorie Intake vs Target Bar Chart */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>
              Daily Calorie Adherence ({timeRange} Days)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Dashed line indicates your daily target of {targetCalories} kcal
            </p>
          </div>
          <div style={{ display: 'flex', gap: '14px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--primary)' }} />
              On Target / Deficit
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--accent-orange)' }} />
              Over Target
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '2px', background: '#38bdf8' }} />
              Target Line
            </span>
          </div>
        </div>

        {/* Responsive Bar Chart Canvas */}
        <div style={{
          position: 'relative',
          height: '220px',
          display: 'flex',
          alignItems: 'flex-end',
          gap: timeRange === 30 ? '4px' : '10px',
          paddingBottom: '30px',
          borderBottom: '1px solid var(--border-color)'
        }}>
          {/* Target line overlay */}
          <div 
            style={{
              position: 'absolute',
              bottom: `${(targetCalories / maxCalInChart) * 190 + 30}px`,
              left: 0,
              right: 0,
              height: '1px',
              borderTop: '2px dashed #38bdf8',
              opacity: 0.6,
              pointerEvents: 'none',
              zIndex: 2
            }}
          />

          {rangeData.map((day) => {
            const isSelected = selectedDate === day.date
            const isOver = day.calories > targetCalories
            const barHeight = Math.max(8, Math.round((day.calories / maxCalInChart) * 190))
            const barColor = isOver ? 'linear-gradient(180deg, #f97316 0%, #ea580c 100%)' : 'linear-gradient(180deg, #10b981 0%, #059669 100%)'

            return (
              <div
                key={day.date}
                onClick={() => {
                  onSelectDate(day.date)
                  if (onSwitchToDayView) onSwitchToDayView()
                }}
                title={`${day.displayDate}: ${day.calories} kcal (Protein: ${day.protein}g, Carbs: ${day.carbs}g, Fat: ${day.fat}g)`}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  height: '100%',
                  cursor: 'pointer',
                  position: 'relative',
                  padding: '2px'
                }}
              >
                {/* Bar */}
                <div 
                  style={{
                    width: '100%',
                    maxWidth: '38px',
                    height: `${barHeight}px`,
                    borderRadius: '6px 6px 2px 2px',
                    background: barColor,
                    boxShadow: isSelected ? '0 0 14px rgba(16, 185, 129, 0.7)' : 'none',
                    border: isSelected ? '2px solid #fff' : 'none',
                    transition: 'all 0.25s ease'
                  }} 
                />

                {/* Day Label */}
                <div style={{
                  position: 'absolute',
                  bottom: '6px',
                  fontSize: timeRange === 30 ? '0.62rem' : '0.72rem',
                  color: isSelected ? '#fff' : 'var(--text-dim)',
                  fontWeight: isSelected ? '700' : '500'
                }}>
                  {timeRange === 30 ? day.shortDate.split(' ')[1] : day.shortDate}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Weight Progression & Macro Ratio Split */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        
        {/* Weight Curve */}
        <div className="glass-panel" style={{ padding: '24px 26px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>
              Weight Logged Over Time
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Goal: {profile.targetWeight || 72} kg
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {rangeData.slice(-7).map(day => (
              <div 
                key={day.date}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: day.date === (selectedDate || todayStr) ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                  border: day.date === (selectedDate || todayStr) ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={13} color="var(--text-dim)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#fff' }}>
                    {day.displayDate}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--primary-light)' }}>
                    {day.weight ? `${day.weight} kg` : '—'}
                  </span>
                  <button
                    onClick={() => {
                      onSelectDate(day.date)
                      setWeightInput(day.weight ? day.weight.toString() : latestWeight.toString())
                      setShowWeightModal(true)
                    }}
                    className="btn-ghost"
                    style={{ fontSize: '0.74rem', color: 'var(--text-muted)', padding: '2px 6px' }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Multi-Day Macro Consistency */}
        <div className="glass-panel" style={{ padding: '24px 26px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>
              Average Macro Split ({timeRange} Days)
            </h3>
            <span className="badge badge-purple">{profile.macroPreset || 'High Protein'}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Protein */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Protein:</span>
                <strong style={{ color: 'var(--accent-purple)' }}>{avgProtein}g / {targetProtein}g ({Math.round((avgProtein / targetProtein) * 100)}%)</strong>
              </div>
              <div className="progress-container" style={{ height: '6px' }}>
                <div className="progress-bar" style={{ width: `${Math.min(100, Math.round((avgProtein / targetProtein) * 100))}%`, background: 'var(--accent-purple)' }} />
              </div>
            </div>

            {/* Carbs */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Carbohydrates:</span>
                <strong style={{ color: 'var(--accent-blue)' }}>{avgCarbs}g / {targetCarbs}g ({Math.round((avgCarbs / targetCarbs) * 100)}%)</strong>
              </div>
              <div className="progress-container" style={{ height: '6px' }}>
                <div className="progress-bar" style={{ width: `${Math.min(100, Math.round((avgCarbs / targetCarbs) * 100))}%`, background: 'var(--accent-blue)' }} />
              </div>
            </div>

            {/* Fat */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Fats:</span>
                <strong style={{ color: 'var(--accent-yellow)' }}>{avgFat}g / {targetFat}g ({Math.round((avgFat / targetFat) * 100)}%)</strong>
              </div>
              <div className="progress-container" style={{ height: '6px' }}>
                <div className="progress-bar" style={{ width: `${Math.min(100, Math.round((avgFat / targetFat) * 100))}%`, background: 'var(--accent-yellow)' }} />
              </div>
            </div>

            {/* Water */}
            <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Daily Hydration:</span>
                <strong style={{ color: '#38bdf8' }}>{avgWater} ml / {waterGoal} ml ({Math.round((avgWater / waterGoal) * 100)}%)</strong>
              </div>
              <div className="progress-container" style={{ height: '6px' }}>
                <div className="progress-bar" style={{ width: `${Math.min(100, Math.round((avgWater / waterGoal) * 100))}%`, background: '#38bdf8' }} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Log Weight Modal */}
      {showWeightModal && createPortal(
        <div 
          className="modal-backdrop" 
          onClick={() => setShowWeightModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="modal-card" 
            onClick={e => e.stopPropagation()} 
            style={{ maxWidth: '440px' }}
          >
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff', margin: 0 }}>
                Log Weight for {formatDisplayDate(selectedDate || todayStr)}
              </h3>
              <button 
                type="button" 
                onClick={() => setShowWeightModal(false)} 
                className="btn-ghost" 
                style={{ padding: '4px' }}
                aria-label="Close weight modal"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveWeight} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  Weigh yourself in the morning under consistent conditions for greatest trend accuracy.
                </p>
                <div>
                  <label className="input-label" htmlFor="historical-weight-input">Weight (kg)</label>
                  <input
                    id="historical-weight-input"
                    name="historicalWeight"
                    autoComplete="off"
                    type="number"
                    step="0.1"
                    required
                    autoFocus
                    placeholder="e.g. 75.8"
                    value={weightInput}
                    onChange={e => setWeightInput(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.1)', background: '#131f37' }}>
                <button type="button" onClick={() => setShowWeightModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Weigh-In
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  )
}
