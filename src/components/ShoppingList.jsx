import React, { useState } from 'react'
import { 
  ShoppingCart, 
  Square, 
  CheckSquare, 
  Plus, 
  Trash2
} from 'lucide-react'

export default function ShoppingList({ shoppingItems, onToggleItem, onAddItem, onDeleteItem, onClearCompleted }) {
  const [newItemText, setNewItemText] = useState('')
  const [newCategory, setNewCategory] = useState('Fresh Produce')

  const categories = [
    'Fresh Produce',
    'Poultry & Meat',
    'Fish & Seafood',
    'Dairy & Eggs',
    'Pantry & Grains',
    'Oils & Condiments'
  ]

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newItemText.trim()) return

    const newItem = {
      id: 's_' + Date.now(),
      text: newItemText.trim(),
      category: newCategory,
      completed: false
    }
    onAddItem(newItem)
    setNewItemText('')
  }

  // Group by category
  const grouped = categories.reduce((acc, cat) => {
    const items = shoppingItems.filter(i => i.category === cat)
    if (items.length > 0) {
      acc[cat] = items
    }
    return acc
  }, {})

  // Also include items with custom/unrecognized categories
  const otherItems = shoppingItems.filter(i => !categories.includes(i.category))
  if (otherItems.length > 0) {
    grouped['General & Others'] = otherItems
  }

  const completedCount = shoppingItems.filter(i => i.completed).length
  const totalCount = shoppingItems.length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header and Progress */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.08) 0%, rgba(18, 26, 41, 0.8) 100%)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className="badge badge-amber">Smart Grocery Aisle</span>
            <span className="badge badge-emerald">Diet Compliant</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>
            Weekly Shopping List
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Organized by grocery department so you can get in, grab your nutritious staples, and get out fast.
          </p>
        </div>

        {/* Counter and clear actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div className="tabular-nums" style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary-light)' }}>
              {completedCount} / {totalCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Items checked off (<span className="tabular-nums">{progressPercent}%</span>)
            </div>
          </div>

          {completedCount > 0 && (
            <button 
              type="button"
              onClick={onClearCompleted}
              className="btn btn-secondary btn-sm"
              style={{ color: 'var(--accent-red)' }}
              aria-label="Clear all checked off grocery items"
            >
              Clear Checked
            </button>
          )}
        </div>
      </div>

      {/* Add New Item Input Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px' }}>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            id="new-grocery-item-input"
            name="groceryItem"
            autoComplete="off"
            aria-label="New grocery item"
            placeholder="Add grocery item (e.g. 500g Chicken, Blueberries, Greek Yogurt)…"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            className="input-field"
            style={{ flex: 1, minWidth: '240px' }}
          />

          <select 
            id="new-grocery-category-select"
            name="groceryCategory"
            aria-label="Grocery department category"
            value={newCategory} 
            onChange={(e) => setNewCategory(e.target.value)}
            className="select-field"
            style={{ width: 'auto', minWidth: '160px' }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <button type="submit" className="btn btn-primary" aria-label="Add grocery item to cart">
            <Plus size={16} aria-hidden="true" />
            <span>Add to Cart</span>
          </button>
        </form>
      </div>

      {/* Grouped Grocery Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {Object.keys(grouped).length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <ShoppingCart size={36} color="var(--text-dim)" aria-hidden="true" style={{ margin: '0 auto 12px' }} />
            <p>Your grocery list is empty.</p>
            <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Add items above or transfer recipes from the Meal Prep tab!</p>
          </div>
        ) : (
          Object.entries(grouped).map(([categoryName, items]) => (
            <div key={categoryName} className="glass-panel" style={{ padding: '20px 24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '8px'
              }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary-light)' }}>
                  {categoryName}
                </h3>
                <span className="tabular-nums" style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {items.map((item) => (
                  <div 
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={item.completed}
                      aria-label={`Mark ${item.text} as ${item.completed ? 'not completed' : 'completed'}`}
                      onClick={() => onToggleItem(item.id)}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault()
                          onToggleItem(item.id)
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        flex: 1,
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: item.completed ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                        border: item.completed ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid var(--border-color)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'var(--transition)'
                      }}
                    >
                      {item.completed ? (
                        <CheckSquare size={18} color="var(--primary-light)" aria-hidden="true" />
                      ) : (
                        <Square size={18} color="var(--text-dim)" aria-hidden="true" />
                      )}
                      <span style={{
                        fontSize: '0.92rem',
                        textDecoration: item.completed ? 'line-through' : 'none',
                        color: item.completed ? 'var(--text-dim)' : 'var(--text-main)',
                        fontWeight: item.completed ? '400' : '500'
                      }}>
                        {item.text}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      className="btn-ghost"
                      aria-label={`Delete ${item.text}`}
                      style={{
                        minWidth: '44px',
                        minHeight: '44px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-dim)',
                        transition: 'var(--transition)'
                      }}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  )
}
