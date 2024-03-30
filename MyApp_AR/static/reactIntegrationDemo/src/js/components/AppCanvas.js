import React, { useRef, useEffect } from 'react'

import { JEELIZVTO, ARGenius } from 'ARGenius' // Importation des modules ARGenius et JEELIZVTO

import searchImage from '../../images/target512.jpg' // Importation de l'image de recherche

// Fonction pour initialiser le widget VTO
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
    searchImageMask: searchImage, // Image affichée lorsque le visage n'est pas trouvé
    searchImageColor: 0xeeeeee, // Couleur de l'animation de chargement (visage non trouvé)
    searchImageRotationSpeed: -0.001, // Vitesse de rotation de l'image de recherche
    callbackReady: function(){
      console.log('INFO: ARGenius est prêt :)');
    },
    onError: function(errorLabel){ // Cette fonction capture les erreurs pour afficher des messages personnalisés
      alert('Une erreur s\'est produite. errorLabel =' + errorLabel)
      switch(errorLabel) {
        case 'WEBCAM_UNAVAILABLE':
          // L'utilisateur n'a pas de caméra ou ne veut pas la partager
          break;
        case 'INVALID_SKU':
          // Le SKU fourni ne correspond pas à un modèle de lunettes
          break;
        case 'PLACEHOLDER_NULL_WIDTH':
        case 'PLACEHOLDER_NULL_HEIGHT':
          // Quelque chose ne va pas avec le placeholder
          break;
        case 'FATAL':
        default:
          // Une erreur grave est survenue :(
          break;
      } // fin switch
    } // fin onError()
  }) // fin de l'appel à ARGenius.start
}

// Composant principal de l'application
function AppCanvas(props){
  const refPlaceHolder = useRef(); // Référence pour le placeholder
  const refCanvas = useRef(); // Référence pour le canvas
  const refAdjustEnter = useRef(); // Référence pour le bouton d'entrée en mode ajustement
  const refAdjust = useRef(); // Référence pour le message d'ajustement
  const refChangeModel = useRef(); // Référence pour le conteneur de changement de modèle
  const refLoading = useRef(); // Référence pour l'élément de chargement

  // Fonction pour basculer l'affichage du chargement
  const toggle_loading = (isLoadingVisible) => {
    refLoading.current.style.display = (isLoadingVisible) ? 'block' : 'none';
  }

  // Fonction pour entrer en mode d'ajustement
  const enter_adjustMode = () => {
    ARGenius.enter_adjustMode();
    refAdjustEnter.current.style.display = 'none';
    refAdjust.current.style.display = 'block';
    refChangeModel.current.style.display = 'none';
  }

  // Fonction pour quitter le mode d'ajustement
  const exit_adjustMode = () => {
    ARGenius.exit_adjustMode();
    refAdjustEnter.current.style.display = 'block';
    refAdjust.current.style.display = 'none';
    refChangeModel.current.style.display = 'block';
  }

  // Fonction pour définir le modèle de lunettes
  const set_glassesModel = (sku) => {
    ARGenius.load(sku);
  }

  // Effet pour initialiser le widget VTO lors du chargement du composant
  useEffect(() => {
    const placeHolder = refPlaceHolder.current;
    const canvas = refCanvas.current;
    init_VTOWidget(placeHolder, canvas, toggle_loading);

    return () => {
      ARGenius.destroy(); // Destruction du widget lors du démontage du composant
    }
  }, []);

  // Rendu du composant
  return (
    <div ref={refPlaceHolder} className='ARGenius'>
      <canvas ref={refCanvas} className='ARGeniusCanvas'></canvas>
      
      <div ref={refAdjustEnter} className='ARGeniusControls'>
        <button className='ARGeniusButton ARGeniusAdjustEnterButton' onClick={enter_adjustMode}>
          Ajuster
        </button>
      </div>

      <div ref={refAdjust} className='ARGeniusAdjustNotice'>
        Déplacez les lunettes pour les ajuster.
        <button className='ARGeniusButton ARGeniusAdjustExitButton' onClick={exit_adjustMode}>
          Quitter
        </button>
      </div>

      <div ref={refChangeModel} className='ARGeniusControls ARGeniusChangeModelContainer'>
        <button className='ARGeniusButton' onClick={set_glassesModel.bind(this, 'rayban_aviator_or_vertFlash')}>Modèle 1</button>
        <button className='ARGeniusButton' onClick={set_glassesModel.bind(this, 'rayban_round_cuivre_pinkBrownDegrade')}>Modèle 2</button>
        <button className='ARGeniusButton' onClick={set_glassesModel.bind(this, 'carrera_113S_blue')}>Modèle 3</button>
      </div>

      <div ref={refLoading} className='ARGeniusLoading'>
       <div className='ARGeniusLoadingText'>
          CHARGEMENT...
        </div>
      </div>

    </div>
  )
}

export default AppCanvas // Exportation du composant AppCanvas
