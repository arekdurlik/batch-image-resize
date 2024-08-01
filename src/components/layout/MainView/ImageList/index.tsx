import { Grid, Image, ImageWrapper, Item, Title } from './styled'
import { ImageData } from '../../../../store/types'
import { bytesToSizeFormatted } from '../../../../lib/helpers'
import { SortType } from './types'

type Props = { 
  images: ImageData[], 
  sortBy?: SortType, 
};

export function ImageList ({ images, sortBy = SortType.FILENAME }: Props) {

  return (
    <Grid>
      {images.map(image => (
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

