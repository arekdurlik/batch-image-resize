export function normalizedToPosition(
    imageWidth: number,
    imageHeight: number,
    editorWidth: number,
    editorHeight: number,
    scale: number,
    x: number,
    y: number
) {
    const scaledImageWidth = imageWidth * scale;
    const scaledImageHeight = imageHeight * scale;

    // fill the extra space on the left side only (/2) when the image is scaled down to keep it centered
    const spaceToFillX = (imageWidth - scaledImageWidth) / 2;
    const overflowX = (scaledImageWidth - editorWidth) * x;
    const left = -spaceToFillX - overflowX;

    const spaceToFillY = (imageHeight - scaledImageHeight) / 2;
    const overflowY = (scaledImageHeight - editorHeight) * y;
    const top = -spaceToFillY - overflowY;

    return { left, top };
}

export function positionToNormalized(
    imageWidth: number,
    imageHeight: number,
    editorWidth: number,
    editorHeight: number,
    scale: number,
    left: number,
    top: number
) {
    const scaledImageWidth = imageWidth * scale;
    const scaledImageHeight = imageHeight * scale;

    const spaceToFillX = (imageWidth - scaledImageWidth) / 2;
    const spaceToFillY = (imageHeight - scaledImageHeight) / 2;

    const overflowX = -(left + spaceToFillX);
    const overflowY = -(top + spaceToFillY);

    let x = overflowX / (scaledImageWidth - editorWidth);
    let y = overflowY / (scaledImageHeight - editorHeight);

    if (isNaN(x)) x = 0;
    if (isNaN(y)) y = 0;

    return { x, y };
}
