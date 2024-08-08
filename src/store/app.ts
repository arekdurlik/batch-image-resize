import { create } from 'zustand'
import { useOutputImages } from './outputImages'

export type SelectedItem = {
  type: 'input',
  id: string
} | {
  type: 'output',
  id: string
}

type App = {
  selectedItems: SelectedItem[],
  latestSelectedItem: SelectedItem | undefined,
  quality: number
  indexAsName: boolean
  prefix: string
  suffix: string
  api: {
    selectItem: (item: SelectedItem) => void
    deselectItem: (item: SelectedItem) => void
    setSelectedItems: (items: SelectedItem[]) => void
    clearSelectedItems: () => void
    setQuality: (quality: number) => void
    setIndexAsName: (indexAsName: boolean) => void
    setPrefix: (prefix: string) => void
    setSuffix: (suffix: string) => void
  }
};

export const useApp = create<App>((set, get) => ({
  selectedItems: [],
  latestSelectedItem: undefined,
  quality: 1,
  indexAsName: false,
  prefix: '',
  suffix: '',
  
  api: {
    selectItem: (item) => {
      const selectedItems = [...get().selectedItems].filter(i => i.type === item.type);
      selectedItems.push(item);
      set({ selectedItems, latestSelectedItem: item });
    },
    deselectItem: (item) => {
      const selectedItems = [...get().selectedItems];
      const index = selectedItems.findIndex(i => i.id === item.id);
      
      if (index < 0) {
        return;
      }
      
      selectedItems.splice(index);
      set({ selectedItems, latestSelectedItem: selectedItems[selectedItems.length - 1] });
    },
    setSelectedItems: (items) => {
      set({ selectedItems: items, latestSelectedItem: items[items.length - 1] });
    },
    clearSelectedItems: () => set({ selectedItems: [] }),
    async setQuality(quality) {
      set({ quality })

      useOutputImages.getState().api.regenerate();
    },
    setIndexAsName: (indexAsName) => set({ indexAsName }),
    setPrefix: (prefix) => set({ prefix }),
    setSuffix: (suffix) => set({ suffix }),
  }
}));