import { createGlobalStyle } from 'styled-components';
import { fontStack, outline } from './mixins';

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

  overflow: hidden;
  user-select: none;

  background-color: var(--bgColor-default);
  color: var(--fgColor-default);
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 {
  font-weight: 600;
}

h2 {
  font-size: 1.5em;
}

h3 {
  font-size: 1.25em;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

input, button, textarea, select {
  font: inherit;
}

textarea, div, button {
  outline: transparent;
}

p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}

ul {
  padding: unset;
}

input[type="range"]:focus {
  ${outline};
  outline-offset: 1px;
  border-radius: var(--borderRadius-default);
}

#root {
  isolation: isolate;
  height: 100vh;
}

#overlay {
  position: absolute;
  inset: 0;
  z-index: 1222;
  pointer-events: none;

  > * {
    pointer-events: all;
  }
}

.drag-select-box {
  position: absolute;
  border: 1px solid var(--color-blue-3);
  z-index: 999;
  opacity: 0.5;
  pointer-events: none;

  &--hidden {
    opacity: 0;
  }

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: var(--color-blue-3);
    opacity: 0.5;
  }
}

.context-menu-actuator {
  opacity: 0;
  pointer-events: none;
  position: absolute;
}
`;
