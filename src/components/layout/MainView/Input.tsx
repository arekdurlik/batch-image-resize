import styled from 'styled-components'
import { DropZone } from './DropZone'
import { SectionHeader, SectionTitle } from '../../styled/globals'
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
background: ${props => `linear-gradient(to top, ${props.theme.backgroundTransparent}, ${props.theme.background} 85%)`};
backdrop-filter: blur(15px);
width: 100%;
`
const Wrapper = styled.div`
overflow-y: scroll;
position: relative;
height: calc(100%);
padding-top: 40px;
`