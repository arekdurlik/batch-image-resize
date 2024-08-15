import { create } from 'zustand'
import { useOutputImages } from './output-images'
import { subscribeWithSelector } from 'zustand/middleware'
import { mergeUniqueSelectionItems } from '../utils'
import { SelectedItem } from './types'
import { switchedType } from './utils'

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
    setSelectedItems: (items: SelectedItem[], setLatestSelected?: boolean) => void
    setLastSelectedItem: (item: SelectedItem | undefined) => void
    clearSelectedItems: () => void
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
    clearSelectedItems: () => {
      set({ selectedItems: [] })
    },
    async setQuality(quality) {
      set({ quality })

      useOutputImages.getState().api.regenerate();
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