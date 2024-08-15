import { DropZone } from './drop-zone'
import { SectionHeader, SectionTitle } from '../../layout/styled'
import { useMemo } from 'react'
import { removeFileExtension } from '../../../lib/helpers'
import { useInputImages } from '../../../store/input-images'
import { ProgressBar } from '../../ui/progress-bar'
import { ImageListWrapper, ProgressBarWrapper, Wrapper } from '../styled'
import { ImageList } from '../image-list'

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

export function InputImages() {
  const images = useInputImages(state => state.images);
  const progress = useInputImages(state => state.progress);

  const sortedImages = useMemo(() => (
    images.sort((a, b) => collator.compare(removeFileExtension(a.filename), removeFileExtension(b.filename)))
  ), [images]);

  return (
    <Wrapper>
      <SectionHeader>
        <SectionTitle>Input images</SectionTitle>
      </SectionHeader>
      <ImageListWrapper>
        <ProgressBarWrapper>
          <ProgressBar value={progress.processedItems} max={progress.totalItems}/>
        </ProgressBarWrapper>
        <ImageList type='input' images={sortedImages} />
        {sortedImages.length === 0 && <DropZone/>}
      </ImageListWrapper>
    </Wrapper>
  )
}





