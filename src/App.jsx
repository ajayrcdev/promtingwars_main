import { useState, lazy, Suspense, useCallback } from 'react'
import { useWellness } from './context/WellnessContext.jsx'
import Navbar from './components/Navbar.jsx'
import './App.css'

const Dashboard = lazy(() => import('./components/Dashboard.jsx'))
const CheckIn = lazy(() => import('./components/CheckIn.jsx'))
const JournalHistory = lazy(() => import('./components/JournalHistory.jsx'))
const Insights = lazy(() => import('./components/Insights.jsx'))
const AIChat = lazy(() => import('./components/AIChat.jsx'))

function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-label="Loading page">
      <span aria-hidden="true">🧠</span>
      <span className="sr-only">Loading…</span>
    </div>
  )
}

export default function App() {
  const [tab, setTab] = useState('dashboard')
  const { loaded } = useWellness()

  const handleNavigate = useCallback((t) => setTab(t), [])
  const handleCheckinDone = useCallback(() => setTab('dashboard'), [])

  if (!loaded) {
    return (
      <div className="loading-screen" role="status" aria-label="Loading application">
        <span className="loading-icon" aria-hidden="true">🧠</span>
        <p>Loading MindWell…</p>
      </div>
    )
  }

  return (
    <div className="app">
      <main id="main-content" className="main-content">
        <Suspense fallback={<PageLoader />}>
          {tab === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
          {tab === 'checkin' && <CheckIn onDone={handleCheckinDone} />}
          {tab === 'history' && <JournalHistory />}
          {tab === 'insights' && <Insights />}
          {tab === 'chat' && <AIChat />}
        </Suspense>
      </main>
      <Navbar active={tab} onTabChange={handleNavigate} />
    </div>
  )
}
