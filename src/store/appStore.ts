import { create } from 'zustand'

export type Data = { file: File, width: number, height: number }

export type Variant = {
  id: string
  width: number | null
  height: number | null
  prefix: string
  suffix: string
}

export type VariantUpdate = Partial<Omit<Variant, 'id'>>

type AppStore = {
  images: Data[]
  variants: Variant[]
  addVariant: (variant: Variant) => void
  setVariantWidth: (id: string, width: number) => void
  setVariantHeight: (id: string, height: number) => void
  setVariantPrefix: (id: string, prefix: string) => void
  setVariantSuffix: (id: string, suffix: string) => void
  removeVariant: (variant: Variant) => void
  index: boolean
  setIndex: (index: boolean) => void
  prefix: string
  setPrefix: (prefix: string) => void
  suffix: string
  setSuffix: (suffix: string) => void
  setImageFiles: (images: Data[]) => void
  addImage: (image: Data) => void
}

function updateVariant(id: string, field: string, value: string | number) {
  const variants = useAppStore.getState().variants;
  const index = variants.findIndex(v => v.id === id);
  variants[index] = { ...variants[index], [field]: value };

  useAppStore.setState({ variants })
}

export const useAppStore = create<AppStore>((set, get) => ({
  images: [],
  setImageFiles: (images) => set({ images }),
  variants: [{
    id: `v-${Date.now()}`,
    width: 480,
    height: null,
    prefix: '',
    suffix: '_480w'
  }],
  addVariant: (variant) => {
    const variants = [...get().variants];
    variants.push(variant);
    set({ variants });
  },
  setVariantWidth: (id, width)    => updateVariant(id, 'width', width),
  setVariantHeight: (id, height)  => updateVariant(id, 'height', height),
  setVariantPrefix: (id, prefix)  => updateVariant(id, 'prefix', prefix),
  setVariantSuffix: (id, suffix)  => updateVariant(id, 'suffix', suffix),
  removeVariant: (variant) => {
    const variants = get().variants;
    const index = variants.findIndex(v => v.id === variant.id);
    variants.splice(index, 1);
    set({ variants });
  },
  index: false,
  setIndex: (index) => set({ index }),
  prefix: '',
  setPrefix: (prefix) => set({ prefix }),
  suffix: '',
  setSuffix: (suffix) => set({ suffix }),

  addImage: (image) => {
    const images = get().images;
    images.push(image);

    set({ images })
  },
}))