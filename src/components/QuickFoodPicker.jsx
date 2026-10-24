import React, { useState } from 'react'
import { Zap, Plus, Search, Info, Sparkles } from 'lucide-react'
import { MICRONUTRIENTS_DATA } from '../data/vitaminsMinerals'

export default function QuickFoodPicker({
  foodLibrary = [],
  onQuickAddFood,
  onPreviewFood,
  onOpenAddFoodModal
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFoodCategory, setSelectedFoodCategory] = useState('All')

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

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={18} color="var(--accent-yellow)" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Quick Food Library</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Includes Vitamins & Minerals</span>
          {onOpenAddFoodModal && (
            <button
              type="button"
              onClick={onOpenAddFoodModal}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.76rem', padding: '4px 10px' }}
            >
              <Plus size={13} color="var(--primary-light)" /> Add Food
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <Search size={16} aria-hidden="true" style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
        <input 
          type="text"
          id="dashboard-food-search"
          name="dashboardFoodSearch"
          autoComplete="off"
          aria-label="Search food or nutrient"
          placeholder="Search food, nutrient (e.g. magnesium, iron, omega)…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field"
          style={{ paddingLeft: '38px', fontSize: '0.88rem' }}
        />
      </div>

      {/* Category Chips */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '8px',
        marginBottom: '10px',
        WebkitOverflowScrolling: 'touch'
      }}>
        {foodCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedFoodCategory(cat)}
            className={`btn btn-sm ${selectedFoodCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
            style={{ 
              padding: '8px 14px', 
              fontSize: '0.82rem', 
              whiteSpace: 'nowrap',
              minHeight: '38px',
              borderRadius: '20px'
            }}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ minWidth: 0, flex: '1 1 180px' }}>
                  <div style={{ fontWeight: '600', fontSize: '0.92rem', wordBreak: 'break-word' }}>{food.name}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {food.serving} • <span style={{ color: 'var(--accent-blue)' }}>{food.protein}g P</span> | <span style={{ color: 'var(--accent-yellow)' }}>{food.carbs}g C</span> | <span style={{ color: 'var(--accent-red)' }}>{food.fat}g F</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: 'auto' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--primary-light)' }}>
                    {food.calories} cal
                  </span>
                  {onPreviewFood && (
                    <button
                      type="button"
                      onClick={() => onPreviewFood(food)}
                      className="btn-ghost"
                      style={{ 
                        minWidth: '40px', 
                        minHeight: '40px', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        borderRadius: '8px',
                        cursor: 'pointer' 
                      }}
                      title="View Full Nutritional & Micronutrient Panel"
                      aria-label={`View nutritional panel for ${food.name}`}
                    >
                      <Info size={18} color="var(--accent-blue)" />
                    </button>
                  )}
                  {onQuickAddFood && (
                    <button 
                      type="button"
                      onClick={() => onQuickAddFood(food)}
                      className="btn btn-secondary btn-sm"
                      style={{ 
                        padding: '6px 14px', 
                        minHeight: '40px',
                        fontWeight: '700'
                      }}
                      title="Add to daily log"
                    >
                      <Plus size={15} /> Add
                    </button>
                  )}
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
  )
}
