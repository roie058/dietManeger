import React, { useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { 
  X, 
  Plus, 
  Trash2, 
  ChefHat, 
  Clock, 
  Flame, 
  Sparkles, 
  Scale, 
  BookOpen, 
  Check, 
  AlertCircle,
  Barcode,
  Camera
} from 'lucide-react'
import { calculateRecipeNutrition, parseServingGrams } from '../utils/recipeCalculator'
import AddFoodModal from './AddFoodModal'

export default function RecipeBuilderModal({ 
  isOpen, 
  onClose, 
  onSaveRecipe, 
  foodLibrary = [], 
  onAddNewFoodToLibrary,
  editingRecipe = null 
}) {
  const [title, setTitle] = useState(editingRecipe?.title || '')
  const [category, setCategory] = useState(editingRecipe?.category || 'Lunch')
  const [servings, setServings] = useState(editingRecipe?.servings || 4)
  const [prepTime, setPrepTime] = useState(editingRecipe?.prepTime || '30 mins')
  const [instructions, setInstructions] = useState(editingRecipe?.instructions || '')
  const [tips, setTips] = useState(editingRecipe?.tips || '')
  
  // Ingredients list: array of { foodId, foodName, amountGrams, servingDesc }
  const [ingredients, setIngredients] = useState(() => {
    if (editingRecipe?.ingredients?.length) {
      return [...editingRecipe.ingredients]
    }
    // Default starter ingredients if new
    return [
      { foodId: 'f1', foodName: 'Grilled Chicken Breast', amountGrams: 500, servingDesc: '500g' },
      { foodId: 'f5', foodName: 'Steamed Jasmine / Brown Rice', amountGrams: 350, servingDesc: '350g' }
    ]
  })

  // Ingredient picker state
  const [selectedFoodId, setSelectedFoodId] = useState(foodLibrary[0]?.id || '')
  const [amountInput, setAmountInput] = useState(150)
  const [foodSearchQuery, setFoodSearchQuery] = useState('')
  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false)

  // Filtered foods for picker
  const filteredLibrary = useMemo(() => {
    const q = foodSearchQuery.toLowerCase().trim()
    if (!q) return foodLibrary
    return foodLibrary.filter(f => 
      f.name.toLowerCase().includes(q) || 
      (f.category && f.category.toLowerCase().includes(q))
    )
  }, [foodLibrary, foodSearchQuery])

  // Live nutritional calculations
  const nutrition = useMemo(() => {
    return calculateRecipeNutrition({
      servings,
      ingredients
    }, foodLibrary)
  }, [servings, ingredients, foodLibrary])

  if (!isOpen) return null

  // Add ingredient to list
  const handleAddIngredient = () => {
    const food = foodLibrary.find(f => f.id === selectedFoodId) || filteredLibrary[0]
    if (!food) return

    const grams = parseFloat(amountInput) || 100
    const existingIndex = ingredients.findIndex(i => i.foodId === food.id)

    if (existingIndex >= 0) {
      // Update amount
      const updated = [...ingredients]
      updated[existingIndex].amountGrams = grams
      updated[existingIndex].servingDesc = `${grams}g`
      setIngredients(updated)
    } else {
      setIngredients([
        ...ingredients,
        {
          foodId: food.id,
          foodName: food.name,
          amountGrams: grams,
          servingDesc: `${grams}g`
        }
      ])
    }
  }

  // Remove ingredient
  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, idx) => idx !== index))
  }

  // Update ingredient amount
  const handleUpdateAmount = (index, newGrams) => {
    const updated = [...ingredients]
    const g = Math.max(1, parseFloat(newGrams) || 0)
    updated[index].amountGrams = g
    updated[index].servingDesc = `${g}g`
    setIngredients(updated)
  }

  // Callback when a brand new food is created via AddFoodModal
  const handleNewFoodCreated = (newFood) => {
    // 1. Add to library
    onAddNewFoodToLibrary(newFood)
    // 2. Select it in dropdown
    setSelectedFoodId(newFood.id)
    // 3. Automatically append it to the current recipe!
    const grams = parseServingGrams(newFood.serving) || 100
    setIngredients(prev => [
      ...prev,
      {
        foodId: newFood.id,
        foodName: newFood.name,
        amountGrams: grams,
        servingDesc: `${grams}g`
      }
    ])
    setIsAddFoodModalOpen(false)
  }

  // Submit recipe
  const handleSave = (e) => {
    e.preventDefault()
    if (!title.trim() || ingredients.length === 0) return

    const savedRecipe = {
      id: editingRecipe?.id || 'r_' + Date.now(),
      title: title.trim(),
      category,
      servings: Math.max(1, parseInt(servings) || 1),
      prepTime: prepTime.trim() || '30 mins',
      instructions: instructions.trim(),
      tips: tips.trim(),
      ingredients: ingredients.map(i => ({
        foodId: i.foodId,
        foodName: i.foodName,
        amountGrams: i.amountGrams,
        servingDesc: i.servingDesc
      })),
      macrosSummary: `${nutrition.perServing.calories} kcal | ${nutrition.perServing.protein}g P | ${nutrition.perServing.carbs}g C | ${nutrition.perServing.fat}g F (per serving)`
    }

    onSaveRecipe(savedRecipe)
    onClose()
  }

  // Calculate Macro Percentages
  const calFromP = (nutrition.perServing.protein * 4)
  const calFromC = (nutrition.perServing.carbs * 4)
  const calFromF = (nutrition.perServing.fat * 9)
  const totalMacroCal = (calFromP + calFromC + calFromF) || 1
  const pctP = Math.round((calFromP / totalMacroCal) * 100)
  const pctC = Math.round((calFromC / totalMacroCal) * 100)
  const pctF = Math.round((calFromF / totalMacroCal) * 100)

  // Close on Escape key and lock body scroll
  React.useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <>
      <div 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-builder-title"
        className="modal-backdrop"
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          className="modal-card" 
          style={{
            maxWidth: '960px'
          }}
        >
          {/* Header */}
          <div className="modal-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px var(--primary-glow)'
              }}>
                <ChefHat size={22} color="#fff" aria-hidden="true" />
              </div>
              <div>
                <h3 id="recipe-builder-title" style={{ fontSize: '1.28rem', fontWeight: '800', color: '#fff' }}>
                  {editingRecipe ? 'Edit Recipe & Ingredients' : 'Recipe Creator & Nutrition Architect'}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Compose recipes from your food database with live calorie, macro, and micronutrient calculations
                </p>
              </div>
            </div>

            <button 
              type="button"
              onClick={onClose} 
              className="modal-close-btn"
              aria-label="Close recipe builder dialog"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          {/* Form Content */}
          <div className="modal-body">
            <form id="recipe-builder-form" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* General Info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <label className="input-label">Recipe Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pan-Seared Salmon with Lemon Quinoa & Greens"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="select-field"
                >
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Meal Prep">Meal Prep Batch</option>
                  <option value="Snack / Shake">Snack / Shake</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Portions / Servings</label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  required
                  value={servings}
                  onChange={(e) => setServings(Math.max(1, parseInt(e.target.value) || 1))}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Prep Time</label>
                <input
                  type="text"
                  placeholder="e.g. 30 mins"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            {/* INGREDIENTS SECTION */}
            <div style={{
              background: '#0d1527',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 'var(--radius-md)',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Scale size={18} color="var(--primary-light)" />
                    Recipe Ingredients
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Ingredients scale in real time based on grams from your food database.
                  </p>
                </div>

                {/* CRITICAL BUTTON: Add New Food to Database if not exists */}
                <button
                  type="button"
                  onClick={() => setIsAddFoodModalOpen(true)}
                  className="btn btn-secondary btn-sm"
                  style={{
                    borderColor: 'var(--primary-light)',
                    color: 'var(--primary-light)',
                    background: 'rgba(16, 185, 129, 0.1)',
                    fontWeight: '700'
                  }}
                >
                  <Plus size={15} />
                  <span>Ingredient missing? Scan Barcode / Photo Label / Manual</span>
                </button>
              </div>

              {/* Add Ingredient Bar */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(220px, 2fr) minmax(110px, 1fr) auto',
                gap: '10px',
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                alignItems: 'end'
              }}>
                <div className="input-group">
                  <label className="input-label" style={{ fontSize: '0.74rem' }}>Select Ingredient from Database</label>
                  <select
                    value={selectedFoodId}
                    onChange={(e) => setSelectedFoodId(e.target.value)}
                    className="select-field"
                    style={{ fontSize: '0.88rem' }}
                  >
                    {filteredLibrary.map(food => (
                      <option key={food.id} value={food.id}>
                        {food.name} ({food.calories} kcal / {food.serving})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label" style={{ fontSize: '0.74rem' }}>Quantity in Grams (g)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="100"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="input-field"
                    style={{ fontSize: '0.88rem' }}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="btn btn-primary"
                  style={{ height: '42px', whiteSpace: 'nowrap' }}
                >
                  <Plus size={16} />
                  <span>Add Ingredient</span>
                </button>
              </div>

              {/* Ingredients Table */}
              {nutrition.ingredientDetails.length === 0 ? (
                <div style={{
                  padding: '24px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.88rem',
                  border: '1px dashed var(--border-color)',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  No ingredients added yet. Select an ingredient above or add a new one to the database.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {nutrition.ingredientDetails.map((ing, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 14px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        flexWrap: 'wrap',
                        gap: '10px'
                      }}
                    >
                      <div style={{ flex: 1, minWidth: '180px' }}>
                        <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>
                          {ing.foodName}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                          Database base: {ing.food?.calories} kcal per {ing.food?.serving}
                        </div>
                      </div>

                      {/* Grams input */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input
                          type="number"
                          min="1"
                          value={ing.amountGrams}
                          onChange={(e) => handleUpdateAmount(idx, e.target.value)}
                          className="input-field"
                          style={{ width: '80px', padding: '4px 8px', fontSize: '0.86rem', textAlign: 'center' }}
                        />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>grams</span>
                      </div>

                      {/* Calculated macros for this ingredient row */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '0.82rem',
                        color: 'var(--text-main)'
                      }}>
                        <span style={{ color: 'var(--primary-light)', fontWeight: '700' }}>
                          {ing.nutrition.calories} kcal
                        </span>
                        <span style={{ color: 'var(--macro-protein)' }}>
                          P: {ing.nutrition.protein}g
                        </span>
                        <span style={{ color: 'var(--macro-carbs)' }}>
                          C: {ing.nutrition.carbs}g
                        </span>
                        <span style={{ color: 'var(--macro-fat)' }}>
                          F: {ing.nutrition.fat}g
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(idx)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--accent-red)', padding: '6px' }}
                        title="Remove ingredient"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* LIVE NUTRITION DASHBOARD FOR THIS RECIPE */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(56, 189, 248, 0.08) 100%), #0d1527',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: 'var(--radius-md)',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Flame size={20} color="var(--primary-light)" />
                  <h4 style={{ fontWeight: '800', fontSize: '1.1rem' }}>
                    Calculated Nutritional Profile
                  </h4>
                </div>
                <span className="badge badge-emerald">
                  Calculated per portion (1 of {servings} servings)
                </span>
              </div>

              {/* Macro Cards Per Serving vs Total */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Calories / Serving</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-light)' }}>
                    {nutrition.perServing.calories}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    Batch Total: {nutrition.total.calories}
                  </div>
                </div>

                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--macro-protein)' }}>Protein / Serving</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--macro-protein)' }}>
                    {nutrition.perServing.protein}g
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    Batch Total: {nutrition.total.protein}g
                  </div>
                </div>

                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--macro-carbs)' }}>Carbs / Serving</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--macro-carbs)' }}>
                    {nutrition.perServing.carbs}g
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    Batch Total: {nutrition.total.carbs}g
                  </div>
                </div>

                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--macro-fat)' }}>Fat / Serving</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--macro-fat)' }}>
                    {nutrition.perServing.fat}g
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    Batch Total: {nutrition.total.fat}g
                  </div>
                </div>
              </div>

              {/* Macro Ratio Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '4px', color: 'var(--text-muted)' }}>
                  <span>Macro Ratio: Protein {pctP}%</span>
                  <span>Carbs {pctC}%</span>
                  <span>Fat {pctF}%</span>
                </div>
                <div style={{ height: '8px', borderRadius: '4px', display: 'flex', overflow: 'hidden' }}>
                  <div style={{ width: `${pctP}%`, background: 'var(--macro-protein)' }} />
                  <div style={{ width: `${pctC}%`, background: 'var(--macro-carbs)' }} />
                  <div style={{ width: `${pctF}%`, background: 'var(--macro-fat)' }} />
                </div>
              </div>

              {/* Micronutrients Highlights */}
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '10px' }}>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Micronutrients & Vitamins Per Serving:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {nutrition.perServing.micros.vit_d > 0 && <span className="micro-pill highlight">Vitamin D3: {nutrition.perServing.micros.vit_d} IU</span>}
                  {nutrition.perServing.micros.vit_b12 > 0 && <span className="micro-pill highlight">Vitamin B12: {nutrition.perServing.micros.vit_b12} mcg</span>}
                  {nutrition.perServing.micros.iron > 0 && <span className="micro-pill highlight">Iron: {nutrition.perServing.micros.iron} mg</span>}
                  {nutrition.perServing.micros.magnesium > 0 && <span className="micro-pill highlight">Magnesium: {nutrition.perServing.micros.magnesium} mg</span>}
                  {nutrition.perServing.micros.potassium > 0 && <span className="micro-pill highlight">Potassium: {nutrition.perServing.micros.potassium} mg</span>}
                  {nutrition.perServing.micros.calcium > 0 && <span className="micro-pill highlight">Calcium: {nutrition.perServing.micros.calcium} mg</span>}
                  {nutrition.perServing.micros.vit_c > 0 && <span className="micro-pill highlight">Vitamin C: {nutrition.perServing.micros.vit_c} mg</span>}
                  {nutrition.perServing.micros.zinc > 0 && <span className="micro-pill highlight">Zinc: {nutrition.perServing.micros.zinc} mg</span>}
                  {nutrition.perServing.micros.omega_3 > 0 && <span className="micro-pill highlight">Omega-3: {nutrition.perServing.micros.omega_3} mg</span>}
                </div>
              </div>
            </div>

            {/* Instructions & Storage Tips */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="input-group">
                <label className="input-label">Cooking Instructions & Steps</label>
                <textarea
                  rows="3"
                  placeholder="Seasoning, oven temperature, pan-searing times, boiling steps…"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Storage & Meal Prep Tips</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Seal in airtight glass meal-prep containers. Keeps fresh for 4 days in fridge…"
                  value={tips}
                  onChange={(e) => setTips(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            </form>
          </div>

          {/* Fixed Modal Footer */}
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ minWidth: '100px' }}>
              Cancel
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-emerald" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
                {ingredients.length} {ingredients.length === 1 ? 'ingredient' : 'ingredients'} • {nutrition.perServing.calories} kcal / serving ({servings} {servings === 1 ? 'portion' : 'portions'})
              </span>
            </div>

            <button
              type="submit"
              form="recipe-builder-form"
              disabled={ingredients.length === 0 || !title.trim()}
              className="btn btn-primary"
              style={{ minWidth: '200px' }}
            >
              <Check size={16} />
              <span>Save Recipe to Library</span>
            </button>
          </div>

        </div>
      </div>

      {/* Embedded Add Food Modal when an ingredient doesn't exist */}
      {isAddFoodModalOpen && (
        <AddFoodModal
          isOpen={isAddFoodModalOpen}
          onClose={() => setIsAddFoodModalOpen(false)}
          onSave={handleNewFoodCreated}
        />
      )}
    </>,
    document.body
  )
}
