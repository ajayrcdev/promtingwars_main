import { Component } from 'react'
import PropTypes from 'prop-types'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
          <span role="img" aria-label="warning" style={{ fontSize: 48 }}>⚠️</span>
          <h1 style={{ fontSize: 24, marginTop: 16, marginBottom: 8 }}>Something went wrong</h1>
          <p style={{ color: '#64748b', marginBottom: 24 }}>Please refresh the page to continue.</p>
          <button
            onClick={() => window.location.reload()}
            aria-label="Refresh page to recover"
            style={{
              padding: '12px 28px',
              borderRadius: 10,
              border: 'none',
              background: '#6366f1',
              color: 'white',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Refresh Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
}
