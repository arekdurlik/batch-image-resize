import { createGlobalStyle } from 'styled-components'
import { fontStack } from './mixins/typography'

export const GlobalStyles = createGlobalStyle`
* {
  margin: 0;
  color: var(--fgColor-default);
}

*, *::before, *::after {
  box-sizing: border-box;
}

body {
  ${fontStack};

  background-color: var(--bgColor-default);
  color: var(--fgColor-default);
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 {
  font-weight: 500;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

input, button, textarea, select {
  font: inherit;
}

input, textarea, div, button {
  outline: transparent;
}

p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}

ul {
  padding: unset;
}

#root {
  isolation: isolate;
  height: 100vh;
}
`