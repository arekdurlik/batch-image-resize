import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { DEFAULT_CROP_SETTINGS } from '../../../lib/config'

type CropState = {
  x: number
  y: number
  zoom: number
  minZoom: number
  api: {
    set: ({ x, y, zoom }: { x?: number, y?: number, zoom?: number }) => void
    setPos: (x: number, y: number) => void
    setX: (x: number) => void
    setY: (y: number) => void
    setZoom: (zoom: number) => void
    setMinZoom: (minZoom: number) => void
  }
};

export const useCropState = create<CropState>()(subscribeWithSelector((set, get) => ({
  x: DEFAULT_CROP_SETTINGS.x,
  y: DEFAULT_CROP_SETTINGS.y,
  zoom: DEFAULT_CROP_SETTINGS.zoom,
  minZoom: DEFAULT_CROP_SETTINGS.zoom,
  api: {
    set: data => {
      const merged = {...get(), ...data };
      set(merged);
    },
    setPos: (x, y) => set({ x, y }),
    setX: x => {
      set({ x });
    },
    setY: y => set({ y }),
    setZoom: zoom => set({ zoom }),
    setMinZoom: minZoom => set({ minZoom })
  }
})));