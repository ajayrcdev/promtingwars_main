import { useState } from 'react'
import { useWellness } from './context/WellnessContext.jsx'
import Navbar from './components/Navbar.jsx'
import Dashboard from './components/Dashboard.jsx'
import CheckIn from './components/CheckIn.jsx'
import JournalHistory from './components/JournalHistory.jsx'
import Insights from './components/Insights.jsx'
import AIChat from './components/AIChat.jsx'
import './App.css'

export default function App() {
  const [tab, setTab] = useState('dashboard')
  const { loaded } = useWellness()

  if (!loaded) {
    return (
      <div className="loading-screen">
        <span className="loading-icon">🧠</span>
        <p>Loading MindWell…</p>
      </div>
    )
  }

  return (
    <div className="app">
      <main className="main-content">
        {tab === 'dashboard' && <Dashboard onNavigate={setTab} />}
        {tab === 'checkin' && <CheckIn onDone={() => setTab('dashboard')} />}
        {tab === 'history' && <JournalHistory />}
        {tab === 'insights' && <Insights />}
        {tab === 'chat' && <AIChat />}
      </main>
      <Navbar active={tab} onTabChange={setTab} />
    </div>
  )
}
