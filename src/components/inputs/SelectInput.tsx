import { useEffect, useMemo, useRef, useState } from 'react'
import { GoTriangleDown } from 'react-icons/go'
import { MdCheck } from 'react-icons/md'
import styled from 'styled-components'
import { outline } from '../../styles/mixins/outline'

type Props = {
  label?: string
  value: string | number
  options: {
    label: string
    value: string | number
  }[]
  rightAligned?: boolean
  onChange: (value: string | number) => void
}
export function SelectInput({ value, options, rightAligned = false, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const currentLabel = useMemo(() => options.find(o => o.value === value)?.label, [value]);
  const ref = useRef<HTMLDivElement>(null!);

  useEffect(() => {
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

    ref.current.addEventListener('keydown', handler);

    return () => ref.current.removeEventListener('keydown', handler)
  }, [isOpen, highlightedIndex, options, onChange])

  return (
    <>
      <Select
        ref={ref}
        onClick={() => setIsOpen(prev => !prev)} onBlur={() => { setIsOpen(false); ref.current.blur() }}
        tabIndex={0}
      >
        <SelectedOption>{currentLabel}</SelectedOption>
        <Triangle/>
        {isOpen && (
          <Options $rightAligned={rightAligned}>
            {options.map((option, i) => (
              <Option 
                key={option.label + option.value}
                $highlighted={i === highlightedIndex}
                onClick={e => {
                  e.stopPropagation();
                  onChange(option.value);
                  setIsOpen(false);
                  ref.current.blur() 
                }}
              > 
                <Check $visible={option.value === value}/>
                {option.label}
              </Option>
            ))}
          </Options>
        )}
      </Select>
    </>
  )
}

const Select = styled.div`
${outline}

position: relative;
font-weight: 400;
background-color: var(--button-default-bgColor-rest);
border: 1px solid var(--borderColor-default);
border-radius: var(--borderRadius-default);
padding: 3px 6px;
display: flex;
min-height: 30px;
min-width: 100px;
gap: 5px;
align-items: center;
justify-content: flex-end;
transition: border-color 150ms;

&:hover {
  background-color: var(--button-default-bgColor-hover);
  cursor: pointer;
}
`


const SelectedOption = styled.span`
font-weight: 500;
flex-grow: 1;
text-align: center;
`

const Triangle = styled(GoTriangleDown)`
position: relative;
top: 1px;
`

const Options = styled.ul<{ $rightAligned: boolean }>`
list-style: none;
position: absolute;
top: calc(100% + 4px);
min-width: max-content;
width: 100%;
overflow: hidden;
padding: 5px;
border-radius: var(--borderRadius-default);
box-shadow: 0px 3px 6px 0px #424a531f;

@keyframes fade-in {
  from  {
    top: calc(100% - 4px);
    opacity: 0;
  }
  to {
    top: calc(100% + 4px);
    opacity: 1;
  }
}

animation-name: fade-in;
animation-duration: 150ms;

${props => props.$rightAligned ? 'right: 0' : 'left: 0'};
background-color: var(--bgColor-default);
border: 1px solid var(--borderRadius-default);
`

const Check = styled(MdCheck)<{ $visible: boolean }>`
  opacity: ${props => props.$visible ? 1 : 0};
`
const Option = styled.li<{ $highlighted: boolean }>`
display: flex;
align-items: center;
gap: 5px;
padding: 5.5px 10px;
cursor: pointer;
transition: var(--transition-default);
border-radius: var(--borderRadius-default);

&:hover {
  background-color: var(--button-default-bgColor-rest);
}

${props => props.$highlighted && outline};
`