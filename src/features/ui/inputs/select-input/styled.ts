import { MdCheck } from 'react-icons/md'
import styled from 'styled-components'
import { GoTriangleDown } from 'react-icons/go'
import { outline } from '../../../../styles/mixins'
import { Placement } from '../../types'
import { OVERLAY_Z_INDEX } from '../../../../lib/constants'

export const Select = styled.div`
${outline}

position: relative;
font-weight: 400;
background-color: var(--button-default-bgColor-rest);
border: 1px solid var(--borderColor-default);
border-radius: var(--borderRadius-default);
padding: 3px 6px;
display: flex;
min-height: 30px;
min-width: 100px;
gap: 5px;
align-items: center;
justify-content: flex-end;
transition: border-color 150ms;


&:hover {
  background-color: var(--button-default-bgColor-hover);
  cursor: pointer;
}
`

export const SelectedOption = styled.span`
font-weight: 500;
flex-grow: 1;
text-align: center;
pointer-events: none;
`

export const Triangle = styled(GoTriangleDown)`
position: relative;
top: 1px;
pointer-events: none;
`

export const Options = styled.ul<{ $rightAligned: boolean, $renderParams: { placement: Placement, x: number, y: number } }>`
z-index: ${OVERLAY_Z_INDEX.DROPDOWN};
list-style: none;
position: absolute;
min-width: max-content;
overflow: hidden;
padding: 5px;
border: 1px solid var(--borderColor-default);
border-radius: var(--borderRadius-default);
box-shadow: var(--shadow-default);
background-color: var(--bgColor-default);
cursor: default;

left: ${props => props.$renderParams.x}px;
top: ${props => props.$renderParams.y}px;
opacity: 0;

@keyframes slide-in {
  from  {
    top: ${props => props.$renderParams.y + (props.$renderParams.placement === Placement.BOTTOM ? -4 : 4)}px;
    opacity: 0;
  }
  to {
    top: ${props => props.$renderParams.y + (props.$renderParams.placement === Placement.BOTTOM ? 4 : -4)}px;
    opacity: 1;
  }
}

animation-name: slide-in; 
animation-duration: 200ms;
animation-fill-mode: forwards;
`

export const Check = styled(MdCheck)<{ $visible: boolean }>`
  opacity: ${props => props.$visible ? 1 : 0};
`
export const Option = styled.li<{ $highlighted: boolean }>`
display: flex;
align-items: center;
gap: 5px;
padding: 5.5px 10px;
cursor: pointer;
transition: background-color var(--transition-default);
border-radius: var(--borderRadius-default);

${props => props.$highlighted && 'background-color: var(--button-default-bgColor-hover)'};
`