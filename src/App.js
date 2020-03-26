import React, { useContext, createContext, useReducer, useEffect, useState, useLayoutEffect, useRef } from 'react';
import './App.css';

const AppContext = createContext({});

const reducer = (state, action) => {
  let nextState = null;

  switch (action.type) {
    case 'setA':
      nextState = { a: action.value, b: state.b, c: action.value + state.b };
      break;
    case 'setB':
      nextState = { a: state.a, b: action.value, c: state.a + action.value };
      break;
    case 'log': {
      console.log('logUsingReducer', state.c);
      nextState = { ...state };
      break;
    }
    default:
      nextState = { ...state };
  }

  console.log('reducer called', { state, action, nextState });

  return nextState;
};

const useABCReducer = () => {
  const [state, dispatch] = useReducer(reducer, { a: 0, b: 0, c: 0 });

  const setA = value => dispatch({ type: 'setA', value });
  const setB = value => dispatch({ type: 'setB', value });
  const logUsingReducer = () => dispatch({ type: 'log' });

  const getState = () => {
    return state;
  };

  return { ...state, setA, setB, getState, logUsingReducer };
};

const AppContextProvider = ({ children }) => {
  const value = useABCReducer();

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useCLogger = () => {
  const { c, getState } = useContext(AppContext);

  const log = () => console.log('useCLogger', { c, getState: getState().c });
  return log;
};

const useCLoggerWithEffect = () => {
  const { c } = useContext(AppContext);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    console.log('useCLoggerWithEffect', c);
  }, [counter]);

  const increment = x => x + 1;
  return () => setCounter(increment);
};

const InputA = () => {
  console.log('render InputA');
  const { a, setA } = useContext(AppContext);
  const log = useCLogger();

  const onChange = e => {
    setA(+e.target.value);
    log();
  };

  return <input type="number" value={a} onChange={onChange} />;
};

const InputB = () => {
  console.log('render InputB');
  const { b, setB, logUsingReducer } = useContext(AppContext);
  const log = useCLogger();
  const logWithEffect = useCLoggerWithEffect();

  const onChange = e => {
    console.log('onChange');
    setB(+e.target.value);
    logUsingReducer();
    logWithEffect();
    log();
  };

  return <input type="number" value={b} onChange={onChange} />;
};

const InputC = () => {
  console.log('render InputC');
  const { c } = useContext(AppContext);

  return <input type="number" value={c} readOnly />;
};

const App = () => (
  <div className="App">
    <AppContextProvider>
      <InputA />+
      <InputB />=
      <InputC />
    </AppContextProvider>
  </div>
);

export default App;
