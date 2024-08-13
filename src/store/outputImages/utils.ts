import { useOutputImages } from '.'
import { THUMBNAIL_SIZE } from '../../lib/constants'
import { filenameToJpg, insertVariantDataToFilename, isJpg } from '../../lib/helpers'
import { Log } from '../../lib/log'
import { processImage } from '../../lib/utils'
import { useApp } from '../app'
import { InputImageData, OutputImageData, Variant } from '../types'
import { useVariants } from '../variants'

function alreadyExists(id: string, images: OutputImageData[]) {
  const alreadyExists = images.findIndex(i => i.id === id) > -1;
  if (alreadyExists) {
    Log.warn(`Output image "${id}" already exists.`);
    return true;
  } else {
    return false;
  }
}

export async function generateOutputImageVariants(inputImage: InputImageData, checkForDuplicate = true) {
  Log.debug_verbose('Generating output image variants', { inputImage });

  const variants = useVariants.getState().variants;
  const outputImages = [];
  
  for (let j = 0; j < variants.length; j++) {
    const variant = variants[j];

    const image = await generateOutputImage(inputImage, variant, checkForDuplicate);

    if (image) {
      outputImages.push(image);
    }
  }
  return outputImages;
}

export async function generateOutputImage(inputImage: InputImageData, variant: Variant, checkForDuplicate = true) {
  Log.debug_verbose('Generating output image', { inputImage, variant });

  const id = `${inputImage.id}-${variant.id}`;
  
  if (checkForDuplicate) {
    const currentImages = useOutputImages.getState().images;
    if (alreadyExists(id, currentImages)) return undefined;
  }
  
  const quality = useApp.getState().quality;
  const ratio = inputImage.dimensions.width / inputImage.dimensions.height;
  let newWidth = inputImage.dimensions.width;
  let newHeight = inputImage.dimensions.height;

  if (variant.width) {
    newWidth = variant.width;
    newHeight = Math.ceil(newWidth / ratio);
  } else if (variant?.height) {
    newHeight = variant.height;
    newWidth = Math.ceil(newHeight * ratio);
  }

  let filename = insertVariantDataToFilename(
    inputImage.filename, 
    variant.prefix, 
    variant.suffix
  );

  if (quality < 1) {
    filename = filenameToJpg(filename);
  }

  const processedFull = await processImage(
    inputImage.image.full, 
    quality, 
    variant.width, 
    variant.height, 
    variant.crop
  );

  const processedFile = new File([processedFull.blob], inputImage.filename);

  // generate thumbnail - use full pic if smaller than THUMBNAIL_SIZE
  let processedThumbnail = {...processedFull};
  const { width, height } = processedFull.dimensions;

  if (width > THUMBNAIL_SIZE || height > THUMBNAIL_SIZE) {
    let scaleWidth = undefined;
    let scaleHeight = undefined;
    
    width > height
      ? scaleWidth = THUMBNAIL_SIZE
      : scaleHeight = THUMBNAIL_SIZE

    processedThumbnail = await processImage(
      processedFile, 
      isJpg(inputImage.filename) ? 0.9 : 1, 
      scaleWidth, 
      scaleHeight
    );
  }

  if (checkForDuplicate) {
    const currentImages = useOutputImages.getState().images;
    if (alreadyExists(id, currentImages)) return undefined;
  }

  return {
    id,
    inputImageFilename: inputImage.filename,
    inputImageId: inputImage.id,
    variantId: variant.id,

    image: {
      full: processedFull.blob,
      thumbnail: processedThumbnail.blob
    },

    dimensions: {
      width: processedFull.dimensions.width,
      height: processedFull.dimensions.height
    },

    overwriteFilename: false,
    filename: filename,

    overwriteQuality: false,
    quality: quality
  }
}