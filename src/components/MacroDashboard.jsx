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
  PieChart,
  Info,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Activity,
  Heart,
  Pill,
  Check,
  X,
  Flame,
  Award,
  Barcode,
  Camera
} from 'lucide-react'
import { COMMON_FOOD_LIBRARY } from '../data/initialData'
import { MICRONUTRIENTS_DATA } from '../data/vitaminsMinerals'
import AddFoodModal from './AddFoodModal'

export default function MacroDashboard({ 
  profile, 
  mealLogs, 
  onAddMeal, 
  onDeleteMeal,
  dailyVitaminsCovered = [],
  onToggleVitamin,
  foodLibrary = COMMON_FOOD_LIBRARY,
  onAddNewFoodToLibrary
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFoodCategory, setSelectedFoodCategory] = useState('All')
  const [microCategoryFilter, setMicroCategoryFilter] = useState('All')
  const [expandedMealIds, setExpandedMealIds] = useState({})
  const [previewFood, setPreviewFood] = useState(null)
  const [showCustomModal, setShowCustomModal] = useState(false)
  const [showMicrosInForm, setShowMicrosInForm] = useState(false)
  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false)

  const [customMeal, setCustomMeal] = useState({
    name: '',
    mealType: 'Lunch',
    serving: '1 serving',
    protein: '',
    carbs: '',
    fat: '',
    micros: {
      vit_d: '',
      vit_b12: '',
      vit_c: '',
      vit_a: '',
      magnesium: '',
      zinc: '',
      iron: '',
      calcium: '',
      potassium: '',
      omega_3: ''
    }
  })

  // Macro Totals
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

  // Micronutrient Aggregation across all meal logs
  const microTotals = MICRONUTRIENTS_DATA.reduce((acc, micro) => {
    const sum = mealLogs.reduce((total, meal) => {
      const val = meal.micros?.[micro.id] || 0
      return total + (parseFloat(val) || 0)
    }, 0)
    acc[micro.id] = Math.round(sum * 10) / 10
    return acc
  }, {})

  // Compute stats per micronutrient
  const microStats = MICRONUTRIENTS_DATA.map((micro) => {
    const current = microTotals[micro.id] || 0
    const target = micro.targetValue || 100
    const percent = Math.round((current / target) * 100)
    const isMet = current >= target

    // Find the meal that contributed the most to this micronutrient
    let topContributor = null
    let maxVal = 0
    mealLogs.forEach(meal => {
      const mVal = parseFloat(meal.micros?.[micro.id]) || 0
      if (mVal > maxVal) {
        maxVal = mVal
        topContributor = { name: meal.name, amount: mVal }
      }
    })

    return {
      ...micro,
      current,
      target,
      percent,
      isMet,
      topContributor
    }
  })

  // Summary counts
  const totalMicrosCount = microStats.length
  const metMicrosCount = microStats.filter(m => m.isMet).length
  const avgMicroPercent = Math.min(100, Math.round(
    microStats.reduce((sum, m) => sum + Math.min(100, m.percent), 0) / totalMicrosCount
  ))

  // Deficient nutrients for recommendation (< 50% target)
  const lowMicros = microStats.filter(m => m.percent < 50)

  // Smart food recommendation based on lowest nutrients
  const recommendedFoods = React.useMemo(() => {
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

  // Quick food categories
  const foodCategories = ['All', 'Protein', 'Carbs', 'Healthy Fats', 'Dairy', 'Produce', 'Supplement']

  // Filtered Quick Foods with micronutrient keyword searching
  const filteredQuickFoods = foodLibrary.filter(f => {
    const matchesCat = selectedFoodCategory === 'All' || f.category === selectedFoodCategory
    const q = searchQuery.toLowerCase().trim()
    if (!q) return matchesCat

    const matchesName = f.name.toLowerCase().includes(q)
    const matchesFoodCat = f.category.toLowerCase().includes(q)
    const matchesKeyMicros = f.keyMicros?.some(k => k.toLowerCase().includes(q))
    
    // Check if searching for a specific micronutrient name (e.g., 'magnesium', 'iron', 'vitamin d')
    const matchesMicroName = MICRONUTRIENTS_DATA.some(m => {
      if (m.name.toLowerCase().includes(q) || m.shortName.toLowerCase().includes(q)) {
        return (f.micros?.[m.id] || 0) > 0
      }
      return false
    })

    return matchesCat && (matchesName || matchesFoodCat || matchesKeyMicros || matchesMicroName)
  })

  // Toggle meal micronutrients display
  const toggleMealExpanded = (id) => {
    setExpandedMealIds(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // Quick Add from Library
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
      micros: { ...(food.micros || {}) },
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    onAddMeal(newEntry)
  }

  // Preset boosters for Custom Meal modal
  const applyPresetBooster = (preset) => {
    if (preset === 'veggies') {
      setCustomMeal(prev => ({
        ...prev,
        micros: {
          ...prev.micros,
          iron: '3.5',
          vit_c: '50',
          vit_a: '650',
          magnesium: '65',
          potassium: '450',
          calcium: '120'
        }
      }))
    } else if (preset === 'seafood') {
      setCustomMeal(prev => ({
        ...prev,
        micros: {
          ...prev.micros,
          omega_3: '1500',
          vit_d: '600',
          vit_b12: '4.5',
          potassium: '500',
          magnesium: '45',
          zinc: '1.2'
        }
      }))
    } else if (preset === 'multivitamin') {
      setCustomMeal(prev => ({
        ...prev,
        micros: {
          vit_d: '800',
          vit_b12: '2.4',
          vit_c: '90',
          vit_a: '900',
          zinc: '11',
          iron: '14',
          magnesium: '100',
          calcium: '150',
          potassium: '100',
          omega_3: '0'
        }
      }))
    } else if (preset === 'clear') {
      setCustomMeal(prev => ({
        ...prev,
        micros: {
          vit_d: '',
          vit_b12: '',
          vit_c: '',
          vit_a: '',
          magnesium: '',
          zinc: '',
          iron: '',
          calcium: '',
          potassium: '',
          omega_3: ''
        }
      }))
    }
  }

  // Custom Meal Submit
  const handleCustomSubmit = (e) => {
    e.preventDefault()
    if (!customMeal.name.trim()) return

    const p = parseFloat(customMeal.protein) || 0
    const c = parseFloat(customMeal.carbs) || 0
    const f = parseFloat(customMeal.fat) || 0
    const computedCal = Math.round(p * 4 + c * 4 + f * 9)

    // Parse micros
    const cleanedMicros = {}
    Object.keys(customMeal.micros).forEach(key => {
      const val = parseFloat(customMeal.micros[key])
      if (!isNaN(val) && val > 0) {
        cleanedMicros[key] = val
      }
    })

    const newEntry = {
      id: 'm_' + Date.now(),
      mealType: customMeal.mealType,
      name: customMeal.name,
      serving: customMeal.serving || '1 portion',
      calories: computedCal,
      protein: p,
      carbs: c,
      fat: f,
      micros: cleanedMicros,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    onAddMeal(newEntry)
    setCustomMeal({
      name: '',
      mealType: 'Lunch',
      serving: '1 serving',
      protein: '',
      carbs: '',
      fat: '',
      micros: {
        vit_d: '',
        vit_b12: '',
        vit_c: '',
        vit_a: '',
        magnesium: '',
        zinc: '',
        iron: '',
        calcium: '',
        potassium: '',
        omega_3: ''
      }
    })
    setShowMicrosInForm(false)
    setShowCustomModal(false)
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner: Calories & Macronutrients */}
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
              Goal: {profile.goal?.replace(/_/g, ' ') || 'Maintain'}
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

      {/* NEW: Daily Micronutrients & Minerals Tracker Section */}
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
            padding: '14px 20px',
            minWidth: '240px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                RDA FULFILLMENT
              </span>
              <span className={`badge ${metMicrosCount >= 7 ? 'badge-emerald' : 'badge-amber'}`}>
                {metMicrosCount >= 7 ? 'Optimal' : 'In Progress'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>
                {metMicrosCount} / {totalMicrosCount}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--primary-light)', fontWeight: '600' }}>
                targets met ({avgMicroPercent}%)
              </span>
            </div>
            <div className="progress-container" style={{ marginTop: '8px', height: '6px' }}>
              <div 
                className="progress-bar" 
                style={{ 
                  width: `${avgMicroPercent}%`, 
                  background: metMicrosCount >= 7 
                    ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)' 
                    : 'linear-gradient(90deg, #a855f7 0%, #38bdf8 100%)' 
                }} 
              />
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
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '14px'
        }}>
          {filteredMicros.map(micro => {
            const isMet = micro.isMet
            const displayPercent = Math.min(200, micro.percent)

            return (
              <div
                key={micro.id}
                style={{
                  background: isMet ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                  border: isMet ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
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

                    {isMet ? (
                      <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                        <Check size={11} /> {micro.percent}% Met
                      </span>
                    ) : micro.percent >= 60 ? (
                      <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                        {micro.percent}%
                      </span>
                    ) : (
                      <span className="badge badge-rose" style={{ fontSize: '0.7rem' }}>
                        {micro.percent}%
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
                      Top: <strong style={{ color: '#cbd5e1' }}>{micro.topContributor.name.slice(0, 15)}...</strong>
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
                      onClick={() => handleQuickAdd(food)}
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
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button 
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsAddFoodModalOpen(true)}
              >
                <Barcode size={14} color="var(--accent-blue)" />
                <span>Scan Barcode / Label</span>
              </button>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => setShowCustomModal(true)}
              >
                <Plus size={15} /> Log Custom Food
              </button>
            </div>
          </div>

          {mealLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <p>No meals recorded today yet.</p>
              <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Select an item from the Quick Library or log custom macros and vitamins!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {mealLogs.map((meal) => {
                const isExpanded = !!expandedMealIds[meal.id]
                const mealMicros = meal.micros || {}
                const microEntries = Object.entries(mealMicros).filter(([_, val]) => Number(val) > 0)

                return (
                  <div 
                    key={meal.id}
                    style={{
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-color)',
                      transition: 'var(--transition)',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Top Row: Basic Info */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="badge badge-blue">{meal.mealType}</span>
                          <strong style={{ fontSize: '0.95rem' }}>{meal.name}</strong>
                        </div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {meal.serving} • {meal.time}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--primary-light)' }}>
                            {meal.calories} kcal
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                            P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                          </div>
                        </div>

                        {/* Micronutrients expand toggle */}
                        {microEntries.length > 0 && (
                          <button
                            onClick={() => toggleMealExpanded(meal.id)}
                            className="btn btn-secondary btn-sm"
                            style={{ 
                              padding: '5px 8px', 
                              fontSize: '0.75rem', 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '4px' 
                            }}
                            title="Toggle vitamin & mineral breakdown"
                          >
                            <Sparkles size={12} color="var(--accent-purple)" />
                            <span>Micros</span>
                            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                        )}

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

                    {/* Expandable Micronutrient Breakdown */}
                    {isExpanded && microEntries.length > 0 && (
                      <div style={{
                        padding: '10px 14px 14px 14px',
                        background: 'rgba(0, 0, 0, 0.25)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                          Vitamins & Minerals in this meal:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {microEntries.map(([microId, val]) => {
                            const meta = MICRONUTRIENTS_DATA.find(m => m.id === microId)
                            if (!meta) return null
                            const pctOfRda = Math.round((Number(val) / meta.targetValue) * 100)
                            const isHigh = pctOfRda >= 25

                            return (
                              <span 
                                key={microId} 
                                className={`micro-pill ${isHigh ? 'highlight' : ''}`}
                                title={`${meta.name}: ${val} ${meta.unit} (${pctOfRda}% of daily RDA)`}
                              >
                                <strong>{meta.shortName}:</strong> {val} {meta.unit}
                                {isHigh && <span style={{ fontSize: '0.68rem', color: 'var(--primary-light)' }}>({pctOfRda}% RDA)</span>}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Includes Vitamins & Minerals</span>
              <button
                type="button"
                onClick={() => setIsAddFoodModalOpen(true)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.76rem', padding: '4px 10px' }}
              >
                <Plus size={13} color="var(--primary-light)" /> Add Food
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
            <input 
              type="text"
              placeholder="Search food, nutrient (e.g. magnesium, iron, omega)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '38px', fontSize: '0.88rem' }}
            />
          </div>

          {/* Category Chips */}
          <div style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            paddingBottom: '8px',
            marginBottom: '10px'
          }}>
            {foodCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedFoodCategory(cat)}
                className={`btn btn-sm ${selectedFoodCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '3px 10px', fontSize: '0.76rem', whiteSpace: 'nowrap' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Food List */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '10px', 
            maxHeight: '450px', 
            overflowY: 'auto',
            paddingRight: '4px' 
          }}>
            {filteredQuickFoods.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                No foods found matching "{searchQuery}".
              </div>
            ) : (
              filteredQuickFoods.map((food) => (
                <div 
                  key={food.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-color)',
                    transition: 'var(--transition)',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.92rem' }}>{food.name}</div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {food.serving} • <span style={{ color: 'var(--accent-blue)' }}>{food.protein}g P</span> | <span style={{ color: 'var(--accent-yellow)' }}>{food.carbs}g C</span> | <span style={{ color: 'var(--accent-red)' }}>{food.fat}g F</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--primary-light)' }}>
                        {food.calories} cal
                      </span>
                      <button
                        onClick={() => setPreviewFood(food)}
                        className="btn-ghost"
                        style={{ padding: '5px', cursor: 'pointer' }}
                        title="View Full Nutritional & Micronutrient Panel"
                      >
                        <Info size={15} color="var(--accent-blue)" />
                      </button>
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

                  {/* Micronutrient Badges */}
                  {food.keyMicros && food.keyMicros.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', alignItems: 'center' }}>
                      <Sparkles size={11} color="var(--accent-purple)" />
                      {food.keyMicros.map((tag, idx) => (
                        <span key={idx} className="micro-pill highlight" style={{ fontSize: '0.7rem', padding: '1px 6px' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Food Micronutrient Details Preview Modal */}
      {previewFood && (
        <div 
          onClick={() => setPreviewFood(null)}
          style={{
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
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="glass-panel" 
            style={{
              maxWidth: '520px',
              width: '100%',
              padding: '26px',
              background: 'var(--bg-card-solid)',
              border: '1px solid var(--border-color)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="badge badge-purple">{previewFood.category}</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '6px' }}>
                  {previewFood.name}
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Portion: {previewFood.serving}
                </span>
              </div>
              <button 
                type="button"
                onClick={() => setPreviewFood(null)}
                className="btn-ghost"
                style={{ padding: '6px', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Macros summary row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '18px',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CALORIES</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary-light)' }}>{previewFood.calories}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-blue)' }}>PROTEIN</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>{previewFood.protein}g</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-yellow)' }}>CARBS</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>{previewFood.carbs}g</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-red)' }}>FAT</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>{previewFood.fat}g</div>
              </div>
            </div>

            {/* Full Micronutrients Table */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <Sparkles size={15} color="var(--accent-purple)" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Vitamins & Minerals Breakdown</h4>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {MICRONUTRIENTS_DATA.map(micro => {
                  const val = previewFood.micros?.[micro.id] || 0
                  const pct = Math.round((val / micro.targetValue) * 100)

                  return (
                    <div 
                      key={micro.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        background: val > 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: val > 0 ? '#fff' : 'var(--text-dim)' }}>
                          {micro.name}
                        </span>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                          RDA: {micro.rda}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.9rem', color: val > 0 ? 'var(--primary-light)' : 'var(--text-dim)' }}>
                          {val} {micro.unit}
                        </span>
                        {val > 0 && (
                          <span style={{ fontSize: '0.74rem', color: pct >= 25 ? 'var(--primary-light)' : 'var(--text-muted)', marginLeft: '6px' }}>
                            ({pct}% RDA)
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button"
                onClick={() => setPreviewFood(null)} 
                className="btn btn-secondary" 
                style={{ flex: 1 }}
              >
                Close
              </button>
              <button 
                type="button"
                onClick={() => {
                  handleQuickAdd(previewFood)
                  setPreviewFood(null)
                }} 
                className="btn btn-primary" 
                style={{ flex: 1 }}
              >
                <Plus size={16} /> Log This Food
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Custom Meal Modal with Vitamins & Minerals */}
      {showCustomModal && (
        <div 
          onClick={() => setShowCustomModal(false)}
          style={{
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
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="glass-panel" 
            style={{
              maxWidth: '540px',
              width: '100%',
              padding: '26px',
              background: 'var(--bg-card-solid)',
              border: '1px solid var(--border-color)',
              maxHeight: '92vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700' }}>
                Log Custom Food / Meal
              </h3>
              <button onClick={() => setShowCustomModal(false)} className="btn-ghost" style={{ padding: '6px' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="input-group">
                <label className="input-label">Food / Dish Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Homemade Turkey Chili & Rice"
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

              {/* Macronutrient Inputs */}
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

              {/* Collapsible Vitamins & Minerals Section */}
              <div style={{
                border: '1px solid rgba(168, 85, 247, 0.25)',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(168, 85, 247, 0.04)',
                padding: '14px'
              }}>
                <div 
                  onClick={() => setShowMicrosInForm(!showMicrosInForm)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} color="var(--accent-purple)" />
                    <span style={{ fontWeight: '700', fontSize: '0.92rem', color: '#fff' }}>
                      Add Vitamins & Minerals (Optional)
                    </span>
                  </div>
                  <button type="button" className="btn-ghost" style={{ padding: '2px' }}>
                    {showMicrosInForm ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                {showMicrosInForm && (
                  <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Quick booster presets */}
                    <div>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>
                        1-Click Profile Presets:
                      </span>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                        <button 
                          type="button" 
                          onClick={() => applyPresetBooster('veggies')} 
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                        >
                          🌿 Veggies Boost
                        </button>
                        <button 
                          type="button" 
                          onClick={() => applyPresetBooster('seafood')} 
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                        >
                          🐟 Seafood & Omega
                        </button>
                        <button 
                          type="button" 
                          onClick={() => applyPresetBooster('multivitamin')} 
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                        >
                          💊 Multivitamin Tablet
                        </button>
                        <button 
                          type="button" 
                          onClick={() => applyPresetBooster('clear')} 
                          className="btn-ghost"
                          style={{ fontSize: '0.72rem', padding: '3px 6px', color: 'var(--accent-red)' }}
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    {/* Inputs for each micronutrient */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '10px'
                    }}>
                      {MICRONUTRIENTS_DATA.map(micro => (
                        <div key={micro.id} className="input-group">
                          <label className="input-label" style={{ fontSize: '0.75rem', textTransform: 'none' }}>
                            {micro.shortName} <span style={{ color: 'var(--text-dim)' }}>({micro.unit})</span>
                          </label>
                          <input 
                            type="number"
                            step="any"
                            min="0"
                            placeholder={`0 ${micro.unit}`}
                            value={customMeal.micros[micro.id] || ''}
                            onChange={(e) => setCustomMeal({
                              ...customMeal,
                              micros: {
                                ...customMeal.micros,
                                [micro.id]: e.target.value
                              }
                            })}
                            className="input-field"
                            style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button type="button" onClick={() => setShowCustomModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Save & Log Food
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Food Modal (Barcode / Photo OCR / Manual) */}
      {isAddFoodModalOpen && (
        <AddFoodModal
          isOpen={isAddFoodModalOpen}
          onClose={() => setIsAddFoodModalOpen(false)}
          onSave={(newFood) => {
            if (onAddNewFoodToLibrary) onAddNewFoodToLibrary(newFood)
            handleQuickAdd(newFood)
            setIsAddFoodModalOpen(false)
          }}
        />
      )}

    </div>
  )
}
