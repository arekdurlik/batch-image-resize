import { useEffect, useState } from 'react'
import { PanelResizeHandle } from 'react-resizable-panels'
import styled, { css } from 'styled-components'

type Direction = 'horizontal' | 'vertical';

export function Resizer({ direction = 'horizontal', onReset }: { direction?: Direction, onReset?: () => void }) {
  const [dragging, setDragging] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (dragging) {
      if (direction === 'horizontal') {
        document.body.style.cursor = 'ew-resize';
      } else {
        document.body.style.cursor = 'ns-resize';
      }
    } else {
      document.body.style.cursor = '';
    }
  }, [direction, dragging]);

  function handleDoubleClick() {
    onReset?.();
    setCancelHover(true);
    setTimeout(() => setCancelHover(false));
  }

  return (
    <PanelResizeHandle
      style={{ zIndex: 3, position: 'relative' }} 
      onDragging={setDragging} 
      onDoubleClick={handleDoubleClick}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <Handle 
        $direction={direction} 
        $dragging={dragging} 
        className={`${cancelHover && 'no-hover'} ${focused && 'focused'}`}
      >
        <Line $direction={direction}></Line>
      </Handle>
    </PanelResizeHandle>
  )
}

const Line = styled.div<{ $direction: Direction }>`
background-color: transparent;
${props => props.$direction === 'horizontal' && css`
  width: 1px;
  height: 100%;
  cursor: ew-resize !important;
`}
${props => props.$direction === 'vertical' && css`
  height: 1px;
  width: 100%;
  cursor: ns-resize !important;
`}
`

const Handle = styled.div<{ $direction: Direction, $dragging: boolean }>`
position: absolute;
display: grid;
place-items: center;
background-color: transparent;

${props => props.$direction === 'horizontal' && css`
width: calc(100% + 10px);
height: 100%;
left: -5px;
cursor: ew-resize !important;
`}
${props => props.$direction === 'vertical' && css`
height: calc(100% + 10px);
width: 100%;
top: -5px;
cursor: ns-resize !important;
`}

&:not(.no-hover) {
  &:hover, &.focused {  
    ${Line} {
      background-color: var(--color-blue-5);
      transition: var(--transition-fast);
      ${props => props.$direction === 'horizontal' 
        ? 'width: 5px;'
        : 'height: 5px'
      }
    }
  }

  &:hover {
    ${Line} {
      transition-delay: 200ms;
    }
  }

  ${props => props.$dragging && css`
    ${Line} {
      background-color: var(--color-blue-5) !important;
      transition: none !important;
      ${props.$direction === 'horizontal' 
        ? `width: 5px;` 
        : `height: 5px;`
      }
    }
  `}
}
`



