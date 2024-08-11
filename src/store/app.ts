import { create } from 'zustand'
import { useOutputImages } from './outputImages'
import { subscribeWithSelector } from 'zustand/middleware'
import { mergeUniqueSelectionItems } from '../utils'

export type SelectedItem = {
  type: 'input',
  id: string
} | {
  type: 'output',
  id: string
}

function switchedType(items1: SelectedItem[], items2: SelectedItem[]) {
  return items1[0]?.type && items2[0]?.type && items1[0].type !== items2[0].type;
}

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
      modifiers?: { control?: boolean, shift?: boolean }
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
      const { control, shift } = modifiers;
      
      if (items.length === 1) {
        set({ latestSelectedItem: items[0] });
      }
      
      if (!control && !shift) {
        set({ selectedItems: items });
      }
      
      if (control) {
        const inverted = mergeUniqueSelectionItems(items, selectedItemsOfSameType);
        set({ selectedItems: inverted });
      }  
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
        added.forEach(item => {
          const index = selectedItems.findIndex(i => i.id === item.id);
    
          index > -1
            ? selectedItems.splice(index, 1)
            : selectedItems.push(item);
        });
        
        removed.forEach(item => {
          const index = selectedItems.findIndex(i => i.id === item.id);
          
          index > -1
            ? selectedItems.splice(index, 1)
            : selectedItems.push(item);
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