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
    overwritten: boolean,
    value: string
  }
  quality: {
    overwritten: boolean,
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

export type VariantUpdate = keyof Partial<Omit<Variant, 'id'>>;