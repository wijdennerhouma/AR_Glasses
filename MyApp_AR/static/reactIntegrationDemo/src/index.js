import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import './styles/index.scss' // Importation des styles SCSS pour l'ensemble de l'application

import AppCanvas from './js/components/AppCanvas' // Importation du composant principal de l'application

// Rendu du composant AppCanvas enveloppé dans AppContainer pour le hot reloading
render(
  <AppContainer>
    {/* Le composant principal de l'application, AppCanvas */}
    <AppCanvas />
  </AppContainer>,
  document.querySelector('#root') // Sélection de l'élément avec l'ID "root" dans lequel le composant sera rendu
);
