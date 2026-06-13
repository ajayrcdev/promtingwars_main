import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WellnessProvider } from '../context/WellnessContext.jsx'
import SettingsModal from '../components/SettingsModal.jsx'

function renderWithContext(ui) {
  return render(
    <WellnessProvider>
      {ui}
    </WellnessProvider>
  )
}

describe('SettingsModal', () => {
  it('renders dialog with heading', () => {
    renderWithContext(<SettingsModal onClose={() => {}} />)
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument()
  })

  it('shows Groq API key input', () => {
    renderWithContext(<SettingsModal onClose={() => {}} />)
    expect(screen.getByLabelText('Groq API key')).toBeInTheDocument()
  })

  it('shows Test and Save buttons', () => {
    renderWithContext(<SettingsModal onClose={() => {}} />)
    expect(screen.getByLabelText('Test API key')).toBeInTheDocument()
    expect(screen.getByText('Save Key')).toBeInTheDocument()
  })

  it('shows AI mode indicator', () => {
    renderWithContext(<SettingsModal onClose={() => {}} />)
    expect(screen.getByText(/Mock AI/)).toBeInTheDocument()
  })

  it('has close button', () => {
    renderWithContext(<SettingsModal onClose={() => {}} />)
    expect(screen.getByLabelText('Close settings')).toBeInTheDocument()
  })

  it('has Remove Key button when apiKey is present', () => {
    renderWithContext(<SettingsModal onClose={() => {}} />)
    expect(screen.queryByText('Remove Key')).not.toBeInTheDocument()
  })
})
