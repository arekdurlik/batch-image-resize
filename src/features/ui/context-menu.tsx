import { ReactNode, RefObject, useEffect, useState } from 'react'
import { DropdownList } from './dropdown-list'
import { Alignment } from './dropdown-list/types'
import { ActionMenu } from './action-menu'

type Props = {
  actuator: RefObject<HTMLElement>
  children: ReactNode
  initialHighlightIndex?: number
  align?: Alignment
  open?: boolean
  onOpen?: () => void
  onClose?: () => void
};

const el = document.createElement('div');
el.style.display = 'none';
el.classList.add('context-menu-actuator');
document.body.append(el);
const elRef = { current: el };

export function ContextMenu({ 
  actuator, 
  initialHighlightIndex, 
  align,
  open,
  onOpen, 
  onClose, 
  children 
}: Props) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalIsOpen;

  useEffect(() => {
    if (!actuator.current) return;
    const ref = actuator.current;

    function handler(event: KeyboardEvent) {
      switch(event.key) {
        case 'Enter':
        case ' ': {
          const rect = ref.getBoundingClientRect();
          el.style.left = rect.left + (ref.offsetWidth / 2) + 'px';
          el.style.top = rect.top + (ref.offsetHeight / 2) + 'px';
          setInternalIsOpen(true);
          break;
        }
        case 'Esc':
        case 'Tab':
          setInternalIsOpen(false);
      }
    }

    ref.addEventListener('keydown', handler)
    return () => ref.removeEventListener('keydown', handler)
  }, [children, actuator]);

  // remove forced focus-visible if opening context menu with rmb after any keyboard input
  useEffect(() => {
    function handler() {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, []);

  useEffect(() => {
    if (!actuator.current) return;

    function handler(event: MouseEvent) {
      event.preventDefault();
      el.style.display = 'initial';
      el.style.top = event.clientY + 'px';
      el.style.left = event.clientX + 'px';
      setInternalIsOpen(true);
      onOpen?.();
    } 

    const ref = actuator.current;
    ref.addEventListener('contextmenu', handler);
    return () => ref.removeEventListener('contextmenu', handler);
  }, [actuator, onOpen]);

  useEffect(() => {
    if (!actuator.current) return;
    const ref = actuator.current;
    
    if (isOpen && el.computedStyleMap().get('display')?.toString() === 'none') {
      el.style.display = 'initial';
      const rect = ref.getBoundingClientRect();
      el.style.left = rect.left + (ref.offsetWidth / 2) + 'px';
      el.style.top = rect.top + (ref.offsetHeight / 2) + 'px';
    }
  }, [actuator, isOpen]);

  function handleClose() {
    setInternalIsOpen(false);
    onClose?.();
    actuator.current?.focus();
    el.style.display = 'none';
  }

  return isOpen && (
    <ActionMenu
      actuator={elRef}
      initialHighlightIndex={initialHighlightIndex}
      floating={true}
      align={align}
      margin={0}
      open={isOpen}
      onClose={handleClose}
    >
      {children}
    </ActionMenu>
  )
}

ContextMenu.Item = DropdownList.Item;
ContextMenu.Divider = DropdownList.Divider;