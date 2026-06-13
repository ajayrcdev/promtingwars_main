import { useWellness } from '../context/WellnessContext.jsx'
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

  return (
    <nav className="navbar">
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`nav-item ${active === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="nav-icon">
            {tab.icon}
            {tab.id === 'checkin' && !todayEntry && <span className="badge-dot" />}
          </span>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
