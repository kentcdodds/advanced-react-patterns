// Compound Components
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {Switch} from '../switch'

function Toggle({children}) {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

  // 📜 https://react.dev/reference/react/Children
  // 📜 https://react.dev/reference/react/cloneElement
  return React.Children.map(children, child => {
    if (allowedTypes.includes(child.type)) {
      const newChild = React.cloneElement(child, {on, toggle})
      return newChild
    }
    return child
  })
}

const ToggleOn = ({on, children}) => (on ? children : null)
const ToggleOff = ({on, children}) => (!on ? children : null)
const ToggleButton = ({on, toggle}) => <Switch on={on} onClick={toggle} />
const MyToggleButton = ({on}) => (on ? 'On' : 'Off')

const allowedTypes = [ToggleOn, ToggleOff, ToggleButton]

function App() {
  return (
    // <div>
    //   <Toggle>
    //     <ToggleOn>The button is on</ToggleOn>
    //     <ToggleOff>The button is off</ToggleOff>
    //     <ToggleButton />
    //   </Toggle>
    // </div>

    // 1. 💯 Support DOM component children
    <div>
      <Toggle>
        <ToggleOn>The button is on</ToggleOn>
        <ToggleOff>The button is off</ToggleOff>
        <div>Hello</div>
        <ToggleButton />
        <MyToggleButton />
      </Toggle>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
