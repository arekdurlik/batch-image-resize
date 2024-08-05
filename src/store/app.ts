import { create } from 'zustand'
import { useOutputImages } from './outputImages'

type App = {
  quality: number
  indexAsName: boolean
  prefix: string
  suffix: string
  api: {

    setQuality: (quality: number) => void
    setIndexAsName: (indexAsName: boolean) => void
    setPrefix: (prefix: string) => void
    setSuffix: (suffix: string) => void
  }
};

export const useApp = create<App>((set, get) => ({
  quality: 1,
  indexAsName: false,
  prefix: '',
  suffix: '',

  api: {
    setQuality: async (quality) => {
      set({ quality })

      useOutputImages.getState().api.regenerate();
    },
    setIndexAsName: (indexAsName) => set({ indexAsName }),
    setPrefix: (prefix) => set({ prefix }),
    setSuffix: (suffix) => set({ suffix }),
  }
}));