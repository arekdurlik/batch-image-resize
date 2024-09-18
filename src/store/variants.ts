import { create } from 'zustand'
import { Variant } from './types'
import { useOutputImages } from './output-images'
import { v1 as uuid } from 'uuid'
import { DimensionMode } from '../types'
import { Log } from '../lib/log'
import { getVariantsWithIdCheck } from './utils'
import { regenerateVariant } from './utils/regenerate'

type Variants = {
  variants: Variant[]
  api: {
    add: (variant: Variant) => void
    delete: (variantId: string) => void
    rename: (variantId: string, name: string) => void
    setFilenamePart: (part: 'prefix' | 'suffix', variantId: string, value: string) => void
    setDimension: (dimension: 'width' | 'height', variantId: string, value: number | undefined) => void
    setDimensions: (variantId: string, width: number | undefined, height: number | undefined) => void
    setWidthMode: (variantId: string, mode: DimensionMode) => void
    setHeightMode: (variantId: string, mode: DimensionMode) => void
    setCrop: (variantId: string, value: boolean) => void
    toggleAspectRatioEnabled: (variantId: string) => void
    setAspectRatioEnabled: (variantId: string, value: boolean) => void
    setAspectRatioValue: (variantId: string, value: string) => void
    flipAspectRatio: (variantId: string) => void
  }
};

