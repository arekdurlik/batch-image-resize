import { ChangeEventHandler, CSSProperties } from 'react'
import styled from 'styled-components'

type Props = {
  label?: string
  checked: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
  style?: CSSProperties
}
export function Checkbox({ label, checked, onChange, style }: Props) {

  return <Container style={style}>
    <input
      name={label}
      type='checkbox'
      checked={checked}
      onChange={onChange}
    />
    {label &&<Label htmlFor={label}>{label}</Label>}
  </Container>
}

const Container = styled.div`
display: flex;
align-items: center;
gap: 7px;
font-weight: 500;
`

const Label = styled.label`
font-weight: 500;
`