import { useCallback } from 'react'
import { Grid, Image, ImageWrapper, Item, Title } from './styled'
import { ImageData } from '../../../../store/types'
import { bytesToSizeFormatted, compare } from '../../../../helpers'
import { SortDirection, SortType } from './types'

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

type Props = { 
  images: ImageData[], 
  sortBy?: SortType, 
  sortDir?: SortDirection
};

export function ImageList({ images, sortBy = SortType.FILENAME, sortDir = SortDirection.ASC }: Props) {
  
  const getSortingMethod = useCallback((a: ImageData, b: ImageData) => {
    switch(sortBy) {
      case SortType.FILESIZE:
        return sortDir === SortDirection.ASC 
        ? compare(a.image.full.size, b.image.full.size)
        : compare(b.image.full.size, a.image.full.size);
      default:
        return sortDir === SortDirection.ASC 
          ? collator.compare(a.filename, b.filename)
          : collator.compare(b.filename, a.filename);
    }
  }, [sortBy, sortDir]);

  return (
    <Grid>
      {images
        .sort(getSortingMethod)
        .map(image=> (
          <Item key={image.id}>
            <ImageWrapper>
              <Image src={URL.createObjectURL(image.image.thumbnail)}/>
            </ImageWrapper>
            <Title>
              {sortBy === SortType.FILESIZE 
                ? bytesToSizeFormatted(image.image.full.size)
                : image.filename
              }
            </Title>
          </Item>
        ))}
    </Grid>
  )
}

