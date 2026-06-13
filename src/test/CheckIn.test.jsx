import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WellnessProvider } from '../context/WellnessContext.jsx'
import CheckIn from '../components/CheckIn.jsx'

function renderWithContext(ui) {
  return render(
    <WellnessProvider>
      {ui}
    </WellnessProvider>
  )
}

describe('CheckIn', () => {
  it('renders check-in form', () => {
    renderWithContext(<CheckIn onDone={() => {}} />)
    expect(screen.getByRole('region', { name: 'Daily check-in form' })).toBeInTheDocument()
  })

  it('shows mood slider', () => {
    renderWithContext(<CheckIn onDone={() => {}} />)
    expect(screen.getByLabelText(/Mood level/)).toBeInTheDocument()
  })

  it('shows progress indicator', () => {
    renderWithContext(<CheckIn onDone={() => {}} />)
    expect(screen.getByLabelText('Step 1 of 4')).toBeInTheDocument()
  })

  it('shows the first step heading', () => {
    renderWithContext(<CheckIn onDone={() => {}} />)
    expect(screen.getByText('How are you feeling?')).toBeInTheDocument()
  })
})
