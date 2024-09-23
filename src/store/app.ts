import { create } from 'zustand'
import { useOutputImages } from './output-images'
import { subscribeWithSelector } from 'zustand/middleware'
import { mergeUniqueSelectionItems } from '../utils'
import { SelectedItem } from './types'
import { switchedType } from './utils'
import { useInputImages } from './input-images'
import { openToast, ToastType } from './toasts'
import { Log } from '../lib/log'

type App = {
  selectedItems: SelectedItem[],
  latestSelectedItem: SelectedItem | undefined,
  quality: number
  indexAsName: boolean
  prefix: string
  suffix: string
  api: {
    selectItems: (
      items: SelectedItem[], 
      modifiers?: { control?: boolean }
    ) => void
    selectItemsWithShift: (
      item: SelectedItem,
      allItems: SelectedItem[]
    ) => void
    selectItemsByDrag: (
      items: SelectedItem[],
      added: SelectedItem[], 
      removed: SelectedItem[], 
      modifiers?: { control?: boolean, shift?: boolean }
    ) => void
    deselectItems: (items: SelectedItem[]) => void
    deselectAll: () => void
    setSelectedItems: (items: SelectedItem[], setLatestSelected?: boolean) => void
    setLastSelectedItem: (item: SelectedItem | undefined) => void
    deleteSelectedItems: () => void
    clearAllSelectedItems: () => void
    setQuality: (quality: number) => void
    setIndexAsName: (indexAsName: boolean) => void
    setPrefix: (prefix: string) => void
    setSuffix: (suffix: string) => void
  }
};

export const useApp = create<App>()(subscribeWithSelector((set, get) => ({
  selectedItems: [],
  latestSelectedItem: undefined,
  quality: 1,
  indexAsName: false,
  prefix: '',
  suffix: '',

  api: {
    selectItems: (items, modifiers = {}) => {
      const selectedItemsOfSameType = [...get().selectedItems].filter(i => i.type === items[0]?.type);
      const { control } = modifiers;
      
      if (items.length === 1) {
        set({ latestSelectedItem: items[0] });
      }
      
      if (!control) {
        set({ selectedItems: items });
      } else {
        const inverted = mergeUniqueSelectionItems(items, selectedItemsOfSameType);
        set({ selectedItems: inverted });
      }
    },
    selectItemsWithShift: (item, allItems) => {

      const clickIndex  = allItems.findIndex(i => i.id === item.id);
      let otherEndIndex = allItems.findIndex(i => i.id === get().latestSelectedItem?.id);

      if (otherEndIndex < 0) { // switched type
        set({ latestSelectedItem: item });
        otherEndIndex = 0;
      }

      const startIndex = clickIndex > otherEndIndex ? otherEndIndex : clickIndex;
      const endIndex = clickIndex > otherEndIndex ? clickIndex : otherEndIndex;

      const slice = allItems.slice(startIndex, endIndex + 1);
      set({ selectedItems: slice });
    },
    selectItemsByDrag: (selected, added, removed, modifiers = {}) => {
      const { control, shift } = modifiers;
      
      if (!control && !shift) {
        set({ selectedItems: selected });
      }
      
      let selectedItems = [...get().selectedItems];

      if (switchedType(selectedItems, selected)) {
        selectedItems = [];
      }
      
      if (control) {
        [added, removed].forEach(arr => {
          arr.forEach(item => {
            const index = selectedItems.findIndex(i => i.id === item.id);
    
          index > -1
            ? selectedItems.splice(index, 1)
            : selectedItems.push(item);
          });
        });

        set({ selectedItems });
      }
      
      if (shift) {
        added.forEach(item => {
          const notDuplicate = !selectedItems.some(i => i.id === item.id);
          notDuplicate && selectedItems.push(item);
        });

        removed.forEach(item => {
          const index = selectedItems.findIndex(i => i.id == item.id);
          index > -1 && selectedItems.splice(index, 1);
        });

        set({ selectedItems })
      }
    },
    deselectItems: (items) => {
      const selectedItems = [...get().selectedItems];
      
      items.forEach(item => {
        const index = selectedItems.findIndex(i => i.id === item.id);
        index > -1 && selectedItems.splice(index);
      });
      
      set({ selectedItems });
    },
    deselectAll: () => {
      set({ selectedItems: [], latestSelectedItem: undefined });
    },
    setSelectedItems: (items, setLatestSelected = false) => {
      const latestSelectedItem = setLatestSelected ? items[items.length - 1] : undefined;

      if (setLatestSelected) {
        set({ latestSelectedItem });
      }

      set({ selectedItems: items });
    },
    setLastSelectedItem: (item) => {
      set({ latestSelectedItem: item });
    },
    deleteSelectedItems: () => {
      try {
        const selectedItems = [...get().selectedItems];
        if (!selectedItems.length) return;

        const latest = get().latestSelectedItem;
        const inputImages = [...useInputImages.getState().images];
        let outputImages = [...useOutputImages.getState().images];
        let totalInputSize = useInputImages.getState().totalSize;

        const type = selectedItems[0].type;
        const typeImages = type === 'input' 
          ? inputImages 
          : outputImages;
        
        const selectedIds = selectedItems.map(i => i.id);

        selectedIds.forEach(id => {
          const index = typeImages.findIndex(img => img.id === id);
  
          if (index > -1) {
            if (type === 'input') {
              totalInputSize -= inputImages[index].image.full.file.size;
              outputImages = outputImages.filter(img => img.inputImage.id !== id);
            }

            typeImages.splice(index, 1);
          } else {
            throw new Error();
          }
        });

        if (type === 'input') {
          useInputImages.setState({ images: inputImages, totalSize: totalInputSize });
        }
        
        useOutputImages.setState({ images: outputImages });
        set({ selectedItems: [] });

        if (latest && selectedItems.map(i => i.id).includes(latest.id)) {
          set({ latestSelectedItem: undefined });
        }
      } catch (error) {
        Log.error('Error deleting selected images.', error);
        openToast(ToastType.ERROR, 'Error deleting selected images.');
      }
    },
    clearAllSelectedItems: () => {
      set({ selectedItems: [] })
    },
    async setQuality(quality) {
      set({ quality })

      useOutputImages.getState().api.regenerateAll();
    },
    setIndexAsName: (indexAsName) => {
      set({ indexAsName })
    },
    setPrefix: (prefix) => {
      set({ prefix })
    },
    setSuffix: (suffix) => {
      set({ suffix })
    },
  }
})));