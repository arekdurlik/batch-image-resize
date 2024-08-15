import { create } from 'zustand'
import { InputImageData, OutputImageData, Variant } from '../types'
import { insertVariantDataToFilename} from '../../lib/helpers'
import { useInputImages } from '../input-images'
import { Log } from '../../lib/log'
import { subscribeWithSelector } from 'zustand/middleware'
import { initialProgress, Progress, startProgress } from '../utils'
import { generateOutputImage, generateOutputImageVariants } from './utils'
import { openToast, ToastType } from '../toasts'

type OutputImagesState = {
  images: OutputImageData[]
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
  progress: initialProgress,
  api: {
    async generate(images) {
      Log.debug('Generating output images.');

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
        progress.cancel();
        Log.error('Error generating output images.', error);
        openToast(ToastType.ERROR, 'Error generating output images. Please try again.');
      }
    },
    async regenerate() {
      Log.debug('Regenerating output images.');

      regenerateIndex++;
      const currentIndex = regenerateIndex;
      const inputImages = useInputImages.getState().images;
      const outputImages: OutputImageData[] = [];

      const progress = startProgress(useOutputImages, inputImages.length);

      try {
        for (let i = 0; i < inputImages.length; i++) {
          const images = await generateOutputImageVariants(inputImages[i], false);
          outputImages.push(...images);
          
          progress.advance();

          if (currentIndex !== regenerateIndex) {
            progress.cancel();
            return;
          } 
        }
        
        set({ images: outputImages });
      } catch (error) {
        progress.cancel();
        Log.error('Error generating output images.', error);
        openToast(ToastType.ERROR, 'Error generating output images. Please try again.');
      }
    },
    async generateVariant(variant) {
      Log.debug('Generating output images for variant.', { variant });

      const inputImages = useInputImages.getState().images;
      const progress = startProgress(useOutputImages, inputImages.length);
      
      try {
        for (let i = 0; i < inputImages.length; i++) {
          const image = await generateOutputImage(inputImages[i], variant);
          
          if (image) {
            const outputImages = [...get().images];
            outputImages.push(image);
            set({ images: outputImages });
          }

          progress.advance();
        }
      } catch (error) {
        progress.cancel();
        Log.error('Error generating output images for variant.', error);
        openToast(ToastType.ERROR, 'Error generating output images. Please try again.');
      }
    },
    async regenerateVariant(variant) {
      Log.debug('Regenerating output images for variant.', { variant });
      
      const outputImages = [...get().images];
      regenerateVariantOutputImagesIndex += 1;
      const currentIndex = regenerateVariantOutputImagesIndex;
      const inputImages = useInputImages.getState().images;

      const progress = startProgress(useOutputImages, outputImages.length);

      try {
        for (let i = 0; i < outputImages.length; i++) {
          if (outputImages[i].variantId === variant.id) {
            const inputImage = inputImages.find(img => img.id === outputImages[i].inputImage.id);
  
            if (!inputImage) {
              throw new Error(`Variant with id ${variant.id} not found.`);
            }
            
            const image = await generateOutputImage(inputImage, variant, false);
            
            if (image) {
              URL.revokeObjectURL(outputImages[i].image.full.src);
              URL.revokeObjectURL(outputImages[i].image.thumbnail.src);
              outputImages[i] = image;
            }
          }

          if (currentIndex !== regenerateVariantOutputImagesIndex) {
            Log.debug('Variant regeneration cancelled.');
            progress.cancel();
            return;
          } 
          
          progress.advance();
        }

        set({ images: outputImages });
      } catch (error) {
        progress.cancel();
        Log.error('Error regenerating output images.', error);
        openToast(ToastType.ERROR, 'Error regenerating output images. Please try again.');
      }
    },
    updateVariantData(variant) {
      Log.debug('Updating variant data.', { variant });
      const images = [...get().images];

      images.forEach(image => {
        if (image.variantId === variant.id) {
          !image.overwriteQuality && (image.quality = variant.quality);
          
          !image.overwriteFilename && (image.filename = insertVariantDataToFilename(
            image.inputImage.filename,
            variant.prefix,
            variant.suffix
          ));
        }
      });

      set({ images });
    }
  }
})));