import { ReactNode, RefObject, useEffect, useState } from 'react'
import { DropdownList } from './dropdown-list'
import { Alignment } from './dropdown-list/types'

type Props = {
  actuator: RefObject<HTMLElement>
  children: ReactNode
  initialHighlightIndex?: number
  align?: Alignment
};

export function ActionMenu({ actuator, initialHighlightIndex, align, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  function handleClose() {
    setIsOpen(false);
    actuator.current?.focus();
  }

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      switch(event.key) {
        case 'Enter':
        case ' ':
          toggleOpened();
          break;
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          !isOpen && setIsOpen(true);
      }
    }

    function handleBlur(event: FocusEvent) {
      if (!isOpen && event.relatedTarget) {
        setIsOpen(false);
      }
    }

    function toggleOpened() {
      setIsOpen(prev => !prev);
    }

    if (actuator.current) {
      const act = actuator.current;
      act.addEventListener('keydown', handleKey);
      act.addEventListener('blur', handleBlur);
      act.addEventListener('click', toggleOpened)
      return () => {
        act.removeEventListener('keydown', handleKey);
        act.removeEventListener('blur', handleBlur);
        act.removeEventListener('click', toggleOpened)
      }
    }
  }, [actuator, isOpen]);

  return isOpen && (
    <DropdownList
      actuator={actuator}
      open={isOpen}
      initialHighlightIndex={initialHighlightIndex}
      onClose={handleClose}
      align={align}
      slideIn
    >
      {children}
    </DropdownList>
  )
}

ActionMenu.Item = DropdownList.Item;
ActionMenu.Divider = DropdownList.Divider;