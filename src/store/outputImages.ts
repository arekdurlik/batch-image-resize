import { create } from 'zustand'
import { InputImageData, OutputImageData, Variant } from './types'
import { v1 as uuid } from 'uuid'
import { useApp } from './app'
import { filenameToJpg, insertVariantDataToFilename, isJpg } from '../lib/helpers'
import { processImage } from '../lib/utils'
import { THUMBNAIL_SIZE } from '../lib/constants'
import { useVariants } from './variants'
import { useInputImages } from './inputImages'

async function generateOutputImageVariants(inputImage: InputImageData) {
  const variants = useVariants.getState().variants;
  const outputImages = [];
  
  for (let j = 0; j < variants.length; j++) {
    const variant = variants[j];

    const image = await generateOutputImage(inputImage, variant);

    outputImages.push(image);
  }
  return outputImages;
}

async function generateOutputImage(inputImage: InputImageData, variant: Variant) {
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

  const processedFull = await processImage(inputImage.image.full, quality, variant.width, variant.height, variant.crop);
  const processedFile = new File([processedFull], inputImage.filename);
  const processedThumbnail = await processImage(processedFile, isJpg(inputImage.filename) ? 0.9 : 1, THUMBNAIL_SIZE, variant.height, variant.crop);

  return {
    id: uuid(),
    inputImageFilename: inputImage.filename,
    inputImageId: inputImage.id,
    variantId: variant.id,

    image: {
      full: processedFull,
      thumbnail: processedThumbnail
    },

    dimensions: {
      width: newWidth,
      height: newHeight
    },

    overwriteFilename: false,
    filename: filename,

    overwriteQuality: false,
    quality: quality
  }
}

// global index to cancel current regeneration before starting new one
let regenerateVariantOutputImagesIndex = 0;
async function regenerateVariantOutputImages(outputImages: OutputImageData[], variant: Variant) {
  regenerateVariantOutputImagesIndex += 1;
  const currentIndex = regenerateVariantOutputImagesIndex;
  
  const inputImages = useInputImages.getState().images;

  for (let i = 0; i < outputImages.length; i++) {
    if (outputImages[i].variantId === variant.id) {
      const inputImage = inputImages.find(img => img.id === outputImages[i].inputImageId);

      if (!inputImage) {
        throw new Error(`Variant with id ${variant.id} not found.`);
      }
      
      const oldId = outputImages[i].id;
      outputImages[i] = await generateOutputImage(inputImage, variant);
      outputImages[i].id = oldId;
    }

    if (currentIndex !== regenerateVariantOutputImagesIndex) {
      return false;
    }
  }
  return outputImages;
}

type OutputImagesState = {
  images: OutputImageData[]
  generatingImages: boolean
  api: {
    generate: (images: InputImageData[]) => void
    generateVariant: (variant: Variant) => void
    regenerate: () => void
    regenerateVariant: (variant: Variant) => void
    updateVariantData: (variant: Variant) => void
  }
};

let regenerateIndex = 0;

export const useOutputImages = create<OutputImagesState>((set, get) => ({
  images: [],
  generatingImages: false,
  api: {
    async generate(images) {
      set({ generatingImages: true });

      try {
        for (let i = 0; i < images.length; i++) {
          const outputImages = [...get().images];
          const newImages = await generateOutputImageVariants(images[i]);

          outputImages.push(...newImages);

          set({ images: outputImages });
        }
      } catch(error) {
        console.error(error);
      } finally {
        set ({ generatingImages: false });
      }

    },
    async regenerate() {
      regenerateIndex++;
      const currentIndex = regenerateIndex;

      const inputImages = useInputImages.getState().images;
      const outputImages: OutputImageData[] = [];

      set({ generatingImages: true });
      for (let i = 0; i < inputImages.length; i++) {
        const images = await generateOutputImageVariants(inputImages[i]);
        outputImages.push(...images);

        if (currentIndex !== regenerateIndex) return; 
      }

      set({ images: outputImages, generatingImages: false });
    },
    async generateVariant(variant) {
      const inputImages = useInputImages.getState().images;

      for (let i = 0; i < inputImages.length; i++) {
        const outputImages = [...get().images];
        const image = await generateOutputImage(inputImages[i], variant);
        outputImages.push(image);
        set({ images: outputImages });
      }
    },
    async regenerateVariant(variant) {
      set({ generatingImages: true });
      
      const images = await regenerateVariantOutputImages([...get().images], variant);

      images && set({ images, generatingImages: false });
    },
    updateVariantData(variant) {
      const images = [...get().images];

      images.forEach(image => {
        if (image.variantId === variant.id) {
          !image.overwriteQuality && (image.quality = variant.quality);
          
          !image.overwriteFilename && (image.filename = insertVariantDataToFilename(
            image.inputImageFilename,
            variant.prefix,
            variant.suffix
          ));
        }
      });

      set({ images });
    }
  }
}));