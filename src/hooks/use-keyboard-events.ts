import { DependencyList, useEffect } from 'react';

export function useKeyDownEvents(
    callback: (event: KeyboardEvent) => void,
    enabled = true,
    deps = <DependencyList>[]
) {
    useEffect(() => {
        if (enabled) {
            document.addEventListener('keydown', callback);
            return () => document.removeEventListener('keydown', callback);
        }
    }, [callback, enabled, ...deps]);
}

export function useKeyUpEvents(
    callback: (event: KeyboardEvent) => void,
    enabled = true,
    deps = <DependencyList>[]
) {
    useEffect(() => {
        if (enabled) {
            document.addEventListener('keyup', callback);
            return () => document.removeEventListener('keyup', callback);
        }
    }, [callback, enabled, ...deps]);
}
