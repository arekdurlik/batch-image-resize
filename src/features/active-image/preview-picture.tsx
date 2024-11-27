import { MouseEvent, useRef, useState } from 'react';
import { BackgroundImage, Image, ImageWrapper } from './styled';
import { Lightbox } from './lightbox';
import styled from 'styled-components';

export type PreviewImageData = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export function PreviewPicture({ src, thumbnailSrc }: { src?: string; thumbnailSrc?: string }) {
    const [lightBoxOpened, setLightBoxOpened] = useState(false);
    const [imageData, setImageData] = useState<PreviewImageData>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });
    const imageRef = useRef<HTMLImageElement>(null!);

    function handleClick() {
        const { x, y, width, height } = imageRef.current.getBoundingClientRect();
        setImageData({ x, y, width, height });
        setLightBoxOpened(true);
    }

    function handleClose(event: MouseEvent) {
        event.stopPropagation();
        setLightBoxOpened(false);
    }

    return (
        <>
            <ImageWrapper onClick={handleClick}>
                {lightBoxOpened && (
                    <Lightbox src={src} imageData={imageData} onClose={handleClose} />
                )}
                <Wrapper>
                    <Image ref={imageRef} src={src} draggable={false} />
                </Wrapper>
                <BackgroundImage src={thumbnailSrc}></BackgroundImage>
            </ImageWrapper>
        </>
    );
}

const Wrapper = styled.div`
    position: relative;
    max-height: 100%;
    display: flex;
    align-items: center;
    height: 100%;
    overflow: hidden;
`;
