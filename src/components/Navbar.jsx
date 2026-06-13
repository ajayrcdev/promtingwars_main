import { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useWellness } from '../context/WellnessContext.jsx'
import SettingsModal from './SettingsModal.jsx'
import './Navbar.css'

const TABS = [
  { id: 'dashboard', label: 'Home', icon: '🏠' },
  { id: 'checkin', label: 'Check-in', icon: '📝' },
  { id: 'history', label: 'Journal', icon: '📖' },
  { id: 'insights', label: 'Insights', icon: '📊' },
  { id: 'chat', label: 'Chat', icon: '💬' },
]

export default function Navbar({ active, onTabChange }) {
  const { todayEntry } = useWellness()
  const [showSettings, setShowSettings] = useState(false)

  const handleSettingsClose = useCallback(() => setShowSettings(false), [])
  const handleSettingsOpen = useCallback(() => setShowSettings(true), [])

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`nav-item ${active === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            aria-current={active === tab.id ? 'page' : undefined}
            aria-label={`${tab.label} tab`}
          >
            <span className="nav-icon" aria-hidden="true">
              {tab.icon}
              {tab.id === 'checkin' && !todayEntry && <span className="badge-dot" aria-label="Check-in needed" />}
            </span>
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
        <button
          className="nav-item settings-btn"
          onClick={handleSettingsOpen}
          aria-label="Open settings"
        >
          <span className="nav-icon" aria-hidden="true">⚙️</span>
          <span className="nav-label">Settings</span>
        </button>
      </nav>
      {showSettings && <SettingsModal onClose={handleSettingsClose} />}
    </>
  )
}

Navbar.propTypes = {
  active: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
}
