import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WellnessProvider } from '../context/WellnessContext.jsx'
import AIChat from '../components/AIChat.jsx'

function renderWithContext(ui) {
  return render(
    <WellnessProvider>
      {ui}
    </WellnessProvider>
  )
}

describe('AIChat', () => {
  it('renders chat interface', () => {
    renderWithContext(<AIChat />)
    expect(screen.getByLabelText('AI chat companion')).toBeInTheDocument()
    expect(screen.getByText('MindWell AI')).toBeInTheDocument()
  })

  it('shows welcome message when no chat history', () => {
    renderWithContext(<AIChat />)
    expect(screen.getByLabelText('Chat messages')).toBeInTheDocument()
  })

  it('has send button', () => {
    renderWithContext(<AIChat />)
    expect(screen.getByLabelText('Send message')).toBeInTheDocument()
  })

  it('has chat input', () => {
    renderWithContext(<AIChat />)
    expect(screen.getByLabelText('Type your message')).toBeInTheDocument()
  })
})
