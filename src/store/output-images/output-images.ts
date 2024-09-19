import { create } from 'zustand'
import { InputImageData, OutputImageData, SelectedItem, Variant } from '../types'
import { filenameToJpg, insertVariantDataToFilename} from '../../lib/helpers'
import { useInputImages } from '../input-images'
import { Log } from '../../lib/log'
import { subscribeWithSelector } from 'zustand/middleware'
import { initialProgress, Progress, startProgress } from '../utils'
import { generateOutputImage, generateOutputImageVariants, getUpToDateVariant } from './utils'
import { openToast, ToastType } from '../toasts'
import { useApp } from '../app'

type OutputImagesState = {
  images: OutputImageData[]
  progress: Progress
  api: {
    generate: (images: InputImageData[]) => void
    generateVariant: (variantId: string) => void
    regenerate: () => void
    regenerateVariant: (variantId: string) => void
    updateVariantData: (variant: Variant) => void
    deleteByInputImageIds: (ids: string[]) => void
    deleteAll: () => void
    selectAll: () => void
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
    async generateVariant(variantId) {
      Log.debug('Generating output images for variant.', { variantId });

      const inputImages = useInputImages.getState().images;
      const progress = startProgress(useOutputImages, inputImages.length);
      
      try {
        for (let i = 0; i < inputImages.length; i++) {

          let currentInputImages = useInputImages.getState().images;
          if (!currentInputImages.some(img => img.id === inputImages[i].id)) {
            progress.advance();
            continue;
          }
          
          const image = await generateOutputImage(inputImages[i], variantId);

          currentInputImages = useInputImages.getState().images;
          if (!currentInputImages.some(img => img.id === inputImages[i].id)) {
            progress.advance();
            continue;
          }
          
          if (image) {
            const outputImages = [...get().images];
            outputImages.push(image);
            set({ images: outputImages });
          }

          progress.advance();
        }
      } catch (error) {
        progress.cancel();

        // probably deleted variant during generation
        if (String(error).includes('not found')) return;

        Log.error('Error generating output images for variant.', error);
        openToast(ToastType.ERROR, 'Error generating output images. Please try again.');
      }
    },
    async regenerateVariant(variantId) {
      Log.debug('Regenerating output images for variant.', { variantId });

      if (get().images.length === 0) {
        Log.debug('No images to regenerate.', { variantId });
        return;
      }

      regenerateVariantOutputImagesIndex += 1;
      const currentIndex = regenerateVariantOutputImagesIndex;
      const inputImages = useInputImages.getState().images;

      const progress = startProgress(useOutputImages, inputImages.length);

      try {
        const outputImages: OutputImageData[] = [];
        const urlsToRevoke: string[] = [];

        let i = 0;
        let outputImage = get().images[i];
        do {  
          if (outputImage.variantId === variantId) {
            const inputImage = inputImages.find(img => img.id === outputImage.inputImage.id);
  
            if (!inputImage) {
              throw new Error(`Variant with id ${variantId} not found.`);
            }
            
            const image = await generateOutputImage(inputImage, variantId, false);
            
            if (image) {
              urlsToRevoke.push(outputImage.image.full.src);
              urlsToRevoke.push(outputImage.image.thumbnail.src);
              outputImages.push(image);
            }

            if (currentIndex !== regenerateVariantOutputImagesIndex) {
              Log.debug('Variant regeneration cancelled.');
              progress.cancel();
              return;
            } 
            
            progress.advance();
          }
          
          i++;
          outputImage = get().images[i]; 
        } while (outputImage !== undefined);


        const variant = getUpToDateVariant(variantId);

        for (let i = 0; i < outputImages.length; i++) {
          if (outputImages[i].variantId === variantId) {
            const image = outputImages[i];
  
            if (!image.overwriteFilename) {
              outputImages[i].filename = insertVariantDataToFilename(
                variant.quality < 1 ? filenameToJpg(image.inputImage.filename) : image.inputImage.filename, 
                variant.prefix, 
                variant.suffix
              );
            }
          }
        }


        const updates = Object.fromEntries(outputImages.map(i => [i.id, i]));
        const result = [...get().images].map(i => updates[i.id] || i);

        urlsToRevoke.forEach(url => {
          URL.revokeObjectURL(url);
        });

        set({ images: result });
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
          if (!image.overwriteQuality) {
            image.quality = variant.quality;
          }
          
          if (!image.overwriteFilename) {
            image.filename = insertVariantDataToFilename(
              image.inputImage.filename,
              variant.prefix,
              variant.suffix
            );
          }
        }
      });

      set({ images });
    },
    deleteByInputImageIds: (ids) => {
      let outputImages = [...get().images];

      ids.forEach(id => {
        outputImages = outputImages.filter(img => img.inputImage.id !== id);
      });

      set({ images: outputImages });
    },
    deleteAll: () => {
      set({ images: [] });
    },
    selectAll: () => {
      const images = get().images;
      const toSelect = images.map(i => ({ type: 'output', id: i.id })) as SelectedItem[];
      useApp.setState({ selectedItems: toSelect });
    }
  }
})));