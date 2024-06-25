import { ChangeEventHandler } from 'react'
import styled from 'styled-components'

type Props = {
  label?: string
  value: string | number
  onChange: ChangeEventHandler<HTMLInputElement>
}
export function TextInput({ label, value, onChange }: Props) {


  return <Container>
    {label &&<Label htmlFor={label}>{label}:</Label>}
    <Input
      name={label}
      type='text'
      value={value}
      onChange={onChange}
    >
  </Input>
  </Container>
}

const Container = styled.div`

`

const Label = styled.label`

`
const Input = styled.input`
font-weight: 400;
  border: 1px solid ${props => props.theme.border};
  border-radius: 0.25rem;
  padding: 2px 6px;
  width: 100%;
  max-width: 200px;
`