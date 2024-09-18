import { Children, isValidElement, ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { OVERLAY_ID } from '../../../lib/constants'
import { Placement } from '../types'
import { Container } from './styled'
import { Item } from './children/item'
import { Props, RenderParams } from './types'
import { getAlignment } from './utils'
import { Divider } from './children/divider'

export function DropdownList({ 
children, 
actuator, 
initialHighlightIndex = 0, 
floating = false,
align = 'left', 
slideIn = false, 
margin = 4, 
onClose,
}: Props) {
  const [highlightedIndex, setHighlightedIndex] = useState(initialHighlightIndex);
  const [reactElemRefArray, setReactElemRefArray] = useState<ReactElement[]>([]);
  const [tabbableArray, setTabbableArray] = useState<(HTMLElement | null)[]>([]);
  const [renderParams, setRenderParams] = useState<RenderParams>({
    x: 0, y: 0, placement: Placement.BOTTOM, width: 'auto'
  });

  const overlay = useRef<HTMLDivElement>(document.querySelector(`#${OVERLAY_ID}`)!);
  const list = useRef<HTMLUListElement>(null!);
  
  const tabbableLength = tabbableArray.length;

  const runItemCallback = useCallback(async (index: number, event?: Event) => {
    const item = reactElemRefArray[index];
    if (item) {
      (item as ReactElement).props?.onClick?.(event);
      onClose?.();
    }
  }, [onClose, reactElemRefArray]);

  // fill dom and react elem refs arrays
  useEffect(() => {
    const reactArray = Children.map(children, child => {
      if (isValidElement(child)) {
        return child;
      }
    });

    if (!reactArray) return;

    setTabbableArray(
      Array.from(list.current.children)
      .filter((child, index) => {
        if (child.hasAttribute('tabindex')) {
          setReactElemRefArray(v => [...v, reactArray[index]]);
          return true;
        } else {
          return false;
        }
      }) as (HTMLElement | null)[]
    );
  }, [children]);

  // focus on highlighted item
  useEffect(() => {
    tabbableArray[highlightedIndex]?.focus();
  }, [tabbableArray, highlightedIndex]);

  // run onClick cb on item click and close list
  useEffect(() => {
    function handler(event: MouseEvent) {
      const clickedOnOption = list.current.contains(event.target as HTMLElement);
      
      if (clickedOnOption) {
        const index = tabbableArray.findIndex(el => el === event.target);
        runItemCallback(index, event);
      }
    }
    
    function handleMouseDown(event: MouseEvent) {
      event.stopPropagation();
    }

    const ref = list.current;

    ref.addEventListener('mousedown', handleMouseDown);
    ref.addEventListener('click', handler);
    return () => {
      ref.removeEventListener('mousedown', handleMouseDown);
      ref.removeEventListener('click', handler);
    }
  }, [onClose, tabbableArray, runItemCallback]);

  // click away listener
  // pointer down with useCapture, otherwise clicking on panel resizer doesn't close dropdown
  useEffect(() => {
    function handler(event: MouseEvent) {
      const clickedOnActuator = actuator?.current?.contains(event.target as HTMLElement);
      const clickedOnList = event.target === list.current;
      const clickedOnOption = list.current.contains(event.target as HTMLElement);

      if (!clickedOnActuator && !clickedOnOption && !clickedOnList) {
        onClose?.();
      }
    }

    document.addEventListener('pointerdown', handler, true);
    return () => document.removeEventListener('pointerdown', handler, true);
  }, [actuator, onClose]);

  // set list placement based on screen bounds
  useEffect(() => {
    function calculatePosition() {
      if (!list.current || !actuator?.current) return;

      const listRect = list.current.getBoundingClientRect();
      const actuatorRect = actuator.current.getBoundingClientRect();
      const alignment = getAlignment(listRect, actuatorRect, align);
      const actuatorBottom = actuatorRect.y + actuatorRect.height;
      
      let width: string | number = 'auto';

      if (actuatorRect.width > listRect.width) {
        width = actuatorRect.width;
      }
      if (actuatorBottom + listRect.height > window.innerHeight) {
        setRenderParams({
          x: actuatorRect.x + alignment, 
          y: actuatorRect.y - listRect.height - margin,
          placement: Placement.TOP,
          width
        });
      } else {
        setRenderParams({
          x: actuatorRect.x + alignment,
          y: actuatorRect.y + actuatorRect.height + margin,
          placement: Placement.BOTTOM,
          width
        });
      }
    }
    
    calculatePosition();
    window.addEventListener('resize', calculatePosition);
    return () => window.removeEventListener('resize', calculatePosition);
  }, [actuator, align, margin]);

  // keyboard navigation
  useEffect(() => {
    function handler(event: KeyboardEvent) {
      event.stopPropagation();
      switch (event.key) {
        case 'Tab':
        case 'Escape':
          onClose?.();
          break;
        case 'Enter':
        case ' ': {
          runItemCallback(highlightedIndex, event);
          break;
        }
        case 'ArrowUp':
        case 'ArrowDown': {
          const newValue = highlightedIndex + (event.key === 'ArrowDown' ? 1 : -1);

          if (newValue >= 0 && newValue < tabbableLength) {
            setHighlightedIndex(newValue);
          }
        }
      }
    }

    const ref = list.current;
    
    ref.addEventListener('keydown', handler);
    return () => ref.removeEventListener('keydown', handler);
  }, [highlightedIndex, tabbableLength, onClose, runItemCallback]);

  return createPortal((
    <Container
      ref={list}
      $floating={floating}
      $slideIn={slideIn}
      $renderParams={renderParams}
    >
      {children}
    </Container>
  ), overlay.current);
}

DropdownList.Item = Item;
DropdownList.Divider = Divider;