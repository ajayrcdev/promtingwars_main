import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WellnessProvider } from '../context/WellnessContext.jsx'
import JournalHistory from '../components/JournalHistory.jsx'

function renderWithContext(ui) {
  return render(<WellnessProvider>{ui}</WellnessProvider>)
}

describe('JournalHistory', () => {
  it('shows empty state when no entries', () => {
    renderWithContext(<JournalHistory />)
    expect(screen.getByText('No journal entries yet')).toBeInTheDocument()
  })

  it('has accessible heading', () => {
    renderWithContext(<JournalHistory />)
    expect(screen.getByRole('heading', { name: 'No journal entries yet' })).toBeInTheDocument()
  })
})
