import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { WasteProvider } from './data/WasteContext'
import { AuthProvider } from './data/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider><WasteProvider><App /></WasteProvider></AuthProvider>
  </StrictMode>,
)
