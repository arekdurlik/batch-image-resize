import { create } from 'zustand'
import { InputImageData, UploadedImage } from '../types'
import { useOutputImages } from '../outputImages'
import { useVariants } from '../variants'
import { Log } from '../../lib/log'
import { initialProgress, Progress, startProgress } from '../utils'
import { generateInputImage } from './utils'

type InputImagesState = {
  images: InputImageData[]
  totalSize: number
  addingImages: boolean
  progress: Progress
  api: {
    add: (images: UploadedImage[]) => void
  }
};

export const useInputImages = create<InputImagesState>((set, get) => ({
  images: [],
  totalSize: 0,
  addingImages: false,
  progress: initialProgress,
  api: {
    async add(images) {
      Log.debug('Adding input images', { images }, images.length);
      
      const progress = startProgress(useInputImages, images.length);
      
      try {
        const newImages = [];

        for (let i = 0; i < images.length; i++) {
          const inputImage = await generateInputImage(images[i]);
          if (!inputImage) return;
          
          const inputImages = [...get().images];
          inputImage.index = inputImages.length;
          inputImages.push(inputImage);
          newImages.push(inputImage);

          set({ images: inputImages });

          progress.advance();
        }
        const variants = useVariants.getState().variants;

        variants.forEach(v => {
          useOutputImages.getState().api.generateVariant(v);
        })

      } catch(error) {
        console.error(error);
      } finally {
        set ({ addingImages: false });

        Log.assert(
          images.length === get().images.length, 
          'Amount of generated input images does not equal the amount of uploaded images', 
          { input: images, generated: get().images }
        );
      }

    }
  }
}));