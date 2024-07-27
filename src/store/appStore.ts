import { create } from 'zustand'
import { v1 as uuid } from 'uuid'
import { processImage } from '../utils'
import { changeFilename, filenameToJpg, insertVariantDataToFilename } from '../helpers'

export type InputImageData = { 
  id: string
  
  image: {
    full: File
    thumbnail: Blob
  },
  
  filename: string
  dimensions: {
    width: number,
    height: number
  }
};

export type OutputImageData = {
  id: string,
  inputImageFilename: string
  inputImageId: string
  variantId: string

  image: {
    full: Blob
    thumbnail: Blob
  },

  filename: {
    overwritten: false,
    value: string
  }
  quality: {
    overwritten: false,
    value: number
  }
  dimensions: {
    width: number,
    height: number
  }
};

export type Variant = {
  id: string
  width?: number
  height?: number
  prefix: string
  suffix: string
  crop: boolean
};

const initialVariant = {
  id: uuid(),
  width: 400,
  height: undefined,
  prefix: '',
  suffix: '_400w',
  crop: false
};

export type VariantUpdate = keyof Partial<Omit<Variant, 'id'>>;

type AppStore = {
  inputImages: InputImageData[]
  outputImages: OutputImageData[]
  variants: Variant[]
  quality: number | string
  indexAsName: boolean
  prefix: string
  suffix: string
  api: {
    addInputImage: (file: File, width: number, height: number) => void

    setImageFiles: (images: InputImageData[]) => void
    setQuality: (quality: number | string) => void
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

function updateVariant(id: string, field: VariantUpdate, value?: string | number | boolean) {
  const variants = useAppStore.getState().variants;
  const index = variants.findIndex(v => v.id === id);
  variants[index] = { ...variants[index], [field as string]: value };

  useAppStore.setState({ variants });
}

async function generateOutputImages(inputImage: InputImageData) {
  const variants = useAppStore.getState().variants;
  let quality = useAppStore.getState().quality;
  const outputImages = useAppStore.getState().outputImages;

  quality = quality === '' ? 1 : Number(quality) / 100;
  const ratio = inputImage.dimensions.width / inputImage.dimensions.height;
  
  for (let i = 0; i < variants.length; i++) {
    const variant = variants[i];

    let newWidth = inputImage.dimensions.width;
    let newHeight = inputImage.dimensions.height;
    
    if (variant.width) {
      newWidth = variant.width;
      newHeight = Math.ceil(newWidth / ratio);
    } else if (variant?.height) {
      newHeight = variant.height;
      newWidth = Math.ceil(newHeight * ratio);
    }

    const filename = insertVariantDataToFilename(
      inputImage.filename, 
      variant.prefix, 
      variant.suffix
    );

    outputImages.push({
      id: uuid(),
      inputImageFilename: inputImage.filename,
      inputImageId: inputImage.id,
      variantId: variant.id,

      image: {
        full: await processImage(inputImage.image.full, quality, variant.width, variant.height, variant.crop),
        thumbnail: inputImage.image.thumbnail
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
    });
  }
  
  return outputImages;
  
}

export const useAppStore = create<AppStore>((set, get) => ({
  inputImages: [],
  outputImages: [],
  variants: [initialVariant],

  quality: 100,
  indexAsName: false,
  prefix: '',
  suffix: '',

  api: {
    addInputImage: async (file, width, height) => {
      const inputImages = get().inputImages;
      const indexAsName = get().indexAsName;
      const id = uuid();

      const newImage = { 
        id, 
        image: {
          full: file,
          thumbnail: await processImage(file, 1, 200, undefined),
        }, 
        filename: indexAsName ? changeFilename(file.name, String(inputImages.length + 1)) : file.name, 
        dimensions: { 
          width, 
          height 
        }
      } as InputImageData;
      
      inputImages.push(newImage);
      set({ inputImages });

      const outputImages = await generateOutputImages(newImage);

      useAppStore.setState(({ outputImages }));
    },
    setImageFiles: (inputImages) => set({ inputImages }),
    setQuality: (quality) => set({ quality }),
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