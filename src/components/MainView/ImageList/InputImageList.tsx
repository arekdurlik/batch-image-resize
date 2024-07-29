import { useAppStore } from '../../../store/appStore'
import { compare } from '../../../helpers'
import { Grid, Image, ImageWrapper, Item, Title } from './styled'

export function InputImageList() {
  const { inputImages } = useAppStore();

  return (
    <Grid>
      {inputImages.sort((a, b) => compare(a.filename, b.filename)).map((inputImage, i) => {
        return <Item key={i}>
          <ImageWrapper>
            <Image src={URL.createObjectURL(inputImage.image.thumbnail)}/>
          </ImageWrapper>
          <Title>{inputImage.filename}</Title>
        </Item>
      })}
    </Grid>
  )
}

