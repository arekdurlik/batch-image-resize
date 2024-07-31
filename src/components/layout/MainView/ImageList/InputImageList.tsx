import { useAppStore } from '../../../../store/appStore'
import { Grid, Image, ImageWrapper, Item, Title } from './styled'

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

export function InputImageList() {
  const { inputImages } = useAppStore();

  return (
    <Grid>
      {inputImages
        .sort((a, b) => collator.compare(a.filename, b.filename))
        .map((inputImage, i) => {
          return (
            <Item key={i}>
              <ImageWrapper>
                <Image src={URL.createObjectURL(inputImage.image.thumbnail)}/>
              </ImageWrapper>
              <Title>{inputImage.filename}</Title>
            </Item>
          )
      })}
    </Grid>
  )
}

