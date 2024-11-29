import styled from 'styled-components';
import { ImageWrapper } from '../styled';

export const StyledImageWrapper = styled(ImageWrapper)`
    display: grid;
    place-content: center;
    cursor: default;
`;

export const OuterWrapper = styled.div`
    position: relative;
    max-height: 100%;
    display: flex;
    align-items: center;
    height: 100%;
    overflow: hidden;
`;

export const Wrapper = styled.div`
    position: absolute;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    max-height: 100%;
    max-width: 100%;
`;

export const EditorWrapper = styled.div<{ $width: number; $height: number }>`
    position: relative;
    max-height: 100%;
    max-width: 100%;
    height: ${props => props.$height}px;
    width: ${props => props.$width}px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const StyledImage = styled.img`
    position: absolute;
    cursor: grab;
    z-index: 0;
    height: max-content;
`;
