import { compareTwo } from '../../../helpers'
import { useAppStore } from '../../../store/appStore'
import { Grid, Image, ImageWrapper, Item, Title } from './styled'

export function OutputImageList() {
  const { outputImages } = useAppStore();

  return <Grid>
  {outputImages.sort((a, b) => compareTwo(a.inputImageFilename, b.inputImageFilename, a.filename.value, b.filename.value)).map((outputImage, i) => {
    return <Item key={i}>
      <ImageWrapper>
        <Image src={URL.createObjectURL(outputImage.image.thumbnail)}/>
      </ImageWrapper>
      <Title>{outputImage.filename.value}</Title>
    </Item>
  })}
  </Grid>
}
