import styled, { css } from 'styled-components';
import { SECTION_HEADER_HEIGHT } from '../../lib/constants';

export const AppWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
`;

export const AppContent = styled.div`
    display: flex;
    height: 100%;
    overflow: hidden;
`;

export const SectionHeader = styled.div<{ $borderTop?: boolean }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-large);

    padding: 0 var(--spacing-large);
    height: ${SECTION_HEADER_HEIGHT}px;
    border-bottom: 1px solid var(--borderColor-default);
    ${props =>
        props.$borderTop &&
        css`
            border-top: 1px solid var(--borderColor-default);
        `}

    * {
        pointer-events: initial;
    }
`;

export const SectionTitle = styled.h2`
    display: flex;
    align-items: center;
    margin-top: calc(-1 * var(--spacing-default));
    margin-bottom: calc(-1 * var(--spacing-default));
`;

export const SideBarSection = styled.div<{ $animate?: boolean }>`
    display: flex;
    flex-direction: column;
    padding: var(--spacing-large);
`;

export const SectionGroup = styled.div`
    border-bottom: 1px solid var(--borderColor-default);

    display: flex;
    flex-direction: column;

    /* &:last-child:not(:nth-child(2)) {
    border-bottom: none;
  } */
`;
