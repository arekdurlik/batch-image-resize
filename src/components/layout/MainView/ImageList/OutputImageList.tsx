import { bytesToSizeFormatted, compare, compareTwo } from '../../../../helpers'
import { useAppStore } from '../../../../store/appStore'
import { OutputImageData } from '../../../../store/types'
import { Grid, Image, ImageWrapper, Item, Title } from './styled'

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

export function OutputImageList({ sortBy, sortDir }: { sortBy: string, sortDir: 'asc' | 'desc' }) {
  const { outputImages } = useAppStore();
  function getSortingMethod(a: OutputImageData, b: OutputImageData) {
    switch(sortBy) {
      case 'size':
        return sortDir === 'asc' 
        ? compare(a.image.full.size, b.image.full.size)
        : compare(b.image.full.size, a.image.full.size)
      default:
        return sortDir === 'asc'
          ? collator.compare(a.filename.value, b.filename.value)
          : collator.compare(b.filename.value, a.filename.value)
    }
  } 

  return <Grid>
  {outputImages.sort(getSortingMethod).map((outputImage, i) => {
    return <Item key={i}>
      <ImageWrapper>
        <Image src={URL.createObjectURL(outputImage.image.thumbnail)}/>
      </ImageWrapper>
      <Title>
        {sortBy === 'size' ? bytesToSizeFormatted(outputImage.image.full.size) : outputImage.filename.value }
      </Title>
    </Item>
  })}
  </Grid>
}
