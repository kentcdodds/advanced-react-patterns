// Control Props
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {Switch} from '../switch'
import warning from 'warning'

const callAll =
  (...fns) =>
  (...args) =>
    fns.forEach(fn => fn?.(...args))

const actionTypes = {
  toggle: 'toggle',
  reset: 'reset',
}

function toggleReducer(state, {type, initialState}) {
  switch (type) {
    case actionTypes.toggle: {
      return {on: !state.on}
    }
    case actionTypes.reset: {
      return initialState
    }
    default: {
      throw new Error(`Unsupported type: ${type}`)
    }
  }
}

// 3. 💯 extract warnings to a custom hook
function useControlledSwitchWarning(
  controlPropValue,
  controlPropName,
  componentName,
) {
  const isControlled = controlPropValue != null
  const {current: wasControlled} = React.useRef(isControlled)

  React.useEffect(() => {
    warning(
      !(isControlled && !wasControlled),
      `\`${componentName}\` is changing from uncontrolled to be controlled. Components should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled \`${componentName}\` for the lifetime of the component. Check the \`${controlPropName}\` prop.`,
    )
    warning(
      !(!isControlled && wasControlled),
      `\`${componentName}\` is changing from controlled to be uncontrolled. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled \`${componentName}\` for the lifetime of the component. Check the \`${controlPropName}\` prop.`,
    )
  }, [componentName, controlPropName, isControlled, wasControlled])
}

function useOnChangeReadOnlyWarning(
  controlPropValue,
  controlPropName,
  componentName,
  hasOnChange,
  readOnly,
  readOnlyProp,
  initialValueProp,
  onChangeProp,
) {
  const isControlled = controlPropValue != null
  React.useEffect(() => {
    warning(
      !(!hasOnChange && isControlled && !readOnly),
      `A \`${controlPropName}\` prop was provided to \`${componentName}\` without an \`${onChangeProp}\` handler. This will result in a read-only \`${controlPropName}\` value. If you want it to be mutable, use \`${initialValueProp}\`. Otherwise, set either \`${onChangeProp}\` or \`${readOnlyProp}\`.`,
    )
  }, [
    componentName,
    controlPropName,
    isControlled,
    hasOnChange,
    readOnly,
    onChangeProp,
    initialValueProp,
    readOnlyProp,
  ])
}

function useToggle({
  initialOn = false,
  reducer = toggleReducer,
  onChange,
  on: controlledOn,
  readOnly = false,
} = {}) {
  const {current: initialState} = React.useRef({on: initialOn})
  const [state, dispatch] = React.useReducer(reducer, initialState)

  const onIsControlled = controlledOn != null
  const on = onIsControlled ? controlledOn : state.on

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useControlledSwitchWarning(controlledOn, 'on', 'useToggle')
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useOnChangeReadOnlyWarning(
      controlledOn,
      'on',
      'useToggle',
      Boolean(onChange),
      readOnly,
      'readOnly',
      'initialOn',
      'onChange',
    )
  }

  // // 2. 💯 add a controlled state warning
  // const {current: onWasControlled} = React.useRef(onIsControlled)
  // React.useEffect(() => {
  //   warning(
  //     !(onIsControlled && !onWasControlled),
  //     `\`useToggle\` is changing from uncontrolled to be controlled. Components should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled \`useToggle\` for the lifetime of the component. Check the \`on\` prop.`,
  //   )
  //   warning(
  //     !(!onIsControlled && onWasControlled),
  //     `\`useToggle\` is changing from controlled to be uncontrolled. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled \`useToggle\` for the lifetime of the component. Check the \`on\` prop.`,
  //   )
  // }, [onIsControlled, onWasControlled])

  // // 1. 💯 add read only warning
  // const hasOnChange = Boolean(onChange)

  // React.useEffect(() => {
  //   warning(
  //     !(!hasOnChange && onIsControlled && !readOnly),
  //     `An \`on\` prop was provided to useToggle without an \`onChange\` handler. This will render a read-only toggle. If you want it to be mutable, use \`initialOn\`. Otherwise, set either \`onChange\` or \`readOnly\`.`,
  //   )
  // }, [hasOnChange, onIsControlled, readOnly])

  function dispatchWithOnChange(action) {
    if (!onIsControlled) {
      dispatch(action)
    }

    const newState = reducer({...state, on}, action)
    onChange?.(newState, action)
  }

  const toggle = () => dispatchWithOnChange({type: actionTypes.toggle})
  const reset = () =>
    dispatchWithOnChange({type: actionTypes.reset, initialState})

  function getTogglerProps({onClick, ...props} = {}) {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      ...props,
    }
  }

  function getResetterProps({onClick, ...props} = {}) {
    return {
      onClick: callAll(onClick, reset),
      ...props,
    }
  }

  return {
    on,
    reset,
    toggle,
    getTogglerProps,
    getResetterProps,
  }
}

function Toggle({on: controlledOn, onChange, initialOn, reducer, readOnly}) {
  const {on, getTogglerProps} = useToggle({
    on: controlledOn,
    onChange,
    initialOn,
    reducer,
    readOnly,
  })
  const props = getTogglerProps({on})
  return <Switch {...props} />
}

function App() {
  const [bothOn, setBothOn] = React.useState(false)
  const [timesClicked, setTimesClicked] = React.useState(0)

  function handleToggleChange(state, action) {
    if (action.type === actionTypes.toggle && timesClicked > 4) {
      return
    }
    setBothOn(state.on)
    setTimesClicked(c => c + 1)
  }

  function handleResetClick() {
    setBothOn(false)
    setTimesClicked(0)
  }

  return (
    <div>
      <div>
        <Toggle on={bothOn} />
        <Toggle on={bothOn} onChange={handleToggleChange} />
      </div>
      {timesClicked > 4 ? (
        <div data-testid="notice">
          Whoa, you clicked too much!
          <br />
        </div>
      ) : (
        <div data-testid="click-count">Click count: {timesClicked}</div>
      )}
      <button onClick={handleResetClick}>Reset</button>
      <hr />
      <div>
        <div>Uncontrolled Toggle:</div>
        <Toggle
          onChange={(...args) =>
            console.info('Uncontrolled Toggle onChange', ...args)
          }
        />
      </div>
    </div>
  )
}

export default App
// we're adding the Toggle export for tests
export {Toggle}

/*
eslint
  no-unused-vars: "off",
*/
