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
  onChangeViewMode
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
      padding: '10px 14px',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '10px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
    }}>
      {/* Date Switcher controls - Always strictly one row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '6px',
        flexWrap: 'nowrap',
        flex: '1 1 290px',
        minWidth: 0
      }}>
        <button
          type="button"
          onClick={handlePrevDay}
          className="btn-ghost"
          aria-label="Previous day"
          title="Previous day"
          style={{
            minWidth: '40px',
            width: '40px',
            height: '42px',
            borderRadius: '10px',
            padding: 0,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border-color)',
            flexShrink: 0
          }}
        >
          <ChevronLeft size={18} />
        </button>

        {/* Date Display & Native Picker Trigger */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1, minWidth: 0, justifyContent: 'center' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: isToday ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)',
            padding: '8px 10px',
            minHeight: '42px',
            width: '100%',
            borderRadius: '10px',
            cursor: 'pointer',
            overflow: 'hidden'
          }}>
            <Calendar size={15} color={isToday ? 'var(--primary-light)' : 'var(--text-muted)'} style={{ flexShrink: 0 }} />
            <span style={{
              fontSize: '0.86rem',
              fontWeight: '700',
              color: '#fff',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {formatDisplayDate(selectedDate)}
            </span>
            {isToday && (
              <span className="badge badge-emerald" style={{ fontSize: '0.62rem', padding: '1px 5px', flexShrink: 0 }}>
                TODAY
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
            minWidth: '40px',
            width: '40px',
            height: '42px',
            borderRadius: '10px',
            padding: 0,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border-color)',
            flexShrink: 0
          }}
        >
          <ChevronRight size={18} />
        </button>

        {!isToday && (
          <button
            type="button"
            onClick={handleJumpToday}
            className="btn btn-sm btn-secondary"
            title="Jump to today"
            style={{
              fontSize: '0.74rem',
              height: '42px',
              padding: '0 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              flexShrink: 0
            }}
          >
            <RotateCcw size={12} />
            <span style={{ display: 'none' }} className="today-btn-text">Today</span>
          </button>
        )}
      </div>

      {/* View Mode Switcher: Daily Log vs Trends & Analytics */}
      <div style={{ display: 'flex', alignItems: 'center', flex: '1 1 240px', minWidth: 0 }}>
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '3px',
          width: '100%'
        }}>
          <button
            type="button"
            onClick={() => onChangeViewMode('day')}
            style={{
              flex: 1,
              padding: '6px 10px',
              borderRadius: '8px',
              border: 'none',
              background: viewMode === 'day' ? 'var(--primary)' : 'transparent',
              color: viewMode === 'day' ? '#fff' : 'var(--text-muted)',
              fontWeight: '600',
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              transition: 'var(--transition)',
              whiteSpace: 'nowrap'
            }}
          >
            <CalendarDays size={14} />
            Daily Log
          </button>

          <button
            type="button"
            onClick={() => onChangeViewMode('analytics')}
            style={{
              flex: 1,
              padding: '6px 10px',
              borderRadius: '8px',
              border: 'none',
              background: viewMode === 'analytics' ? 'var(--primary)' : 'transparent',
              color: viewMode === 'analytics' ? '#fff' : 'var(--text-muted)',
              fontWeight: '600',
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              transition: 'var(--transition)',
              whiteSpace: 'nowrap'
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
