import React, { useState } from 'react'
import { 
  Flame, 
  Dumbbell, 
  Plus, 
  Trash2, 
  Timer, 
  Zap, 
  Sparkles, 
  TrendingUp, 
  Activity, 
  HeartPulse,
  CheckCircle2,
  X
} from 'lucide-react'

export const WORKOUT_PRESETS = [
  { id: 'weights_mod', name: 'Strength Training', icon: Dumbbell, kcalPerMin: 6.5, category: 'Strength' },
  { id: 'hiit', name: 'HIIT / Circuit Training', icon: Zap, kcalPerMin: 10.5, category: 'Conditioning' },
  { id: 'running', name: 'Running / Jogging', icon: Activity, kcalPerMin: 11.2, category: 'Cardio' },
  { id: 'cycling', name: 'Cycling / Spin Class', icon: Activity, kcalPerMin: 8.5, category: 'Cardio' },
  { id: 'walking', name: 'Brisk Walking / Steps', icon: HeartPulse, kcalPerMin: 4.5, category: 'Low Impact' },
  { id: 'swimming', name: 'Swimming (Laps)', icon: Activity, kcalPerMin: 9.0, category: 'Cardio' },
  { id: 'yoga', name: 'Yoga / Mobility Recovery', icon: Sparkles, kcalPerMin: 3.5, category: 'Mobility' },
  { id: 'custom', name: 'Custom Workout', icon: Flame, kcalPerMin: 7.0, category: 'Custom' }
]

