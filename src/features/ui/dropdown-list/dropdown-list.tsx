import { Children, isValidElement, ReactElement, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { OVERLAY_ID } from '../../../lib/constants'
import { Placement } from '../types'
import { Container } from './styled'
import { Item } from './children/item'
import { Props } from './types'
import { getAlignment } from './utils'
import { Divider } from './children/divider'

export function DropdownList({ 
children, 
actuator, 
initialHighlightIndex = 0, 
align = 'left', 
slideIn = false, 
margin = 4, 
onClose,
}: Props) {
  const [highlightedIndex, setHighlightedIndex] = useState(initialHighlightIndex);
  const [reactElemRefArray, setReactElemRefArray] = useState<ReactElement[]>([]);
  const [tabbableArray, setTabbableArray] = useState<(HTMLElement | null)[]>([]);
  const [renderParams, setRenderParams] = useState({
    x: 0, y: 0, placement: Placement.BOTTOM
  });

  const overlay = useRef<HTMLDivElement>(document.querySelector(`#${OVERLAY_ID}`)!);
  const list = useRef<HTMLUListElement>(null!);
  
  const tabbableLength = tabbableArray.length;

  // fill dom and react elem refs arrays
  useEffect(() => {
    const reactArray = Children.map(children, child => {
      if (isValidElement(child)) {
        return child;
      } else {
        throw new Error(`Dropdown list child not a valid React element: ${child}`);
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
        const reactElem = reactElemRefArray[index];
        (reactElem as ReactElement).props.onClick?.(event);
        onClose?.();
      }
    }

    const ref = list.current;

    ref.addEventListener('click', handler, true);
    return () => ref.removeEventListener('click', handler, true);
  }, [onClose, reactElemRefArray, tabbableArray]);

  // click away listener
  // pointer down with useCapture, otherwise clicking on panel resizer doesn't close dropdown
  useEffect(() => {
    function handler(event: MouseEvent) {
      const clickedOnActuator = event.target === actuator?.current;
      const clickedOnList = event.target === list.current;
      const clickedOnOption = list.current.contains(event.target as HTMLElement);

      if (!clickedOnActuator && !clickedOnOption && !clickedOnList) {
        onClose?.();
      }
    }

    const ref = list.current;

    ref.addEventListener('pointerdown', handler, true);
    return () => ref.removeEventListener('pointerdown', handler, true);
  }, [actuator, onClose]);

  // set list placement based on screen bounds
  useEffect(() => {
    function calculatePosition() {
      if (!list.current || !actuator?.current) return;

      if (actuator.current) {
        const listRect = list.current.getBoundingClientRect();
        const actuatorRect = actuator.current.getBoundingClientRect();
        const alignment = getAlignment(listRect, actuatorRect, align);
        const actuatorBottom = actuatorRect.y + actuatorRect.height;
        
        if (actuatorBottom + listRect.height > window.innerHeight) {
          setRenderParams({
            x: actuatorRect.x + alignment, 
            y: actuatorRect.y - listRect.height - margin,
            placement: Placement.TOP
          });
        } else {
          setRenderParams({
            x: actuatorRect.x + alignment,
            y: actuatorRect.y + actuatorRect.height + margin,
            placement: Placement.BOTTOM
          });
        }
      }
    }
    
    calculatePosition();
    window.addEventListener('resize', calculatePosition);
    return () => window.removeEventListener('resize', calculatePosition);
  }, [actuator, align, margin]);

  // keyboard navigation
  useEffect(() => {
    function handler(event: KeyboardEvent) {
      switch (event.key) {
        case 'Tab':
        case 'Escape':
          onClose?.();
          break;
        case 'Enter':
        case ' ': {
          const item = reactElemRefArray[highlightedIndex];
          if (item) {
            (item as ReactElement).props.onClick?.(event);
            onClose?.();
          }
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
  }, [highlightedIndex, tabbableLength, reactElemRefArray, onClose]);
  
  return createPortal((
    <Container
      ref={list}
      $slideIn={slideIn}
      $renderParams={renderParams}
    >
      {children}
    </Container>
  ), overlay.current);
}

DropdownList.Item = Item;
DropdownList.Divider = Divider;