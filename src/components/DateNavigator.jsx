import React from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  RotateCcw, 
  BarChart3,
  CalendarDays
} from 'lucide-react'
import { formatDisplayDate, addDays, getTodayDateString } from '../utils/dateUtils'

export default function DateNavigator({
  selectedDate,
  onSelectDate,
  viewMode = 'day', // 'day' | 'analytics'
  onChangeViewMode,
  streakCount = 6
}) {
  const todayStr = getTodayDateString()
  const isToday = selectedDate === todayStr

  const handlePrevDay = () => {
    onSelectDate(addDays(selectedDate, -1))
  }

  const handleNextDay = () => {
    onSelectDate(addDays(selectedDate, 1))
  }

  const handleJumpToday = () => {
    onSelectDate(todayStr)
  }

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      padding: '12px 18px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '14px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
    }}>
      {/* Date Switcher controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          type="button"
          onClick={handlePrevDay}
          className="btn-ghost"
          aria-label="Previous day"
          title="Previous day"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            padding: 0,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border-color)'
          }}
        >
          <ChevronLeft size={18} />
        </button>

        {/* Date Display & Native Picker Trigger */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: isToday ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)',
            padding: '7px 14px',
            borderRadius: '10px',
            cursor: 'pointer'
          }}>
            <Calendar size={15} color={isToday ? 'var(--primary-light)' : 'var(--text-muted)'} />
            <span style={{ fontSize: '0.92rem', fontWeight: '700', color: '#fff' }}>
              {formatDisplayDate(selectedDate)}
            </span>
            {isToday && (
              <span className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                CURRENT
              </span>
            )}
          </div>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => e.target.value && onSelectDate(e.target.value)}
            aria-label="Select custom date"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer'
            }}
          />
        </div>

        <button
          type="button"
          onClick={handleNextDay}
          className="btn-ghost"
          aria-label="Next day"
          title="Next day"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            padding: 0,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border-color)'
          }}
        >
          <ChevronRight size={18} />
        </button>

        {!isToday && (
          <button
            type="button"
            onClick={handleJumpToday}
            className="btn btn-sm btn-secondary"
            style={{ fontSize: '0.76rem', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <RotateCcw size={12} />
            Jump to Today
          </button>
        )}
      </div>

      {/* View Mode Switcher: Daily Log vs Trends & Analytics */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '3px'
        }}>
          <button
            type="button"
            onClick={() => onChangeViewMode('day')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: viewMode === 'day' ? 'var(--primary)' : 'transparent',
              color: viewMode === 'day' ? '#fff' : 'var(--text-muted)',
              fontWeight: '600',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'var(--transition)'
            }}
          >
            <CalendarDays size={14} />
            Daily Log
          </button>

          <button
            type="button"
            onClick={() => onChangeViewMode('analytics')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: viewMode === 'analytics' ? 'var(--primary)' : 'transparent',
              color: viewMode === 'analytics' ? '#fff' : 'var(--text-muted)',
              fontWeight: '600',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'var(--transition)'
            }}
          >
            <BarChart3 size={14} />
            Trends & Analytics
          </button>
        </div>
      </div>
    </div>
  )
}
