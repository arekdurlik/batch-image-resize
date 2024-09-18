import { DimensionMode } from '../types'

export type UploadedImage = { file: File, width: number, height: number };

export type InputImageData = { 
  id: string
  index: number
  
  image: {
    full: {
      file: File,
      src: string
    }
    thumbnail: {
      file: Blob,
      src: string
    }
  },
  
  filename: string
  dimensions: {
    width: number,
    height: number
  }
};

export type OutputImageData = {
  id: string,
  inputImage: {
    id: string
    filename: string
    size: number
  },
  variantId: string

  crop: {
    x: number,
    y: number,
    scale: number,
  },

  image: {
    full: {
      file: Blob,
      src: string,
    }
    thumbnail: {
      file: Blob,
      src: string
    }
  },

  overwriteFilename: boolean
  filename: string

  overwriteQuality: boolean
  quality: number

  dimensions: {
    width: number,
    height: number
  }
};

export type ImageData = InputImageData | OutputImageData;

export type Variant = {
  id: string
  index: number
  name: string
  width: {
    mode: DimensionMode
    value?: number
  }
  height: {
    mode: DimensionMode
    value?: number
  }
  prefix: string
  suffix: string
  crop: boolean
  overWriteQuality: boolean
  quality: number
  aspectRatio: {
    enabled: boolean
    value: string
  }
};

export type VariantUpdate = keyof Partial<Omit<Variant, 'id'>>;

export type SelectedItem = {
  type: 'input',
  id: string
} | {
  type: 'output',
  id: string
};