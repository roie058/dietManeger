import React from 'react'
import { AlertCircle, RotateCcw } from 'lucide-react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error in NutriFlow:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleResetStorage = () => {
    if (window.confirm('Reset local cache and reload? Your saved profile and history will be reset to defaults.')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: 'var(--bg-main, #0b0f17)',
          color: '#fff'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '520px',
            width: '100%',
            padding: '32px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(244, 63, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-red)'
            }}>
              <AlertCircle size={32} />
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Something went wrong</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              NutriFlow encountered an unexpected error while rendering. Your data in local storage is safe.
            </p>

            {this.state.error && (
              <pre style={{
                background: 'rgba(0,0,0,0.4)',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                color: '#fca5a5',
                width: '100%',
                overflowX: 'auto',
                textAlign: 'left'
              }}>
                {this.state.error.message || String(this.state.error)}
              </pre>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px', width: '100%' }}>
              <button
                type="button"
                onClick={this.handleReload}
                className="btn btn-primary"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <RotateCcw size={16} />
                <span>Reload App</span>
              </button>
              <button
                type="button"
                onClick={this.handleResetStorage}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Reset Cache
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
