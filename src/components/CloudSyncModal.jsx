import React, { useState, useEffect, useRef } from 'react'
import { 
  Cloud, 
  CloudOff, 
  RefreshCw, 
  Download, 
  Upload, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  User, 
  Lock, 
  Mail, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Key, 
  ExternalLink,
  HardDrive
} from 'lucide-react'
import { 
  isSupabaseConfigured, 
  getSupabaseCredentials, 
  saveCustomSupabaseCredentials, 
  clearCustomSupabaseCredentials 
} from '../utils/supabaseClient'
import { 
  signUpWithEmail, 
  signInWithEmail, 
  signOutUser, 
  getCurrentUser, 
  uploadLocalDataToCloud, 
  syncCloudAndLocal, 
  getLastSyncTime, 
  isAutoSyncEnabled, 
  setAutoSyncEnabled 
} from '../utils/cloudSync'
import { 
  exportAllDataAsJson, 
  importDataFromJson, 
  checkStoragePersistence, 
  requestPersistentStorage 
} from '../utils/storage'

export default function CloudSyncModal({ isOpen, onClose, onDataRestored }) {
  const [activeTab, setActiveTab] = useState('cloud') // 'cloud' | 'manual' | 'settings'
  const [authMode, setAuthMode] = useState('signin') // 'signin' | 'signup'

  // Supabase Config State
  const [isConfigured, setIsConfigured] = useState(() => isSupabaseConfigured())
  const [configUrl, setConfigUrl] = useState('')
  const [configKey, setConfigKey] = useState('')
  const [configSource, setConfigSource] = useState('')

  // Auth State
  const [user, setUser] = useState(null)
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState(null)
  const [authSuccess, setAuthSuccess] = useState(null)

  // Sync Action State
  const [syncLoading, setSyncLoading] = useState(false)
  const [lastSync, setLastSync] = useState(() => getLastSyncTime())
  const [autoSync, setAutoSync] = useState(() => isAutoSyncEnabled())
  const [syncStatusMsg, setSyncStatusMsg] = useState(null)

  // Browser Storage Persistence
  const [isPersisted, setIsPersisted] = useState(false)

  // File import ref
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    // Refresh credentials & configuration check
    const creds = getSupabaseCredentials()
    setIsConfigured(isSupabaseConfigured())
    setConfigUrl(creds.url)
    setConfigKey(creds.anonKey)
    setConfigSource(creds.isFromEnv ? 'Environment (.env)' : creds.isFromLocalStorage ? 'Local Settings' : 'Not Configured')

    // Refresh user state
    getCurrentUser().then(u => setUser(u))
    setLastSync(getLastSyncTime())
    setAutoSync(isAutoSyncEnabled())

    // Check browser persistence
    checkStoragePersistence().then(p => setIsPersisted(p))
  }, [isOpen])

  if (!isOpen) return null

  // --- Handlers ---
  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    setAuthError(null)
    setAuthSuccess(null)
    setAuthLoading(true)

    try {
      if (authMode === 'signup') {
        const res = await signUpWithEmail(authEmail, authPassword)
        if (res?.user && !res.session) {
          setAuthSuccess('Registration submitted! If email confirmation is enabled on your Supabase project, check your inbox.')
        } else {
          setAuthSuccess('Account created and signed in successfully!')
          setUser(res.user)
          // Automatically run initial sync
          await syncCloudAndLocal()
          setLastSync(getLastSyncTime())
          if (onDataRestored) onDataRestored()
        }
      } else {
        const res = await signInWithEmail(authEmail, authPassword)
        setAuthSuccess('Signed in successfully!')
        setUser(res.user)
        // Automatically sync on sign in
        const syncResult = await syncCloudAndLocal()
        setLastSync(getLastSyncTime())
        if (syncResult.action === 'downloaded' && onDataRestored) {
          onDataRestored()
        }
      }
    } catch (err) {
      setAuthError(err.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOutUser()
      setUser(null)
      setAuthSuccess('Signed out successfully. Data remains safely preserved on device and cloud.')
    } catch (err) {
      setAuthError(err.message)
    }
  }

  const handleManualSync = async () => {
    setSyncLoading(true)
    setSyncStatusMsg(null)
    try {
      const res = await syncCloudAndLocal()
      setLastSync(getLastSyncTime())
      setSyncStatusMsg({ type: 'success', text: res.message || 'Data synced with cloud!' })
      if (res.action === 'downloaded' && onDataRestored) {
        onDataRestored()
      }
    } catch (err) {
      setSyncStatusMsg({ type: 'error', text: err.message || 'Failed to sync with cloud.' })
    } finally {
      setSyncLoading(false)
    }
  }

  const handleForceUpload = async () => {
    setSyncLoading(true)
    setSyncStatusMsg(null)
    try {
      await uploadLocalDataToCloud()
      setLastSync(getLastSyncTime())
      setSyncStatusMsg({ type: 'success', text: 'Local data pushed to cloud successfully!' })
    } catch (err) {
      setSyncStatusMsg({ type: 'error', text: err.message || 'Upload to cloud failed.' })
    } finally {
      setSyncLoading(false)
    }
  }

  const handleToggleAutoSync = () => {
    const nextVal = !autoSync
    setAutoSync(nextVal)
    setAutoSyncEnabled(nextVal)
  }

  const handleSaveCredentials = (e) => {
    e.preventDefault()
    saveCustomSupabaseCredentials(configUrl, configKey)
    const configured = isSupabaseConfigured()
    setIsConfigured(configured)
    setAuthSuccess('Credentials saved! You can now sign in or create an account.')
    setActiveTab('cloud')
  }

  const handleClearCredentials = () => {
    clearCustomSupabaseCredentials()
    setConfigUrl('')
    setConfigKey('')
    setIsConfigured(false)
    setUser(null)
    setAuthSuccess('Custom credentials cleared.')
  }

  const handleRequestPersistence = async () => {
    const granted = await requestPersistentStorage()
    setIsPersisted(granted)
  }

  const handleFileImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result
      if (typeof content === 'string') {
        const result = importDataFromJson(content)
        if (result.success) {
          alert(`Successfully restored ${result.count} data categories! The app will now refresh.`)
          if (onDataRestored) onDataRestored()
          window.location.reload()
        } else {
          alert(`Import failed: ${result.error}`)
        }
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={{
        background: 'var(--card-bg, #111827)',
        border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '580px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: user ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {user ? <CheckCircle2 size={22} color="#ffffff" /> : <Cloud size={22} color="var(--primary, #10b981)" />}
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                Data Storage & Cloud Sync
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted, #9ca3af)', margin: '2px 0 0 0' }}>
                Permanent storage protected against accidental browser cache cleaning
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted, #9ca3af)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Browser Eviction Shield Banner */}
        <div style={{
          padding: '10px 24px',
          background: isPersisted ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
          borderBottom: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.82rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} color={isPersisted ? '#10b981' : '#f59e0b'} />
            <span style={{ color: isPersisted ? '#a7f3d0' : '#fde68a' }}>
              {isPersisted 
                ? 'Browser Storage Persistence: Protected from auto-eviction' 
                : 'Storage best-effort: Can request persistent status'}
            </span>
          </div>
          {!isPersisted && (
            <button
              type="button"
              onClick={handleRequestPersistence}
              style={{
                background: 'rgba(245, 158, 11, 0.2)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                color: '#f59e0b',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Lock Persistence
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          padding: '12px 24px 0 24px',
          gap: '8px',
          borderBottom: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('cloud')}
            style={{
              padding: '8px 16px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === 'cloud' ? '2px solid var(--primary, #10b981)' : '2px solid transparent',
              color: activeTab === 'cloud' ? '#ffffff' : 'var(--text-muted, #9ca3af)',
              fontWeight: activeTab === 'cloud' ? '600' : '400',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Cloud size={16} />
            <span>Cloud Account</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            style={{
              padding: '8px 16px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === 'manual' ? '2px solid var(--primary, #10b981)' : '2px solid transparent',
              color: activeTab === 'manual' ? '#ffffff' : 'var(--text-muted, #9ca3af)',
              fontWeight: activeTab === 'manual' ? '600' : '400',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <HardDrive size={16} />
            <span>File Backup & Restore</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            style={{
              padding: '8px 16px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === 'settings' ? '2px solid var(--primary, #10b981)' : '2px solid transparent',
              color: activeTab === 'settings' ? '#ffffff' : 'var(--text-muted, #9ca3af)',
              fontWeight: activeTab === 'settings' ? '600' : '400',
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Settings size={16} />
            <span>Supabase Setup</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div style={{ padding: '24px' }}>
          {/* Notifications */}
          {authError && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              color: '#f87171',
              fontSize: '0.86rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              marginBottom: '18px'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{authError}</div>
            </div>
          )}

          {authSuccess && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '10px',
              color: '#34d399',
              fontSize: '0.86rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '18px'
            }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <div>{authSuccess}</div>
            </div>
          )}

          {/* TAB 1: CLOUD ACCOUNT */}
          {activeTab === 'cloud' && (
            <div>
              {!isConfigured ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <CloudOff size={44} color="#f59e0b" style={{ margin: '0 auto 12px auto' }} />
                  <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '8px' }}>
                    Supabase Project Not Yet Connected
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted, #9ca3af)', maxWidth: '420px', margin: '0 auto 20px auto', lineHeight: '1.5' }}>
                    Connect a free Supabase project to enable seamless cloud syncing across all your devices and keep your data 100% safe from browser wiping.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className="btn btn-primary"
                    style={{ padding: '10px 20px', fontSize: '0.9rem', gap: '8px' }}
                  >
                    <Settings size={16} />
                    <span>Configure Supabase Keys</span>
                  </button>
                </div>
              ) : user ? (
                /* USER IS SIGNED IN */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Account Badge Card */}
                  <div style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: '700'
                      }}>
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.92rem', fontWeight: '600', color: '#ffffff' }}>
                          {user.email}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--primary-light, #6ee7b7)' }}>
                          Cloud Connected & Protected
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.8rem', padding: '6px 12px', gap: '6px' }}
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>

                  {/* Sync Status Info */}
                  <div style={{
                    padding: '14px 18px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.85rem'
                  }}>
                    <span style={{ color: 'var(--text-muted, #9ca3af)' }}>Last Synchronized:</span>
                    <span style={{ color: '#ffffff', fontWeight: '600' }}>
                      {lastSync ? new Date(lastSync).toLocaleString() : 'Not yet synced'}
                    </span>
                  </div>

                  {/* Auto Sync Toggle */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#ffffff' }}>
                        Automatic Sync
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted, #9ca3af)' }}>
                        Save your meals and recipes to cloud automatically as you log them
                      </div>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                      <input 
                        type="checkbox" 
                        checked={autoSync} 
                        onChange={handleToggleAutoSync}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        inset: 0,
                        backgroundColor: autoSync ? 'var(--primary, #10b981)' : '#374151',
                        borderRadius: '24px',
                        transition: '.3s'
                      }}>
                        <span style={{
                          position: 'absolute',
                          height: '18px',
                          width: '18px',
                          left: autoSync ? '23px' : '3px',
                          bottom: '3px',
                          backgroundColor: '#ffffff',
                          borderRadius: '50%',
                          transition: '.3s'
                        }} />
                      </span>
                    </label>
                  </div>

                  {/* Sync Action Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={handleManualSync}
                      disabled={syncLoading}
                      className="btn btn-primary"
                      style={{ padding: '12px', fontSize: '0.9rem', justifyContent: 'center' }}
                    >
                      <RefreshCw size={16} className={syncLoading ? 'animate-spin' : ''} />
                      <span>{syncLoading ? 'Syncing...' : 'Sync Cloud & Local'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleForceUpload}
                      disabled={syncLoading}
                      className="btn btn-secondary"
                      style={{ padding: '12px', fontSize: '0.9rem', justifyContent: 'center' }}
                    >
                      <Upload size={16} />
                      <span>Push Local to Cloud</span>
                    </button>
                  </div>

                  {syncStatusMsg && (
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      background: syncStatusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: syncStatusMsg.type === 'success' ? '#34d399' : '#f87171'
                    }}>
                      {syncStatusMsg.text}
                    </div>
                  )}
                </div>
              ) : (
                /* USER NOT SIGNED IN - SHOW SIGNIN / SIGNUP FORM */
                <div>
                  <div style={{
                    display: 'flex',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '4px',
                    borderRadius: '10px',
                    marginBottom: '20px'
                  }}>
                    <button
                      type="button"
                      onClick={() => setAuthMode('signin')}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: 'none',
                        borderRadius: '8px',
                        background: authMode === 'signin' ? 'var(--primary, #10b981)' : 'transparent',
                        color: authMode === 'signin' ? '#ffffff' : 'var(--text-muted, #9ca3af)',
                        fontWeight: authMode === 'signin' ? '600' : '500',
                        fontSize: '0.86rem',
                        cursor: 'pointer'
                      }}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: 'none',
                        borderRadius: '8px',
                        background: authMode === 'signup' ? 'var(--primary, #10b981)' : 'transparent',
                        color: authMode === 'signup' ? '#ffffff' : 'var(--text-muted, #9ca3af)',
                        fontWeight: authMode === 'signup' ? '600' : '500',
                        fontSize: '0.86rem',
                        cursor: 'pointer'
                      }}
                    >
                      Create Account
                    </button>
                  </div>

                  <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted, #9ca3af)', marginBottom: '6px' }}>
                        Email Address
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted, #9ca3af)' }} />
                        <input
                          type="email"
                          required
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="input"
                          style={{ width: '100%', paddingLeft: '38px' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted, #9ca3af)', marginBottom: '6px' }}>
                        Password
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted, #9ca3af)' }} />
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          placeholder="••••••••"
                          className="input"
                          style={{ width: '100%', paddingLeft: '38px' }}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="btn btn-primary"
                      style={{ padding: '12px', fontSize: '0.92rem', justifyContent: 'center', marginTop: '6px' }}
                    >
                      {authLoading ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <span>{authMode === 'signin' ? 'Sign In & Sync' : 'Create Account & Start Sync'}</span>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MANUAL FILE BACKUP & RESTORE */}
          {activeTab === 'manual' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))'
              }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#ffffff', marginBottom: '6px' }}>
                  Export Data to Computer
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted, #9ca3af)', lineHeight: '1.5', marginBottom: '14px' }}>
                  Download a complete snapshot of all your meal logs, customized foods, recipes, shopping lists, and body composition history into a single backup file.
                </p>
                <button
                  type="button"
                  onClick={exportAllDataAsJson}
                  className="btn btn-primary"
                  style={{ gap: '8px', padding: '10px 18px', fontSize: '0.88rem' }}
                >
                  <Download size={16} />
                  <span>Download Backup (.json)</span>
                </button>
              </div>

              <div style={{
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))'
              }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#ffffff', marginBottom: '6px' }}>
                  Restore from Backup File
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted, #9ca3af)', lineHeight: '1.5', marginBottom: '14px' }}>
                  Accidentally cleared your browser or switched computers? Upload a previously exported backup file to restore all your history instantly.
                </p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept=".json,application/json" 
                  onChange={handleFileImport}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-secondary"
                  style={{ gap: '8px', padding: '10px 18px', fontSize: '0.88rem' }}
                >
                  <Upload size={16} />
                  <span>Select Backup File to Restore</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: SUPABASE CONFIGURATION */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveCredentials} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                padding: '12px 16px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '10px',
                fontSize: '0.82rem',
                color: '#a7f3d0',
                lineHeight: '1.5'
              }}>
                <strong>How to get free Supabase credentials:</strong>
                <ol style={{ margin: '6px 0 0 16px', padding: 0 }}>
                  <li>Create a free project at <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: '#34d399', textDecoration: 'underline' }}>supabase.com</a>.</li>
                  <li>In Project Settings → API, copy your <strong>Project URL</strong> and <strong>anon (public) key</strong>.</li>
                  <li>Run the SQL script from <code>supabase_schema.sql</code> in your project's SQL Editor to create the secured table.</li>
                </ol>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted, #9ca3af)', marginBottom: '6px' }}>
                  Supabase Project URL
                </label>
                <input
                  type="url"
                  required
                  value={configUrl}
                  onChange={(e) => setConfigUrl(e.target.value)}
                  placeholder="https://your-project.supabase.co"
                  className="input"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted, #9ca3af)', marginBottom: '6px' }}>
                  Supabase Anon (Public) Key
                </label>
                <textarea
                  required
                  rows={3}
                  value={configKey}
                  onChange={(e) => setConfigKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="input"
                  style={{ width: '100%', resize: 'none', fontFamily: 'monospace', fontSize: '0.78rem' }}
                />
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #9ca3af)' }}>
                Configuration Source: <strong>{configSource}</strong>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1, justifyContent: 'center', padding: '10px' }}
                >
                  Save Credentials
                </button>
                {configSource.includes('Local') && (
                  <button
                    type="button"
                    onClick={handleClearCredentials}
                    className="btn btn-secondary"
                    style={{ padding: '10px 14px' }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
