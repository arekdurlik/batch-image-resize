import { DependencyList, EffectCallback, useEffect, useRef } from 'react'

export function useDidUpdateEffect(effect: EffectCallback, deps: DependencyList) {
  const isMountingRef = useRef(false);

  useEffect(() => {
    isMountingRef.current = true;
  }, []);

  useEffect(() => {
    if (!isMountingRef.current) {
      return effect();
    } else {
      isMountingRef.current = false;
    }
  }, deps);
}