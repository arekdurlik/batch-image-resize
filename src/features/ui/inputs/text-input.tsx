import { ReactNode, ChangeEventHandler, CSSProperties, useState, ChangeEvent } from 'react'
import styled from 'styled-components'
import { outlineRest, outlineActive } from '../../../styles/mixins'

type Props = {
  label?: string
  value: string | number
  placeholder?: string
  prefix?: ReactNode
  suffix?: ReactNode
  spellCheck?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
  onBlur?: ChangeEventHandler<HTMLInputElement>
  style?: CSSProperties
};

export function TextInput({ label, value, placeholder, prefix, suffix, spellCheck = false, onChange, onBlur, style }: Props) {
  const [isFocused, setIsFocused] = useState(false);

  function handleBlur(event: ChangeEvent<HTMLInputElement>) {
    setIsFocused(false);
    onBlur?.(event);
  }

  return (
    <Wrapper style={style}>
      {label && <Label htmlFor={label}>{label}</Label>}
      <InputContainer $focused={isFocused}>
        {prefix && <Icon>{prefix}</Icon>}
        <Input
          name={label}
          type='text'
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          spellCheck={spellCheck}
          >
        </Input>
        {suffix && <Icon>{suffix}</Icon>}
      </InputContainer>
    </Wrapper>
  )
}

const Wrapper = styled.div`
position: relative;
display: flex;
flex-direction: column;
justify-content: center;
margin-top: 5px;
margin-bottom: 5px;
white-space: nowrap;
width: min-content;
min-width: 90px;
`

const Label = styled.label`
font-weight: 500;
`

const InputContainer = styled.div<{ $focused: boolean }>`
${outlineRest}
${props => props.$focused && outlineActive}
background-color: var(--control-default-bgColor-rest);
border: 1px solid var(--borderColor-default);
border-radius: var(--borderRadius-default);
transition: border-color var(--transition-default);
overflow: hidden;
padding: 0 6px;

display: flex;
align-items: center;
gap: 4px;
`

const Input = styled.input`
font-weight: 400;
width: 100%;
min-height: 30px;
outline: none;
border: none;
background-color: transparent;
`

const Icon = styled.div`
font-size: 16px;
min-width: 16px;
color: var(--fgColor-icon);

span {
  color: var(--fgColor-icon);
}

svg {
  fill: var(--fgColor-icon);
}
`