import { create } from 'zustand'
import { InputImageData, SelectedItem, UploadedImage } from '../types'
import { useOutputImages } from '../output-images'
import { useVariants } from '../variants'
import { Log } from '../../lib/log'
import { initialProgress, Progress, startProgress } from '../utils'
import { generateInputImage } from './utils'
import { openToast, ToastType } from '../toasts'
import { useApp } from '../app'

type InputImagesState = {
  images: InputImageData[]
  totalSize: number
  progress: Progress
  api: {
    add: (images: UploadedImage[]) => void
    deleteByIds: (ids: string[]) => void
    deleteAll: () => void
    selectAll: () => void
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

          set({ images: inputImages, totalSize: get().totalSize + inputImage.image.full.file.size });

          progress.advance();
        } catch(error) {
          progress.cancel();

          if (String(error).includes('fingerprint')) {
            openToast(
              ToastType.ERROR, 
              "Error processing input image. Make sure fingerprinting protection isn't enabled in the browser settings."
            );
            return;
          }

          Log.error(`Error processing input image: "${images[i].file.name}".`, error);
          openToast(
            ToastType.ERROR, 
            `Error processing input image: "${images[i].file.name}". Please try again.`
          );
          return;
        }
      }

      Log.assert(
        images.length === get().images.length, 
        'Amount of generated input images does not equal the amount of uploaded images', 
        { input: images, generated: get().images }
      );

      const variants = useVariants.getState().variants;

      variants.forEach(v => {
        useOutputImages.getState().api.generateVariant(v.id);
      });
    },
    deleteByIds: (ids) => {
      const inputImages = [...get().images];
      let totalSize = get().totalSize;

      ids.forEach(id => {
        const index = inputImages.findIndex(img => img.id === id);

        if (index > -1) {
          totalSize = totalSize - inputImages[index].image.full.file.size;
          inputImages.splice(index, 1);
        } else {
          throw new Error();
        }

      });

      useOutputImages.getState().api.deleteByInputImageIds(ids);

      set({ images: inputImages, totalSize });
    },
    deleteAll: () => {
      set({ images: [] });
      useOutputImages.setState({ images: [] });
    },
    selectAll: () => {
      const images = get().images;
      const toSelect = images.map(i => ({ type: 'input', id: i.id })) as SelectedItem[];
      useApp.setState({ selectedItems: toSelect });
    }
  }
}));