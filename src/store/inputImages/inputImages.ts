import { create } from 'zustand'
import { InputImageData, UploadedImage } from '../types'
import { useOutputImages } from '../outputImages'
import { useVariants } from '../variants'
import { Log } from '../../lib/log'
import { initialProgress, Progress, startProgress } from '../utils'
import { generateInputImage } from './utils'
import { openToast, ToastType } from '../toasts'

type InputImagesState = {
  images: InputImageData[]
  totalSize: number
  progress: Progress
  api: {
    add: (images: UploadedImage[]) => void
  }
};

export const useInputImages = create<InputImagesState>((set, get) => ({
  images: [],
  totalSize: 0,
  progress: initialProgress,
  api: {
    async add(images) {
      Log.debug('Adding input images', { images }, images.length);
      
      const newImages = [];
      const progress = startProgress(useInputImages, images.length);

      for (let i = 0; i < images.length; i++) {
        try {
          const inputImage = await generateInputImage(images[i]);

          if (!inputImage) {
            throw new Error();
          }
          
          const inputImages = [...get().images];
          inputImage.index = inputImages.length;
          inputImages.push(inputImage);
          newImages.push(inputImage);

          set({ images: inputImages });

          progress.advance();
        } catch(error) {
          progress.cancel();
          Log.error(`Error processing input image: "${images[i].file.name}".`, error);
          openToast(
            ToastType.ERROR, 
            `Error processing input image: "${images[i].file.name}". Please try again.`
          );
        } finally {
          Log.assert(
            images.length === get().images.length, 
            'Amount of generated input images does not equal the amount of uploaded images', 
            { input: images, generated: get().images }
          );
        }
      }

      const variants = useVariants.getState().variants;

      variants.forEach(v => {
        useOutputImages.getState().api.generateVariant(v);
      });
    }
  }
}));