export default function ExerciseTracker({
  workouts = [],
  onAddWorkout,
  onDeleteWorkout,
  isNetMode,
  onToggleNetMode,
  onLogQuickRecoverySnack
}) {
  const [showModal, setShowModal] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState(WORKOUT_PRESETS[0])
  const [durationMinutes, setDurationMinutes] = useState(45)
  const [intensity, setIntensity] = useState('moderate') // 'light' (0.8x), 'moderate' (1.0x), 'vigorous' (1.25x)
  const [customCalories, setCustomCalories] = useState('')
  const [customName, setCustomName] = useState('')

  const intensityMultiplier = intensity === 'light' ? 0.8 : intensity === 'vigorous' ? 1.25 : 1.0

  const calculatedCalories = customCalories 
    ? parseInt(customCalories) || 0 
    : Math.round(durationMinutes * selectedPreset.kcalPerMin * intensityMultiplier)

  const totalCaloriesBurned = workouts.reduce((sum, w) => sum + (Number(w.caloriesBurned) || 0), 0)
  const totalWorkoutMinutes = workouts.reduce((sum, w) => sum + (Number(w.duration) || 0), 0)

  const handleSubmitWorkout = (e) => {
    e.preventDefault()
    const name = selectedPreset.id === 'custom' && customName.trim() ? customName.trim() : selectedPreset.name
    const entry = {
      id: 'w_' + Date.now(),
      name,
      category: selectedPreset.category,
      duration: parseInt(durationMinutes) || 30,
      intensity,
      caloriesBurned: calculatedCalories,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    onAddWorkout(entry)
    setShowModal(false)
    setCustomCalories('')
    setCustomName('')
  }

  return (
    <div className="glass-panel" style={{
      padding: '24px 28px',
      background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.06) 0%, rgba(18, 26, 41, 0.85) 100%)',
      border: '1px solid rgba(234, 88, 12, 0.25)',
      borderRadius: 'var(--radius-lg)'
    }}>
      {/* Header with Totals & Net Calorie Mode Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-amber">
              <Flame size={13} /> Active Burn Tracker
            </span>
            <span className="badge badge-emerald">Exercise & Net Energy</span>
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff' }}>
            Workouts & Active Calorie Burn
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginTop: '2px', maxWidth: '600px' }}>
            Log physical training to calculate your active caloric expenditure. Toggle Net Calories to adjust your daily budget for workout fuel.
          </p>
        </div>

        {/* Burned Summary & Net Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* Net Mode Toggle Switch */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '4px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '0.78rem', color: isNetMode ? 'var(--primary-light)' : 'var(--text-muted)', fontWeight: '600' }}>
              {isNetMode ? '⚡ Net Calories Mode (ON)' : 'Gross Calories (Strict)'}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isNetMode}
              onClick={onToggleNetMode}
              style={{
                width: '38px',
                height: '22px',
                borderRadius: '11px',
                background: isNetMode ? 'var(--primary)' : 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                padding: '2px'
              }}
            >
              <span style={{
                display: 'block',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#fff',
                transform: isNetMode ? 'translateX(16px)' : 'translateX(0)',
                transition: 'transform 0.2s ease'
              }} />
            </button>
          </div>

          {/* Quick Log Workout button */}
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
          >
            <Plus size={15} />
            Log Workout
          </button>
        </div>
      </div>

      {/* Burn Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px',
        marginBottom: '20px'
      }}>
        {/* Total Calories Burned */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px'
        }}>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            ACTIVE BURN TODAY
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-orange)' }}>
              {totalCaloriesBurned}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>kcal burned</span>
          </div>
        </div>

        {/* Training Duration */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px'
        }}>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            TOTAL TRAINING TIME
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>
              {totalWorkoutMinutes}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>minutes</span>
          </div>
        </div>

        {/* Workouts Completed */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px'
        }}>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            SESSIONS LOGGED
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary-light)' }}>
              {workouts.length}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>workout{workouts.length === 1 ? '' : 's'}</span>
          </div>
        </div>
      </div>

      {/* Logged Workouts List */}
      {workouts.length === 0 ? (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px dashed var(--border-color)',
          borderRadius: 'var(--radius-md)'
        }}>
          <Dumbbell size={28} color="var(--text-dim)" style={{ margin: '0 auto 8px auto' }} />
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            No workouts recorded yet for this day. Click <strong>"Log Workout"</strong> to track exercise.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {workouts.map(item => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 18px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                transition: 'var(--transition)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(249, 115, 22, 0.15)',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Flame size={19} color="var(--accent-orange)" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ fontSize: '0.96rem', fontWeight: '700', color: '#fff' }}>
                      {item.name}
                    </h4>
                    <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>
                      {item.category}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                      {item.time}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {item.duration} minutes • <span style={{ textTransform: 'capitalize' }}>{item.intensity}</span> intensity
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--accent-orange)' }}>
                  +{item.caloriesBurned} kcal
                </span>
                <button
                  type="button"
                  onClick={() => onDeleteWorkout(item.id)}
                  className="btn-ghost"
                  title="Remove workout"
                  style={{ color: 'var(--text-dim)', padding: '6px' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post-Workout Recovery Guidance */}
      {workouts.length > 0 && (
        <div style={{
          marginTop: '16px',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(56, 189, 248, 0.05)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={18} color="var(--primary-light)" />
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#fff' }}>
                Post-Workout Recovery Window:
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                Aim for 25–40g protein + 500ml water to optimize muscle protein synthesis and replenish glycogen.
              </span>
            </div>
          </div>
          {onLogQuickRecoverySnack && (
            <button
              type="button"
              onClick={onLogQuickRecoverySnack}
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            >
              + Log Whey Recovery Shake (24g P)
            </button>
          )}
        </div>
      )}

      {/* Log Workout Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Flame size={20} color="var(--accent-orange)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Record Workout Activity</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="btn-ghost" style={{ padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitWorkout} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Activity Preset selector */}
              <div>
                <label className="input-label" htmlFor="workout-activity-select">Select Workout Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginTop: '6px' }}>
                  {WORKOUT_PRESETS.map(preset => {
                    const Icon = preset.icon
                    const isSelected = selectedPreset.id === preset.id
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setSelectedPreset(preset)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-md)',
                          border: isSelected ? '1px solid var(--accent-orange)' : '1px solid var(--border-color)',
                          background: isSelected ? 'rgba(249, 115, 22, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                          color: isSelected ? '#fff' : 'var(--text-muted)',
                          fontSize: '0.8rem',
                          fontWeight: isSelected ? '700' : '500',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <Icon size={16} color={isSelected ? 'var(--accent-orange)' : 'var(--text-dim)'} />
                        <span>{preset.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Custom name if custom selected */}
              {selectedPreset.id === 'custom' && (
                <div>
                  <label className="input-label" htmlFor="workout-custom-name">Workout Name</label>
                  <input
                    id="workout-custom-name"
                    name="customWorkoutName"
                    autoComplete="off"
                    type="text"
                    required
                    placeholder="e.g. Martial arts / Kettlebell flow"
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    className="input-field"
                  />
                </div>
              )}

              {/* Duration Slider / Input */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label className="input-label" htmlFor="workout-duration-range">Duration</label>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-light)' }}>
                    {durationMinutes} minutes
                  </span>
                </div>
                <input
                  id="workout-duration-range"
                  name="workoutDurationRange"
                  type="range"
                  min="5"
                  max="180"
                  step="5"
                  value={durationMinutes}
                  onChange={e => setDurationMinutes(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-orange)' }}
                />
              </div>

              {/* Intensity Picker */}
              <div>
                <label className="input-label">Intensity Level</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '6px' }}>
                  {[
                    { id: 'light', label: 'Light', desc: '0.8x burn' },
                    { id: 'moderate', label: 'Moderate', desc: '1.0x burn' },
                    { id: 'vigorous', label: 'Vigorous', desc: '1.25x burn' }
                  ].map(lvl => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setIntensity(lvl.id)}
                      style={{
                        padding: '8px',
                        borderRadius: 'var(--radius-md)',
                        border: intensity === lvl.id ? '1px solid var(--accent-orange)' : '1px solid var(--border-color)',
                        background: intensity === lvl.id ? 'rgba(249, 115, 22, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                        color: intensity === lvl.id ? '#fff' : 'var(--text-muted)',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '0.82rem', fontWeight: '700' }}>{lvl.label}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{lvl.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Estimated Burn preview / custom override */}
              <div style={{
                background: 'rgba(249, 115, 22, 0.08)',
                border: '1px solid rgba(249, 115, 22, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Estimated Calorie Burn:</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-orange)' }}>
                    ~{calculatedCalories} kcal
                  </div>
                </div>
                <div style={{ width: '110px' }}>
                  <label htmlFor="workout-override-cals" style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Override (kcal):</label>
                  <input
                    id="workout-override-cals"
                    name="overrideCalories"
                    autoComplete="off"
                    type="number"
                    placeholder={calculatedCalories.toString()}
                    value={customCalories}
                    onChange={e => setCustomCalories(e.target.value)}
                    className="input-field"
                    style={{ padding: '4px 8px', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: 'var(--accent-orange)', borderColor: 'var(--accent-orange)' }}>
                  Save Workout (+{calculatedCalories} kcal)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
