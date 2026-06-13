import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { WellnessProvider } from './context/WellnessContext.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WellnessProvider>
      <App />
    </WellnessProvider>
  </StrictMode>
)
