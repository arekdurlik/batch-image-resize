import { css } from 'styled-components';

export const outlineRest = css`
    outline: 1px solid transparent;
    outline-offset: var(--outlineOffset);
`;

export const outlineActive = css`
    outline-offset: var(--outlineOffset);
    outline: 2px solid var(--outlineColor);
`;

export const outline = css`
    outline: 1px solid transparent;
    outline-offset: var(--outlineOffset);

    &:focus-visible {
        outline: 2px solid var(--outlineColor);
    }
`;
