import React, { useState } from 'react'
import { 
  Plus, 
  X, 
  Barcode, 
  FileText, 
  Camera, 
  Droplets 
} from 'lucide-react'

export default function MobileQuickAddFab({
  onOpenBarcode,
  onOpenOcr,
  onOpenManual,
  onQuickAddWater
}) {
  const [isOpen, setIsOpen] = useState(false)

  const handleAction = (actionFn) => {
    setIsOpen(false)
    if (actionFn) actionFn()
  }

  return (
    <div className="mobile-fab-container mobile-only" aria-label="Quick Action Menu">
      {/* Backdrop overlay when FAB is expanded to dismiss on tap */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(3, 7, 18, 0.5)',
            backdropFilter: 'blur(4px)',
            pointerEvents: 'auto',
            zIndex: -1
          }}
        />
      )}

      {/* Expanded Quick Action Menu */}
      {isOpen && (
        <div className="mobile-fab-menu" role="menu">
          <div style={{ padding: '6px 10px 2px 10px', fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Quick Log
          </div>

          <button
            type="button"
            role="menuitem"
            className="mobile-fab-menu-item"
            onClick={() => handleAction(onOpenBarcode)}
          >
            <Barcode size={18} color="var(--accent-blue)" />
            <span>Scan Barcode</span>
          </button>

          <button
            type="button"
            role="menuitem"
            className="mobile-fab-menu-item"
            onClick={() => handleAction(onOpenOcr)}
          >
            <Camera size={18} color="var(--accent-purple)" />
            <span>Scan Nutrition Label</span>
          </button>

          <button
            type="button"
            role="menuitem"
            className="mobile-fab-menu-item"
            onClick={() => handleAction(onOpenManual)}
          >
            <FileText size={18} color="var(--primary-light)" />
            <span>Log Custom Food</span>
          </button>

          {onQuickAddWater && (
            <button
              type="button"
              role="menuitem"
              className="mobile-fab-menu-item"
              onClick={() => handleAction(onQuickAddWater)}
            >
              <Droplets size={18} color="var(--macro-water)" />
              <span>+250ml Water</span>
            </button>
          )}
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        type="button"
        className="mobile-fab-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close Quick Log Menu" : "Open Quick Log Menu"}
        style={{
          transform: isOpen ? 'rotate(45deg)' : 'none'
        }}
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>
    </div>
  )
}
