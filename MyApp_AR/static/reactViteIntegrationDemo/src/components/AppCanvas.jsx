import React, { useRef, useEffect } from 'react'

import { ARLook , ARLookWIDGET } from 'jeelizvtowidget'




function init_VTOWidget(placeHolder, canvas, toggle_loading){
  JEELIZVTOWIDGET.start({
    placeHolder,
    canvas,
    callbacks: {
      ADJUST_START: null,
      ADJUST_END: null,
      LOADING_START: toggle_loading.bind(null, true),
      LOADING_END: toggle_loading.bind(null, false)
    },
    sku: 'empty', // SKU loadded at the beginning
    // image displayed when face is not found:
    searchImageMask: searchImage,
    searchImageColor: 0xeeeeee, 
    searchImageRotationSpeed: -0.001, // negative -> clockwise
    callbackReady: function(){
      console.log('INFO: ARLookWIDGET is ready :)')
    },
    onError: function(errorLabel){ // this function catches errors, so you can display custom integrated messages
      alert('An error happened. errorLabel =' + errorLabel)
      switch(errorLabel) {
        case 'WEBCAM_UNAVAILABLE':
          // the user has no camera, or does not want to share it.
          break

        case 'INVALID_SKU':
          // the provided SKU does not match with a glasses model
          break

        case 'PLACEHOLDER_NULL_WIDTH':
        case 'PLACEHOLDER_NULL_HEIGHT':
          // Something is wrong with the placeholder
          // (element whose id='ARLookWidget')
          break
          
        case 'FATAL':
        default:
          // a bit error happens:(
          break
      } // end switch
    } // end onError()
  })
}


function AppCanvas(props){
  const refPlaceHolder = useRef()
  const refCanvas = useRef()
  const refAdjustEnter = useRef()
  const refAdjust = useRef()
  const refChangeModel = useRef()
  const refLoading = useRef()

  const toggle_loading = (isLoadingVisible) => {
    refLoading.current.style.display = (isLoadingVisible) ? 'block' : 'none'
  }

  const enter_adjustMode = () => {
    JEELIZVTOWIDGET.enter_adjustMode()
    refAdjustEnter.current.style.display = 'none'
    refAdjust.current.style.display = 'block'
    refChangeModel.current.style.display = 'none'
  }

  const exit_adjustMode = () => {
    JEELIZVTOWIDGET.exit_adjustMode()
    refAdjustEnter.current.style.display = 'block'
    refAdjust.current.style.display = 'none'
    refChangeModel.current.style.display = 'block'
  }

  const set_glassesModel = (sku) => {
    JEELIZVTOWIDGET.load(sku)
  }

  useEffect(() => {
    const placeHolder = refPlaceHolder.current
    const canvas = refCanvas.current
    init_VTOWidget(placeHolder, canvas, toggle_loading)

    return () => {
      
    }
  }, [])

  return (
    <div ref={refPlaceHolder} className='ARLookWidget'>
      <canvas ref={refCanvas} className='ARLookWidgetCanvas'></canvas>
      
      <div ref={refAdjustEnter} className='ARLookWidgetControls'>
        <button className='ARLookWidgetButton ARLookWidgetAdjustEnterButton' onClick={enter_adjustMode}>
          Adjust
        </button>
      </div>

      <div ref={refAdjust} className='JARLookWidgetAdjustNotice'>
        Move the glasses to adjust them.
        <button className='ARLookWidgetButton ARLookWidgetAdjustExitButton' onClick={exit_adjustMode}>
          Quit
        </button>
      </div>

      <div ref={refChangeModel} className='ARLookWidgetControls ARLookWidgetChangeModelContainer'>
        <button className='ARLookWidgetButton' onClick={set_glassesModel.bind(this, 'glasses_blue')}>Model 1</button>
        <button className='ARLookWidgetButton' onClick={set_glassesModel.bind(this, 'rayban_round_cuivre_pinkBrownDegrade')}>Model 2</button>
        <button className='ARLookWidgetButton' onClick={set_glassesModel.bind(this, 'carrera_113S_blue')}>Model 3</button>
      </div>

      <div ref={refLoading} className='ARLookWidgetLoading'>
       <div className='ARLookWidgetLoadingText'>
          LOADING...
        </div>
      </div>

    </div>
  )
}

export default AppCanvas
