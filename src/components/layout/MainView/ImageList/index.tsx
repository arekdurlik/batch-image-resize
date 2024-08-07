import { Grid } from './styled'
import { ImageData } from '../../../../store/types'
import { SortType } from './types'
import { ListItem } from './Item'
import styled from 'styled-components'
import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useApp } from '../../../../store/app'
import { useKeyboardEvents } from '../../../../hooks/useKeyboardEvents'
import { clamp } from '../../../../lib/helpers'
import { usePrevious } from '../../../../hooks/usePrevious'
import { useOutsideClick } from '../../../../hooks/useOutsideClick'

type Props = { 
  type: 'input' | 'output'
  images: ImageData[], 
  sortBy?: SortType, 
};

const INPUT_TIMEOUT = 500;

export function ImageList({ type, images, sortBy = SortType.FILENAME }: Props) {
  const [isActive, setIsActive] = useState(false);
  const activeItem = useApp(state => state.activeItem);
  const previousActiveItem = usePrevious(activeItem);
  const setActiveItem = useApp(state => state.api.setActiveItem);
  const grid = useRef<HTMLDivElement>(null!);
  const itemRefMap = useMemo(() => new Map<string, HTMLDivElement>(), []);
  const list = useRef<HTMLDivElement>(null!);
  useOutsideClick(list, () => setIsActive(false));
  const inputtingFilename = useRef(false);
  const inputtingTimeout = useRef<NodeJS.Timeout>();
  const input = useRef('');

  // jump to new active item if out of view
  useEffect(() => {
    if (!activeItem) return;

    const activeItemRef = itemRefMap.get(activeItem?.id);

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
  }, [activeItem, itemRefMap]);

  useKeyboardEvents((event) => {
    const activeId = activeItem?.id ?? previousActiveItem?.id;

    const index = images.findIndex(img => img.id === activeId) ?? 0;
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

        if ((newIndex < 0 || newIndex > images.length -1) && activeItem !== undefined) {
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
    
    if (newIndex === index && activeItem !== undefined) return;

    setActiveItem({ type, id: images[newIndex].id });
  }, isActive, [images, activeItem]);

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
    found && setActiveItem({ type, id: found.id });
  }

  function handleFocus() {
    setIsActive(true);
    const index = Math.max(0, images.findIndex(img => img.id === previousActiveItem?.id)); 

    setActiveItem({ type, id: images[index].id});
  }

  function handleBackgroundClick() {
    setIsActive(true);
    setActiveItem(undefined);
  }

  function handleItemClick(itemId: string) {
    return (event: MouseEvent) => {
      event.stopPropagation();
      setIsActive(true);
      setActiveItem(itemId ? { type, id: itemId } : undefined);
    }
  }

  return (
    <ImageListWrapper
      ref={list}
      tabIndex={0} 
      onFocus={handleFocus}
      onClick={handleBackgroundClick}
      onBlur={() => setIsActive(false)} 
      /* style={{ backgroundColor: isActive ? 'red' : undefined }} */
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
              isActive={image.id === activeItem?.id}
              isPreviousActive={image.id === previousActiveItem?.id}
              previousActiveVisible={!activeItem}
              sortBy={sortBy} 
              onClick={handleItemClick(image.id)}
            />
          ))}
        </Grid>
      )}
    </ImageListWrapper>
  )
}

const ImageListWrapper = styled.div`
z-index: 3;
overflow-y: scroll;
height: 100%;
position: relative;
container-type: inline-size;
`

