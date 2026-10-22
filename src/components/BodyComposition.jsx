import React, { useState, useEffect, useMemo } from 'react'
import { 
  Activity, 
  Sparkles, 
  Check, 
  Trash2, 
  Plus, 
  TrendingDown, 
  TrendingUp, 
  Scale, 
  Info,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react'
import { 
  calculateBodyFatNavy, 
  getBodyFatCategory, 
  calculateBodyComposition 
} from '../utils/calculators'

const STORAGE_KEY = 'nutriflow_body_comp_history'

// Realistic default sample history
const DEFAULT_HISTORY = [
  {
    id: 'bc_1',
    date: '2026-10-01',
    weight: 78.5,
    waist: 86.0,
    neck: 38.0,
    hips: 97.0,
    arms: 35.5,
    thighs: 58.0,
    bodyFat: 17.6,
    leanMass: 64.7,
    fatMass: 13.8,
    notes: 'Starting baseline measurement'
  },
  {
    id: 'bc_2',
    date: '2026-10-10',
    weight: 77.2,
    waist: 84.5,
    neck: 38.0,
    hips: 96.0,
    arms: 35.6,
    thighs: 57.5,
    bodyFat: 16.4,
    leanMass: 64.5,
    fatMass: 12.7,
    notes: 'Consistent calorie deficit, gym 4x'
  },
  {
    id: 'bc_3',
    date: '2026-10-20',
    weight: 76.0,
    waist: 82.5,
    neck: 38.0,
    hips: 95.0,
    arms: 35.8,
    thighs: 57.0,
    bodyFat: 14.8,
    leanMass: 64.8,
    fatMass: 11.2,
    notes: 'Waist down 3.5cm, lean mass preserved!'
  }
]

export default function BodyComposition({ profile, onUpdateProfile }) {
  const [gender, setGender] = useState(profile?.gender || 'male')
  const [height, setHeight] = useState(profile?.height || 178)
  const [weight, setWeight] = useState(profile?.weight || 76)
  
  // Circumference measurements (in cm)
  const [neck, setNeck] = useState(38)
  const [waist, setWaist] = useState(82.5)
  const [hips, setHips] = useState(95)
  const [arms, setArms] = useState(35.8)
  const [thighs, setThighs] = useState(57)
  const [notes, setNotes] = useState('')

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return DEFAULT_HISTORY
  })

  const [savedSuccess, setSavedSuccess] = useState(false)

  // Save history to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    } catch {
      // ignore
    }
  }, [history])

  // Real-time body fat calculation
  const calculatedBF = useMemo(() => {
    return calculateBodyFatNavy({
      gender,
      height: parseFloat(height) || 175,
      waist: parseFloat(waist) || 82,
      neck: parseFloat(neck) || 38,
      hip: parseFloat(hips) || 95
    })
  }, [gender, height, waist, neck, hips])

  const category = useMemo(() => {
    return getBodyFatCategory(calculatedBF, gender)
  }, [calculatedBF, gender])

  const comp = useMemo(() => {
    return calculateBodyComposition({
      weight: parseFloat(weight) || 75,
      bodyFatPercent: calculatedBF
    })
  }, [weight, calculatedBF])

  // Log current entry to history
  const handleSaveMeasurement = (e) => {
    e.preventDefault()

    const todayDateStr = new Date().toISOString().split('T')[0]
    const newEntry = {
      id: 'bc_' + Date.now(),
      date: todayDateStr,
      weight: parseFloat(weight) || 75,
      waist: parseFloat(waist) || 82,
      neck: parseFloat(neck) || 38,
      hips: parseFloat(hips) || 95,
      arms: parseFloat(arms) || 0,
      thighs: parseFloat(thighs) || 0,
      bodyFat: calculatedBF,
      leanMass: comp.leanMassKg,
      fatMass: comp.fatMassKg,
      notes: notes.trim() || 'Tape measurement check-in'
    }

    setHistory(prev => [newEntry, ...prev.filter(h => h.date !== todayDateStr)])
    
    // Update profile weight & bodyFat if callback provided
    if (onUpdateProfile) {
      onUpdateProfile({
        ...profile,
        gender,
        height: parseFloat(height) || profile.height,
        weight: parseFloat(weight) || profile.weight,
        bodyFat: calculatedBF
      })
    }

    setNotes('')
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3500)
  }

  const handleDeleteEntry = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id))
  }

  // Calculate changes over time from oldest to newest
  const overallChange = useMemo(() => {
    if (history.length < 2) return null
    const sorted = [...history].sort((a, b) => new Date(a.date) - new Date(b.date))
    const first = sorted[0]
    const latest = sorted[sorted.length - 1]

    return {
      weightDiff: Math.round((latest.weight - first.weight) * 10) / 10,
      waistDiff: Math.round((latest.waist - first.waist) * 10) / 10,
      bfDiff: Math.round((latest.bodyFat - first.bodyFat) * 10) / 10,
      leanDiff: Math.round((latest.leanMass - first.leanMass) * 10) / 10,
      fatDiff: Math.round((latest.fatMass - first.fatMass) * 10) / 10,
      days: Math.round((new Date(latest.date) - new Date(first.date)) / (1000 * 60 * 60 * 24))
    }
  }, [history])

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-emerald">US Navy Circumference Method</span>
            <span className="badge badge-blue">Recomposition Intelligence</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>
            Body Composition & Recomposition Log
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '720px', marginTop: '4px' }}>
            Scale weight alone doesn't tell the full story. Track your circumference tape measurements to estimate Body Fat %, monitor Lean Muscle preservation, and visualize authentic body recomposition.
          </p>
        </div>

        {savedSuccess && (
          <div style={{
            padding: '10px 18px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid var(--primary)',
            color: 'var(--primary-light)',
            fontWeight: '700',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Check size={18} />
            <span>Measurement Logged & Synced!</span>
          </div>
        )}
      </div>

      {/* Top 3 Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px'
      }}>
        {/* Body Fat % */}
        <div className="glass-panel" style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Estimated Body Fat %
            </span>
            <span className={`badge ${category.badge}`} style={{ fontSize: '0.74rem' }}>
              {category.label}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: '800', color: category.color, lineHeight: '1' }}>
              {calculatedBF}%
            </span>
            <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              ({category.range})
            </span>
          </div>

          {/* Color Spectrum Progress Bar */}
          <div style={{ marginTop: '6px' }}>
            <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden', position: 'relative' }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, Math.max(10, (calculatedBF / 40) * 100))}%`,
                background: `linear-gradient(90deg, #10b981 0%, #38bdf8 40%, #f59e0b 70%, #f43f5e 100%)`,
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              <span>Essential (6%)</span>
              <span>Athletic (12%)</span>
              <span>Fitness (16%)</span>
              <span>Average (22%+)</span>
            </div>
          </div>
        </div>

        {/* Lean Body Mass */}
        <div className="glass-panel" style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Lean Body Mass (LBM)
            </span>
            <span className="badge badge-emerald" style={{ fontSize: '0.74rem' }}>
              Active Muscle & Organs
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-light)', lineHeight: '1' }}>
              {comp.leanMassKg}
            </span>
            <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              kg ({comp.leanMassPercent}%)
            </span>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
            Your primary metabolic engine. Higher lean mass keeps your resting BMR elevated.
          </p>
        </div>

        {/* Fat Mass */}
        <div className="glass-panel" style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Body Fat Mass
            </span>
            <span className="badge badge-amber" style={{ fontSize: '0.74rem' }}>
              Adipose Tissue
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-yellow)', lineHeight: '1' }}>
              {comp.fatMassKg}
            </span>
            <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              kg ({comp.bodyFatPercent}%)
            </span>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
            Estimated total fat weight across essential visceral and subcutaneous tissue.
          </p>
        </div>
      </div>

      {/* Main Grid: Measurement Input Form & Recomp History */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px'
      }}>
        
        {/* Form: Take New Tape Measurement */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '6px' }}>
            Tape Measurements & Navy Formula
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
            Measure snugly against bare skin without compressing soft tissue.
          </p>

          <form onSubmit={handleSaveMeasurement} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Sex Toggle */}
            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Biological Sex (Navy Formula Baseline)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    fontWeight: gender === 'male' ? '700' : '500',
                    background: gender === 'male' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.02)',
                    border: gender === 'male' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                    color: gender === 'male' ? 'var(--primary-light)' : 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    fontWeight: gender === 'female' ? '700' : '500',
                    background: gender === 'female' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.02)',
                    border: gender === 'female' ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                    color: gender === 'female' ? 'var(--primary-light)' : 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Height & Weight */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Height (cm) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  className="input-field"
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Body Weight (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="input-field"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Waist & Neck (Core Navy Formula) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Waist Circumference (cm) *
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block' }}>At belly button level</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="input-field"
                  value={waist}
                  onChange={e => setWaist(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Neck Circumference (cm) *
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block' }}>Below Adam's apple</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="input-field"
                  value={neck}
                  onChange={e => setNeck(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Hips (Required for females, good for glute tracking for males) */}
            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Hips Circumference (cm) {gender === 'female' ? '*' : '(Optional)'}
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block' }}>Widest part of buttocks</span>
              </label>
              <input
                type="number"
                step="0.1"
                className="input-field"
                value={hips}
                onChange={e => setHips(e.target.value)}
                required={gender === 'female'}
              />
            </div>

            {/* Optional Arms & Thighs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Biceps / Arm (cm)
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block' }}>Flexed peak</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="input-field"
                  placeholder="Optional"
                  value={arms}
                  onChange={e => setArms(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Thigh (cm)
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block' }}>Mid-quad</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="input-field"
                  placeholder="Optional"
                  value={thighs}
                  onChange={e => setThighs(e.target.value)}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Check-in Notes
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Morning fasted measurement, week 3 cut"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '12px', fontSize: '0.96rem', marginTop: '6px' }}
            >
              <Plus size={18} />
              <span>Log & Save Today's Measurement</span>
            </button>
          </form>
        </div>

        {/* History Table & Recomposition Insights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Recomposition Progress Summary */}
          {overallChange && (
            <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={16} color="var(--primary-light)" />
                <h4 style={{ fontSize: '1rem', fontWeight: '800' }}>
                  Total Recomposition Delta ({overallChange.days} Days)
                </h4>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                gap: '12px',
                marginTop: '12px'
              }}>
                <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Weight</div>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '800',
                    color: overallChange.weightDiff <= 0 ? 'var(--primary-light)' : 'var(--accent-yellow)'
                  }}>
                    {overallChange.weightDiff > 0 ? `+${overallChange.weightDiff}` : overallChange.weightDiff} kg
                  </div>
                </div>

                <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Waist</div>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '800',
                    color: overallChange.waistDiff <= 0 ? 'var(--primary-light)' : 'var(--accent-red)'
                  }}>
                    {overallChange.waistDiff > 0 ? `+${overallChange.waistDiff}` : overallChange.waistDiff} cm
                  </div>
                </div>

                <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Body Fat</div>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '800',
                    color: overallChange.bfDiff <= 0 ? 'var(--primary-light)' : 'var(--accent-red)'
                  }}>
                    {overallChange.bfDiff > 0 ? `+${overallChange.bfDiff}` : overallChange.bfDiff}%
                  </div>
                </div>

                <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Lean Mass</div>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '800',
                    color: overallChange.leanDiff >= 0 ? 'var(--primary-light)' : 'var(--accent-yellow)'
                  }}>
                    {overallChange.leanDiff > 0 ? `+${overallChange.leanDiff}` : overallChange.leanDiff} kg
                  </div>
                </div>

                <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Fat Mass</div>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '800',
                    color: overallChange.fatDiff <= 0 ? 'var(--primary-light)' : 'var(--accent-red)'
                  }}>
                    {overallChange.fatDiff > 0 ? `+${overallChange.fatDiff}` : overallChange.fatDiff} kg
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Timeline Cards */}
          <div className="glass-panel" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '14px' }}>
              Measurement History ({history.length})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '420px' }}>
              {history.map((entry, idx) => (
                <div
                  key={entry.id || idx}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={14} color="var(--primary-light)" />
                      <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{entry.date}</span>
                      <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                        {entry.bodyFat}% BF
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="btn-ghost"
                      style={{ padding: '4px', color: 'var(--text-dim)' }}
                      title="Delete measurement"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Metrics Row */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                    gap: '8px',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)'
                  }}>
                    <div>Weight: <strong style={{ color: 'var(--text-main)' }}>{entry.weight}kg</strong></div>
                    <div>Waist: <strong style={{ color: 'var(--text-main)' }}>{entry.waist}cm</strong></div>
                    <div>Neck: <strong style={{ color: 'var(--text-main)' }}>{entry.neck}cm</strong></div>
                    {entry.hips && <div>Hips: <strong style={{ color: 'var(--text-main)' }}>{entry.hips}cm</strong></div>}
                    <div>Lean: <strong style={{ color: 'var(--primary-light)' }}>{entry.leanMass}kg</strong></div>
                    <div>Fat: <strong style={{ color: 'var(--accent-yellow)' }}>{entry.fatMass}kg</strong></div>
                  </div>

                  {entry.notes && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                      “{entry.notes}”
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
