import { CSSProperties, ReactNode } from 'react';
import styled from 'styled-components';

export function Setting({
    label,
    unit,
    noUnitSpace,
    unitWidth = 17,
    style,
    children,
}: {
    label?: string;
    unit?: string;
    noUnitSpace?: boolean;
    unitWidth?: number;
    style?: CSSProperties;
    children: ReactNode;
}) {
    return (
        <Wrapper style={style}>
            {label && <Label>{label}:</Label>}
            {children}
            {!noUnitSpace && <Unit $width={unitWidth}>{unit}</Unit>}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 5px;
    width: 100%;
`;

const Label = styled.span`
    cursor: default;
    position: relative;
    bottom: 2px;
    font-weight: 600;
`;

const Unit = styled.span<{ $width: number }>`
    width: 100%;
    max-width: ${props => props.$width}px;
    cursor: default;
`;
