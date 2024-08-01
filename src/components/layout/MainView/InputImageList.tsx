import styled from 'styled-components'
import { DropZone } from './DropZone'
import { useAppStore } from '../../../store/appStore'
import { ImageList } from './ImageList'
import { SectionHeader, SectionTitle } from '../../styled'
import { useMemo } from 'react'

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

export function InputImageList() {
  const images = useAppStore(state => state.inputImages);
  useAppStore(state => state.totalInputImagesSize); // reload images

  const sortedImages = useMemo(() => (
    images.sort((a, b) => collator.compare(a.filename, b.filename))
  ), [images]);

  return (
    <Wrapper>
      <FixedTitle>
        <SectionHeader>
          <SectionTitle>Input images</SectionTitle>
        </SectionHeader>
      </FixedTitle>
      <ImageListWrapper>
        <ImageList images={sortedImages}/>
        <DropZone/>
      </ImageListWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
flex: 1;
display: flex;
flex-direction: column;
height: 100%;
`

const FixedTitle = styled.div`
width: 100%;
`
const ImageListWrapper = styled.div`
position: relative;
overflow-y: scroll;
height: 100%;
`