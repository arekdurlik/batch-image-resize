import styled, { css } from 'styled-components'
import { GoTriangleDown } from 'react-icons/go'
import { outline } from '../../../../styles/mixins'

export const Select = styled.div<{ $open: boolean }>`
${outline}

position: relative;
font-weight: 400;
background-color: var(--control-default-bgColor-rest);
border: 1px solid var(--borderColor-default);
border-radius: var(--borderRadius-default);
padding: 3px 6px;
display: flex;
min-height: 29px;
width: 100%;
gap: 5px;
align-items: center;
justify-content: flex-end;
transition: background-color var(--transition-default), border-color var(--transition-default);

&:hover {
  background-color: var(--control-default-bgColor-hover);
  cursor: pointer;
}

${props => props.$open && css`
  background-color: var(--control-default-bgColor-active) !important;
`}
`
export const SelectedOption = styled.span`
font-weight: 500;
flex-grow: 1;
text-align: center;
pointer-events: none;
user-select: none;
white-space: nowrap;
`

export const Triangle = styled(GoTriangleDown)`
position: relative;
min-width: 14px;
top: 0.5px;
pointer-events: none;
* {
  pointer-events: none;
}
`