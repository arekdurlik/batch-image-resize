import { create } from 'zustand'

export type Data = { file: File, width: number, height: number };

export type Variant = {
  id: string
  width?: number
  height?: number
  prefix: string
  suffix: string
  crop: boolean
};

export type VariantUpdate = keyof Partial<Omit<Variant, 'id'>>;

type AppStore = {
  images: Data[]
  variants: Variant[]
  quality: number | string
  indexAsName: boolean
  prefix: string
  suffix: string
  api: {
    addImage: (image: Data) => void
    setImageFiles: (images: Data[]) => void
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

export const useAppStore = create<AppStore>((set, get) => ({
  images: [],
  variants: [{
    id: `v-${Date.now()}`,
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
    // GLOBAL
    addImage: (image) => {
      const images = get().images;
      images.push(image);

      set({ images })
    },
    setImageFiles: (images) => set({ images }),
    setQuality: (quality) => set({ quality }),
    setIndexAsName: (indexAsName) => set({ indexAsName }),
    setPrefix: (prefix) => set({ prefix }),
    setSuffix: (suffix) => set({ suffix }),

    // VARIANT
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