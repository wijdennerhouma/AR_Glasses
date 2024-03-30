import React, { useRef, useEffect } from 'react'

// Importation des modules JEELIZVTO et ARGenius depuis ARGenius
import { JEELIZVTO, ARGenius } from 'ARGenius'

// Importation de l'image de recherche depuis les ressources
import searchImage from '../assets/target512.jpg'

// Fonction d'initialisation du widget VTO
function init_VTOWidget(placeHolder, canvas, toggle_loading){
  ARGenius.start({
    placeHolder,
    canvas,
    callbacks: {
      ADJUST_START: null,
      ADJUST_END: null,
      LOADING_START: toggle_loading.bind(null, true),
      LOADING_END: toggle_loading.bind(null, false)
    },
    sku: 'empty', // SKU chargé au début
    searchImageMask: searchImage, // Image affichée lorsque le visage n'est pas détecté
    searchImageColor: 0xeeeeee, // Couleur de l'animation de chargement
    searchImageRotationSpeed: -0.001, // Vitesse de rotation de l'image de recherche
    callbackReady: function(){
      console.log('INFO: ARGenius est prêt :)')
    },
    onError: function(errorLabel){ // Gestion des erreurs
      alert('Une erreur est survenue. errorLabel =' + errorLabel)
      switch(errorLabel) {
        case 'WEBCAM_UNAVAILABLE':
          // Pas de caméra disponible ou l'utilisateur ne souhaite pas la partager
          break

        case 'INVALID_SKU':
          // Le SKU fourni ne correspond pas à un modèle de lunettes valide
          break

        case 'PLACEHOLDER_NULL_WIDTH':
        case 'PLACEHOLDER_NULL_HEIGHT':
          // Problème avec le placeholder
          break
          
        case 'FATAL':
        default:
          // Erreur critique
          break
      }
    }
  })
}

// Composant AppCanvas
function AppCanvas(props){
  // Références aux éléments DOM
  const refPlaceHolder = useRef()
  const refCanvas = useRef()
  const refAdjustEnter = useRef()
  const refAdjust = useRef()
  const refChangeModel = useRef()
  const refLoading = useRef()

  // Fonction pour afficher ou masquer l'animation de chargement
  const toggle_loading = (isLoadingVisible) => {
    refLoading.current.style.display = (isLoadingVisible) ? 'block' : 'none'
  }

  // Fonction pour entrer en mode ajustement
  const enter_adjustMode = () => {
    ARGenius.enter_adjustMode()
    refAdjustEnter.current.style.display = 'none'
    refAdjust.current.style.display = 'block'
    refChangeModel.current.style.display = 'none'
  }

  // Fonction pour quitter le mode ajustement
  const exit_adjustMode = () => {
    ARGenius.exit_adjustMode()
    refAdjustEnter.current.style.display = 'block'
    refAdjust.current.style.display = 'none'
    refChangeModel.current.style.display = 'block'
  }

  // Fonction pour charger un modèle de lunettes
  const set_glassesModel = (sku) => {
    ARGenius.load(sku)
  }

  // Effet secondaire pour initialiser le widget VTO
  useEffect(() => {
    const placeHolder = refPlaceHolder.current
    const canvas = refCanvas.current
    init_VTOWidget(placeHolder, canvas, toggle_loading)

    return () => {
      // Désactiver le widget
      // ARGenius.destroy()
    }
  }, [])

  // Rendu du composant
  return (
    <div ref={refPlaceHolder} className='ARGenius'>
      <canvas ref={refCanvas} className='ARGeniusCanvas'></canvas>
      
      {/* Bouton pour entrer en mode ajustement */}
      <div ref={refAdjustEnter} className='ARGeniusControls'>
        <button className='ARGeniusButton ARGeniusAdjustEnterButton' onClick={enter_adjustMode}>
          Ajuster
        </button>
      </div>

      {/* Affichage pour le mode ajustement */}
      <div ref={refAdjust} className='ARGeniusAdjustNotice'>
        Déplacez les lunettes pour les ajuster.
        <button className='ARGeniusButton ARGeniusAdjustExitButton' onClick={exit_adjustMode}>
          Quitter
        </button>
      </div>

      {/* Sélecteur de modèle */}
      <div ref={refChangeModel} className='ARGeniusControls ARGeniusChangeModelContainer'>
        <button className='ARGeniusButton' onClick={set_glassesModel.bind(this, 'rayban_aviator_or_vertFlash')}>Modèle 1</button>
        <button className='ARGeniusButton' onClick={set_glassesModel.bind(this, 'rayban_round_cuivre_pinkBrownDegrade')}>Modèle 2</button>
        <button className='ARGeniusButton' onClick={set_glassesModel.bind(this, 'carrera_113S_blue')}>Modèle 3</button>
      </div>

      {/* Animation de chargement */}
      <div ref={refLoading} className='ARGeniusLoading'>
       <div className='ARGeniusLoadingText'>
          CHARGEMENT...
        </div>
      </div>

    </div>
  )
}

export default AppCanvas
