import { create } from 'zustand'

type AppStore = {
  images: []
}
export const useAppStore = create<AppStore>((set) => ({
  images: [],
}))