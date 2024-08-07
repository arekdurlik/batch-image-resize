import styled from 'styled-components'
import { DropZone } from './DropZone'
import { ImageList } from './ImageList'
import { SectionHeader, SectionTitle } from '../../styled'
import { useMemo } from 'react'
import { removeFileExtension } from '../../../lib/helpers'
import { useInputImages } from '../../../store/inputImages'
import { SECTION_HEADER_HEIGHT } from '../../../lib/constants'

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

export function InputImageList() {
  const images = useInputImages(state => state.images);
  useInputImages(state => state.totalSize); // reload images

  const sortedImages = useMemo(() => (
    images.sort((a, b) => collator.compare(removeFileExtension(a.filename), removeFileExtension(b.filename)))
  ), [images]);

  return (
    <Wrapper>
      <FixedTitle>
        <SectionHeader>
          <SectionTitle>Input images</SectionTitle>
        </SectionHeader>
      </FixedTitle>
      <ImageListWrapper>
        <ImageList type='input' images={sortedImages} />
        {sortedImages.length === 0 && <DropZone/>}
      </ImageListWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
position: relative;
display: flex;
flex-direction: column;
height: 100%;
`

const FixedTitle = styled.div`
`

const ImageListWrapper = styled.div`
position: relative;
height: calc(100% - ${SECTION_HEADER_HEIGHT}px);
`