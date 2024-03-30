// On importe les outils de React et ReactDOM.
import React from 'react'
import ReactDOM from 'react-dom/client'

// On importe notre application principale depuis le fichier App.jsx.
import App from './App.jsx'

// On importe les styles CSS pour notre page d'accueil.
import './index.css'

// On crée une "racine" dans la page HTML, à l'endroit avec l'identifiant 'root'.
ReactDOM.createRoot(document.getElementById('root')).render(
  // On utilise StrictMode de React pour détecter les problèmes potentiels dans notre application.
  <React.StrictMode>
    {/* On rend notre application à l'intérieur de StrictMode. */}
    <App />
  </React.StrictMode>,
)
