import styled from 'styled-components'
import { DropZone } from './DropZone'
import { SectionHeader, SectionTitle } from '../styled/globals'
import { InputImageList } from './ImageList/InputImageList'

export function Input() {
  return (
    <>
      <FixedTitle>
        <SectionHeader>
          <SectionTitle>Input</SectionTitle>
        </SectionHeader>
      </FixedTitle>
      <Wrapper>
        <InputImageList/>
        <DropZone/>
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
position: relative;
height: calc(100% - 40px);
margin-top: 40px;
`