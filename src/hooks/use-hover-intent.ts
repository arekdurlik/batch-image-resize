import { useEffect, useRef, useState } from 'react'

export function useHoverIntent(enabled: boolean, timeout = 100) {
  const [hoverIntended, setHoverIntended] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!enabled) setHoverIntended(false);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    let timer = timerRef.current;

    function handler() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setHoverIntended(true);
      }, timeout);
    }

    document.addEventListener('mousemove', handler);
    return () => {
      document.removeEventListener('mousemove', handler);
      clearTimeout(timer);
    }
  }, [enabled, timeout]);

  return hoverIntended;
}