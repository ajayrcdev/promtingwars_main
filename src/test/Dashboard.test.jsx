import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WellnessProvider } from '../context/WellnessContext.jsx'
import Dashboard from '../components/Dashboard.jsx'

function renderWithContext(ui) {
  return render(
    <WellnessProvider>
      {ui}
    </WellnessProvider>
  )
}

describe('Dashboard', () => {
  it('shows empty state when no entries', () => {
    renderWithContext(<Dashboard onNavigate={() => {}} />)
    expect(screen.getByText('Start Your Wellness Journey')).toBeInTheDocument()
  })

  it('shows check-in button when no entry today', () => {
    renderWithContext(<Dashboard onNavigate={() => {}} />)
    expect(screen.getByText("Start Today's Check-in")).toBeInTheDocument()
  })

  it('has accessible region', () => {
    renderWithContext(<Dashboard onNavigate={() => {}} />)
    expect(screen.getByRole('region', { name: 'Dashboard overview' })).toBeInTheDocument()
  })

  it('shows greeting card with status message', () => {
    renderWithContext(<Dashboard onNavigate={() => {}} />)
    expect(screen.getByText(/Log your daily check-in/)).toBeInTheDocument()
  })

  it('shows streak badge', () => {
    renderWithContext(<Dashboard onNavigate={() => {}} />)
    expect(screen.getByLabelText('0 day streak')).toBeInTheDocument()
  })
})
