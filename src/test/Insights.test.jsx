import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WellnessProvider } from '../context/WellnessContext.jsx'
import Insights from '../components/Insights.jsx'

function renderWithContext(ui) {
  return render(
    <WellnessProvider>
      {ui}
    </WellnessProvider>
  )
}

describe('Insights', () => {
  it('renders region', () => {
    renderWithContext(<Insights />)
    expect(screen.getByRole('region', { name: 'Wellness insights' })).toBeInTheDocument()
  })

  it('shows empty state when no data', () => {
    renderWithContext(<Insights />)
    expect(screen.getByText('Not enough data yet')).toBeInTheDocument()
  })
})
