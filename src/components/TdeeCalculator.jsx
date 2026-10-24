import React, { useState } from 'react'
import { 
  Target, 
  Activity, 
  Sparkles, 
  Check, 
  Flame, 
  Droplet 
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
import BodyComposition from './BodyComposition'

export default function TdeeCalculator({ profile, onUpdateProfile, initialSection = 'tdee' }) {
  const [activeSection, setActiveSection] = useState(initialSection)

  React.useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection)
    }
  }, [initialSection])
  const [formData, setFormData] = useState({
    name: profile.name || 'Alex',
    gender: profile.gender || 'male',
    age: profile.age || 28,
    height: profile.height || 178,
    weight: profile.weight || 76,
    targetWeight: profile.targetWeight || 72,
    activityLevel: profile.activityLevel || 'moderate',
    goal: profile.goal || 'lose_weight_steady',
    macroPreset: profile.macroPreset || 'high_protein'
  })

  const [savedSuccess, setSavedSuccess] = useState(false)

  // Real-time calculations
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

  const handleSave = (e) => {
    e.preventDefault()
    onUpdateProfile({
      ...formData,
      bmr,
      tdee,
      targetCalories,
      targetProtein: targetMacros.protein,
      targetCarbs: targetMacros.carbs,
      targetFat: targetMacros.fat,
      waterGoal: waterTarget
    })
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Sub-Navigation: BMR & TDEE Goals vs Body Composition Tape Log */}
      <div style={{
        display: 'flex',
        gap: '8px',
        background: 'rgba(255, 255, 255, 0.03)',
        padding: '6px',
        borderRadius: '14px',
        border: '1px solid var(--border-color)',
        alignSelf: 'flex-start',
        flexWrap: 'wrap'
      }}>
        <button
          type="button"
          onClick={() => setActiveSection('tdee')}
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            fontSize: '0.92rem',
            fontWeight: activeSection === 'tdee' ? '700' : '500',
            background: activeSection === 'tdee' ? 'var(--primary)' : 'transparent',
            color: activeSection === 'tdee' ? '#0f172a' : 'var(--text-muted)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'var(--transition)'
          }}
        >
          <Target size={17} />
          <span>BMR, TDEE & Macro Targets</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('bodycomp')}
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            fontSize: '0.92rem',
            fontWeight: activeSection === 'bodycomp' ? '700' : '500',
            background: activeSection === 'bodycomp' ? 'var(--primary)' : 'transparent',
            color: activeSection === 'bodycomp' ? '#0f172a' : 'var(--text-muted)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'var(--transition)'
          }}
        >
          <Activity size={17} />
          <span>Body Composition & Tape Measurements</span>
        </button>
      </div>

      {activeSection === 'bodycomp' ? (
        <BodyComposition profile={profile} onUpdateProfile={onUpdateProfile} />
      ) : (
        <>
          {/* Header */}
          <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Target size={24} color="var(--primary-light)" />
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>
            Metabolic Rate & Weight Goal Architect
          </h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Fine-tune your BMR (Basal Metabolic Rate), Total Daily Energy Expenditure (TDEE), and automated macro distribution for healthy weight loss or muscle gain.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px'
      }}>
        
        {/* Input Parameters Form */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '18px' }}>
            Your Biometrics & Lifestyle
          </h3>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Gender Toggle */}
            <div className="input-group">
              <label className="input-label" id="label-biological-sex">Biological Sex</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }} role="group" aria-labelledby="label-biological-sex">
                <button
                  type="button"
                  aria-pressed={formData.gender === 'male'}
                  onClick={() => setFormData({ ...formData, gender: 'male' })}
                  className={formData.gender === 'male' ? 'btn btn-primary' : 'btn btn-secondary'}
                >
                  Male
                </button>
                <button
                  type="button"
                  aria-pressed={formData.gender === 'female'}
                  onClick={() => setFormData({ ...formData, gender: 'female' })}
                  className={formData.gender === 'female' ? 'btn btn-primary' : 'btn btn-secondary'}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Age & Height */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="input-group">
                <label htmlFor="tdee-age" className="input-label">Age (years)</label>
                <input 
                  id="tdee-age"
                  name="age"
                  inputMode="numeric"
                  autoComplete="off"
                  type="number"
                  min="14"
                  max="100"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="input-field tabular-nums"
                />
              </div>

              <div className="input-group">
                <label htmlFor="tdee-height" className="input-label">Height (cm)</label>
                <input 
                  id="tdee-height"
                  name="height"
                  inputMode="numeric"
                  autoComplete="off"
                  type="number"
                  min="100"
                  max="240"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                  className="input-field tabular-nums"
                />
              </div>
            </div>

            {/* Current Weight & Target Weight */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="input-group">
                <label htmlFor="tdee-weight" className="input-label">Current Weight (kg)</label>
                <input 
                  id="tdee-weight"
                  name="weight"
                  inputMode="decimal"
                  autoComplete="off"
                  type="number"
                  step="0.5"
                  min="35"
                  max="250"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                  className="input-field tabular-nums"
                />
              </div>

              <div className="input-group">
                <label htmlFor="tdee-target-weight" className="input-label">Target Weight (kg)</label>
                <input 
                  id="tdee-target-weight"
                  name="targetWeight"
                  inputMode="decimal"
                  autoComplete="off"
                  type="number"
                  step="0.5"
                  min="35"
                  max="250"
                  value={formData.targetWeight}
                  onChange={(e) => setFormData({ ...formData, targetWeight: Number(e.target.value) })}
                  className="input-field tabular-nums"
                />
              </div>
            </div>

            {/* Activity Level */}
            <div className="input-group">
              <label htmlFor="tdee-activity-level" className="input-label">Activity Level</label>
              <select 
                id="tdee-activity-level"
                name="activityLevel"
                value={formData.activityLevel}
                onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                className="select-field"
              >
                {Object.entries(ACTIVITY_MULTIPLIERS).map(([key, item]) => (
                  <option key={key} value={key}>{item.label}</option>
                ))}
              </select>
            </div>

            {/* Goal Choice */}
            <div className="input-group">
              <label htmlFor="tdee-primary-goal" className="input-label">Primary Goal</label>
              <select 
                id="tdee-primary-goal"
                name="primaryGoal"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                className="select-field"
              >
                {Object.entries(GOAL_MODIFIERS).map(([key, item]) => (
                  <option key={key} value={key}>{item.label} ({item.desc})</option>
                ))}
              </select>
            </div>

            {/* Macro Distribution Preset */}
            <div className="input-group">
              <label htmlFor="tdee-macro-distribution" className="input-label">Macro Distribution Strategy</label>
              <select 
                id="tdee-macro-distribution"
                name="macroDistribution"
                value={formData.macroPreset}
                onChange={(e) => setFormData({ ...formData, macroPreset: e.target.value })}
                className="select-field"
              >
                {Object.entries(MACRO_PRESETS).map(([key, item]) => (
                  <option key={key} value={key}>{item.name}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '8px', padding: '12px' }}>
              {savedSuccess ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }} aria-live="polite">
                  <Check size={18} aria-hidden="true" /> Plan Saved & Applied!
                </span>
              ) : (
                <>
                  <Sparkles size={18} aria-hidden="true" /> Update & Apply Targets
                </>
              )}
            </button>
          </form>
        </div>

        {/* Calculated Results & Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Target Calories Highlight Card */}
          <div className="glass-panel" style={{
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(18, 26, 41, 0.9) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="badge badge-emerald">YOUR RECOMMENDED DAILY TARGET</span>
                <div style={{ fontSize: '2.4rem', fontWeight: '800', marginTop: '6px', color: '#fff' }}>
                  {targetCalories} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>kcal/day</span>
                </div>
              </div>
              <div style={{
                background: 'rgba(16, 185, 129, 0.2)',
                padding: '10px',
                borderRadius: '12px',
                color: 'var(--primary-light)'
              }}>
                <Flame size={26} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '12px',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Basal Metabolic Rate (BMR)</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>{bmr} kcal</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Base calories burned at rest</div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '12px',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Maintenance Burn (TDEE)</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>{tdee} kcal</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Zero gain/loss threshold</div>
              </div>
            </div>
          </div>

          {/* Daily Gram Breakdown */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '14px' }}>
              Target Macronutrient Split
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Protein */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(56, 189, 248, 0.06)',
                border: '1px solid rgba(56, 189, 248, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--macro-protein)' }} />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>Protein</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {(formData.weight > 0 ? (targetMacros.protein / formData.weight).toFixed(1) : 2.0)}g / kg bodyweight
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-blue)' }}>
                    {targetMacros.protein}g
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    {Math.round(targetMacros.protein * 4)} kcal
                  </div>
                </div>
              </div>

              {/* Carbs */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(251, 191, 36, 0.06)',
                border: '1px solid rgba(251, 191, 36, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--macro-carbs)' }} />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>Carbohydrates</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Glycogen & daily brain fuel</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-yellow)' }}>
                    {targetMacros.carbs}g
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    {Math.round(targetMacros.carbs * 4)} kcal
                  </div>
                </div>
              </div>

              {/* Fats */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(244, 63, 94, 0.06)',
                border: '1px solid rgba(244, 63, 94, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--macro-fat)' }} />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>Dietary Healthy Fats</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Hormones & nutrient transport</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-red)' }}>
                    {targetMacros.fat}g
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    {Math.round(targetMacros.fat * 9)} kcal
                  </div>
                </div>
              </div>

              {/* Water Target */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(6, 182, 212, 0.06)',
                border: '1px solid rgba(6, 182, 212, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Droplet size={18} color="var(--macro-water)" />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>Target Hydration</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Adjusted for weight & activity</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--macro-water)' }}>
                    {(waterTarget / 1000).toFixed(1)}L
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    {waterTarget} ml/day
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
        </>
      )}

    </div>
  )
}
