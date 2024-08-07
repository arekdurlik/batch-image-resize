import { MutableRefObject, useEffect } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useOutsideClick(ref: MutableRefObject<HTMLElement>, callback: Function) {
  useEffect(() => {
    const handleClick = function(event: MouseEvent) {
      if (ref.current) {
        if (!ref.current.contains(event.target as Node)) {
          callback();
        }
      }
    }
    
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [callback, ref]);
}