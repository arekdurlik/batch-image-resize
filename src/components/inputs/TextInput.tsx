import { ChangeEventHandler } from 'react'
import styled from 'styled-components'
import { outline } from '../../styles/mixins/outline'

type Props = {
  label?: string
  value: string | number
  onChange?: ChangeEventHandler<HTMLInputElement>
  onBlur?: ChangeEventHandler<HTMLInputElement>
}
export function TextInput({ label, value, onChange, onBlur }: Props) {


  return <Container>
    {label &&<Label htmlFor={label}>{label}</Label>}
    <Input
      name={label}
      type='text'
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    >
  </Input>
  </Container>
}

const Container = styled.div`
display: flex;
flex-direction: column;
margin-top: 5px;
margin-bottom: 5px;
`

const Label = styled.label`
font-weight: 500;
`

const Input = styled.input`
${outline}

font-weight: 400;
background-color: var(--button-default-bgColor-rest);
border: 1px solid var(--borderColor-default);
border-radius: var(--borderRadius-default);
padding: 3px 6px;
width: 100%;
min-height: 30px;
transition: border-color var(--transition-default);

`