import { createGlobalStyle } from 'styled-components'
import { fontStack } from './shared'

export const GlobalStyles = createGlobalStyle`
body {
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  ${fontStack};
}

div {
  border-color: ${props => props.theme.border}; 
}

h2 {
  font-weight: 500;
}
`