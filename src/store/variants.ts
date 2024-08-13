import { create } from 'zustand'
import { Variant } from './types'
import { useOutputImages } from './outputImages'
import { v1 as uuid } from 'uuid'

type Variants = {
  variants: Variant[]
  api: {
    add: (variant: Variant) => void
    delete: (variantId: string) => void
    setFilenamePart: (part: 'prefix' | 'suffix', variantId: string, value: string) => void
    setDimension: (dimension: 'width' | 'height', variantId: string, value: number | undefined) => void
    setCrop: (variantId: string, value: boolean) => void
  }
};

export const useVariants = create<Variants>((set, get) => ({
  variants: [{
    id: uuid(),
    index: 0,
    width: 400,
    height: undefined,
    prefix: '',
    suffix: '_400w',
    overWriteQuality: false,
    quality: 1,
    crop: false
  }],
  api: {
    async add(variant) {
      const variants = [...get().variants];
      
      variants.push(variant);
      set({ variants });
      
      useOutputImages.getState().api.generateVariant(variant);
    },
    delete(variantId) {
      const variants = get().variants;
      const index = variants.findIndex(v => v.id === variantId);
      
      if (index === undefined) {
        throw new Error(`Variant with id ${variantId} not found.`);
      }
      variants.splice(index, 1);
      set({ variants });
    },
    setCrop(variantId, value) {
      const variants = [...get().variants];
      const index = variants.findIndex(v => v.id === variantId);
      
      if (index === undefined) {
        throw new Error(`Variant with id ${variantId} not found.`);
      }

      variants[index].crop = value;

      set({ variants });

      useOutputImages.getState().api.regenerateVariant(variants[index]);
    },
    setFilenamePart(part, variantId, value) {
      const variants = [...get().variants];
      const index = variants.findIndex(v => v.id === variantId);
      
      if (index === undefined) {
        throw new Error(`Variant with id ${variantId} not found.`);
      }

      variants[index][part] = value;

      set({ variants });

      useOutputImages.getState().api.updateVariantData(variants[index]);
    },
    setDimension(dimension, variantId, value) {
      const variants = [...get().variants];
      const index = variants.findIndex(v => v.id === variantId);
  
      if (index === undefined) {
        throw new Error(`Variant with id "${variantId}" not found.`);
      }
  
      variants[index][dimension] = value;
      
      if (dimension === 'height') {
        variants[index].width = undefined;
      } else {
        variants[index].height = undefined;
      }
      
      set({ variants });
  
      useOutputImages.getState().api.regenerateVariant(variants[index]);
    },
  },
}));