import React, { useState } from 'react'
import { 
  Sparkles, 
  Flame, 
  Droplet, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  User, 
  TrendingDown, 
  TrendingUp, 
  Minus
} from 'lucide-react'
import { 
  calculateBMR, 
  calculateTDEE, 
  calculateTargetMacros, 
  calculateWaterGoal,
  ACTIVITY_MULTIPLIERS, 
  GOAL_MODIFIERS, 
  MACRO_PRESETS 
} from '../utils/calculators'

export default function OnboardingModal({
  isOpen,
  onClose,
  initialProfile,
  onComplete
}) {
  const [step, setStep] = useState(1) // 1: Bio metrics, 2: Goal & Macro Style, 3: Target Blueprint

  const [formData, setFormData] = useState({
    name: initialProfile?.name || 'Friend',
    gender: initialProfile?.gender || 'male',
    age: initialProfile?.age || 28,
    height: initialProfile?.height || 178,
    weight: initialProfile?.weight || 76,
    targetWeight: initialProfile?.targetWeight || 72,
    activityLevel: initialProfile?.activityLevel || 'moderate',
    goal: initialProfile?.goal || 'lose_weight_steady',
    macroPreset: initialProfile?.macroPreset || 'high_protein'
  })

  if (!isOpen) return null

  // Real-time calculated metabolic variables
  const bmr = calculateBMR({
    gender: formData.gender,
    age: formData.age,
    height: formData.height,
    weight: formData.weight
  })

  const tdee = calculateTDEE(bmr, formData.activityLevel)
  const deficit = GOAL_MODIFIERS[formData.goal]?.deficit || 0
  const targetCalories = Math.max(1200, tdee + deficit)
  const targetMacros = calculateTargetMacros(targetCalories, formData.macroPreset)
  const waterTarget = calculateWaterGoal(formData.weight, formData.activityLevel)

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      handleFinish()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleFinish = () => {
    const updatedProfile = {
      ...formData,
      bmr,
      tdee,
      targetCalories,
      targetProtein: targetMacros.protein,
      targetCarbs: targetMacros.carbs,
      targetFat: targetMacros.fat,
      waterGoal: waterTarget
    }
    onComplete(updatedProfile)
  }

  const goalIcons = {
    lose_weight_fast: TrendingDown,
    lose_weight_steady: TrendingDown,
    maintain: Minus,
    gain_muscle_lean: TrendingUp,
    gain_muscle_fast: TrendingUp
  }

  return (
    <div 
      className="modal-backdrop" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="onboarding-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        backgroundColor: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto'
      }}
    >
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '620px',
          background: 'linear-gradient(135deg, rgba(17, 26, 46, 0.96) 0%, rgba(10, 15, 26, 0.98) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(16, 185, 129, 0.15)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px',
          position: 'relative',
          animation: 'modalZoomIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Close / Skip button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Skip setup and use defaults"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: 'none',
            color: 'var(--text-muted)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)' }}
        >
          <X size={18} />
        </button>

        {/* Header with Step Tracker */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Sparkles size={12} />
              <span>Step {step} of 3</span>
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Quick Metabolic Calibration
            </span>
          </div>

          <h2 id="onboarding-title" style={{ fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#fff' }}>
            {step === 1 && 'Welcome! Let’s Tailor Your Targets'}
            {step === 2 && 'What Is Your Primary Fitness Goal?'}
            {step === 3 && 'Your Personalized Nutrition Plan'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            {step === 1 && 'Enter your basic biological metrics so we can accurately estimate your metabolic expenditure.'}
            {step === 2 && 'Select whether you want to burn fat, maintain current weight, or build lean muscle.'}
            {step === 3 && 'Based on the Mifflin-St Jeor formula, here are your calculated daily calories, macros, and hydration targets.'}
          </p>

          {/* Progress bar */}
          <div className="progress-container" style={{ height: '5px', marginTop: '14px' }}>
            <div 
              className="progress-bar"
              style={{ 
                width: `${(step / 3) * 100}%`,
                background: 'linear-gradient(90deg, #10b981 0%, #38bdf8 100%)'
              }}
            />
          </div>
        </div>

        {/* Step 1: Body Metrics */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Biological Sex (for metabolic BMR equation)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {['male', 'female'].map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: g })}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: formData.gender === g ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      background: formData.gender === g ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      color: formData.gender === g ? 'var(--primary-light)' : 'var(--text-main)',
                      fontWeight: '700',
                      textTransform: 'capitalize',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <User size={16} />
                    <span>{g}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Age (yrs)
                </label>
                <input 
                  type="number" 
                  min="12" 
                  max="100"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) || 25 })}
                  className="input-field tabular-nums"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Height (cm)
                </label>
                <input 
                  type="number" 
                  min="100" 
                  max="250"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) || 170 })}
                  className="input-field tabular-nums"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Weight (kg)
                </label>
                <input 
                  type="number" 
                  step="0.5" 
                  min="30" 
                  max="250"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) || 70 })}
                  className="input-field tabular-nums"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Daily Activity Level
              </label>
              <select
                value={formData.activityLevel}
                onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                className="select-field"
                style={{ width: '100%' }}
              >
                {Object.entries(ACTIVITY_MULTIPLIERS).map(([key, data]) => (
                  <option key={key} value={key}>{data.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Goal & Macro Preset */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Primary Weight & Energy Goal
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(GOAL_MODIFIERS).map(([key, data]) => {
                  const isSelected = formData.goal === key
                  const Icon = goalIcons[key] || Flame
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFormData({ ...formData, goal: key })}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                        background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: isSelected ? 'var(--primary)' : 'rgba(255, 255, 255, 0.06)',
                          color: isSelected ? '#000' : 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.92rem', color: isSelected ? '#fff' : 'var(--text-main)' }}>
                            {data.label}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {data.desc}
                          </div>
                        </div>
                      </div>
                      <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                        {data.deficit > 0 ? `+${data.deficit}` : data.deficit} kcal
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Macronutrient Distribution Style
              </label>
              <select
                value={formData.macroPreset}
                onChange={(e) => setFormData({ ...formData, macroPreset: e.target.value })}
                className="select-field"
                style={{ width: '100%' }}
              >
                {Object.entries(MACRO_PRESETS).map(([key, data]) => (
                  <option key={key} value={key}>{data.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Target Blueprint */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Calorie Card */}
            <div style={{
              padding: '20px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              textAlign: 'center'
            }}>
              <span className="badge badge-emerald" style={{ marginBottom: '8px' }}>
                Daily Caloric Target
              </span>
              <div className="tabular-nums" style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff', lineHeight: 1.1 }}>
                {targetCalories} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: '400' }}>kcal / day</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '10px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <span>BMR: <strong className="tabular-nums" style={{ color: '#fff' }}>{bmr} kcal</strong></span>
                <span>•</span>
                <span>Maintenance TDEE: <strong className="tabular-nums" style={{ color: '#fff' }}>{tdee} kcal</strong></span>
              </div>
            </div>

            {/* Macros 3-Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-blue)', textTransform: 'uppercase' }}>Protein</div>
                <div className="tabular-nums" style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', marginTop: '2px' }}>
                  {targetMacros.protein}g
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Muscle recovery</div>
              </div>

              <div style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(251, 191, 36, 0.08)',
                border: '1px solid rgba(251, 191, 36, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-yellow)', textTransform: 'uppercase' }}>Carbs</div>
                <div className="tabular-nums" style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', marginTop: '2px' }}>
                  {targetMacros.carbs}g
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Daily energy</div>
              </div>

              <div style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(244, 63, 94, 0.08)',
                border: '1px solid rgba(244, 63, 94, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-red)', textTransform: 'uppercase' }}>Fat</div>
                <div className="tabular-nums" style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', marginTop: '2px' }}>
                  {targetMacros.fat}g
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Hormone health</div>
              </div>
            </div>

            {/* Hydration target pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Droplet size={18} color="var(--accent-blue)" />
                <span style={{ fontSize: '0.88rem', fontWeight: '600', color: '#fff' }}>Recommended Daily Hydration</span>
              </div>
              <span className="tabular-nums" style={{ fontWeight: '800', color: 'var(--accent-blue)', fontSize: '1.05rem' }}>
                {(waterTarget / 1000).toFixed(1)} Liters <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>({waterTarget} ml)</span>
              </span>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '26px',
          paddingTop: '18px',
          borderTop: '1px solid var(--border-color)',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-dim)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Skip and use defaults
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="btn btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              fontSize: '0.95rem',
              fontWeight: '700',
              marginLeft: 'auto'
            }}
          >
            {step < 3 ? (
              <>
                <span>Continue</span>
                <ArrowRight size={16} />
              </>
            ) : (
              <>
                <Check size={18} />
                <span>Save Targets & Start Logging</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
