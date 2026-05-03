import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Vacina contra erro de toString/null no boot
window.onerror = function(msg) {
  if (msg.includes('toString') || msg.includes('null')) {
    console.warn('Erro de boot detectado. Limpando cache local...');
    localStorage.clear();
    return true; // Impede o erro de travar o navegador
  }
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
