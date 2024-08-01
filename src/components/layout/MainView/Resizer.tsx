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

  return (
    <Wrapper>
      <PanelResizeHandle style={{ zIndex: 5, position: 'relative' }} onDragging={setDragging} />
      <StyledHandle>
        <ResizerWrapper onDoubleClick={handleDoubleClick} className={cancelHover ? 'no-hover' : ''}>
          <ResizerHandle $dragging={dragging} />
        </ResizerWrapper>
      </StyledHandle>  
    </Wrapper>
  )
}

const Wrapper = styled.div`
position: relative;
z-index: 3;
`

const ResizerHandle = styled.div<{ $dragging: boolean }>`
position: relative;
width: 100%;
height: 1px;
background-color: var(--borderColor-default);
transition: 150ms;

${props => props.$dragging && `
  transition: none !important;
  height: 5px;
  background-color: var(--color-blue-5);
`}
`

const ResizerWrapper = styled.div`
position: absolute;
top: -5px;
left: 0;
right: 0;
bottom: 0px;
width: 100%;
display: flex;
align-items: center;
justify-content: center;
height: 10px;
z-index: 4;

&:hover {
  ${ResizerHandle} {
    height: 5px;
    background-color: var(--color-blue-5);
    transition-delay: 300ms;
}

&.no-hover {
  ${ResizerHandle} {
    height: 1px;
    background-color: var(--borderColor-default);
    transition-delay: 0ms;
  }
}
}
`

const StyledHandle = styled.div`
position: absolute;
height: 0px;
width: 100%;
`
