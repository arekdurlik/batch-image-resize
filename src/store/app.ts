import { create } from 'zustand'
import { useOutputImages } from './outputImages'

export type ActiveItem = {
  type: 'input',
  id: string
} | {
  type: 'output',
  id: string
} | undefined

type App = {
  activeItem: ActiveItem,
  quality: number
  indexAsName: boolean
  prefix: string
  suffix: string
  api: {
    setActiveItem: (item: ActiveItem) => void
    setQuality: (quality: number) => void
    setIndexAsName: (indexAsName: boolean) => void
    setPrefix: (prefix: string) => void
    setSuffix: (suffix: string) => void
  }
};

export const useApp = create<App>((set, get) => ({
  activeItem: undefined,
  quality: 1,
  indexAsName: false,
  prefix: '',
  suffix: '',
  
  api: {
    setActiveItem: (item) => set({ activeItem: item }),
    async setQuality(quality) {
      set({ quality })

      useOutputImages.getState().api.regenerate();
    },
    setIndexAsName: (indexAsName) => set({ indexAsName }),
    setPrefix: (prefix) => set({ prefix }),
    setSuffix: (suffix) => set({ suffix }),
  }
}));