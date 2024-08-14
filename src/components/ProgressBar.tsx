import { useEffect, useRef } from 'react'
import styled from 'styled-components'

export function ProgressBar({ value, max }: { value: number, max: number }) {
  const bar = useRef<HTMLDivElement>(null!);
  const fraction = value / max;
  const width = fraction * 100 + '%';
  const showBar = !isNaN(fraction) && fraction !== 1;
  const dynamicOpacity = 1.25 - (fraction * 1.25);

  useEffect(() => {
    const barEl = bar.current;
    
    if (!showBar) {
      barEl.classList.add('progress-bar--fade-out');

      const timeout = setTimeout(() => {
        barEl.style.display = 'none';
      }, 150);
      
      return () => clearTimeout(timeout);
    } else {
      barEl.classList.remove('progress-bar--fade-out');
      barEl.style.display = 'initial';
    }
  }, [showBar]);

  return <Wrapper>
    <Bar 
      ref={bar} 
      style={{ 
        width, 
        opacity: isNaN(dynamicOpacity) 
          ? 1 
          : dynamicOpacity 
      }}
    />
  </Wrapper>
}

const Wrapper = styled.div`
position: relative;
width: 100%;
height: 3px;
`

const Bar = styled.div`
position: absolute;
height: 100%;
left: 0;
transition: var(--transition-slow);
background-color: var(--color-blue-5);

&.progress-bar--fade-out {
  opacity: 0 !important;
}
`