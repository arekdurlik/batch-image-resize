export type UploadedImage = { file: File, width: number, height: number };

export type InputImageData = { 
  id: string
  index: number
  
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
  width?: number
  height?: number
  prefix: string
  suffix: string
  crop: boolean
  overWriteQuality: boolean
  quality: number
};

export type VariantUpdate = keyof Partial<Omit<Variant, 'id'>>;

export type SelectedItem = {
  type: 'input',
  id: string
} | {
  type: 'output',
  id: string
};