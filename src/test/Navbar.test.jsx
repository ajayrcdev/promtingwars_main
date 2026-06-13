import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WellnessProvider } from '../context/WellnessContext.jsx'
import Navbar from '../components/Navbar.jsx'

function renderWithContext(ui) {
  return render(
    <WellnessProvider>
      {ui}
    </WellnessProvider>
  )
}

describe('Navbar', () => {
  it('renders all navigation tabs', () => {
    renderWithContext(<Navbar active="dashboard" onTabChange={() => {}} />)
    expect(screen.getByLabelText('Home tab')).toBeInTheDocument()
    expect(screen.getByLabelText('Check-in tab')).toBeInTheDocument()
    expect(screen.getByLabelText('Journal tab')).toBeInTheDocument()
    expect(screen.getByLabelText('Insights tab')).toBeInTheDocument()
    expect(screen.getByLabelText('Chat tab')).toBeInTheDocument()
    expect(screen.getByLabelText('Open settings')).toBeInTheDocument()
  })

  it('marks the active tab with aria-current', () => {
    renderWithContext(<Navbar active="chat" onTabChange={() => {}} />)
    const chatTab = screen.getByLabelText('Chat tab')
    expect(chatTab).toHaveAttribute('aria-current', 'page')
  })

  it('renders navigation landmark', () => {
    renderWithContext(<Navbar active="dashboard" onTabChange={() => {}} />)
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Main navigation')
  })
})
