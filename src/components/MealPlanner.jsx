import React, { useState } from 'react'
import { 
  ChefHat, 
  Clock, 
  Flame, 
  Plus, 
  Sparkles, 
  ShoppingCart, 
  BookOpen, 
  Check 
} from 'lucide-react'
import { DEFAULT_MEAL_PREP_TEMPLATES } from '../data/initialData'

export default function MealPlanner({ onAddIngredientsToShoppingList }) {
  const [prepList, setPrepList] = useState(DEFAULT_MEAL_PREP_TEMPLATES)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPlan, setNewPlan] = useState({
    day: 'Saturday - Sunday',
    batchTitle: '',
    servings: '4 meals',
    prepTime: '40 mins',
    macroBreakdown: '500 kcal | 45g Protein | 40g Carbs | 12g Fat',
    recipe: '',
    tips: ''
  })
  const [copiedNotification, setCopiedNotification] = useState(null)

  const handleAddPlan = (e) => {
    e.preventDefault()
    if (!newPlan.batchTitle) return
    setPrepList([...prepList, newPlan])
    setNewPlan({
      day: 'Saturday - Sunday',
      batchTitle: '',
      servings: '4 meals',
      prepTime: '40 mins',
      macroBreakdown: '',
      recipe: '',
      tips: ''
    })
    setShowAddForm(false)
  }

  const handleTransferToShopping = (plan) => {
    // Extract simple ingredients
    const items = [
      `${plan.batchTitle} ingredients`,
      'Meal prep glass containers'
    ]
    if (onAddIngredientsToShoppingList) {
      onAddIngredientsToShoppingList(items)
      setCopiedNotification(plan.batchTitle)
      setTimeout(() => setCopiedNotification(null), 3000)
    }
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
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
            <span className="badge badge-emerald">Batch Cooking & Lifestyle</span>
            <span className="badge badge-amber">Saves 6+ hours weekly</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>
            Meal Prep Master & Batch Cooking
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '650px', marginTop: '4px' }}>
            Pre-cook nutrient-dense, macro-calculated meals in batches so healthy eating becomes effortless even on your busiest days.
          </p>
        </div>

        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
        >
          <Plus size={16} /> Add Batch Recipe
        </button>
      </div>

      {/* Add Batch Form Modal/Collapsible */}
      {showAddForm && (
        <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--primary)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>
            New Meal Prep Routine
          </h3>
          <form onSubmit={handleAddPlan} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div className="input-group">
                <label className="input-label">Days Planned</label>
                <input 
                  type="text" 
                  value={newPlan.day} 
                  onChange={(e) => setNewPlan({ ...newPlan, day: e.target.value })} 
                  className="input-field" 
                  placeholder="e.g. Monday - Thursday" 
                />
              </div>

              <div className="input-group">
                <label className="input-label">Recipe / Batch Name</label>
                <input 
                  type="text" 
                  required 
                  value={newPlan.batchTitle} 
                  onChange={(e) => setNewPlan({ ...newPlan, batchTitle: e.target.value })} 
                  className="input-field" 
                  placeholder="e.g. Teriyaki Turkey & Jasmine Rice" 
                />
              </div>

              <div className="input-group">
                <label className="input-label">Portions / Servings</label>
                <input 
                  type="text" 
                  value={newPlan.servings} 
                  onChange={(e) => setNewPlan({ ...newPlan, servings: e.target.value })} 
                  className="input-field" 
                />
              </div>

              <div className="input-group">
                <label className="input-label">Prep Time</label>
                <input 
                  type="text" 
                  value={newPlan.prepTime} 
                  onChange={(e) => setNewPlan({ ...newPlan, prepTime: e.target.value })} 
                  className="input-field" 
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Macros Per Portion</label>
              <input 
                type="text" 
                value={newPlan.macroBreakdown} 
                onChange={(e) => setNewPlan({ ...newPlan, macroBreakdown: e.target.value })} 
                className="input-field" 
                placeholder="e.g. 480 kcal | 42g Protein | 45g Carbs | 12g Fat" 
              />
            </div>

            <div className="input-group">
              <label className="input-label">Cooking Instructions / Ingredients</label>
              <textarea 
                rows="3"
                value={newPlan.recipe} 
                onChange={(e) => setNewPlan({ ...newPlan, recipe: e.target.value })} 
                className="input-field" 
                placeholder="Seasoning, oven temperature, boiling instructions..." 
              />
            </div>

            <div className="input-group">
              <label className="input-label">Storage & Reheating Tips</label>
              <input 
                type="text" 
                value={newPlan.tips} 
                onChange={(e) => setNewPlan({ ...newPlan, tips: e.target.value })} 
                className="input-field" 
                placeholder="Glass containers, freeze 2 portions, reheat with moist paper towel..." 
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Routine
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Meal Prep Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: '24px'
      }}>
        {prepList.map((plan, index) => (
          <div 
            key={index} 
            className="glass-panel" 
            style={{ 
              padding: '24px', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between' 
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span className="badge badge-emerald">{plan.day}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <Clock size={14} />
                  <span>{plan.prepTime}</span>
                  <span>•</span>
                  <span>{plan.servings}</span>
                </div>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '8px' }}>
                {plan.batchTitle}
              </h3>

              {/* Macro chip */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-color)',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem',
                color: 'var(--primary-light)',
                fontWeight: '600',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Flame size={15} color="var(--accent-orange)" />
                <span>{plan.macroBreakdown}</span>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '12px', lineHeight: 1.5 }}>
                {plan.recipe}
              </p>

              {plan.tips && (
                <div style={{
                  background: 'rgba(56, 189, 248, 0.06)',
                  border: '1px solid rgba(56, 189, 248, 0.15)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px',
                  fontSize: '0.78rem',
                  color: 'var(--accent-blue)',
                  marginBottom: '16px'
                }}>
                  💡 <strong>Pro Tip:</strong> {plan.tips}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <button 
                onClick={() => handleTransferToShopping(plan)}
                className="btn btn-secondary btn-sm"
              >
                {copiedNotification === plan.batchTitle ? (
                  <>
                    <Check size={14} color="var(--primary-light)" /> Added to Grocery!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={14} /> Add to Shopping List
                  </>
                )}
              </button>

              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                Portion Ready
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
