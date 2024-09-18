import { ReactNode, RefObject, useEffect, useState } from 'react'
import { DropdownList } from './dropdown-list'
import { Alignment } from './dropdown-list/types'

type Props = {
  actuator: RefObject<HTMLElement>
  children: ReactNode
  open?: boolean
  initialHighlightIndex?: number
  floating?: boolean
  align?: Alignment
  margin?: number
  slideIn?: boolean
  disabled?: boolean
  onOpen?: () => void
  onClose?: () => void
};

export function ActionMenu({ 
  actuator, 
  open, 
  initialHighlightIndex, 
  floating, 
  align, 
  margin,
  slideIn = true, 
  disabled,
  onOpen,
  onClose, 
  children 
}: Props) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalIsOpen;

  function handleClose() {
    setInternalIsOpen(false);
    actuator.current?.focus();
    onClose?.();
  }

  useEffect(() => {
    if (isOpen) {
      onOpen?.();
    } else {
      onClose?.();
    }
  }, [isOpen, onClose, onOpen]);

  useEffect(() => {
    if (disabled) return;
    
    function handleKey(event: KeyboardEvent) {
      switch(event.key) {
        case 'Enter':
        case ' ':
          if (!isOpen) setInternalIsOpen(true);
          break;
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          !isOpen && setInternalIsOpen(true);
      }
    }

    function handleBlur(event: FocusEvent) {
      if (!isOpen && event.relatedTarget) {
        setInternalIsOpen(false);
      }
    }
    
    function toggleOpened() {
      setInternalIsOpen(prev => !prev);
    }

    function handleMouseDown() {
      document.addEventListener('mouseup', toggleOpened);
    }

    if (actuator.current) {
      const act = actuator.current;
      act.addEventListener('keydown', handleKey);
      act.addEventListener('blur', handleBlur);
      act.addEventListener('mousedown', handleMouseDown)
      return () => {
        act.removeEventListener('keydown', handleKey);
        act.removeEventListener('blur', handleBlur);
        act.removeEventListener('mousedown', handleMouseDown)
        document.removeEventListener('mouseup', toggleOpened);
      }
    }
  }, [actuator, disabled, isOpen]);

  return isOpen && (
    <DropdownList
      actuator={actuator}
      initialHighlightIndex={initialHighlightIndex}
      onClose={handleClose}
      floating={floating}
      align={align}
      margin={margin}
      slideIn={slideIn}
    >
      {children}
    </DropdownList>
  )
}

ActionMenu.Item = DropdownList.Item;
ActionMenu.Divider = DropdownList.Divider;