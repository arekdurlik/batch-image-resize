import { Grid, ImageListWrapper } from './styled'
import { ImageData } from '../../../../store/types'
import { ListItem } from './Item'
import { useEffect, useMemo, useRef, useState } from 'react'
import { SelectedItem, useApp } from '../../../../store/app'
import { useKeyDownEvents } from '../../../../hooks/useKeyboardEvents'
import { clamp } from '../../../../lib/helpers'
import { useOutsideClick } from '../../../../hooks/useOutsideClick'
import { useMouseInputRef } from '../../../../hooks/useMouseInputRef'
import { useDragSelect } from '../../../../hooks/useDragSelect'
import { SortType, allToSelectedItems, jumpToElement, toSelectedItems } from './utils'
import { useForceUpdate } from '../../../../hooks/useForceUpdate'
import { useModifiersRef } from '../../../../hooks/useModifiers'

const INPUT_TIMEOUT = 500;

type Props = { 
  type: 'input' | 'output'
  images: ImageData[]
  sortBy?: SortType 
};

export function ImageList({ type, images, sortBy = SortType.FILENAME }: Props) {
  const [isActive, setIsActive] = useState(false);
  const itemRefMap = useMemo(() => new Map<string, HTMLDivElement>(), []);

  const grid = useRef<HTMLDivElement>(null!);
  const list = useRef<HTMLDivElement>(null!);
  const selected = useRef<SelectedItem[]>([]);
  const latestSelectedItem = useRef<SelectedItem>();
  const inputtingTimeout = useRef<NodeJS.Timeout>();
  const input = useRef('');
  
  const api = useApp(state => state.api);
  const mouse = useMouseInputRef();
  const modifiers = useModifiersRef();
  
  const selectables = Array.from(itemRefMap).map(i => i[1]);
  const dragSelectBind = useDragSelect(list, selectables, {
    onStart: () => setIsActive(true),
    onChange: data => { // drag select
      const i = allToSelectedItems(data, type);
      api.selectItemsByDrag(i.selected, i.added, i.removed, modifiers);
    },
    onEnd: (data, dragged) => { // click select
      if (dragged) return;

      if (data.length === 0) {
        if (modifiers.none) {
          api.setSelectedItems([], !selected.current.length);
        }
        return;
      }

      const items = toSelectedItems(data, type);

      if (modifiers.shift) {
        api.selectItemsWithShift(
          items[0], 
          images.map(({ id }) => ({ type, id }))
        );
      } else {
        api.selectItems(items, modifiers);
      }
    }
  });
  
  useForceUpdate([images.length]); // fixes drag selecting before images are loaded in
  useOutsideClick(list, handleBlur, { cancelOnDrag: true });

  // jump to new active item if out of view
  useEffect(() => {
    useApp.subscribe(state => state.selectedItems, items => {
      selected.current = items;
    });

    useApp.subscribe(state => state.latestSelectedItem, item => {
      latestSelectedItem.current = item;

      if (!mouse.lmb && item) {
        const el = itemRefMap.get(item.id);
        el && jumpToElement(list.current, el);
      }
    });
  }, [itemRefMap, mouse]);

  useKeyDownEvents((event) => {
    const lastItem = selected.current[selected.current.length - 1];
    const activeId = lastItem?.id ?? latestSelectedItem.current?.id ?? 0;

    const index = Math.max(0, images.findIndex(img => img.id === activeId));
    let newIndex = index;

    switch(event.key) {
      case 'a':
      case 'A': {
        if (modifiers.control) {
          event.preventDefault();
          const items = toSelectedItems(selectables, type);
          api.setSelectedItems(items);
        }
        return;
      }
      case 'ArrowLeft': 
      case 'ArrowRight': {
        newIndex = event.code === 'ArrowLeft' 
          ? newIndex - 1 
          : newIndex + 1;
        newIndex = clamp(newIndex, 0, images.length - 1);
        
        break;
      }
      case 'ArrowUp':
      case 'ArrowDown': {
        event.preventDefault();

        const columnCount = window
          .getComputedStyle(grid.current)
          .getPropertyValue('grid-template-columns')
          .split(' ')
          .length; 
        
        newIndex = event.key === 'ArrowUp' 
          ? newIndex - columnCount 
          : newIndex + columnCount;

        if (newIndex < 0 || newIndex > images.length -1) {
          newIndex = index;
        }

        break;
      }
      default: {
        if (event.key === 'Space') {
          if (input.current.length) {
            event.preventDefault();
          } else {
            return;
          }
        }

        handleInput(event.key);
        return;
      }
    }
    
    if (newIndex === index && lastItem !== undefined) return;

    api.setSelectedItems([{ type, id: images[newIndex].id }], true);
  }, isActive && images.length > 0, [images, selected]);

  function handleInput(key: string) {
    if (key.length !== 1) return;

    input.current += key.toLowerCase();

    clearTimeout(inputtingTimeout.current);
    inputtingTimeout.current = setTimeout(() => {
      input.current = '';
    }, INPUT_TIMEOUT);

    const found = images.find(img => img.filename.toLowerCase().startsWith(input.current));
    found && api.setSelectedItems([{ type, id: found.id }], true);
  }
  
  function handleKeyboardFocus() {
    if (!modifiers.tab || !images.length) return;

    setIsActive(true);
    
    const index = images.findIndex(img => img.id === latestSelectedItem.current?.id);

    index >= 0 && latestSelectedItem.current?.type === type
      ? api.setSelectedItems([{ type, id: images[index].id}], true)
      : api.setSelectedItems([{ type, id: images[0].id}], true);
  }

  function handleKeyboardBlur() {
    if (mouse.lmb) return;
    handleBlur();
  }

  function handleBlur() {
    if (!isActive) return;
    setIsActive(false);
    latestSelectedItem.current = selected.current[selected.current.length - 1];
  }

  return (
    <ImageListWrapper
      ref={list}
      $focused={isActive}
      tabIndex={0} 
      onFocus={handleKeyboardFocus}
      onBlur={handleKeyboardBlur}
      {...dragSelectBind}
    > 
      {images.length > 0 && (
        <Grid ref={grid} className='imagelist-container-query'>
          {images.map(image => (
            <ListItem
              ref={node => node 
                ? itemRefMap.set(image.id, node) 
                : itemRefMap.delete(image.id)
              }
              key={image.id}
              type={type}
              image={image} 
              sortBy={sortBy} 
            />
          ))}
        </Grid>
      )}
    </ImageListWrapper>
  )
}