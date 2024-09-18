import pica from 'pica'
import { DimensionMode } from '../../types'
import { getFileExtension } from '../../lib/helpers'
import { lerp } from '../../helpers'
import { CropSettings } from '../../lib/config'

const resizer = new pica({ features: ['js', 'wasm', 'ww']});

export function loadImage(file: File): Promise<HTMLImageElement> {
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

export function resizeImage(
  image: HTMLCanvasElement | HTMLImageElement, 
  width: number | undefined, 
  height: number | undefined,
): Promise<HTMLCanvasElement> {
  return new Promise(resolve => {
    try {
      const offScreenCanvas = document.createElement('canvas');

      let newWidth = image.width;
      let newHeight = image.height;
      const ratio = image.width / image.height;

      if (width) {
        newWidth = width;
      } else {
        newWidth = Math.ceil(newHeight * ratio);
      }
      
      if (height) {
        newHeight = height;
      } else {
        newHeight = Math.ceil(newWidth / ratio);
      }

      offScreenCanvas.width = newWidth;
      offScreenCanvas.height = newHeight;
      const resized = resizer.resize(image, offScreenCanvas, { filter: 'lanczos3' });
      resolve(resized);
    } catch {
      throw new Error('Failed to resize image.');
    }
  });
}

export function cropImage(image: HTMLImageElement, width: number, height: number, x = 0.5, y = 0.5, scale = 1) {
  const cropCanvas = document.createElement('canvas');
  const cropContext = cropCanvas.getContext('2d')!;

  const inputAspectRatio = image.width / image.height;
  const outputAspectRatio = width / height;

  let cropWidth = image.width, cropHeight = image.height;

  
  if (inputAspectRatio > outputAspectRatio) {
    cropWidth = image.height * outputAspectRatio;
    cropHeight = image.height;
  } else {
    cropWidth = image.width;
    cropHeight = image.width / outputAspectRatio;
  }

  cropCanvas.width = cropWidth;
  cropCanvas.height = cropHeight;

  const min = 0;

  const maxX = -(image.width * scale) + cropWidth;
  const xPos = lerp(min, maxX, x);

  const maxY = -(image.height * scale) + cropHeight;
  const yPos = lerp(min, maxY, y);

  cropContext.drawImage(
    image, 
    0, 0, image.width, image.height, 
    xPos, yPos, image.width * scale, image.height * scale
  );

  return cropCanvas;
}

export function calculateOuputDimensions(
  image: HTMLImageElement,
  settings?: {
    width: number | undefined,
    height: number | undefined,
    widthMode: DimensionMode,
    heightMode: DimensionMode,
    aspectRatioEnabled: boolean,
    aspectRatio: string
  }
) {
  const inputWidth = image.naturalWidth;
  const inputHeight = image.naturalHeight;
  const outputWidth = settings?.width ?? 0;  
  const outputHeight = settings?.height ?? 0;

  let finalWidth = outputWidth; 
  let finalHeight = outputHeight;

  if (!settings) return { width: finalWidth, height: finalHeight };

  const inputAspectRatio = inputWidth / inputHeight;

  // Parse the aspect ratio if it's provided in the settings, else use the image's original aspect ratio
  let aspectRatio = inputAspectRatio;
  if (settings.aspectRatioEnabled && settings.aspectRatio) {
    const split = settings.aspectRatio.split(':').map(v => Number(v));
    aspectRatio = split[0] / split[1];
  }

  // When both width and height are provided
  if (outputWidth && outputHeight) {
    if (settings.widthMode === 'exact' && settings.heightMode === 'exact') {
      if (settings.aspectRatioEnabled) {
        finalWidth = outputWidth;
        finalHeight = finalWidth / aspectRatio;
      } else {
        finalWidth = outputWidth;
        finalHeight = outputHeight;
      }
    } else if (settings.widthMode === 'upto' && settings.heightMode === 'upto') {
      if (settings.aspectRatioEnabled) {
        // Check the width and height to ensure both stay within bounds
        finalWidth = Math.min(outputWidth, inputWidth);
        finalHeight = finalWidth / aspectRatio;
        if (finalHeight > outputHeight) {
          finalHeight = Math.min(outputHeight, inputHeight);
          finalWidth = finalHeight * aspectRatio;
        }
      } else {
        if (inputAspectRatio > outputWidth / outputHeight) {
          finalWidth = Math.min(outputWidth, inputWidth);
          finalHeight = (finalWidth * inputHeight) / inputWidth;
        } else {
          finalHeight = Math.min(outputHeight, inputHeight);
          finalWidth = (finalHeight * inputWidth) / inputHeight;
        }
      }
    } else if (settings.widthMode === 'upto' && settings.heightMode === 'exact') {
      finalHeight = outputHeight;
      if (settings.aspectRatioEnabled) {
        finalWidth = finalHeight * aspectRatio;
        if (finalWidth > outputWidth) {
          finalWidth = outputWidth;
        }
      } else {
        finalWidth = Math.min(outputWidth, (outputHeight * inputWidth) / inputHeight);
      }
    } else if (settings.widthMode === 'exact' && settings.heightMode === 'upto') {
      finalWidth = outputWidth;
      if (settings.aspectRatioEnabled) {
        finalHeight = finalWidth / aspectRatio;
        if (finalHeight > outputHeight) {
          finalHeight = outputHeight;
        }
      } else {
        finalHeight = Math.min(outputHeight, (outputWidth * inputHeight) / inputWidth);
      }
    }
  } 
  // When width is provided but height is empty
  else if (outputWidth && !outputHeight) {
    if (settings.widthMode === 'exact') {
      if (settings.aspectRatioEnabled) {
        finalWidth = outputWidth;
        finalHeight = finalWidth / aspectRatio;
      } else {
        finalWidth = outputWidth;
        finalHeight = (outputWidth * inputHeight) / inputWidth;
      }
    } else if (settings.widthMode === 'upto') {
      if (settings.aspectRatioEnabled) {
        finalWidth = Math.min(outputWidth, inputWidth);
        finalHeight = finalWidth / aspectRatio;
      } else {
        finalWidth = Math.min(outputWidth, inputWidth);
        finalHeight = (finalWidth * inputHeight) / inputWidth;
      }
    }
  } 
  // When height is provided but width is empty
  else if (!outputWidth && outputHeight) {
    if (settings.heightMode === 'exact') {
      if (settings.aspectRatioEnabled) {
        finalHeight = outputHeight;
        finalWidth = finalHeight * aspectRatio;
      } else {
        finalHeight = outputHeight;
        finalWidth = (outputHeight * inputWidth) / inputHeight;
      }
    } else if (settings.heightMode === 'upto') {
      if (settings.aspectRatioEnabled) {
        finalHeight = Math.min(outputHeight, inputHeight);
        finalWidth = finalHeight * aspectRatio;
      } else {
        finalHeight = Math.min(outputHeight, inputHeight);
        finalWidth = (finalHeight * inputWidth) / inputHeight;
      }
    }
  } 
  // When both width and height are empty
  else {
    if (settings.aspectRatioEnabled) {
      if (inputAspectRatio > aspectRatio) {
        finalWidth = inputWidth;
        finalHeight = finalWidth / aspectRatio;
      } else {
        finalHeight = inputHeight;
        finalWidth = finalHeight * aspectRatio;
      }
    } else {
      finalWidth = inputWidth;
      finalHeight = inputHeight;
    }
  }

  return { width: Math.ceil(finalWidth), height: Math.ceil(finalHeight) };
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
export async function processImage(
  image: HTMLImageElement, 
  filename: string, 
  quality: number, 
  width: number, 
  height: number, 
  crop?: CropSettings
) {
  let cropped: HTMLCanvasElement | HTMLImageElement = image;

  if (crop) {
    cropped = cropImage(image, width, height, crop.x, crop.y, crop.scale);
  }
  
  const resized = await resizeImage(cropped, width, height);

  const extension = quality < 1 ? 'jpeg' : getFileExtension(filename);

  const blob = await canvasToBlob(resized, quality, extension);

  return {
    blob, 
    dimensions: {
      width: resized.width,
      height: resized.height
    }
  }
}