import { Grid, ImageListWrapper } from './styled'
import { ImageData } from '../../../../store/types'
import { SortType } from './types'
import { ListItem } from './Item'
import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react'
import { SelectedItem, useApp } from '../../../../store/app'
import { useKeyDownEvents } from '../../../../hooks/useKeyboardEvents'
import { clamp } from '../../../../lib/helpers'
import { useOutsideClick } from '../../../../hooks/useOutsideClick'
import { useMouseInputRef } from '../../../../hooks/useMouseInputRef'
import { useDragSelect } from '../../../../hooks/useDragSelect'
import { jumpToItem } from './utils'
import { useKeyboardInputRef } from '../../../../hooks/useKeyboardInput'

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
  
  useOutsideClick(list, handleBlur, { cancelOnDrag: true });
  const api = useApp(state => state.api);
  const mouse = useMouseInputRef();
  const keyboard = useKeyboardInputRef(['tab', 'control', 'shift']);
  const dragSelectBind = useDragSelect(list, Array.from(itemRefMap).map(i => i[1]), {
    onStart: () => setIsActive(true),
    onSelect: (selected) => {
      api.setSelectedItems(selected.map(i => ({ type, id: i.dataset.id! })));
    },
    onCancel: () => handleBackgroundClick()
  });

  // jump to new active item if out of view
  useEffect(() => {
    useApp.subscribe(state => ({ 
      selected: state.selectedItems, 
      latestSelected: state.latestSelectedItem
    }), (newState) => {
      selected.current = newState.selected;
      latestSelectedItem.current = newState.latestSelected;

      if (!mouse.current.lmb && newState.latestSelected) {
        const item = itemRefMap.get(newState.latestSelected.id);
        item && jumpToItem(list.current, item);
      }
    })
  }, [itemRefMap, mouse]);

  useKeyDownEvents((event) => {
    const lastItem = selected.current[selected.current.length - 1];
    const activeId = lastItem?.id ?? 0;

    const index = Math.max(0, images.findIndex(img => img.id === activeId));
    let newIndex = index;

    switch(event.key) {
      case 'ArrowLeft': 
      case 'ArrowRight': {
        newIndex = event.code === 'ArrowLeft' ? newIndex - 1 : newIndex + 1;
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
        
        newIndex = event.key === 'ArrowUp' ? newIndex - columnCount : newIndex + columnCount;

        if ((newIndex < 0 || newIndex > images.length -1) && lastItem !== undefined) {
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
  }, isActive, [images, selected]);

  function handleInput(key: string) {
    if (key.length !== 1) return;

    input.current += key.toLowerCase();

    clearTimeout(inputtingTimeout.current);
    inputtingTimeout.current = setTimeout(() => {
      input.current = '';
    }, INPUT_TIMEOUT);

    const found = images.find(img => img.filename.toLowerCase().startsWith(input.current));
    found && api.setSelectedItems([{ type, id: found.id }]);
  }

  function handleBackgroundClick() {
    setIsActive(true);
    if (selected.current.length === 0) {
      api.setSelectedItems([], true);
    } else {
      api.setSelectedItems([]);
    }
  }
  
  function handleKeyboardFocus() {
    if (!keyboard.current.tab) return;
    setIsActive(true);
    
    const index = images.findIndex(img => img.id === latestSelectedItem.current?.id);

    index >= 0 && latestSelectedItem.current?.type === type
      ? api.setSelectedItems([{ type, id: images[index].id}], true)
      : api.setSelectedItems([{ type, id: images[0].id}], true);
  }

  function handleKeyboardBlur() {
    if (mouse.current.lmb) return;
    handleBlur();
  }

  function handleBlur() {
    if (!isActive) return;
    setIsActive(false);
    latestSelectedItem.current = selected.current[selected.current.length - 1];
  }
  
  function handleItemClick(itemId: string) {
    return (event: MouseEvent) => {
      event.stopPropagation();
      setIsActive(true);

      keyboard.current.control
        ? api.selectItem({ type, id: itemId })
        : api.setSelectedItems([{ type, id: itemId }], true);
    }
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
            onClick={handleItemClick(image.id)}
            />
          ))}
        </Grid>
      )}
    </ImageListWrapper>
  )
}