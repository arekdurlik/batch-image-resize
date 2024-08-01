import styled from 'styled-components'
import { DropZone } from './DropZone'
import { SectionHeader, SectionTitle } from '../../styled/globals'
import { useAppStore } from '../../../store/appStore'
import { ImageList } from './ImageList'

export function InputImageList() {
  const images = useAppStore(state => state.inputImages);
  useAppStore(state => state.totalInputImagesSize); // reload images

  return (
    <>
      <FixedTitle>
        <SectionHeader>
          <SectionTitle>Input images</SectionTitle>
        </SectionHeader>
      </FixedTitle>
      <Wrapper>
        <ImageList images={images}/>
        <DropZone/>
      </Wrapper>
    </>
  )
}

const FixedTitle = styled.div`
position: absolute;
z-index: 3;
background: linear-gradient(to top, var(--bgColor-default-transparent), var(--bgColor-default) 85%);
width: 100%;
`
const Wrapper = styled.div`
overflow-y: scroll;
position: relative;
height: calc(100% - 50px);
margin-top: 50px;
`