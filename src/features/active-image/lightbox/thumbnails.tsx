import styled from 'styled-components'

export function Thumbnails() {
  return <Wrapper>
    <Item>
    </Item>
    <Item>
    </Item>
  </Wrapper>
}

const Wrapper = styled.div`
display: flex;
gap: 5px;
`

const Item = styled.div`
height: 100px;
width: 100px;
border-radius: var(--borderRadius-default);
border: 1px solid var(--bgColor-muted);
`