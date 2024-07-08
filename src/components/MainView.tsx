import styled from 'styled-components'
import { DropZone } from './DropZone'
import { ImageList } from './ImageList'

export function MainView() {

  return <Wrapper>
    <ImageList/>
    <DropZone/>
  </Wrapper>
}

const Wrapper = styled.div`
position: relative;
width: 100%;
margin-top: 40px;
display: flex;
flex-direction: column;
`