import React, { useState, useEffect } from 'react'
import { Download, Smartphone, X, CheckCircle, Share, PlusSquare } from 'lucide-react'

export default function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIos, setIsIos] = useState(false)
  const [showIosGuide, setShowIosGuide] = useState(false)
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('nutriflow_pwa_dismissed') === 'true'
  })

  useEffect(() => {
    // Check if running as standalone PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
    if (isStandalone) {
      setIsInstalled(true)
      return
    }

    // Check if iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent) && !window.MSStream
    setIsIos(isIosDevice)

    // Listen for Chrome/Edge/Android beforeinstallprompt event
    const handleBeforeInstall = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
      console.log('[NutriFlow PWA] App was successfully installed')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(true)
      return
    }

    if (!deferredPrompt) {
      // Fallback for browsers without beforeinstallprompt
      setShowIosGuide(true)
      return
    }

    deferredPrompt.prompt()
    const choiceResult = await deferredPrompt.userChoice
    if (choiceResult.outcome === 'accepted') {
      setIsInstalled(true)
      setIsInstallable(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    localStorage.setItem('nutriflow_pwa_dismissed', 'true')
  }

  if (isInstalled || isDismissed) {
    return null
  }

  // Only show if browser flagged installable or on iOS Safari
  if (!isInstallable && !isIos) {
    return null
  }

  return (
    <>
      <div 
        className="animate-fade-in pwa-install-banner"
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 95, 70, 0.25) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '14px',
          padding: '8px 12px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            flexShrink: 0,
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
          }}>
            <Smartphone size={18} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'nowrap' }}>
              <span style={{ fontWeight: '700', fontSize: '0.88rem', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Install NutriFlow
              </span>
              <span className="badge badge-emerald desktop-only-inline" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>
                Offline
              </span>
            </div>
            <p className="desktop-only" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Enjoy full-screen mobile experience, instant offline access, and fast logging.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <button
            type="button"
            onClick={handleInstallClick}
            className="btn btn-primary btn-sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 10px',
              fontWeight: '700',
              fontSize: '0.8rem',
              whiteSpace: 'nowrap'
            }}
          >
            <Download size={13} />
            <span>Install</span>
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss install banner"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '5px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition)'
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* iOS Safari Installation Guide Modal */}
      {showIosGuide && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div className="glass-panel animate-scale-up" style={{
            maxWidth: '420px',
            width: '100%',
            padding: '24px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Smartphone size={20} color="var(--primary-light)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>Install on Mobile</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowIosGuide(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '18px' }}>
              To install NutriFlow on your phone as a standalone application:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Share size={15} color="var(--primary-light)" />
                </div>
                <div style={{ fontSize: '0.84rem' }}>
                  <strong>Step 1:</strong> Tap the browser <strong>Share</strong> button (usually at the bottom of Safari or menu in Chrome).
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <PlusSquare size={15} color="var(--primary-light)" />
                </div>
                <div style={{ fontSize: '0.84rem' }}>
                  <strong>Step 2:</strong> Scroll down and select <strong>"Add to Home Screen"</strong>.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <CheckCircle size={15} color="var(--primary-light)" />
                </div>
                <div style={{ fontSize: '0.84rem' }}>
                  <strong>Step 3:</strong> Tap <strong>"Add"</strong>. NutriFlow is now installed on your device with full offline capabilities!
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIosGuide(false)}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  )
}
