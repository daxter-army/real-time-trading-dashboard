// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// TODO: refactor this back to <StrictMode />
createRoot(document.getElementById('root')!).render(
  <>
    <App />
  </>,
)
