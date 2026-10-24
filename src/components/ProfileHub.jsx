import React, { useState } from 'react'
import { 
  Target, 
  Scale, 
  Cloud, 
  Sparkles, 
  Database, 
  ShieldCheck, 
  User
} from 'lucide-react'
import TdeeCalculator from './TdeeCalculator'

export default function ProfileHub({
  profile,
  onUpdateProfile,
  streakCount = 6,
  cloudUser = null,
  onOpenCloudSync,
  onRerunOnboarding,
  historyCount = 0
}) {
  const [activeSection, setActiveSection] = useState('tdee') // 'tdee' | 'bodycomp' | 'cloud'

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* User Header & Setup Recalibration Card */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(18, 26, 41, 0.85) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.35)',
            color: '#fff'
          }}>
            <User size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
                {profile.name || 'Alex'}
              </h2>
              <span className="badge badge-emerald">
                {profile.goal?.replace(/_/g, ' ') || 'Maintain'}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Weight: <strong className="tabular-nums" style={{ color: '#fff' }}>{profile.weight || 76} kg</strong> • 
              Daily Target: <strong className="tabular-nums" style={{ color: 'var(--primary-light)' }}>{profile.targetCalories || 2300} kcal</strong> • 
              Streak: <strong className="tabular-nums" style={{ color: 'var(--accent-orange)' }}>🔥 {streakCount} Days</strong>
            </p>
          </div>
        </div>

        {/* Action: Recalculate / Re-run Onboarding */}
        {onRerunOnboarding && (
          <button
            type="button"
            onClick={onRerunOnboarding}
            className="btn btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}
          >
            <Sparkles size={16} color="var(--primary-light)" />
            <span>Recalibrate Targets</span>
          </button>
        )}
      </div>

      {/* Sub-Navigation Pill Bar */}
      <div className="glass-panel" style={{
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', maxWidth: '100%' }}>
          <button
            type="button"
            onClick={() => setActiveSection('tdee')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              borderRadius: 'var(--radius-md)',
              border: activeSection === 'tdee' ? '1px solid var(--primary)' : '1px solid transparent',
              background: activeSection === 'tdee' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              color: activeSection === 'tdee' ? '#fff' : 'var(--text-muted)',
              fontWeight: activeSection === 'tdee' ? '700' : '500',
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            <Target size={16} color={activeSection === 'tdee' ? 'var(--primary-light)' : 'currentColor'} />
            <span>Goals & TDEE Metabolism</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('bodycomp')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              borderRadius: 'var(--radius-md)',
              border: activeSection === 'bodycomp' ? '1px solid var(--primary)' : '1px solid transparent',
              background: activeSection === 'bodycomp' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              color: activeSection === 'bodycomp' ? '#fff' : 'var(--text-muted)',
              fontWeight: activeSection === 'bodycomp' ? '700' : '500',
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            <Scale size={16} color={activeSection === 'bodycomp' ? 'var(--primary-light)' : 'currentColor'} />
            <span>Body Composition & Tape</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('cloud')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              borderRadius: 'var(--radius-md)',
              border: activeSection === 'cloud' ? '1px solid var(--primary)' : '1px solid transparent',
              background: activeSection === 'cloud' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              color: activeSection === 'cloud' ? '#fff' : 'var(--text-muted)',
              fontWeight: activeSection === 'cloud' ? '700' : '500',
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            <Cloud size={16} color={activeSection === 'cloud' ? 'var(--primary-light)' : 'currentColor'} />
            <span>Cloud Sync & Backup</span>
            {cloudUser && (
              <span className="badge badge-emerald" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>Active</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Section Content */}
      {activeSection === 'tdee' && (
        <TdeeCalculator 
          profile={profile}
          onUpdateProfile={onUpdateProfile}
          initialSection="tdee"
        />
      )}

      {activeSection === 'bodycomp' && (
        <TdeeCalculator 
          profile={profile}
          onUpdateProfile={onUpdateProfile}
          initialSection="bodycomp"
        />
      )}

      {activeSection === 'cloud' && (
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-blue)'
              }}>
                <Cloud size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Cloud Sync & Cross-Device Backup</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Safely synchronize your dietary logs, custom foods, recipes, and body metrics across all your devices.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenCloudSync}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Cloud size={16} />
              <span>{cloudUser ? 'Manage Cloud Sync' : 'Sign In / Connect Cloud'}</span>
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginTop: '8px'
          }}>
            <div style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <ShieldCheck size={18} color="var(--primary-light)" />
                <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Sync Status</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: cloudUser ? 'var(--primary-light)' : 'var(--text-dim)' }}>
                {cloudUser ? `Connected as ${cloudUser.email}` : 'Local-only cache active. Connect cloud to backup online.'}
              </div>
            </div>

            <div style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Database size={18} color="var(--accent-yellow)" />
                <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Local Data Storage</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Persistent IndexedDB & LocalStorage enabled. Zero tracking cookies.
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
