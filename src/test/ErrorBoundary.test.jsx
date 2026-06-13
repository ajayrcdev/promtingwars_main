import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorBoundary from '../components/ErrorBoundary.jsx'

const Bomb = () => { throw new Error('💥') }

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(<ErrorBoundary><div>content ok</div></ErrorBoundary>)
    expect(screen.getByText('content ok')).toBeInTheDocument()
  })

  it('catches errors and shows fallback UI', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<ErrorBoundary><Bomb /></ErrorBoundary>)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByLabelText('Refresh page to recover')).toBeInTheDocument()
  })
})
