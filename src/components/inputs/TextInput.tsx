import { ChangeEventHandler, CSSProperties, ReactNode } from 'react'
import styled from 'styled-components'
import { outline } from '../../styles/mixins/outline'

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

  return (
    <Wrapper style={style}>
      {label && <Label htmlFor={label}>{label}</Label>}
      <InputContainer>
        {prefix && <Icon>{prefix}</Icon>}
        <Input
          name={label}
          type='text'
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
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

const InputContainer = styled.div`
${outline}
background-color: var(--button-default-bgColor-rest);
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