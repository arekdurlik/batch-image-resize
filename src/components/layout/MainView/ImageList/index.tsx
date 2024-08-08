import { Grid, ImageListWrapper } from './styled'
import { ImageData } from '../../../../store/types'
import { SortType } from './types'
import { ListItem } from './Item'
import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useApp } from '../../../../store/app'
import { useKeyDownEvents, useKeyUpEvents } from '../../../../hooks/useKeyboardEvents'
import { clamp } from '../../../../lib/helpers'
import { usePrevious } from '../../../../hooks/usePrevious'
import { useOutsideClick } from '../../../../hooks/useOutsideClick'
import { useMouseInputRef } from '../../../../hooks/useMouseInputRef'

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
  const ctrl = useRef(false);

  const api = useApp(state => state.api);
  const selectedItems = useApp(state => state.selectedItems);
  const prevSelectedItems = usePrevious(selectedItems)!;
  
  const inputtingFilename = useRef(false);
  const inputtingTimeout = useRef<NodeJS.Timeout>();
  const input = useRef('');
  
  const mouse = useMouseInputRef();
  useOutsideClick(list, () => setIsActive(false));
  
  // jump to new active item if out of view
  useEffect(() => {
    if (!selectedItems) return;
    const lastItem = selectedItems[selectedItems.length - 1];

    const activeItemRef = itemRefMap.get(lastItem?.id);

    if (activeItemRef) {
      const { top: itemTop, bottom: itemBottom } = activeItemRef.getBoundingClientRect();
      const { top: listTop, bottom: listBottom } = list.current.getBoundingClientRect();

      const scrollPadding = 20;
      const topDifference = listTop - itemTop;
      const bottomDifference = itemBottom - listBottom;

      if (topDifference > 0) {
        list.current.scrollTo({ top: list.current.scrollTop - topDifference - scrollPadding });
      } else if (bottomDifference > 0) {
        list.current.scrollTo({ top: list.current.scrollTop + bottomDifference + scrollPadding });
      }
    }
  }, [selectedItems, itemRefMap]);

  useKeyDownEvents((event) => {
    switch (event.code) {
      case 'ControlLeft': ctrl.current = true; return;
    }

    const lastItem = selectedItems[selectedItems.length - 1];
    const lastPreviousItem = prevSelectedItems[prevSelectedItems.length - 1];

    const activeId = lastItem?.id ?? lastPreviousItem?.id;

    const index = Math.max(0, images.findIndex(img => img.id === activeId));
    let newIndex = index;

    switch(event.code) {
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
        
        newIndex = event.code === 'ArrowUp' ? newIndex - columnCount : newIndex + columnCount;

        if ((newIndex < 0 || newIndex > images.length -1) && lastItem !== undefined) {
          newIndex = index;
        }

        break;
      }
      default: {
        if (event.code === 'Space') {
          if (inputtingFilename.current) {
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

    api.setSelectedItems([{ type, id: images[newIndex].id }]);
  }, isActive, [images, selectedItems]);

  useKeyUpEvents((event) => {
    switch (event.code) {
      case 'ControlLeft': ctrl.current = false; break;
    }
  });

  function handleInput(key: string) {
    if (key.length !== 1) return;

    inputtingFilename.current = true;
    input.current += key.toLowerCase();

    clearTimeout(inputtingTimeout.current);
    inputtingTimeout.current = setTimeout(() => {
      inputtingFilename.current = false;
      input.current = '';
    }, INPUT_TIMEOUT);

    const found = images.find(img => img.filename.toLowerCase().startsWith(input.current));
    found && api.setSelectedItems([{ type, id: found.id }]);
  }

  function handleBackgroundClick() {
    setIsActive(true);
  }

  function handleFocus() {
    if (mouse.current.lmb) return;

    setIsActive(true);
    const latestActive = selectedItems[selectedItems.length - 1];
    const latestPreviousActive = prevSelectedItems[prevSelectedItems.length - 1];

    const index = images.findIndex(img => img.id === latestPreviousActive?.id);

    index >= 0 && latestActive.type === type
      ? api.setSelectedItems([{ type, id: images[index].id}])
      : api.setSelectedItems([{ type, id: images[0].id}]);
  }
  
  function handleItemClick(itemId: string) {
    return (event: MouseEvent) => {
      event.stopPropagation();
      setIsActive(true);

      ctrl.current
        ? api.selectItem({ type, id: itemId })
        : api.setSelectedItems([{ type, id: itemId }]);
    }
  }

  return (
    <ImageListWrapper
      ref={list}
      tabIndex={0} 
      onFocus={handleFocus}
      onClick={handleBackgroundClick}
      onBlur={() => setIsActive(false)} 
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
              image={image} 
              isActive={selectedItems.find(i => i.id === image.id) !== undefined}
              isPreviousActive={image.id === prevSelectedItems[prevSelectedItems.length - 1]?.id}
              previousActiveVisible={selectedItems.length === 0}
              sortBy={sortBy} 
              onClick={handleItemClick(image.id)}
            />
          ))}
        </Grid>
      )}
    </ImageListWrapper>
  )
}