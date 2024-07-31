import { useEffect, useMemo, useRef, useState } from 'react'
import { MdOutlineChevronRight } from 'react-icons/md'
import styled from 'styled-components'

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

  const currentLabel = useMemo(() => options.find(o => o.value === value)?.label, [value]);
  const ref = useRef<HTMLDivElement>(null!);

  return (
    <>
      <Select
        ref={ref}
        onClick={() => setIsOpen(prev => !prev)} onBlur={() => { setIsOpen(false); ref.current.blur() }}
      >
        <SelectedOption>{currentLabel}</SelectedOption>
        <Chevron/>
        {isOpen && (
          <Options $rightAligned={rightAligned}>
            {options.map(option => (
              <Option 
                key={option.label + option.value}
                $selected={option.value === value}
                onClick={e => {
                  e.stopPropagation();
                  onChange(option.value);
                  setIsOpen(false);
                  ref.current.blur() 
                }}
              >
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
position: relative;
font-weight: 400;
background-color: ${props => props.theme.inputBackground};
border: 1px solid ${props => props.theme.border};
border-radius: ${props => props.theme.borderRadius};
padding: 3px 6px;
display: flex;
min-height: 30px;
min-width: 100px;
gap: 5px;
align-items: center;
justify-content: flex-end;
transition: border-color 150ms;

&:hover {
  background-color: ${props => props.theme.inputBackgroundHover};
  cursor: pointer;
}
&:focus {
  border-color: ${props => props.theme.blue};
  box-shadow: 
    inset 1px 1px ${props => props.theme.blue}, 
    inset 1px -1px ${props => props.theme.blue}, 
    inset -1px -1px ${props => props.theme.blue}, 
    inset -1px 1px ${props => props.theme.blue};
}
`

const Chevron = styled(MdOutlineChevronRight)`
rotate: 90deg;
`

const SelectedOption = styled.span`
font-weight: 500;
flex-grow: 1;
text-align: center;
`

const Options = styled.ul<{ $rightAligned: boolean }>`
list-style: none;
position: absolute;
top: calc(100% - 1px);
min-width: 100%;
width: max-content;
overflow: hidden;

${props => props.$rightAligned ? 'right: 0' : 'left: 0'};
background-color: ${props => props.theme.background};
border: 1px solid ${props => props.theme.border};
`

const Option = styled.li<{ $selected: boolean }>`
padding: 5px 10px;
cursor: pointer;
transition: 150ms;

${props => props.$selected && `
background-color: ${props.theme.inputBackgroundHover};
`}

&:hover {
  background-color: ${props => props.theme.blue};
  color: #fff;
}
`