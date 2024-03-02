// Prop Collections and Getters
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {Switch} from '../switch'

function useToggle() {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

  // Props Collections
  const togglerProps = {
    onClick: toggle,
    on: on,
    'aria-pressed': on,
  }

  // Props Getters
  function getTogglerProps({onClick, ...props} = {}) {
    return {
      'aria-pressed': on,
      onClick: () => {
        onClick && onClick()
        toggle()
      },
      ...props,
    }
  }

  return {on, toggle, togglerProps, getTogglerProps}
}

function App() {
  const {on, getTogglerProps} = useToggle()

  return (
    <div>
      <Switch {...getTogglerProps({on})} />
      <hr />
      <button
        {...getTogglerProps({
          'aria-label': 'custom-button',
          onClick: () => console.info('onButtonClick'),
          id: 'custom-button-id',
        })}
      >
        {!on ? 'on' : 'off'}
      </button>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
