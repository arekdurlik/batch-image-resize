import { CSSProperties } from 'react'
import styled from 'styled-components'

export function Grid({ style }: { style: CSSProperties}) {
  return (
    <Container style={style}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </Container>
  )
}

const Container = styled.div`
position: absolute;
inset: -1px;
z-index: 123;
display: grid;
align-self: center;
grid-template-columns: repeat(3, 1fr);
grid-template-rows: repeat(3, 1fr);
grid-gap: 1px;
box-sizing: border-box;
pointer-events: none;
box-shadow: inset 0 0 0 1px var(--borderColor-default);
padding: 1px;
opacity: 1;

div {
  box-shadow: 0 0 0 1px var(--borderColor-default);
}
`