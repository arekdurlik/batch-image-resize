import pica from 'pica'
import { getFileExtension } from './helpers'

const resizer = new pica({ features: ['js', 'wasm', 'ww']});

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise(resolve => {
    try {
      const image = new Image();
      image.onload = () => resolve(image);
      image.src = URL.createObjectURL(file);
    } catch {
      throw new Error(`Error loading image from file "${file.name}".`);
    }
  });
}

function cropImageToSquare(image: HTMLImageElement): Promise<HTMLCanvasElement> {
  return new Promise(resolve => {
    try {
      const destCanvas = document.createElement('canvas');
      const destContext = destCanvas.getContext('2d')!;

      const isHorizontal = image.width > image.height;
      const squareSideLength = isHorizontal ? image.height : image.width;

      destCanvas.width = destCanvas.height = squareSideLength;

      let startX = 0;
      let startY = 0;

      if (isHorizontal) {
        startX = (image.width / 2) - (squareSideLength / 2);
      } else {
        startY = (image.height / 2) - (squareSideLength / 2);
      }

      destContext.drawImage(image, startX, startY, squareSideLength, squareSideLength, 0, 0, squareSideLength, squareSideLength);
      resolve(destCanvas);
    } catch {
      throw new Error('Failed to crop image.');
    }
  })
}

function resizeImage(image: HTMLCanvasElement | HTMLImageElement, width?: number, height?: number): Promise<HTMLCanvasElement> {
  return new Promise(resolve => {
    try {
      const offScreenCanvas = document.createElement('canvas');

      let newWidth = image.width;
      let newHeight = image.height;
      const ratio = image.width / image.height;

      if (width) {
        newWidth = width;
        newHeight = Math.ceil(newWidth / ratio);
      } else if (height) {
        newHeight = height;
        newWidth = Math.ceil(newHeight * ratio);
      }

      offScreenCanvas.width = newWidth;
      offScreenCanvas.height = newHeight;
      const resized = resizer.resize(image, offScreenCanvas);
      resolve(resized);
    } catch {
      throw new Error('Failed to resize image.');
    }
  });
}

function canvasToBlob(image: HTMLCanvasElement, quality: number, extension: string): Promise<Blob> {
  return new Promise(resolve => {
    try {
      const blob = resizer.toBlob(image, `image/${extension}`, quality);
      resolve(blob);
    } catch {
      throw new Error('Failed to convert image to blob.');
    }
  });
}

// TODO: maybe store the image on file upload so it doesn't have to be loaded again
export async function processImage(file: File, quality: number, width: number | undefined, height: number | undefined, crop?: boolean) {
  const image = await loadImage(file);

  let cropped: HTMLCanvasElement | HTMLImageElement = image;
  if (crop) cropped = await cropImageToSquare(image);

  const resized = await resizeImage(cropped, width, height);

  const extension = quality < 1 ? 'jpeg' : getFileExtension(file.name);

  const blob = await canvasToBlob(resized, quality, extension);

  return {
    blob, 
    dimensions: {
      width: resized.width,
      height: resized.height
    }
  }
}