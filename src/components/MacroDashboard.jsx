import React, { useState } from 'react'
import { 
  Plus, 
  Trash2, 
  Utensils, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  Search,
  PieChart
} from 'lucide-react'
import { COMMON_FOOD_LIBRARY } from '../data/initialData'

export default function MacroDashboard({ 
  profile, 
  mealLogs, 
  onAddMeal, 
  onDeleteMeal 
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [customMeal, setCustomMeal] = useState({
    name: '',
    mealType: 'Lunch',
    serving: '1 serving',
    protein: '',
    carbs: '',
    fat: ''
  })
  const [showCustomModal, setShowCustomModal] = useState(false)

  // Calculations
  const totals = mealLogs.reduce((acc, item) => {
    return {
      calories: acc.calories + (Number(item.calories) || 0),
      protein: acc.protein + (Number(item.protein) || 0),
      carbs: acc.carbs + (Number(item.carbs) || 0),
      fat: acc.fat + (Number(item.fat) || 0)
    }
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 })

  const targetCal = profile.targetCalories || 2300
  const targetProtein = profile.targetProtein || 170
  const targetCarbs = profile.targetCarbs || 230
  const targetFat = profile.targetFat || 65

  const calRemaining = Math.max(0, targetCal - Math.round(totals.calories))
  const calPercent = Math.min(100, Math.round((totals.calories / targetCal) * 100))
  const proteinPercent = Math.min(100, Math.round((totals.protein / targetProtein) * 100))
  const carbsPercent = Math.min(100, Math.round((totals.carbs / targetCarbs) * 100))
  const fatPercent = Math.min(100, Math.round((totals.fat / targetFat) * 100))

  const handleQuickAdd = (food) => {
    const newEntry = {
      id: 'm_' + Date.now() + Math.random().toString(36).substr(2, 4),
      mealType: 'Snack',
      name: food.name,
      serving: food.serving,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    onAddMeal(newEntry)
  }

  const handleCustomSubmit = (e) => {
    e.preventDefault()
    if (!customMeal.name.trim()) return

    const p = parseFloat(customMeal.protein) || 0
    const c = parseFloat(customMeal.carbs) || 0
    const f = parseFloat(customMeal.fat) || 0
    const computedCal = Math.round(p * 4 + c * 4 + f * 9)

    const newEntry = {
      id: 'm_' + Date.now(),
      mealType: customMeal.mealType,
      name: customMeal.name,
      serving: customMeal.serving || '1 portion',
      calories: computedCal,
      protein: p,
      carbs: c,
      fat: f,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    onAddMeal(newEntry)
    setCustomMeal({
      name: '',
      mealType: 'Lunch',
      serving: '1 serving',
      protein: '',
      carbs: '',
      fat: ''
    })
    setShowCustomModal(false)
  }

  const filteredQuickFoods = COMMON_FOOD_LIBRARY.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner & Overview */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        alignItems: 'center',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(18, 26, 41, 0.8) 100%)'
      }}>
        {/* Main Calorie Summary */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className="badge badge-emerald">Daily Nutrition Fuel</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Goal: {profile.goal.replace(/_/g, ' ')}
            </span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '4px' }}>
            {Math.round(totals.calories)}{' '}
            <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: '400' }}>
              / {targetCal} kcal
            </span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {calRemaining > 0 ? (
              <span style={{ color: 'var(--primary-light)', fontWeight: '600' }}>
                {calRemaining} kcal remaining today
              </span>
            ) : (
              <span style={{ color: 'var(--accent-yellow)', fontWeight: '600' }}>
                Daily calorie target reached!
              </span>
            )}
          </p>

          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Daily Caloric Progress</span>
              <span style={{ fontWeight: '700', color: 'var(--primary-light)' }}>{calPercent}%</span>
            </div>
            <div className="progress-container" style={{ height: '10px' }}>
              <div 
                className="progress-bar"
                style={{ 
                  width: `${calPercent}%`, 
                  background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)' 
                }}
              />
            </div>
          </div>
        </div>

        {/* Macro Bars Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '14px'
        }}>
          {/* Protein */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            border: '1px solid rgba(56, 189, 248, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', fontWeight: '700' }}>PROTEIN</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{proteinPercent}%</span>
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fff', marginBottom: '2px' }}>
              {Math.round(totals.protein)}g
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Goal: {targetProtein}g
            </div>
            <div className="progress-container" style={{ height: '6px' }}>
              <div className="progress-bar" style={{ width: `${proteinPercent}%`, background: 'var(--macro-protein)' }} />
            </div>
          </div>

          {/* Carbs */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            border: '1px solid rgba(251, 191, 36, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-yellow)', fontWeight: '700' }}>CARBS</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{carbsPercent}%</span>
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fff', marginBottom: '2px' }}>
              {Math.round(totals.carbs)}g
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Goal: {targetCarbs}g
            </div>
            <div className="progress-container" style={{ height: '6px' }}>
              <div className="progress-bar" style={{ width: `${carbsPercent}%`, background: 'var(--macro-carbs)' }} />
            </div>
          </div>

          {/* Fats */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            border: '1px solid rgba(244, 63, 94, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-red)', fontWeight: '700' }}>FAT</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{fatPercent}%</span>
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fff', marginBottom: '2px' }}>
              {Math.round(totals.fat)}g
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Goal: {targetFat}g
            </div>
            <div className="progress-container" style={{ height: '6px' }}>
              <div className="progress-bar" style={{ width: `${fatPercent}%`, background: 'var(--macro-fat)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Food Logger & Quick Foods */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '24px'
      }}>

        {/* Today's Logged Meals */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Utensils size={18} color="var(--primary-light)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Today's Food Log</h3>
              <span className="badge badge-emerald">{mealLogs.length} logged</span>
            </div>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setShowCustomModal(true)}
            >
              <Plus size={15} /> Log Custom Food
            </button>
          </div>

          {mealLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <p>No meals recorded today yet.</p>
              <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Select an item from the Quick Library or log custom macros!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {mealLogs.map((meal) => (
                <div 
                  key={meal.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-color)',
                    transition: 'var(--transition)'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-blue">{meal.mealType}</span>
                      <strong style={{ fontSize: '0.95rem' }}>{meal.name}</strong>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {meal.serving} • {meal.time}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--primary-light)' }}>
                        {meal.calories} kcal
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                        P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                      </div>
                    </div>
                    <button 
                      onClick={() => onDeleteMeal(meal.id)}
                      className="btn-ghost"
                      style={{
                        padding: '6px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-dim)'
                      }}
                      title="Delete entry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Food Database Library */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="var(--accent-yellow)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Quick Food Library</h3>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>1-Click Macro Log</span>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative', marginBottom: '14px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
            <input 
              type="text"
              placeholder="Search chicken, oats, salmon, avocado..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '38px', fontSize: '0.88rem' }}
            />
          </div>

          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px', 
            maxHeight: '400px', 
            overflowY: 'auto',
            paddingRight: '4px' 
          }}>
            {filteredQuickFoods.map((food) => (
              <div 
                key={food.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  transition: 'var(--transition)'
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{food.name}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    {food.serving} • <span style={{ color: 'var(--accent-blue)' }}>{food.protein}g P</span> | <span style={{ color: 'var(--accent-yellow)' }}>{food.carbs}g C</span> | <span style={{ color: 'var(--accent-red)' }}>{food.fat}g F</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--primary-light)' }}>
                    {food.calories} cal
                  </span>
                  <button 
                    onClick={() => handleQuickAdd(food)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '5px 10px' }}
                    title="Add to daily log"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Custom Meal Modal */}
      {showCustomModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '480px',
            width: '100%',
            padding: '28px',
            background: 'var(--bg-card-solid)',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '16px' }}>
              Log Custom Food / Meal
            </h3>

            <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="input-group">
                <label className="input-label">Food / Dish Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Homemade Turkey Chilli"
                  value={customMeal.name}
                  onChange={(e) => setCustomMeal({ ...customMeal, name: e.target.value })}
                  className="input-field"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group">
                  <label className="input-label">Meal Type</label>
                  <select 
                    value={customMeal.mealType}
                    onChange={(e) => setCustomMeal({ ...customMeal, mealType: e.target.value })}
                    className="select-field"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Serving Size</label>
                  <input 
                    type="text" 
                    placeholder="e.g., 200g or 1 bowl"
                    value={customMeal.serving}
                    onChange={(e) => setCustomMeal({ ...customMeal, serving: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div className="input-group">
                  <label className="input-label" style={{ color: 'var(--accent-blue)' }}>Protein (g)</label>
                  <input 
                    type="number" 
                    min="0"
                    step="0.5"
                    placeholder="0"
                    value={customMeal.protein}
                    onChange={(e) => setCustomMeal({ ...customMeal, protein: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ color: 'var(--accent-yellow)' }}>Carbs (g)</label>
                  <input 
                    type="number" 
                    min="0"
                    step="0.5"
                    placeholder="0"
                    value={customMeal.carbs}
                    onChange={(e) => setCustomMeal({ ...customMeal, carbs: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ color: 'var(--accent-red)' }}>Fat (g)</label>
                  <input 
                    type="number" 
                    min="0"
                    step="0.5"
                    placeholder="0"
                    value={customMeal.fat}
                    onChange={(e) => setCustomMeal({ ...customMeal, fat: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Calculated preview */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.85rem'
              }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Calories:</span>
                <span style={{ fontWeight: '700', color: 'var(--primary-light)', fontSize: '1rem' }}>
                  {Math.round((parseFloat(customMeal.protein) || 0) * 4 + (parseFloat(customMeal.carbs) || 0) * 4 + (parseFloat(customMeal.fat) || 0) * 9)} kcal
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowCustomModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Save & Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
