import { DependencyList, useEffect } from 'react'

export function useKeyboardEvents(callback: (event: KeyboardEvent) => void, enabled = true, deps = <DependencyList>[]) {
  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', callback);
      return () => document.removeEventListener('keydown', callback);
    }
  }, [enabled, ...deps]);
}