export const useVariants = create<Variants>((set, get) => ({
  variants: [{
    id: uuid(),
    index: 0,
    name: '400w',
    width: {
      mode: 'exact',
      value: 400
    },
    height: {
      mode: 'exact',
      value: undefined
    },
    prefix: '',
    suffix: '_400w',
    overWriteQuality: false,
    quality: 1,
    crop: false,
    aspectRatio: {
      enabled: false,
      value: '1:1'
    }
  }],
  api: {
    async add(variant) {
      const variants = [...get().variants];
      
      variants.push(variant);
      set({ variants });
      
      useOutputImages.getState().api.generateVariant(variant.id);
    },
    delete(variantId) {
      const { variants, index } = getVariantsWithIdCheck(variantId);
      
      const outputImages = useOutputImages.getState().images;
      const filtered = outputImages.filter(i => i.variantId !== variantId);
      useOutputImages.setState({ images: filtered });

      variants.splice(index, 1);

      set({ variants });
    },
    setCrop(variantId, value) {
      const { variants, variant } = getVariantsWithIdCheck(variantId);

      variant.crop = value;
      set({ variants });
      useOutputImages.getState().api.regenerateVariant(variant.id);
    },
    rename(variantId, name) {
      const { variants, variant } = getVariantsWithIdCheck(variantId);

      variant.name = name;
      set({ variants });
    },
    setFilenamePart(part, variantId, value) {
      const { variants, variant } = getVariantsWithIdCheck(variantId);

      variant[part] = value;
      set({ variants });
      useOutputImages.getState().api.updateVariantData(variant);
    },
    setDimension(dimension, variantId, value) {
      const { variants, variant } = getVariantsWithIdCheck(variantId);

      if (variant[dimension].value === value) return;

      variant[dimension].value = value;

        if (variant.aspectRatio.enabled && variant.width.mode === 'exact') {
          if (value !== undefined) {
            const splitAspectRatio = variant.aspectRatio.value.split(':');
            const ratio = Number(splitAspectRatio[0]) / Number(splitAspectRatio[1]);
    
            if (dimension === 'height') {
              const ratioedWidth = Math.floor(value * ratio);
              variant.width.value = ratioedWidth;
            } else {
              const ratioedHeight = Math.floor(value / ratio);
              variant.height.value = ratioedHeight;
            }
          } else {
            variant.width.value = value;
            variant.height.value = value;
          }
        }

      set({ variants });

      regenerateVariant(variant.id);
    },
    setDimensions(variantId, width, height) {
      const { variants, variant } = getVariantsWithIdCheck(variantId);
  
      variant.width.value = width;
      variant.height.value = height;

      set({ variants });
    },
    setWidthMode(variantId, mode) {
      const { variants, variant } = getVariantsWithIdCheck(variantId);

      variant.width.mode = mode;

      if (variant.aspectRatio.enabled) {
        variant.height.mode = mode;
      }

      if (variant.width.value && variant.width.mode === 'exact') {
        const splitAspectRatio = variant.aspectRatio.value.split(':');
        const ratio = Number(splitAspectRatio[0]) / Number(splitAspectRatio[1]);
  
        const ratioedHeight = Math.floor(variant.width.value / ratio);
        variant.height.value = ratioedHeight;
      }

      if (variant.width.value) {
        regenerateVariant(variant.id);
      }

      set({ variants });
    },
    setHeightMode(variantId, mode) {
      const { variants, variant } = getVariantsWithIdCheck(variantId);

      variant.height.mode = mode;

      if (variant.aspectRatio.enabled) {
        variant.width.mode = mode;
      }

      if (variant.width.value && variant.width.mode === 'exact') {
        const splitAspectRatio = variant.aspectRatio.value.split(':');
        const ratio = Number(splitAspectRatio[0]) / Number(splitAspectRatio[1]);
  
        const ratioedHeight = Math.floor(variant.width.value / ratio);
        variant.height.value = ratioedHeight;
      }

      if (variant.height.value) {
        regenerateVariant(variant.id);
      }

      set({ variants });
    },
    toggleAspectRatioEnabled(variantId) {
      const { variants, variant } = getVariantsWithIdCheck(variantId);

      variant.aspectRatio.enabled = !variant.aspectRatio.enabled;

      handleAspectRatioChange(variants, variant);


      if (variant.width.mode === 'exact' && variant.height.mode === 'exact' && variant.width.value && variant.height.value) {
        return;
      }

      regenerateVariant(variant.id);
    },
    setAspectRatioEnabled(variantId, value) {
      const { variants, variant } = getVariantsWithIdCheck(variantId);
  
      variant.aspectRatio.enabled = value;

      if (value) {
        handleAspectRatioChange(variants, variant);
      } else {
        set({ variants });
      }
    },
    setAspectRatioValue(variantId, value) {
      const { variants, variant } = getVariantsWithIdCheck(variantId);
  
      if (variant.aspectRatio.value === value) return;

      variant.aspectRatio.value = value;

      if (value) {
        handleAspectRatioChange(variants, variant);
        
        if (variant.aspectRatio.enabled) {
          regenerateVariant(variant.id);
        }

      } else {
        set({ variants });
      }
    },
    flipAspectRatio(variantId) {
      const { variants, variant } = getVariantsWithIdCheck(variantId);
      
      const split = variant.aspectRatio.value.split(':');
      
      if (split.length !== 2) {
        Log.error('Error flipping aspect ratio.');
        return;
      }
      
      const flipped = split[1] + ':' + split[0];
      variant.aspectRatio.value = flipped;
      
      if (variant.aspectRatio.enabled) {
        const oldWidth = variant.width.value;
        variant.width.value = variant.height.value;
        variant.height.value = oldWidth;

        if (Number(split[0]) !== Number(split[1])) {
          regenerateVariant(variant.id);
        }
      }
      
      set({ variants });
    }
  },
}));

function handleAspectRatioChange(newVariants: Variant[], variant: Variant) {
  if (variant.aspectRatio.enabled) {
    const oldWidth = variant.width.value;
    const oldHeight = variant.height.value;

    if (!variant.width.value && variant.height.value) {
      variant.width.mode = variant.height.mode;
    } else {
      variant.height.mode = variant.width.mode;
    }

    if (variant.width.value && variant.width.mode === 'exact') {
      const splitAspectRatio = variant.aspectRatio.value.split(':');
      const ratio = Number(splitAspectRatio[0]) / Number(splitAspectRatio[1]);

      const ratioedHeight = Math.floor(variant.width.value / ratio);
      variant.height.value = ratioedHeight;
    }

    if ((oldWidth !== variant.width.value || oldHeight !== variant.height.value)) {
      regenerateVariant(variant.id);
    }
  }

  useVariants.setState({ variants: newVariants });
}