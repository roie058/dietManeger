import React, { useState } from 'react'
import { 
  Flame, 
  Target, 
  ChefHat, 
  Droplets, 
  LayoutGrid, 
  Pill, 
  Database, 
  ShoppingCart, 
  Cloud, 
  Smartphone, 
  X, 
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronRight
} from 'lucide-react'

export default function MobileBottomNav({
  activeTab,
  setActiveTab,
  onOpenCloudSync,
  isCloudUser = false,
  canInstall = false,
  onInstall,
  streakCount = 6
}) {
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false)

  // Primary navigation items docked in thumb zone
  const primaryTabs = [
    { id: 'dashboard', label: 'Macros', icon: Flame },
    { id: 'tdee', label: 'Goals', icon: Target },
    { id: 'mealprep', label: 'Meal Prep', icon: ChefHat },
    { id: 'water', label: 'Water', icon: Droplets }
  ]

  // Secondary items accessed via the 'More' sheet
  const moreItems = [
    { 
      id: 'foodlibrary', 
      label: 'Food Database', 
      desc: 'Library of nutrition facts & custom foods', 
      icon: Database,
      color: '#38bdf8'
    },
    { 
      id: 'vitamins', 
      label: 'Vitamins & Minerals', 
      desc: 'Track 10 essential micronutrients & RDA', 
      icon: Pill,
      color: '#a855f7'
    },
    { 
      id: 'shopping', 
      label: 'Shopping List', 
      desc: 'Aisles, check-offs & grocery planning', 
      icon: ShoppingCart,
      color: '#fbbf24'
    }
  ]

  const isMoreActive = ['foodlibrary', 'vitamins', 'shopping'].includes(activeTab)

  const handleTabClick = (tabId) => {
    setActiveTab(tabId)
    setIsMoreSheetOpen(false)
  }

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })

  return (
    <>
      {/* Docked Mobile Bottom Navigation Bar */}
      <nav 
        className="mobile-bottom-nav mobile-only" 
        role="navigation" 
        aria-label="Mobile Navigation"
      >
        {primaryTabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              aria-label={tab.label}
            >
              <div className="mobile-nav-icon-wrapper">
                <Icon size={20} aria-hidden="true" />
              </div>
              <span className="mobile-nav-label">{tab.label}</span>
            </button>
          )
        })}

        {/* More Tab */}
        <button
          type="button"
          onClick={() => setIsMoreSheetOpen(true)}
          className={`mobile-nav-item ${isMoreActive ? 'active' : ''}`}
          aria-expanded={isMoreSheetOpen}
          aria-label="More Features & Tools"
        >
          <div className="mobile-nav-icon-wrapper">
            <LayoutGrid size={20} aria-hidden="true" />
          </div>
          <span className="mobile-nav-label">More</span>
        </button>
      </nav>

      {/* Mobile 'More' Bottom Sheet Modal */}
      {isMoreSheetOpen && (
        <div 
          className="mobile-sheet-backdrop mobile-only"
          onClick={() => setIsMoreSheetOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="More Options Menu"
        >
          <div 
            className="mobile-sheet-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-sheet-handle" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Sparkles size={16} color="var(--primary-light)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>More Features</h3>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {todayStr} • <span style={{ color: '#fb923c', fontWeight: '700' }}>{streakCount} Day Streak</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMoreSheetOpen(false)}
                className="btn-ghost"
                style={{
                  minWidth: '40px',
                  minHeight: '40px',
                  borderRadius: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--text-muted)'
                }}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Feature List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              {moreItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTabClick(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: '14px',
                      border: isActive ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.08)',
                      background: isActive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      minHeight: '52px',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: item.color
                      }}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.92rem', color: isActive ? 'var(--primary-light)' : '#fff' }}>
                          {item.label}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          {item.desc}
                        </div>
                      </div>
                    </div>

                    <ChevronRight size={16} color="var(--text-dim)" />
                  </button>
                )
              })}
            </div>

            {/* Quick Actions (Cloud & PWA) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
              {onOpenCloudSync && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMoreSheetOpen(false)
                    onOpenCloudSync()
                  }}
                  className="btn btn-secondary"
                  style={{
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: isCloudUser ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.12)',
                    background: isCloudUser ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.04)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {isCloudUser ? <CheckCircle2 size={18} color="#34d399" /> : <Cloud size={18} color="var(--accent-blue)" />}
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.86rem', fontWeight: '700', color: '#fff' }}>
                        {isCloudUser ? 'Cloud Sync: Active' : 'Cloud Backup & Sync'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {isCloudUser ? 'Your nutrition data is secured remotely' : 'Connect Supabase or export JSON backup'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} color="var(--text-dim)" />
                </button>
              )}

              {canInstall && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMoreSheetOpen(false)
                    if (onInstall) onInstall()
                  }}
                  className="btn btn-secondary"
                  style={{
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    background: 'rgba(16, 185, 129, 0.06)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Smartphone size={18} color="var(--primary-light)" />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--primary-light)' }}>
                        Install App to Home Screen
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Launch NutriFlow full-screen like a native app
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} color="var(--text-dim)" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
