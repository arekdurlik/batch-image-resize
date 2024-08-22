import styled from 'styled-components'
import { Placement } from '../types'
import { OVERLAY_Z_INDEX } from '../../../lib/constants'

export const DropdownListItem = styled.div<{ $highlighted: boolean }>`
display: flex;
align-items: center;
gap: 5px;
padding: 5.5px 10px;
cursor: pointer;
transition: background-color var(--transition-default);
border-radius: var(--borderRadius-default);

${props => props.$highlighted && 'background-color: var(--control-default-bgColor-hover)'};
`

export const Container = styled.ul<{ 
  $floating: boolean
  $slideIn: boolean
  $renderParams: { placement: Placement, x: number, y: number },
}>`
z-index: ${OVERLAY_Z_INDEX.DROPDOWN};
list-style: none;
position: absolute;
min-width: max-content;
overflow: hidden;
border: 1px solid var(--borderColor-default);
border-radius: var(--borderRadius-default);
box-shadow: var(--shadow-default);
${props => props.$floating && `box-shadow: var(--shadow-large);`}
background-color: var(--bgColor-default);
cursor: default;

opacity: 0;
${props => props.$renderParams.x && `left: ${props.$renderParams.x}px;`}
${props => props.$renderParams.y && `top: ${props.$renderParams.y}px;`}

@keyframes fade-in {
  from  {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-down {
  from  {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from  {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

  animation-name: ${props => props.$slideIn 
  ? props.$renderParams.placement === Placement.BOTTOM 
    ? 'slide-down' 
    : 'slide-up' 
  : 'fade-in' }; 
  animation-duration: 200ms;
  animation-fill-mode: forwards;
`