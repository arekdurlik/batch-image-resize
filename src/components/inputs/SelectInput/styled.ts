import { MdCheck } from 'react-icons/md'
import styled from 'styled-components'
import { outline } from '../../../styles/mixins/outline'
import { Placement } from './types'
import { GoTriangleDown } from 'react-icons/go'

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

export const Options = styled.ul<{ $rightAligned: boolean, $placement: Placement }>`
list-style: none;
position: absolute;
min-width: max-content;
width: 100%;
overflow: hidden;
padding: 5px;
border: 1px solid var(--borderColor-default);
border-radius: var(--borderRadius-default);
box-shadow: var(--shadow-default);
background-color: var(--bgColor-default);
cursor: default;

@keyframes fade-down {
  from  {
    top: calc(100% - 4px);
    opacity: 0;
  }
  to {
      top: calc(100% + 4px);
    opacity: 1;
  }
}

@keyframes fade-up {
  from  {
    bottom: calc(100% - 4px);
    opacity: 0;
  }
  to {
    bottom: calc(100% + 4px);
    opacity: 1;
  }
}

animation-name: ${props => props.$placement === Placement.BOTTOM ? 'fade-down' : 'fade-up'};
animation-duration: 150ms;
animation-fill-mode: forwards;

${props => props.$rightAligned ? 'right: 0' : 'left: 0'};
background-color: var(--bgColor-default);
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
transition: var(--transition-default);
border-radius: var(--borderRadius-default);

&:hover {
  background-color: var(--button-default-bgColor-rest);
}

${props => props.$highlighted && outline};
`