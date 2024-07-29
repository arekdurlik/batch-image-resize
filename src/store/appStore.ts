import { create } from 'zustand'
import { v1 as uuid } from 'uuid'
import { processImage } from '../utils'
import { changeFilename, filenameToJpg, insertVariantDataToFilename, isJpg } from '../helpers'
import { InputImageData, OutputImageData, Variant, VariantUpdate } from './types'

function updateVariant(id: string, field: VariantUpdate, value?: string | number | boolean) {
  const variants = useAppStore.getState().variants;
  const index = variants.findIndex(v => v.id === id);
  variants[index] = { ...variants[index], [field as string]: value };
  
  useAppStore.setState({ variants });
  regenerateVariantOutputImages(id);
}

async function regenerateAllOutputImages() {
  const inputImages = useAppStore.getState().inputImages;
  const outputImages: OutputImageData[] = [];
  
  for (let i = 0; i < inputImages.length; i++) {
    const images = await generateOutputImageVariants(inputImages[i]);
    outputImages.push(...images);
  }
  
  useAppStore.setState({ outputImages });
}

async function regenerateVariantOutputImages(variantId: string) {
  const variant = useAppStore.getState().variants.find(v => v.id = variantId);

  if (!variant) {
    throw new Error(`Variant with id ${variantId} not found.`);
  }

  const inputImages = useAppStore.getState().inputImages;
  const outputImages: OutputImageData[] = useAppStore.getState().outputImages;

  for (let i = 0; i < outputImages.length; i++) {
    if (outputImages[i].variantId === variantId) {
      const inputImage = inputImages.find(img => img.id === outputImages[i].inputImageId);

      if (!inputImage) {
        throw new Error(`Variant with id ${variantId} not found.`);
      }
      
      outputImages[i] = await generateOutputImage(inputImage, variant);
    }
  }
  useAppStore.setState({ outputImages });
}

async function generateOutputImageVariants(inputImage: InputImageData) {
  const variants = useAppStore.getState().variants;
  const outputImages = [];
  
  for (let j = 0; j < variants.length; j++) {
    const variant = variants[j];

    const image = await generateOutputImage(inputImage, variant);

    outputImages.push(image);
  }
  return outputImages;
}

async function generateOutputImage(inputImage: InputImageData, variant: Variant) {
  const quality = useAppStore.getState().quality;
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
  const processedThumbnail = await processImage(processedFile, isJpg(inputImage.filename) ? 0.9 : 1, 150, variant.height, variant.crop);

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

    filename: {
      overwritten: false,
      value: filename
    },

    quality: {
      overwritten: false,
      value: quality
    }
  }
}

type AppStore = {
  inputImages: InputImageData[]
  addingInputImages: boolean
  outputImages: OutputImageData[]
  addingOutputImages: boolean
  variants: Variant[]
  quality: number
  indexAsName: boolean
  prefix: string
  suffix: string
  api: {
    addInputImage: (file: File, width: number, height: number) => void
    addInputImages: (images: { file: File, width: number, height: number }[]) => void

    setImageFiles: (images: InputImageData[]) => void
    setQuality: (quality: number) => void
    setIndexAsName: (indexAsName: boolean) => void
    setPrefix: (prefix: string) => void
    setSuffix: (suffix: string) => void

    addVariant: (variant: Variant) => void
    removeVariant: (variant: Variant) => void
    setVariantWidth: (id: string, width: number | undefined) => void
    setVariantHeight: (id: string, height: number | undefined) => void
    setVariantPrefix: (id: string, prefix: string) => void
    setVariantSuffix: (id: string, suffix: string) => void
    setVariantCrop: (id: string, crop: boolean) => void
  }
};

export const useAppStore = create<AppStore>((set, get) => ({
  inputImages: [],
  addingInputImages: false,
  outputImages: [],
  addingOutputImages: false,
  variants: [{
    id: uuid(),
    width: 400,
    height: undefined,
    prefix: '',
    suffix: '_400w',
    crop: false
  }],

  quality: 100,
  indexAsName: false,
  prefix: '',
  suffix: '',

  api: {
    addInputImage: async (file, width, height) => {
      const inputImages = get().inputImages;
      const indexAsName = get().indexAsName;
      const id = uuid();

      set({ addingInputImages: true });
      
      const newImage = { 
        id, 
        image: {
          full: file,
          thumbnail: await processImage(file, 1, 150, undefined),
        }, 
        filename: indexAsName ? changeFilename(file.name, String(inputImages.length + 1)) : file.name, 
        dimensions: { 
          width, 
          height 
        }
      } as InputImageData;
      
      inputImages.push(newImage);
      
      set({ inputImages, addingInputImages: false });

      generateOutputImageVariants(newImage);
    },
    addInputImages: async (images) => {
      const inputImages = get().inputImages;
      const indexAsName = get().indexAsName;
      
      set({ addingInputImages: true });
      
      try {
        for (let i = 0; i < images.length; i++) {
          const id = uuid();
          const { file, height, width } = images[i];
  
          const newImage = { 
            id, 
            image: {
              full: file,
              thumbnail: await processImage(file, 1, 150, undefined),
            }, 
            filename: indexAsName ? changeFilename(file.name, String(inputImages.length + 1)) : file.name, 
            dimensions: { 
              width, 
              height 
            }
          } as InputImageData;
          
          inputImages.push(newImage);
          set({ inputImages });
        }
  
        for (let i = 0; i < inputImages.length; i++) {
          const outputImages = get().outputImages;
          const images = await generateOutputImageVariants(inputImages[i]);
          outputImages.push(...images);
          set({ outputImages });
        }
      } catch (error) {
        console.error(error);
      } finally {
        set({ addingInputImages: false });
      }
    },
    setImageFiles: (inputImages) => set({ inputImages }),
    setQuality: (quality) => {
      set({ quality })
      regenerateAllOutputImages();
    },
    setIndexAsName: (indexAsName) => set({ indexAsName }),
    setPrefix: (prefix) => set({ prefix }),
    setSuffix: (suffix) => set({ suffix }),

    addVariant: (variant) => {
      const variants = [...get().variants];
      variants.push(variant);
      set({ variants });
    },
    removeVariant: (variant) => {
      const variants = get().variants;
      const index = variants.findIndex(v => v.id === variant.id);
      variants.splice(index, 1);
      set({ variants });
    },
    setVariantWidth: (id, width)    => updateVariant(id, 'width', width),
    setVariantHeight: (id, height)  => updateVariant(id, 'height', height),
    setVariantPrefix: (id, prefix)  => updateVariant(id, 'prefix', prefix),
    setVariantSuffix: (id, suffix)  => updateVariant(id, 'suffix', suffix),
    setVariantCrop: (id, crop)      => updateVariant(id, 'crop', crop)
  }
}));