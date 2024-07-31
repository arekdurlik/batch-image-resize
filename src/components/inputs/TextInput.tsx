import { ChangeEventHandler } from 'react'
import styled from 'styled-components'

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
font-weight: 400;
background-color: ${props => props.theme.inputBackground};
border: 1px solid ${props => props.theme.border};
border-radius: ${props => props.theme.borderRadius};
padding: 3px 6px;
width: 100%;
min-height: 30px;
transition: border-color 150ms;

&:focus {
  border-color: ${props => props.theme.blue};
  box-shadow: 
    inset 1px 1px ${props => props.theme.blue}, 
    inset 1px -1px ${props => props.theme.blue}, 
    inset -1px -1px ${props => props.theme.blue}, 
    inset -1px 1px ${props => props.theme.blue};
}
`