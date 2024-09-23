import { ReactNode } from 'react'
import styled from 'styled-components'

export function Setting({ label, unit, noUnitSpace, children }: { label?: string, unit?: string, noUnitSpace?: boolean, children: ReactNode }) {
  return <Wrapper>
    {label && <Label>{label}:</Label>}
    {children}
    {!noUnitSpace && <Unit>{unit}</Unit>}
  </Wrapper>
}

const Wrapper = styled.div`
display: flex;
justify-content: flex-end;
align-items: center;
gap: 5px;
width: 100%;
`

const Label = styled.span`
cursor: default;
position: relative;
bottom: 2px;
font-weight: 500;
`

const Unit = styled.span`
width: 100%;
max-width: 12px;
cursor: default;
`