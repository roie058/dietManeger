import React, { useState } from 'react'
import { 
  Calendar, 
  ChefHat, 
  ShoppingCart, 
  Database,
  Sparkles
} from 'lucide-react'
import MealPlanner from './MealPlanner'
import ShoppingList from './ShoppingList'
import FoodDatabaseView from './FoodDatabaseView'

export default function PlanHub({
  initialSubTab = 'calendar',
  recipes = [],
  onSaveRecipe,
  onDeleteRecipe,
  foodLibrary = [],
  onAddNewFoodToLibrary,
  onDeleteFoodFromLibrary,
  shoppingItems = [],
  onToggleShopping,
  onAddShoppingItem,
  onDeleteShoppingItem,
  onClearCompletedShopping,
  onAddIngredientsToShoppingList,
  onLogMeal,
  onLogBatchMeals,
  targetCalories = 2350
}) {
  const [subTab, setSubTab] = useState(initialSubTab)

  const tabs = [
    { id: 'calendar', label: 'Weekly Schedule', icon: Calendar, badge: '7 Days' },
    { id: 'recipes', label: 'Recipes & Prep', icon: ChefHat, badge: `${recipes.length}` },
    { id: 'shopping', label: 'Shopping List', icon: ShoppingCart, badge: `${shoppingItems.filter(i => !i.completed).length}` },
    { id: 'database', label: 'Food Library', icon: Database, badge: `${foodLibrary.length}` }
  ]

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Segmented Sub-Navigation Pill Bar */}
      <div className="glass-panel" style={{
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', maxWidth: '100%', paddingBottom: '2px' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = subTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: isActive ? '1px solid var(--primary)' : '1px solid transparent',
                  background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={16} color={isActive ? 'var(--primary-light)' : 'currentColor'} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span 
                    className="tabular-nums"
                    style={{
                      fontSize: '0.72rem',
                      padding: '2px 7px',
                      borderRadius: '999px',
                      background: isActive ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)',
                      color: isActive ? '#000' : 'var(--text-dim)',
                      fontWeight: '800'
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} color="var(--primary-light)" />
          <span>Diet & Kitchen System</span>
        </div>
      </div>

      {/* Sub-Views */}
      <div>
        {(subTab === 'calendar' || subTab === 'recipes') && (
          <MealPlanner 
            recipes={recipes}
            onSaveRecipe={onSaveRecipe}
            onDeleteRecipe={onDeleteRecipe}
            foodLibrary={foodLibrary}
            onAddNewFoodToLibrary={onAddNewFoodToLibrary}
            onAddIngredientsToShoppingList={onAddIngredientsToShoppingList}
            onLogMeal={onLogMeal}
            onLogBatchMeals={onLogBatchMeals}
            targetCalories={targetCalories}
            forcedView={subTab}
          />
        )}

        {subTab === 'shopping' && (
          <ShoppingList 
            shoppingItems={shoppingItems}
            onToggleItem={onToggleShopping}
            onAddItem={onAddShoppingItem}
            onDeleteItem={onDeleteShoppingItem}
            onClearCompleted={onClearCompletedShopping}
          />
        )}

        {subTab === 'database' && (
          <FoodDatabaseView 
            foodLibrary={foodLibrary}
            onAddFood={onAddNewFoodToLibrary}
            onDeleteFood={onDeleteFoodFromLibrary}
            onQuickLogMeal={onLogMeal}
          />
        )}
      </div>

    </div>
  )
}
