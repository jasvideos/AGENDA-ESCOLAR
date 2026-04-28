import { useState, useCallback } from 'react';

export const useHistory = (initialState) => {
  const [state, setState] = useState(() => ({
    past: [],
    present: typeof initialState === 'function' ? initialState() : initialState,
    future: []
  }));

  const setExternalState = useCallback((newState) => {
    setState({
      past: [],
      present: newState,
      future: []
    });
  }, []);

  const updateState = useCallback((newPresent) => {
    setState((prevState) => {
      const resolvedPresent = typeof newPresent === 'function' ? newPresent(prevState.present) : newPresent;
      
      if (JSON.stringify(prevState.present) === JSON.stringify(resolvedPresent)) {
        return prevState;
      }

      const past = [...prevState.past, prevState.present];
      if (past.length > 50) past.shift();

      return {
        past,
        present: resolvedPresent,
        future: []
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState((prevState) => {
      if (prevState.past.length === 0) return prevState;

      const previous = prevState.past[prevState.past.length - 1];
      const newPast = prevState.past.slice(0, prevState.past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [prevState.present, ...prevState.future]
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((prevState) => {
      if (prevState.future.length === 0) return prevState;

      const next = prevState.future[0];
      const newFuture = prevState.future.slice(1);

      return {
        past: [...prevState.past, prevState.present],
        present: next,
        future: newFuture
      };
    });
  }, []);

  return [state.present, updateState, undo, redo, setExternalState];
};
