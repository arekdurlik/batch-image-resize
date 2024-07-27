import { ImageList } from './ImageList'
import { SectionHeader, SectionTitle } from '../styled/globals'
import styled from 'styled-components'

export function Output() {
  return (
    <>
      <FixedTitle>
        <SectionHeader>
          <SectionTitle>Output</SectionTitle>
        </SectionHeader>
      </FixedTitle>
      <Wrapper>
        <ImageList type='output'/>
      </Wrapper>
    </>
  )
}

const FixedTitle = styled.div`
position: absolute;
z-index: 3;
background-color: ${props => props.theme.background};
width: 100%;
`
const Wrapper = styled.div`
overflow-y: scroll;
height: calc(100% - 40px);
margin-top: 40px;
`