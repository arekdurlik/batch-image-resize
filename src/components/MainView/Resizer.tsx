import { useState } from 'react'
import { PanelResizeHandle } from 'react-resizable-panels'
import styled from 'styled-components'

export function Resizer({ onReset }: { onReset?: () => void }) {
  const [dragging, setDragging] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);

  function handleDoubleClick() {
    onReset?.();
    setCancelHover(true);

    setTimeout(() => setCancelHover(false));
  }

  return <>
    <PanelResizeHandle style={{ zIndex: 1 }} onDragging={setDragging} />
    <StyledHandle>
      <ResizerWrapper onDoubleClick={handleDoubleClick} className={cancelHover ? 'no-hover' : ''}>
        <ResizerHandle $dragging={dragging} />
      </ResizerWrapper>
    </StyledHandle>  
  </>
}

const ResizerHandle = styled.div<{ $dragging: boolean }>`
position: relative;
width: 100%;
height: 1px;
background-color: ${props => props.theme.border};
top: 0px;
transition: 150ms;

${props => props.$dragging && `
  transition: none !important;
  height: 5px;
  background-color: #41a9ee;
`}
`

const ResizerWrapper = styled.div`
position: absolute;
top: -5px;
left: 0;
right: 0;
bottom: -1px;
width: 100%;
display: flex;
align-items: center;
justify-content: center;

&:hover {
  ${ResizerHandle} {
    height: 5px;
    top: 0px;
    background-color: #41a9ee;
    transition-delay: 300ms;
  }
}

&.no-hover {
  ${ResizerHandle} {
    height: 1px;
    background-color: ${props => props.theme.border};
    transition-delay: 0ms;
  }
}
`

const StyledHandle = styled.div`
position: relative;
height: 5px;
width: 100%;
`
