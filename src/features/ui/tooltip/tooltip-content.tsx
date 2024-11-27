import { ReactNode } from 'react';
import styled, { CSSProperties } from 'styled-components';

export function TooltipContent({
    children,
    style,
}: {
    children: ReactNode;
    style?: CSSProperties;
}) {
    return <Wrapper style={style}>{children}</Wrapper>;
}

const Wrapper = styled.div`
    background-color: var(--bgColor-inverse);
    color: var(--fgColor-inverse);
    border-radius: var(--borderRadius-default);
    padding: var(--spacing-default) var(--spacing-large);
    box-shadow: var(--shadow-default);
    text-align: center;
    white-space: pre-wrap;
    max-width: 200px;
`;
