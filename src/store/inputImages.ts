import { create } from 'zustand'
import { InputImageData } from './types'
import { v1 as uuid } from 'uuid'
import { processImage } from '../lib/utils'
import { THUMBNAIL_SIZE } from '../lib/constants'
import { changeFilename } from '../lib/helpers'
import { useApp } from './app'
import { useOutputImages } from './outputImages'

async function generateInputImage(image: Image): Promise<InputImageData> {
  let inputImage: InputImageData | null = null;

  try {
      const id = uuid();
      const { file, height, width } = image;

      inputImage = { 
        id, 
        index: 0,
        image: {
          full: file,
          thumbnail: await processImage(file, 1, THUMBNAIL_SIZE, undefined),
        }, 
        filename: file.name, 
        dimensions: { 
          width, 
          height 
        }
      } as InputImageData;
      
  } catch (error) {
    throw new Error('Error generating input image.');
  }
  
  return inputImage;
}

async function generateInputImages(images: Image[]): Promise<{ images: InputImageData[], totalSize: number }> {
  const inputImages = [];
  let totalSize = 0;

  try {
    for (let i = 0; i < images.length; i++) {
      const id = uuid();
      const { file, height, width } = images[i];

      const newImage = { 
        id, 
        image: {
          full: file,
          thumbnail: await processImage(file, 1, THUMBNAIL_SIZE, undefined),
        }, 
        filename: useApp.getState().indexAsName ? changeFilename(file.name, String(images.length + 1)) : file.name, 
        dimensions: { 
          width, 
          height 
        }
      } as InputImageData;
      
      inputImages.push(newImage);
      totalSize += file.size;
    }
   
  } catch (error) {
    throw new Error('Error generating input image.');
  }
  
  return { 
    images: inputImages, 
    totalSize
  };
}

type Image = { file: File, width: number, height: number };

type InputImagesState = {
  images: InputImageData[]
  totalSize: number
  addingImages: boolean
  api: {
    add: (images: Image[]) => void
  }
};

export const useInputImages = create<InputImagesState>((set, get) => ({
  images: [],
  totalSize: 0,
  addingImages: false,
  api: {
    async add(images) {
      set({ addingImages: true });
      
      try {
        const newImages = [];

        for (let i = 0; i < images.length; i++) {
          const inputImages = [...get().images];
          const inputImage = await generateInputImage(images[i]);

          inputImage.index = inputImages.length;
          inputImages.push(inputImage);
          newImages.push(inputImage);

          set({ images: inputImages });
        }

        useOutputImages.getState().api.generate(newImages);

      } catch(error) {
        console.error(error);
      } finally {
        set ({ addingImages: false });
      }

    }
  }
}));