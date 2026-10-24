import React, { useState, useMemo } from 'react'
import { 
  Database, 
  Search, 
  Plus, 
  Trash2, 
  Barcode, 
  Camera, 
  Check
} from 'lucide-react'
import AddFoodModal from './AddFoodModal'

export default function FoodDatabaseView({ 
  foodLibrary = [], 
  onAddFood, 
  onDeleteFood,
  onQuickLogMeal 
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [addedNotice, setAddedNotice] = useState(null)

  const categories = ['All', 'Protein', 'Carbs', 'Healthy Fats', 'Dairy', 'Produce', 'Supplement', 'Custom / Scanned']

  const filteredFoods = useMemo(() => {
    return foodLibrary.filter(food => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch = !q || 
        food.name.toLowerCase().includes(q) || 
        (food.category && food.category.toLowerCase().includes(q)) ||
        (food.barcode && food.barcode.includes(q))

      let matchesCat = true
      if (selectedCategory === 'All') matchesCat = true
      else if (selectedCategory === 'Custom / Scanned') {
        matchesCat = food.source === 'barcode' || food.source === 'ocr_label' || food.source === 'manual' || food.id.startsWith('f_custom_')
      } else {
        matchesCat = food.category === selectedCategory
      }

      return matchesSearch && matchesCat
    })
  }, [foodLibrary, searchQuery, selectedCategory])

  const customCount = foodLibrary.filter(f => f.id.startsWith('f_custom_') || f.source === 'barcode' || f.source === 'ocr_label').length

  const handleQuickAdd = (food) => {
    if (onQuickLogMeal) {
      onQuickLogMeal(food)
      setAddedNotice(food.id)
      setTimeout(() => setAddedNotice(null), 2500)
    }
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className="badge badge-emerald">Food & Ingredient Database</span>
            <span className="badge badge-blue">{foodLibrary.length} Library Items</span>
            {customCount > 0 && <span className="badge badge-purple">{customCount} Scanned / Added</span>}
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>
            Food & Micronutrient Database
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '700px', marginTop: '4px' }}>
            Search, filter, and manage your nutritional ingredients. Add any item anytime via Barcode Scanning, Nutrition Facts Label Photo, or Manual Entry.
          </p>
        </div>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn btn-primary"
          style={{ padding: '12px 22px', fontSize: '0.96rem' }}
        >
          <Plus size={18} />
          <span>Add Food (Barcode / Photo / Manual)</span>
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search 
              size={18} 
              color="var(--text-muted)" 
              aria-hidden="true"
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} 
            />
            <input
              type="text"
              id="food-library-search"
              name="foodSearch"
              autoComplete="off"
              aria-label="Search food by name, category, or barcode number"
              placeholder="Search food by name, category, or barcode number…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '40px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                aria-pressed={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: selectedCategory === cat ? '700' : '500',
                  border: selectedCategory === cat ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  background: selectedCategory === cat ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  color: selectedCategory === cat ? 'var(--primary-light)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'var(--transition)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Foods Grid */}
      {filteredFoods.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <Database size={40} color="var(--text-dim)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>No matching foods found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '6px' }}>
            Can't find the item you're looking for? Scan or add it to the database now.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary"
            style={{ marginTop: '16px' }}
          >
            <Plus size={16} /> Add Food to Database Now
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '18px'
        }}>
          {filteredFoods.map(food => {
            const isCustom = food.id.startsWith('f_custom_') || food.source === 'barcode' || food.source === 'ocr_label'
            return (
              <div
                key={food.id}
                className="glass-panel"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: isCustom ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid var(--border-color)',
                  background: isCustom ? 'rgba(24, 20, 38, 0.7)' : undefined
                }}
              >
                <div>
                  {/* Top Bar: Category & Source */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span className="badge badge-emerald">{food.category}</span>
                    
                    {food.source === 'barcode' && (
                      <span className="badge badge-blue">
                        <Barcode size={12} /> Scanned Barcode
                      </span>
                    )}
                    {food.source === 'ocr_label' && (
                      <span className="badge badge-purple">
                        <Camera size={12} /> Photo OCR
                      </span>
                    )}
                    {food.source === 'manual' && isCustom && (
                      <span className="badge badge-amber">
                        Manual Entry
                      </span>
                    )}
                  </div>

                  {/* Title & Serving */}
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '4px' }}>
                    {food.name}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    Database serving size: <strong style={{ color: 'var(--text-main)' }}>{food.serving}</strong>
                  </div>

                  {/* Calories & Macros Row */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '6px',
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '10px',
                    borderRadius: 'var(--radius-sm)',
                    textAlign: 'center',
                    marginBottom: '14px'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Calories</div>
                      <div className="tabular-nums" style={{ fontWeight: '800', color: 'var(--primary-light)', fontSize: '1.05rem' }}>
                        {food.calories}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--macro-protein)' }}>Protein</div>
                      <div className="tabular-nums" style={{ fontWeight: '700', color: 'var(--macro-protein)', fontSize: '0.96rem' }}>
                        {food.protein}g
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--macro-carbs)' }}>Carbs</div>
                      <div className="tabular-nums" style={{ fontWeight: '700', color: 'var(--macro-carbs)', fontSize: '0.96rem' }}>
                        {food.carbs}g
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--macro-fat)' }}>Fat</div>
                      <div className="tabular-nums" style={{ fontWeight: '700', color: 'var(--macro-fat)', fontSize: '0.96rem' }}>
                        {food.fat}g
                      </div>
                    </div>
                  </div>

                  {/* Micros highlights */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                    {food.keyMicros?.map((k, idx) => (
                      <span key={idx} className="micro-pill highlight">{k}</span>
                    ))}
                    {food.micros?.calcium > 0 && !food.keyMicros && (
                      <span className="micro-pill tabular-nums">Calcium: {food.micros.calcium}mg</span>
                    )}
                    {food.micros?.iron > 0 && !food.keyMicros && (
                      <span className="micro-pill tabular-nums">Iron: {food.micros.iron}mg</span>
                    )}
                    {food.micros?.magnesium > 0 && !food.keyMicros && (
                      <span className="micro-pill tabular-nums">Magnesium: {food.micros.magnesium}mg</span>
                    )}
                    {food.micros?.vit_d > 0 && !food.keyMicros && (
                      <span className="micro-pill tabular-nums">Vit D: {food.micros.vit_d}IU</span>
                    )}
                  </div>

                  {/* Caution Nutrients highlights */}
                  {food.cautions && (food.cautions.sodium > 0 || food.cautions.transFat > 0 || food.cautions.cholesterol > 0 || food.cautions.saturatedFat > 0 || food.cautions.addedSugar > 0) && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '14px' }}>
                      {food.cautions.sodium > 0 && (
                        <span className="micro-pill tabular-nums" style={{ color: food.cautions.sodium > 400 ? '#f43f5e' : 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          🧂 {food.cautions.sodium}mg Na
                        </span>
                      )}
                      {food.cautions.transFat > 0 && (
                        <span className="micro-pill tabular-nums" style={{ color: '#f43f5e', background: 'rgba(244, 63, 94, 0.1)', borderColor: 'rgba(244, 63, 94, 0.3)' }}>
                          ⚠️ {food.cautions.transFat}g Trans
                        </span>
                      )}
                      {food.cautions.cholesterol > 0 && (
                        <span className="micro-pill tabular-nums" style={{ color: food.cautions.cholesterol > 150 ? '#f59e0b' : 'var(--text-muted)' }}>
                          🍳 {food.cautions.cholesterol}mg Chol
                        </span>
                      )}
                      {food.cautions.saturatedFat > 0 && (
                        <span className="micro-pill tabular-nums" style={{ color: 'var(--text-muted)' }}>
                          Sat: {food.cautions.saturatedFat}g
                        </span>
                      )}
                      {food.cautions.addedSugar > 0 && (
                        <span className="micro-pill tabular-nums" style={{ color: '#ec4899' }}>
                          🍬 {food.cautions.addedSugar}g Sugar
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-color)'
                }}>
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(food)}
                    className="btn btn-secondary btn-sm"
                    aria-label={`Log ${food.name} to daily meals`}
                  >
                    {addedNotice === food.id ? (
                      <>
                        <Check size={14} color="var(--primary-light)" aria-hidden="true" /> Logged!
                      </>
                    ) : (
                      <>
                        <Plus size={14} aria-hidden="true" /> Log to Daily Meals
                      </>
                    )}
                  </button>

                  {isCustom && onDeleteFood && (
                    <button
                      type="button"
                      onClick={() => onDeleteFood(food.id)}
                      className="btn-ghost"
                      style={{ 
                        color: 'var(--accent-red)',
                        minWidth: '44px',
                        minHeight: '44px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      aria-label={`Delete ${food.name} from database`}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  )}
                </div>

              </div>
            )
          })}
        </div>
      )}

      {/* Add Food Modal */}
      {isAddModalOpen && (
        <AddFoodModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={(newFood) => {
            onAddFood(newFood)
            setIsAddModalOpen(false)
          }}
        />
      )}

    </div>
  )
}
