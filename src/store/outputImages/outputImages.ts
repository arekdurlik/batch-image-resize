import { create } from 'zustand'
import { InputImageData, OutputImageData, Variant } from '../types'
import { insertVariantDataToFilename} from '../../lib/helpers'
import { useInputImages } from '../inputImages'
import { Log } from '../../lib/log'
import { subscribeWithSelector } from 'zustand/middleware'
import { initialProgress, Progress, startProgress } from '../utils'
import { generateOutputImage, generateOutputImageVariants } from './utils'

type OutputImagesState = {
  images: OutputImageData[]
  generatingImages: boolean
  progress: Progress
  api: {
    generate: (images: InputImageData[]) => void
    generateVariant: (variant: Variant) => void
    regenerate: () => void
    regenerateVariant: (variant: Variant) => void
    updateVariantData: (variant: Variant) => void
  }
};

// global indexes to cancel current regeneration before starting new one
let regenerateVariantOutputImagesIndex = 0;
let regenerateIndex = 0;

export const useOutputImages = create<OutputImagesState>()(subscribeWithSelector((set, get) => ({
  images: [],
  generatingImages: false,
  progress: initialProgress,
  api: {
    async generate(images) {
      Log.debug('Generating output images');

      set({ generatingImages: true });
      const progress = startProgress(useOutputImages, images.length);
      
      try {
        for (let i = 0; i < images.length; i++) {
          const newImages = await generateOutputImageVariants(images[i]);
          
          const outputImages = [...get().images];
          outputImages.push(...newImages);
          set({ images: outputImages });

          progress.advance();
        }
      } catch(error) {
        Log.error('Error generating output images', error);
      } finally {
        set ({ generatingImages: false });
      }

    },
    async regenerate() {
      Log.debug('Regenerating output images');

      regenerateIndex++;
      const currentIndex = regenerateIndex;

      const inputImages = useInputImages.getState().images;
      const outputImages: OutputImageData[] = [];

      set({ generatingImages: true });
      const progress = startProgress(useOutputImages, inputImages.length);

      try {

        for (let i = 0; i < inputImages.length; i++) {
          const images = await generateOutputImageVariants(inputImages[i], false);
          outputImages.push(...images);
          
          progress.advance();

          if (currentIndex !== regenerateIndex) {
            set({ generatingImages: false });
            progress.cancel();
            return;
          } 
        }
        
        set({ images: outputImages, generatingImages: false });
      } catch (error) {
        Log.error('Error generating output images', error);
      }
    },
    async generateVariant(variant) {
      Log.debug('Generating output images for variant', { variant });

      const inputImages = useInputImages.getState().images;
      const progress = startProgress(useOutputImages, inputImages.length);
      
      for (let i = 0; i < inputImages.length; i++) {
        const image = await generateOutputImage(inputImages[i], variant);
        
        if (image) {
          const outputImages = [...get().images];
          outputImages.push(image);
          set({ images: outputImages });
        }

        progress.advance();
      }
    },
    async regenerateVariant(variant) {
      Log.debug('Regenerating output images for variant', { variant });

      
      const outputImages = [...get().images];
      regenerateVariantOutputImagesIndex += 1;
      const currentIndex = regenerateVariantOutputImagesIndex;
      
      const inputImages = useInputImages.getState().images;
      
      set({ generatingImages: true });
      const progress = startProgress(useOutputImages, outputImages.length);

      try {
        for (let i = 0; i < outputImages.length; i++) {

          if (outputImages[i].variantId === variant.id) {
            const inputImage = inputImages.find(img => img.id === outputImages[i].inputImageId);
  
            if (!inputImage) {
              throw new Error(`Variant with id ${variant.id} not found.`);
            }
            
            const image = await generateOutputImage(inputImage, variant, false);
            
            if (image) {
              outputImages[i] = image;
            }
          }

          progress.advance();
  
          if (currentIndex !== regenerateVariantOutputImagesIndex) {
            set({ generatingImages: false });
            progress.cancel();
            return;
          } 
        }

      } catch (error) {
        Log.error('Error regenerating output images', error);
      }
      
      set({ images: outputImages, generatingImages: false });
    },
    updateVariantData(variant) {
      Log.debug('Updating variant data', { variant });
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
})));