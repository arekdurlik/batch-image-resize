import { MouseEvent as ReactMouseEvent, useEffect, useMemo, useRef, useState } from 'react'
import { Option as OptionType, Placement, Props } from './types'
import { Check, Option, Options, Select, SelectedOption, Triangle } from './styled'

export function SelectInput({ value, options, rightAligned = false, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [placement, setPlacement] = useState(Placement.BOTTOM);
  
  const ref = useRef<HTMLDivElement>(null!);
  const optionsContainerRef = useRef<HTMLUListElement>(null);

  const optionsRefMap = useMemo(() => new Map(), []);
  const currentLabel = options.find(o => o.value === value)?.label;

  // pointer down with useCapture, otherwise clicking on panel resizer doesn't close dropdown
  useEffect(() => {
    function handler(e: MouseEvent) {
      const clickedOnOption = [...optionsRefMap.values()].some(i => i === e.target);
      const clickedOnButton = e.target === ref.current;
      const clickedOnOptions = e.target === optionsContainerRef.current;

      if (!clickedOnButton && !clickedOnOption && !clickedOnOptions) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('pointerdown', handler, true);
      return () => document.removeEventListener('pointerdown', handler, true);
    }
  }, [isOpen, optionsRefMap]);

  // set list placement based on screen bounds
  useEffect(() => {
    const options = optionsContainerRef.current;
    if (!options) return;

    if (isOpen) {
      const { bottom } = options.getBoundingClientRect();
      
      if (bottom > window.innerHeight) {
        setPlacement(Placement.TOP)
      } else {
        setPlacement(Placement.BOTTOM);
      }
    }
  }, [isOpen]);

  // keyboard navigation
  useEffect(() => {
    const currentRef = ref.current;

    function handler(e: KeyboardEvent) {
      if (e.target !== ref.current) return;

      switch (e.code) {
        case 'Enter':
        case 'Space':
          setIsOpen(prev => !prev);
          if (isOpen) {
            onChange(options[highlightedIndex].value);
          }
          break;
        case 'ArrowUp':
        case 'ArrowDown': {
          if (!isOpen) {
            setIsOpen(true);
            break;
          }

          const newValue = highlightedIndex + (e.code === 'ArrowDown' ? 1 : -1);

          if (newValue >= 0 && newValue < options.length) {
            setHighlightedIndex(newValue);
          }
        }
      }
    }

    currentRef.addEventListener('keydown', handler);
    return () => currentRef.removeEventListener('keydown', handler);

  }, [isOpen, highlightedIndex, options, onChange]);

  function handleOpen() {
    setIsOpen(prev => !prev);
    setPlacement(Placement.BOTTOM); // default placement
  }

  function handleSelect(option: OptionType) {
    return function(event: ReactMouseEvent) {
      event.stopPropagation();
      onChange(option.value);
      setIsOpen(false);
      ref.current?.blur();
    }
  }

  return (
    <Select
      ref={ref}
      tabIndex={0}
      onClick={handleOpen} 
      onBlur={() => { setIsOpen(false); ref.current.blur() }}
    >
      <SelectedOption>{currentLabel}</SelectedOption>
      <Triangle/>
      {isOpen && (
        <Options 
          ref={optionsContainerRef} 
          $rightAligned={rightAligned} 
          $placement={placement}
        >
          {options.map((option, i) => (
            <Option 
              ref={node => node && optionsRefMap.set(i, node)}
              key={option.label + option.value}
              onClick={handleSelect(option)}
              $highlighted={i === highlightedIndex}
            > 
              <Check $visible={option.value === value}/>
              {option.label}
            </Option>
          ))}
        </Options>
      )}
    </Select>
  )
}