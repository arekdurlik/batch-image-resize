import { create } from 'zustand'
import { v1 as uuid } from 'uuid'
import { processImage } from '../utils'
import { changeFilename, filenameToJpg, insertVariantDataToFilename, isJpg } from '../helpers'
import { InputImageData, OutputImageData, Variant, VariantUpdate } from './types'

async function regenerateAllOutputImages() {
  const inputImages = useAppStore.getState().inputImages;
  const outputImages: OutputImageData[] = [];
  
  for (let i = 0; i < inputImages.length; i++) {
    const images = await generateOutputImageVariants(inputImages[i]);
    outputImages.push(...images);
  }
  
  return outputImages;
}

// global index to cancel current regeneration before starting new one
let regenerateVariantOutputImagesIndex = 0;
async function regenerateVariantOutputImages(variant: Variant) {
  regenerateVariantOutputImagesIndex += 1;
  const currentIndex = regenerateVariantOutputImagesIndex;
  
  const inputImages = [...useAppStore.getState().inputImages];
  const outputImages: OutputImageData[] = [...useAppStore.getState().outputImages];

  for (let i = 0; i < outputImages.length; i++) {
    if (outputImages[i].variantId === variant.id) {
      const inputImage = inputImages.find(img => img.id === outputImages[i].inputImageId);

      if (!inputImage) {
        throw new Error(`Variant with id ${variant.id} not found.`);
      }
      
      outputImages[i] = await generateOutputImage(inputImage, variant);
    }

    if (currentIndex !== regenerateVariantOutputImagesIndex) {
      return false;
    }
  }
  return outputImages;
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

    overwriteFilename: false,
    filename: filename,

    overwriteQuality: false,
    quality: quality
  }
}

type AppStore = {
  inputImages: InputImageData[]
  addingInputImages: boolean
  totalInputImagesSize: number
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

    setQuality: (quality: number) => void
    setIndexAsName: (indexAsName: boolean) => void
    setPrefix: (prefix: string) => void
    setSuffix: (suffix: string) => void

    addVariant: (variant: Variant) => void
    removeVariant: (variant: Variant) => void
    updateVariant: (id: string, field: VariantUpdate, value?: string | number | boolean) => void
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
  totalInputImagesSize: 0,
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

  quality: 1,
  indexAsName: false,
  prefix: '',
  suffix: '',

  api: {
    addInputImage: async (file, width, height) => {
      const inputImages = [...get().inputImages];
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
      
      set({ 
        inputImages, 
        addingInputImages: false, 
        totalInputImagesSize: get().totalInputImagesSize + file.size 
      });

      generateOutputImageVariants(newImage);
    },
    addInputImages: async (images) => {
      const inputImages = [...get().inputImages];
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

          set({ 
            inputImages, 
            totalInputImagesSize: get().totalInputImagesSize + file.size 
          });
        }
  
        for (let i = 0; i < inputImages.length; i++) {
          const outputImages = [...get().outputImages];
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
    setQuality: async (quality) => {
      set({ quality })

      const outputImages = await regenerateAllOutputImages();

      set({ outputImages });
    },
    setIndexAsName: (indexAsName) => set({ indexAsName }),
    setPrefix: (prefix) => set({ prefix }),
    setSuffix: (suffix) => set({ suffix }),

    addVariant: async (variant) => {
      const variants = [...get().variants];
      const inputImages = get().inputImages;
      
      variants.push(variant);
      set({ variants });
      
      for (let i = 0; i < inputImages.length; i++) {
        const outputImages = get().outputImages;
        const image = await generateOutputImage(inputImages[i], variant);
        outputImages.push(image);
        set({ outputImages });
      }
    },
    removeVariant: (variant) => {
      const variants = get().variants;
      const index = variants.findIndex(v => v.id === variant.id);
      variants.splice(index, 1);
      set({ variants });
    },
    updateVariant: async (id: string, field: VariantUpdate, value?: string | number | boolean) => {
      const variants = get().variants;
      const index = variants.findIndex(v => v.id === id);
      
      if (index === undefined) {
        throw new Error(`Variant with id ${id} not found.`);
      }
      
      variants[index] = { ...variants[index], [field as string]: value };
      
      set({ variants }); 
      
      const outputImages = await regenerateVariantOutputImages(variants[index]);
      
      if (outputImages) {
        set({ outputImages });
      }
    },
    setVariantWidth: (id, width)    => get().api.updateVariant(id, 'width', width),
    setVariantHeight: (id, height)  => get().api.updateVariant(id, 'height', height),
    setVariantPrefix: (id, prefix) => {
      setVariantPrefixAndSuffix(id, prefix, undefined);
    },
    setVariantSuffix: (id, suffix) => {
      setVariantPrefixAndSuffix(id, undefined, suffix);
    },
    setVariantCrop: (id, crop)      => get().api.updateVariant(id, 'crop', crop)
  }
}));

const setVariantPrefixAndSuffix = function(id: string, prefix: string | undefined, suffix: string | undefined) {
  const variants = [...useAppStore.getState().variants];
  
  const variantIndex = variants.findIndex(v => v.id === id);
      
  if (variantIndex === undefined) {
    throw new Error(`Variant with id ${id} not found.`);
  }

  if (prefix !== undefined) {
    variants[variantIndex].prefix = prefix;
  }
  
  if (suffix !== undefined) {
    variants[variantIndex].suffix = suffix;
  }

  useAppStore.setState({ variants });

  const outputImages = [...useAppStore.getState().outputImages];

  outputImages.forEach(image => {
    if (image.variantId === variants[variantIndex].id) {
      image.filename = insertVariantDataToFilename(
        image.inputImageFilename,
        variants[variantIndex].prefix,
        variants[variantIndex].suffix
      );
    }
  });

  useAppStore.setState({ outputImages });
}