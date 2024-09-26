import pica from 'pica'
import { DimensionMode } from '../../types'
import { CropSettings } from '../../lib/config'
import { PicaFilter } from '../types'

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
  filter: PicaFilter = 'mks2013',
  sharpen?: {
    amount: number
    radius: number
    threshold: number
  }
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
      const resized = resizer.resize(
        image, 
        offScreenCanvas, 
        { 
          filter, 
          unsharpAmount: sharpen?.amount ?? 0, 
          unsharpRadius: sharpen?.radius ?? 0.5, 
          unsharpThreshold: sharpen?.threshold ??0 
        }
      );
      resolve(resized);
    } catch {
      throw new Error('Failed to resize image.');
    }
  });
}

export function cropImage(
  image: HTMLImageElement, 
  width: number, 
  height: number, 
  x = 0.5, 
  y = 0.5, 
  zoom = 1
) {
  const cropCanvas = document.createElement('canvas');
  const cropContext = cropCanvas.getContext('2d')!;

  const inputAspectRatio = image.width / image.height;
  const outputAspectRatio = width / height;

  let cropWidth = image.width;
  let cropHeight = image.height;

  if (inputAspectRatio > outputAspectRatio) {
    cropWidth = image.height * outputAspectRatio;
    cropHeight = image.height;
  } else {
    cropWidth = image.width;
    cropHeight = image.width / outputAspectRatio;
  }

  cropWidth = cropWidth / zoom;
  cropHeight = cropHeight / zoom;

  const offsetX = (image.width - cropWidth) * x;
  const offsetY = (image.height - cropHeight) * y;

  cropCanvas.width = cropWidth;
  cropCanvas.height = cropHeight;

  cropContext.drawImage(
    image,
    offsetX, offsetY,
    cropWidth, cropHeight,
    0, 0,
    cropWidth, cropHeight
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
    aspectRatio?: string
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

  let aspectRatio = inputAspectRatio;
  if (settings.aspectRatioEnabled && settings.aspectRatio) {
    const split = settings.aspectRatio.split(':').map(v => Number(v));
    aspectRatio = split[0] / split[1];
  }

  // both width and height are provided
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
        // check the width and height to ensure both stay within bounds
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
  // width is provided but height is empty
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
  // height is provided but width is empty
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
  //both width and height are empty
  else {
    if (settings.aspectRatioEnabled) {
      if (inputAspectRatio > aspectRatio) {
        finalHeight = inputHeight;
        finalWidth = finalHeight * aspectRatio;
      } else {
        finalWidth = inputWidth;
        finalHeight = finalWidth / aspectRatio;
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

export type ResamplingSettings = {
  enabled: boolean
  filter: PicaFilter
  quality: number
}

export type SharpenSettings = {
  enabled: boolean
  amount: number
  radius: number
  threshold: number
}

// TODO: maybe store the image on file upload so it doesn't have to be loaded again
export async function processImage(
  image: HTMLImageElement, 
  extension: string, 
  width: number, 
  height: number, 
  crop?: CropSettings,
  resamplingData?: ResamplingSettings,
  sharpeningData?: SharpenSettings
) {
  let cropped: HTMLCanvasElement | HTMLImageElement = image;

  if (crop) {
    cropped = cropImage(image, width, height, crop.x, crop.y, crop.zoom * crop.minZoom);
  }
  
  const resized = await resizeImage(cropped, width, height, resamplingData?.filter, sharpeningData);

  const blob = await canvasToBlob(resized, resamplingData?.quality ?? 1, extension);

  return {
    blob, 
    dimensions: {
      width: resized.width,
      height: resized.height
    }
  }
}