import styled from 'styled-components'
import { GoTriangleDown } from 'react-icons/go'
import { outline } from '../../../../styles/mixins'

export const Select = styled.div`
${outline}

position: relative;
font-weight: 400;
background-color: var(--control-default-bgColor-rest);
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
  background-color: var(--control-default-bgColor-hover);
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
* {
  pointer-events: none;
}
`