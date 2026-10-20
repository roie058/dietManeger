import React from 'react'
import { 
  Flame, 
  Target, 
  Pill, 
  Droplets, 
  ChefHat, 
  ShoppingCart, 
  Sparkles,
  Calendar
} from 'lucide-react'

export default function Navbar({ activeTab, setActiveTab, streakCount = 5 }) {
  const navItems = [
    { id: 'dashboard', label: 'Daily Macros', icon: Flame },
    { id: 'tdee', label: 'Goal & TDEE', icon: Target },
    { id: 'vitamins', label: 'Vitamins & Minerals', icon: Pill },
    { id: 'water', label: 'Hydration', icon: Droplets },
    { id: 'mealprep', label: 'Meal Prep', icon: ChefHat },
    { id: 'shopping', label: 'Shopping List', icon: ShoppingCart }
  ]

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })

  return (
    <header style={{
      borderBottom: '1px solid var(--border-color)',
      background: 'rgba(10, 15, 24, 0.85)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
          }}>
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.4rem',
                fontWeight: '800',
                background: 'linear-gradient(90deg, #ffffff 0%, #a7f3d0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em'
              }}>
                NutriFlow
              </span>
              <span className="badge badge-emerald">PRO</span>
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Diet & Healthy Lifestyle Architect
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '5px',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          overflowX: 'auto',
          maxWidth: '100%'
        }}>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.86rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  background: isActive 
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%)' 
                    : 'transparent',
                  boxShadow: isActive ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
                  transition: 'var(--transition)',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Date & Streak Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            padding: '6px 12px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '10px',
            border: '1px solid var(--border-color)'
          }}>
            <Calendar size={14} color="var(--primary-light)" />
            <span>{todayStr}</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: 'rgba(249, 115, 22, 0.12)',
            border: '1px solid rgba(249, 115, 22, 0.25)',
            borderRadius: '10px',
            color: '#fb923c',
            fontWeight: '600',
            fontSize: '0.82rem'
          }}>
            <Flame size={15} />
            <span>{streakCount} Day Streak</span>
          </div>
        </div>
      </div>
    </header>
  )
}
