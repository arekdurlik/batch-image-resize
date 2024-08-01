import { css } from 'styled-components'

export const outline = css`
outline: 1px solid transparent;
outline-offset: var(--outlineOffset);

&:focus-visible {
  outline: 2px solid var(--outlineColor);
}
`