import React, { useState, useMemo } from 'react'
import { 
  ChefHat, 
  Clock, 
  Flame, 
  Plus, 
  Sparkles, 
  ShoppingCart, 
  BookOpen, 
  Check, 
  Scale, 
  Trash2, 
  Edit3, 
  ChevronDown, 
  ChevronUp, 
  Utensils, 
  Calendar 
} from 'lucide-react'
import { calculateRecipeNutrition } from '../utils/recipeCalculator'
import RecipeBuilderModal from './RecipeBuilderModal'
import WeeklyMealCalendar from './WeeklyMealCalendar'

export default function MealPlanner({ 
  recipes = [], 
  onSaveRecipe, 
  onDeleteRecipe, 
  foodLibrary = [], 
  onAddNewFoodToLibrary, 
  onAddIngredientsToShoppingList,
  onLogMeal,
  onLogBatchMeals,
  targetCalories = 2350
}) {
  const [plannerTab, setPlannerTab] = useState('calendar') // 'calendar' | 'recipes'
  const [activeCategory, setActiveCategory] = useState('All')
  const [expandedRecipeIds, setExpandedRecipeIds] = useState({ r1: true }) // expand first by default
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState(null)
  
  // Notice states for 1-click feedback
  const [loggedNotice, setLoggedNotice] = useState(null)
  const [copiedGroceryNotice, setCopiedGroceryNotice] = useState(null)

  // Meal logging dropdown states
  const [loggingRecipeId, setLoggingRecipeId] = useState(null)
  const [logMealType, setLogMealType] = useState('Lunch')
  const [logPortions, setLogPortions] = useState(1)

  const categories = ['All', 'Lunch', 'Dinner', 'Breakfast', 'Meal Prep', 'Snack / Shake']

  const filteredRecipes = useMemo(() => {
    if (activeCategory === 'All') return recipes
    return recipes.filter(r => r.category === activeCategory)
  }, [recipes, activeCategory])

  const toggleExpand = (id) => {
    setExpandedRecipeIds(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // Transfer recipe ingredients to shopping list
  const handleTransferToShopping = (recipe) => {
    const items = (recipe.ingredients || []).map(ing => {
      return `${ing.amountGrams}g ${ing.foodName}`
    })
    if (items.length === 0) {
      items.push(`${recipe.title} ingredients`)
    }

    if (onAddIngredientsToShoppingList) {
      onAddIngredientsToShoppingList(items)
      setCopiedGroceryNotice(recipe.id)
      setTimeout(() => setCopiedGroceryNotice(null), 3000)
    }
  }

  // Log recipe serving to daily meals
  const handleConfirmLogMeal = (recipe) => {
    const calc = calculateRecipeNutrition(recipe, foodLibrary)
    const portionCount = parseFloat(logPortions) || 1

    const newMealEntry = {
      id: 'm_recipe_' + Date.now(),
      mealType: logMealType,
      name: `${recipe.title} (${portionCount} serving${portionCount > 1 ? 's' : ''})`,
      serving: `${portionCount} portion(s)`,
      calories: Math.round(calc.perServing.calories * portionCount),
      protein: Math.round(calc.perServing.protein * portionCount * 10) / 10,
      carbs: Math.round(calc.perServing.carbs * portionCount * 10) / 10,
      fat: Math.round(calc.perServing.fat * portionCount * 10) / 10,
      micros: {},
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    // Scale micros
    Object.keys(calc.perServing.micros).forEach(key => {
      newMealEntry.micros[key] = Math.round((calc.perServing.micros[key] || 0) * portionCount * 10) / 10
    })

    if (onLogMeal) {
      onLogMeal(newMealEntry)
      setLoggedNotice(recipe.id)
      setLoggingRecipeId(null)
      setTimeout(() => setLoggedNotice(null), 3000)
    }
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Sub-Navigation: Weekly 7-Day Calendar vs Recipe Architect */}
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
          onClick={() => setPlannerTab('calendar')}
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            fontSize: '0.92rem',
            fontWeight: plannerTab === 'calendar' ? '700' : '500',
            background: plannerTab === 'calendar' ? 'var(--primary)' : 'transparent',
            color: plannerTab === 'calendar' ? '#0f172a' : 'var(--text-muted)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'var(--transition)'
          }}
        >
          <Calendar size={17} />
          <span>7-Day Meal Calendar & Auto-Shopping</span>
        </button>

        <button
          type="button"
          onClick={() => setPlannerTab('recipes')}
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            fontSize: '0.92rem',
            fontWeight: plannerTab === 'recipes' ? '700' : '500',
            background: plannerTab === 'recipes' ? 'var(--primary)' : 'transparent',
            color: plannerTab === 'recipes' ? '#0f172a' : 'var(--text-muted)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'var(--transition)'
          }}
        >
          <ChefHat size={17} />
          <span>Recipe & Batch Prep Library ({recipes.length})</span>
        </button>
      </div>

      {plannerTab === 'calendar' ? (
        <WeeklyMealCalendar
          recipes={recipes}
          foodLibrary={foodLibrary}
          onAddIngredientsToShoppingList={onAddIngredientsToShoppingList}
          onLogMeal={onLogMeal}
          onLogBatchMeals={onLogBatchMeals}
          targetCalories={targetCalories}
        />
      ) : (
        <>
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
            <span className="badge badge-emerald">Recipe & Meal Prep Architect</span>
            <span className="badge badge-amber">{recipes.length} Saved Recipes</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>
            Meal Prep & Recipe Builder
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '720px', marginTop: '4px' }}>
            Build precision recipes by selecting ingredients from your food database. Calorie, macro, and micronutrient totals are calculated automatically per portion and batch.
          </p>
        </div>

        <button 
          onClick={() => {
            setEditingRecipe(null)
            setIsBuilderOpen(true)
          }}
          className="btn btn-primary"
          style={{ padding: '12px 22px', fontSize: '0.96rem' }}
        >
          <Plus size={18} />
          <span>Create New Recipe (From Ingredients)</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="glass-panel" style={{ padding: '12px 20px', display: 'flex', gap: '8px', overflowX: 'auto' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '8px 18px',
              borderRadius: '20px',
              fontSize: '0.86rem',
              fontWeight: activeCategory === cat ? '700' : '500',
              border: activeCategory === cat ? '1px solid var(--primary)' : '1px solid var(--border-color)',
              background: activeCategory === cat ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              color: activeCategory === cat ? 'var(--primary-light)' : 'var(--text-muted)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'var(--transition)'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recipe Cards List */}
      {filteredRecipes.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <ChefHat size={44} color="var(--text-dim)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>No recipes in this category</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '6px' }}>
            Start composing your first recipe by picking ingredients from the food database.
          </p>
          <button
            onClick={() => {
              setEditingRecipe(null)
              setIsBuilderOpen(true)
            }}
            className="btn btn-primary"
            style={{ marginTop: '16px' }}
          >
            <Plus size={16} /> Create Recipe Now
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
          {filteredRecipes.map(recipe => {
            const calc = calculateRecipeNutrition(recipe, foodLibrary)
            const isExpanded = !!expandedRecipeIds[recipe.id]
            const isLogging = loggingRecipeId === recipe.id

            return (
              <div
                key={recipe.id}
                className="glass-panel"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid var(--border-color)',
                  position: 'relative'
                }}
              >
                <div>
                  {/* Top Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-emerald">{recipe.category || 'Recipe'}</span>
                      <span className="badge badge-blue">{calc.servings} Servings</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <Clock size={14} />
                      <span>{recipe.prepTime || '30 mins'}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '12px' }}>
                    {recipe.title}
                  </h3>

                  {/* Per-Serving Macro Chip Banner */}
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '800', color: 'var(--primary-light)', fontSize: '1.1rem' }}>
                        <Flame size={18} color="var(--accent-orange)" />
                        <span>{calc.perServing.calories} kcal / portion</span>
                      </div>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        Batch Total: {calc.total.calories} kcal
                      </span>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '8px',
                      background: 'rgba(0, 0, 0, 0.25)',
                      padding: '8px',
                      borderRadius: 'var(--radius-sm)',
                      textAlign: 'center',
                      fontSize: '0.82rem'
                    }}>
                      <div>
                        <span style={{ color: 'var(--macro-protein)', fontWeight: '700' }}>
                          P: {calc.perServing.protein}g
                        </span>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Protein</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--macro-carbs)', fontWeight: '700' }}>
                          C: {calc.perServing.carbs}g
                        </span>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Carbs</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--macro-fat)', fontWeight: '700' }}>
                          F: {calc.perServing.fat}g
                        </span>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Fat</div>
                      </div>
                    </div>
                  </div>

                  {/* Ingredients Count Preview & Accordion Button */}
                  <div style={{ marginBottom: '14px' }}>
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={`recipe-ingredients-${recipe.id}`}
                      aria-label={`Toggle ingredients list for ${recipe.title}`}
                      onClick={() => toggleExpand(recipe.id)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: 'var(--text-main)',
                        fontSize: '0.84rem',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                        <Scale size={14} color="var(--primary-light)" aria-hidden="true" />
                        <span>Recipe Ingredients ({calc.ingredientDetails.length} items)</span>
                      </span>
                      {isExpanded ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
                    </button>

                    {/* Expanded Ingredients & Instructions */}
                    {isExpanded && (
                      <div 
                        id={`recipe-ingredients-${recipe.id}`}
                        style={{
                        marginTop: '8px',
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {calc.ingredientDetails.map((ing, idx) => (
                            <div 
                              key={idx}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '0.82rem',
                                padding: '4px 0',
                                borderBottom: idx < calc.ingredientDetails.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
                              }}
                            >
                              <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                                • {ing.amountGrams}g {ing.foodName}
                              </span>
                              <span style={{ color: 'var(--text-muted)' }}>
                                {ing.nutrition.calories} kcal (P:{ing.nutrition.protein}g)
                              </span>
                            </div>
                          ))}
                        </div>

                        {recipe.instructions && (
                          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '8px' }}>
                            <div style={{ fontSize: '0.76rem', color: 'var(--primary-light)', fontWeight: '700', marginBottom: '4px' }}>
                              Cooking Instructions:
                            </div>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                              {recipe.instructions}
                            </p>
                          </div>
                        )}

                        {recipe.tips && (
                          <div style={{
                            background: 'rgba(56, 189, 248, 0.08)',
                            border: '1px solid rgba(56, 189, 248, 0.2)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '8px 10px',
                            fontSize: '0.78rem',
                            color: 'var(--accent-blue)'
                          }}>
                            💡 {recipe.tips}
                          </div>
                        )}

                        {/* Micronutrients Per Serving */}
                        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '8px' }}>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                            Micronutrients & Vitamins Per Serving:
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {calc.perServing.micros.vit_d > 0 && <span className="micro-pill highlight">Vit D: {calc.perServing.micros.vit_d}IU</span>}
                            {calc.perServing.micros.vit_b12 > 0 && <span className="micro-pill highlight">Vit B12: {calc.perServing.micros.vit_b12}mcg</span>}
                            {calc.perServing.micros.iron > 0 && <span className="micro-pill">Iron: {calc.perServing.micros.iron}mg</span>}
                            {calc.perServing.micros.calcium > 0 && <span className="micro-pill">Calcium: {calc.perServing.micros.calcium}mg</span>}
                            {calc.perServing.micros.magnesium > 0 && <span className="micro-pill">Magnesium: {calc.perServing.micros.magnesium}mg</span>}
                            {calc.perServing.micros.potassium > 0 && <span className="micro-pill">Potassium: {calc.perServing.micros.potassium}mg</span>}
                            {calc.perServing.micros.omega_3 > 0 && <span className="micro-pill highlight">Omega-3: {calc.perServing.micros.omega_3}mg</span>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Log Popup / Actions */}
                <div style={{
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  {isLogging ? (
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid var(--primary)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--primary-light)' }}>
                        Log Portion to Daily Meals:
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                          <label className="input-label" style={{ fontSize: '0.7rem' }}>Meal Time</label>
                          <select
                            value={logMealType}
                            onChange={(e) => setLogMealType(e.target.value)}
                            className="select-field"
                            style={{ fontSize: '0.82rem', padding: '6px' }}
                          >
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                            <option value="Dinner">Dinner</option>
                            <option value="Snack">Snack</option>
                          </select>
                        </div>
                        <div>
                          <label className="input-label" style={{ fontSize: '0.7rem' }}>Number of Portions</label>
                          <input
                            type="number"
                            min="0.5"
                            step="0.5"
                            value={logPortions}
                            onChange={(e) => setLogPortions(e.target.value)}
                            className="input-field"
                            style={{ fontSize: '0.82rem', padding: '6px', textAlign: 'center' }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '4px' }}>
                        <button
                          type="button"
                          onClick={() => setLoggingRecipeId(null)}
                          className="btn btn-secondary btn-sm"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleConfirmLogMeal(recipe)}
                          className="btn btn-primary btn-sm"
                        >
                          <Check size={14} /> Confirm Log
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setLoggingRecipeId(recipe.id)}
                        className="btn btn-primary btn-sm"
                      >
                        {loggedNotice === recipe.id ? (
                          <>
                            <Check size={14} color="#fff" /> Logged to Meals!
                          </>
                        ) : (
                          <>
                            <Utensils size={14} /> Log to Daily Meals
                          </>
                        )}
                      </button>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => handleTransferToShopping(recipe)}
                          className="btn btn-secondary btn-sm"
                          title="Add ingredients to Grocery Shopping List"
                        >
                          {copiedGroceryNotice === recipe.id ? (
                            <>
                              <Check size={14} color="var(--primary-light)" /> Added to Grocery!
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={14} /> To Grocery
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingRecipe(recipe)
                            setIsBuilderOpen(true)
                          }}
                          className="btn-ghost"
                          style={{
                            minWidth: '44px',
                            minHeight: '44px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-muted)'
                          }}
                          aria-label={`Edit recipe ${recipe.title}`}
                        >
                          <Edit3 size={16} aria-hidden="true" />
                        </button>

                        {onDeleteRecipe && (
                          <button
                            type="button"
                            onClick={() => onDeleteRecipe(recipe.id)}
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
                            aria-label={`Delete recipe ${recipe.title}`}
                          >
                            <Trash2 size={16} aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )
          })}
        </div>
      )}
        </>
      )}

      {/* Recipe Builder Modal */}
      {isBuilderOpen && (
        <RecipeBuilderModal
          isOpen={isBuilderOpen}
          onClose={() => {
            setIsBuilderOpen(false)
            setEditingRecipe(null)
          }}
          onSaveRecipe={(recipeData) => {
            onSaveRecipe(recipeData)
            setIsBuilderOpen(false)
            setEditingRecipe(null)
          }}
          foodLibrary={foodLibrary}
          onAddNewFoodToLibrary={onAddNewFoodToLibrary}
          editingRecipe={editingRecipe}
        />
      )}

    </div>
  )
}
