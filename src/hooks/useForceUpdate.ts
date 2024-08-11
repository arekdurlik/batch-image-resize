import { DependencyList, useEffect, useReducer } from 'react'

export function useForceUpdate(deps: DependencyList) {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  
  useEffect(() => {
    forceUpdate();
  }, deps);

  return forceUpdate;
}