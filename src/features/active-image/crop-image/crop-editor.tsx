import { useEffect, useRef } from 'react';
import { BackgroundImage, Image } from '../styled';
import { InputImageData, OutputImageData } from '../../../store/types';
import { normalizedToPosition, positionToNormalized } from './utils';
import { clamp } from '../../../helpers';
import { Grid } from './grid';
import { useCropState } from './store';
import { EditorWrapper, OuterWrapper, StyledImage, StyledImageWrapper, Wrapper } from './styled';

export type PreviewImageData = {
    x: number;
    y: number;
    width: number;
    height: number;
};

type Props = {
    thumbnailSrc?: string;
    inputImageData: InputImageData;
    outputImageData: OutputImageData;
};
export function CropEditor({ thumbnailSrc, inputImageData, outputImageData: image }: Props) {
    const cropData = useRef({ x: 0.5, y: 0.5, zoom: 1 });
    const containerRef = useRef<HTMLDivElement>(null!);
    const editorRef = useRef<HTMLDivElement>(null!);
    const gridRef = useRef<HTMLDivElement>(null!);
    const imageRef = useRef<HTMLImageElement>(null!);
    // helper image to maintain proper scaling and aspect ratio for the editor content
    // it also prevents a flash of empty space while loading the og image into editor
    const helperImageRef = useRef<HTMLImageElement>(null!);
    const currentCoords = useRef({ x: 0, y: 0 });
    const dragging = useRef(false);
    const outputAspectRatio = image.dimensions.width / image.dimensions.height;
    const api = useCropState(state => state.api);
    const minZoom = useCropState(state => state.minZoom);

    const resizeObserver = useRef(
        new ResizeObserver(() => {
            if (!editorRef.current) return;

            const pos = normalizedToPosition(
                imageRef.current.width,
                imageRef.current.height,
                editorRef.current.offsetWidth,
                editorRef.current.offsetHeight,
                cropData.current.zoom,
                cropData.current.x,
                cropData.current.y
            );

            imageRef.current.style.left = pos.left + 'px';
            imageRef.current.style.top = pos.top + 'px';

            editorRef.current.style.height = gridRef.current.getBoundingClientRect().height + 'px';
        })
    );

    useEffect(() => {
        const image = imageRef.current;

        const currentCropState = useCropState.getState();
        cropData.current.x = currentCropState.x;
        cropData.current.y = currentCropState.y;
        cropData.current.zoom = currentCropState.zoom * currentCropState.minZoom;

        const pos = normalizedToPosition(
            imageRef.current.width,
            imageRef.current.height,
            editorRef.current.offsetWidth,
            editorRef.current.offsetHeight,
            cropData.current.zoom,
            cropData.current.x,
            cropData.current.y
        );
        imageRef.current.style.transform = `scale(${cropData.current.zoom})`;
        imageRef.current.style.left = pos.left + 'px';
        imageRef.current.style.top = pos.top + 'px';

        const unsub1 = useCropState.subscribe(
            state => ({ x: state.x, y: state.y }),
            state => {
                cropData.current.x = state.x;
                cropData.current.y = state.y;

                if (dragging.current) return;

                const pos = normalizedToPosition(
                    imageRef.current.width,
                    imageRef.current.height,
                    editorRef.current.offsetWidth,
                    editorRef.current.offsetHeight,
                    cropData.current.zoom,
                    cropData.current.x,
                    cropData.current.y
                );
                imageRef.current.style.left = pos.left + 'px';
                imageRef.current.style.top = pos.top + 'px';
            }
        );

        const unsub2 = useCropState.subscribe(
            state => state.zoom,
            (zoom, prevZoom) => {
                if (zoom !== prevZoom) {
                    const minZoom = useCropState.getState().minZoom;
                    image.style.transform = `scale(${zoom * minZoom})`;
                    cropData.current.zoom = zoom * minZoom;
                    handleZoom();
                }
            }
        );

        function handleWheel(event: WheelEvent) {
            if (event.deltaY < 0) {
                api.setZoom(Math.min(minZoom * 10, cropData.current.zoom + 0.25));
            } else {
                api.setZoom(Math.max(minZoom, cropData.current.zoom - 0.25));
            }
        }

        image.addEventListener('wheel', handleWheel);

        return () => {
            unsub1();
            unsub2();
            image.removeEventListener('wheel', handleWheel);
        };
    }, [minZoom]);

    useEffect(() => {
        const editor = editorRef.current;
        if (!editor || dragging.current) return;

        const pos = normalizedToPosition(
            imageRef.current.width,
            imageRef.current.height,
            editorRef.current.offsetWidth,
            editorRef.current.offsetHeight,
            cropData.current.zoom,
            cropData.current.x,
            cropData.current.y
        );
        imageRef.current.style.left = pos.left + 'px';
        imageRef.current.style.top = pos.top + 'px';
    }, [cropData]);

    useEffect(() => {
        const observer = resizeObserver.current;
        const container = containerRef.current;

        observer.observe(container);

        return () => {
            observer.unobserve(container);
        };
    }, []);

    useEffect(() => {
        const img = imageRef.current;
        const editor = editorRef.current;
        let editorRect = editor.getBoundingClientRect();

        function setEditorSize() {
            editor.style.width = '100%';
            editor.style.height = '100%';
            editorRect = editor.getBoundingClientRect();
            const editorIsHorizontal = editorRect.width >= editorRect.height;
            const inputIsHorizontal = img.width > img.height;
            editor.style.aspectRatio = `${image.dimensions.width}/${image.dimensions.height}`;

            if (editorIsHorizontal) {
                if (inputIsHorizontal) {
                    const editorAspectRatio = outputAspectRatio;
                    const containerAspectRatio = editorRect.width / editorRect.height;

                    if (editorAspectRatio > containerAspectRatio) {
                        editor.style.width = '100%';
                        editor.style.height = 'unset';
                    } else {
                        editor.style.height = '100%';
                        editor.style.width = 'unset';
                    }
                } else {
                    const editorAspectRatio = outputAspectRatio;
                    const containerAspectRatio = editorRect.width / editorRect.height;

                    if (editorAspectRatio > containerAspectRatio) {
                        editor.style.width = '100%';
                        editor.style.height = 'unset';
                    } else {
                        editor.style.height = '100%';
                        editor.style.width = 'unset';
                    }
                }
            }

            editorRect = editor.getBoundingClientRect();
        }

        setEditorSize();
        setTimeout(() => {
            setEditorSize();
        });

        function handleMouseDown(event: MouseEvent) {
            if (event.button === 2) return;

            currentCoords.current = { x: event.clientX, y: event.clientY };
            imageRef.current.style.cursor = 'grabbing';
            editorRect = editor.getBoundingClientRect();
            document.addEventListener('mousemove', handleMouseMove);
            dragging.current = true;
        }

        function handleMouseMove(event: MouseEvent) {
            const [x, y] = [event.clientX, event.clientY];
            const left = parseInt(window.getComputedStyle(imageRef.current).left);
            const top = parseInt(window.getComputedStyle(imageRef.current).top);
            const imageRect = img.getBoundingClientRect();

            const xToAdd = x - currentCoords.current.x;
            const yToAdd = y - currentCoords.current.y;

            const oobLeft = imageRect.left + xToAdd >= editorRect.left;
            const oobRight = imageRect.right + xToAdd <= editorRect.right;
            const oobTop = imageRect.top + yToAdd >= editorRect.top;
            const oobBottom = imageRect.bottom + yToAdd <= editorRect.bottom;

            let newLeft = 0,
                newTop = 0;

            if (oobLeft) {
                const xDiff = editorRect.left - imageRect.left;
                newLeft = left + xDiff;
            } else if (oobRight) {
                const xDiff = Math.floor(editorRect.right - imageRect.right);
                newLeft = left + xDiff;
            } else {
                newLeft = left + xToAdd;
            }

            if (oobTop) {
                const yDiff = Math.floor(editorRect.top - imageRect.top);
                newTop = top + yDiff;
            } else if (oobBottom) {
                const yDiff = Math.floor(editorRect.bottom - imageRect.bottom);
                newTop = top + yDiff;
            } else {
                newTop = top + yToAdd;
            }

            newLeft = Math.floor(newLeft);
            newTop = Math.floor(newTop);

            imageRef.current.style.left = newLeft + 'px';
            imageRef.current.style.top = newTop + 'px';

            currentCoords.current = { x: event.clientX, y: event.clientY };
        }

        function handleMouseUp() {
            if (!dragging.current) return;

            document.removeEventListener('mousemove', handleMouseMove);
            imageRef.current.style.cursor = 'grab';
            dragging.current = false;

            const left = parseInt(window.getComputedStyle(imageRef.current).left);
            const top = parseInt(window.getComputedStyle(imageRef.current).top);

            const normalized = positionToNormalized(
                img.width,
                img.height,
                editorRect.width,
                editorRect.height,
                cropData.current.zoom,
                left,
                top
            );

            const roundedX = Math.round(normalized.x * 1000) / 1000;
            const roundedY = Math.round(normalized.y * 1000) / 1000;

            api.setPos(clamp(roundedX, 0, 1), clamp(roundedY, 0, 1));
        }

        img.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            img.removeEventListener('mousedown', handleMouseDown);
        };
    }, [imageRef, image, outputAspectRatio]);

    function handleZoom() {
        const image = imageRef.current;
        const editor = editorRef.current;
        const imageRect = image.getBoundingClientRect();
        const editorRect = editor.getBoundingClientRect();

        const oobLeft = imageRect.left > editorRect.left;
        const oobTop = imageRect.top > editorRect.top;
        const oobRight = imageRect.right < editorRect.right;
        const oobBottom = imageRect.bottom < editorRect.bottom;

        const left = parseInt(window.getComputedStyle(imageRef.current).left);
        const top = parseInt(window.getComputedStyle(imageRef.current).top);

        let newLeft = left,
            newTop = top;

        if (oobLeft) {
            const difference = imageRect.left - editorRect.left;
            newLeft = left - difference;
        }

        if (oobTop) {
            const difference = imageRect.top - editorRect.top;
            newTop = top - difference;
        }

        if (oobRight) {
            const difference = imageRect.right - editorRect.right;
            newLeft = left - difference;
        }

        if (oobBottom) {
            const difference = imageRect.bottom - editorRect.bottom;
            newTop = top - difference;
        }

        newLeft = Math.ceil(newLeft);
        newTop = Math.ceil(newTop);

        image.style.left = newLeft + 'px';
        image.style.top = newTop + 'px';

        const normalized = positionToNormalized(
            image.width,
            image.height,
            editorRect.width,
            editorRect.height,
            cropData.current.zoom,
            newLeft,
            newTop
        );

        api.set({
            x: clamp(normalized.x, 0, 1),
            y: clamp(normalized.y, 0, 1),
        });
    }

    useEffect(() => {}, [cropData.current.zoom]);

    return (
        <>
            <StyledImageWrapper>
                <OuterWrapper
                    style={{ aspectRatio: `${image.dimensions.width}/${image.dimensions.height}` }}
                >
                    <Image ref={helperImageRef} src={image.image.full.src} draggable={false} />
                    <Wrapper
                        ref={containerRef}
                        style={{
                            width: image.dimensions.width,
                            height: image.dimensions.height,
                        }}
                    >
                        <Grid
                            ref={gridRef}
                            style={{
                                aspectRatio: `${image.dimensions.width}/${image.dimensions.height}`,
                            }}
                        />
                        <EditorWrapper
                            ref={editorRef}
                            $height={image.inputImage.dimensions.height}
                            $width={image.inputImage.dimensions.width}
                            style={{
                                aspectRatio: `${image.dimensions.width}/${image.dimensions.height}`,
                            }}
                        >
                            <StyledImage
                                draggable={false}
                                ref={imageRef}
                                onLoad={() => {
                                    helperImageRef.current.style.opacity = '0';
                                }}
                                src={inputImageData.image.full.src}
                                height={image.inputImage.dimensions.height}
                                width={image.inputImage.dimensions.width}
                            />
                        </EditorWrapper>
                    </Wrapper>
                </OuterWrapper>
                <BackgroundImage src={thumbnailSrc} draggable={false}></BackgroundImage>
            </StyledImageWrapper>
        </>
    );
}
