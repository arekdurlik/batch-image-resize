import { MutableRefObject, useEffect, useRef } from 'react'
import { difference } from '../lib/helpers'

const DEFAULT_OPTIONS = { cancelOnDrag: false, dragCancelThreshold: 0 };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useOutsideClick(ref: MutableRefObject<HTMLElement>, callback: Function, options: { cancelOnDrag?: boolean, dragCancelThreshold?: number }) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const mouseDown = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleClick = function(event: MouseEvent) {
      if (ref.current) {
        if (!ref.current.contains(event.target as Node)) {

          if (opts.cancelOnDrag) {
            const { x, y } = mouseDown.current;
            
            if (difference(event.clientX, x) > opts.dragCancelThreshold 
            || difference(event.clientY, y) > opts.dragCancelThreshold) {
              return;
            }
          }

          callback();
        }
      }
    }

    const handleMouseDown = (event: MouseEvent) => {
      mouseDown.current = {
        x: event.clientX,
        y: event.clientY
      }
    }
    
    document.addEventListener('click', handleClick, true);
    opts.cancelOnDrag && document.addEventListener('mousedown', handleMouseDown, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('mousedown', handleMouseDown, true);
    }
  }, [callback, ref]);
}