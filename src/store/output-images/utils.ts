import { useOutputImages } from '.'
import { THUMBNAIL_SIZE } from '../../lib/constants'
import { filenameToJpg, getFileExtension, insertVariantDataToFilename, isJpg } from '../../lib/helpers'
import { Log } from '../../lib/log'
import { calculateOuputDimensions, loadImage, processImage } from '../utils'
import { InputImageData, OutputImageData } from '../types'
import { useVariants } from '../variants'
import { DEFAULT_CROP_SETTINGS } from '../../lib/config'

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

    const image = await generateOutputImage(inputImage, variant.id, checkForDuplicate);

    if (image) {
      outputImages.push(image);
    }
  }
  return outputImages;
}

export function getUpToDateVariant(variantId: string) {
  const variant = useVariants.getState().variants.find(v => v.id === variantId);

  if (!variant) {
    throw new Error(`Variant with id ${variantId} not found.`);
  }

  return variant;
}

export async function generateOutputImage(
  inputImage: InputImageData, 
  variantId: string, 
  checkForDuplicate = true
): Promise<OutputImageData | undefined> {
  Log.debug_verbose('Generating output image', { inputImage, variantId });

  const id = `${inputImage.id}-${variantId}`;
  
  if (checkForDuplicate) {
    const currentImages = useOutputImages.getState().images;
    if (alreadyExists(id, currentImages)) return undefined;
  }

  let variant = getUpToDateVariant(variantId);
  const quality = variant.quality;

  const image = await loadImage(inputImage.image.full.file);
  const finalDimensions = calculateOuputDimensions(
    image, 
    { 
      widthMode: variant.width.mode, 
      width: variant.width.value, 
      heightMode: variant.height.mode,
      height: variant.height.value,
      aspectRatioEnabled: variant.aspectRatio.enabled,
      aspectRatio: variant.aspectRatio.value
    }
  );

  const extension = quality < 1 ? 'jpeg' : getFileExtension(inputImage.filename);

  let filename = insertVariantDataToFilename(
    inputImage.filename, 
    variant.prefix, 
    variant.suffix
  );

  if (extension === 'jpeg') {
    filename = filenameToJpg(filename);
  }

  const processedFull = await processImage(
    image,
    extension, 
    quality, 
    finalDimensions.width, 
    finalDimensions.height,
    variant.filter,
    DEFAULT_CROP_SETTINGS
  );

  variant = getUpToDateVariant(variantId);

  const processedFile = new File([processedFull.blob], inputImage.filename);

  // generate thumbnail - use full pic if smaller than THUMBNAIL_SIZE
  let processedThumbnail = {...processedFull};
  const { width, height } = processedFull.dimensions;
  const needsThumbnail = width > THUMBNAIL_SIZE || height > THUMBNAIL_SIZE;

  if (needsThumbnail) {
    const image = await loadImage(processedFile);
    const finalDimensions = calculateOuputDimensions(
      image, 
      { 
        widthMode: 'upto', 
        width: THUMBNAIL_SIZE, 
        heightMode: 'upto',
        height: THUMBNAIL_SIZE,
        aspectRatioEnabled: variant.aspectRatio.enabled,
        aspectRatio: variant.aspectRatio.value
      }
    );
    
    processedThumbnail = await processImage(
      image,
      processedFile.name,
      isJpg(inputImage.filename) ? 0.9 : 1, 
      finalDimensions.width, 
      finalDimensions.height
    );
  }

  if (checkForDuplicate) {
    const currentImages = useOutputImages.getState().images;
    if (alreadyExists(id, currentImages)) return undefined;
  }

  const fullSrc = URL.createObjectURL(processedFull.blob);

  return {
    id,
    inputImage: {
      id: inputImage.id,
      filename: inputImage.filename,
      size: inputImage.image.full.file.size
    },
    variantId: variant.id,

    crop: DEFAULT_CROP_SETTINGS,

    image: {
      full: {
        file: processedFull.blob,
        src: fullSrc
      },
      thumbnail: {
        file: processedThumbnail.blob,
        src: needsThumbnail ? URL.createObjectURL(processedThumbnail.blob) : fullSrc
      }
    },

    dimensions: {
      width: processedFull.dimensions.width,
      height: processedFull.dimensions.height
    },

    overwriteFilename: false,
    filename,

    overwriteQuality: false,
    quality: quality
  };
}