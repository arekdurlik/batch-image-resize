import { CSSProperties, forwardRef } from 'react';
import styled from 'styled-components';

type Props = {
    style: CSSProperties;
};

export const Grid = forwardRef<HTMLDivElement, Props>((props, ref) => {
    return (
        <Container ref={ref} style={props.style}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </Container>
    );
});

const Container = styled.div`
    position: absolute;
    inset: -1px;
    z-index: 123;
    display: grid;
    align-self: center;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    grid-gap: 1px;
    box-sizing: border-box;
    pointer-events: none;
    opacity: 1;

    div {
        box-shadow: 0 0 0 1px var(--borderColor-default);
    }
`;
