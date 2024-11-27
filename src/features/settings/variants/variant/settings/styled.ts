import styled from 'styled-components';

export const Bold = styled.span`
    font-weight: 600;
    margin-top: var(--spacing-large);
    margin-bottom: var(--spacing-default);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-default);
    cursor: default;
    min-height: 30px;
`;

export const VerticalInputItem = styled.div`
    display: flex;
    align-items: center;
    gap: var(--spacing-default);
`;
