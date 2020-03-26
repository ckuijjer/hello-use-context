import React, { useContext, createContext, useReducer } from 'react';
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
      nextState = state;
      break;
    }
    default:
      return state;
  }

  console.log('reducer called', { state, action, nextState });

  return nextState;
};

const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { a: 0, b: 0, c: 0 });

  const setA = value => dispatch({ type: 'setA', value });
  const setB = value => dispatch({ type: 'setB', value });
  const logUsingReducer = () => dispatch({ type: 'log' });

  const getState = () => {
    return state;
  };

  return (
    <AppContext.Provider value={{ ...state, setA, setB, getState, logUsingReducer }}>{children}</AppContext.Provider>
  );
};

const useCLogger = () => {
  const { c, getState } = useContext(AppContext);

  const log = () => console.log('useCLogger', { c, getState: getState().c });
  return log;
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

  const onChange = e => {
    setB(+e.target.value);
    logUsingReducer();
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
