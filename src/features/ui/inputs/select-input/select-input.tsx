import { useRef } from 'react'
import { Props } from './types'
import { Select, SelectedOption, Triangle } from './styled'
import { ActionMenu } from '../../action-menu'

export function SelectInput({ value, options, align, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null!);
  const currentLabel = options.find(o => o.value === value)?.label;

  function handleSelect(value: string | number) {
    return () => {
      onChange(value);
    }
  }

  return (
    <>
      <Select
        ref={ref}
        tabIndex={0}
      >
        <SelectedOption>{currentLabel}</SelectedOption>
        <Triangle/>
      </Select>
      <ActionMenu 
        actuator={ref} 
        initialHighlightIndex={options.findIndex(opt => opt.value === value) ?? 0}
        align={align} 
      >
        {options.map(option => (
          <ActionMenu.Item
          key={option.label + option.value}
          label={option.label}
          active={option.value === value}
          onClick={handleSelect(option.value)}
          />
        ))}
      </ActionMenu>
    </>
  )
}