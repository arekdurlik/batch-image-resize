import styled from 'styled-components'
import { useAppStore } from '../../store/appStore'

function compare(a: string, b: string) {
  if ( a < b ) { return -1; }
  if ( a > b ) { return 1; }
  return 0;
}

function compareTwo(a: string, b: string, c: string, d: string) {
  if ( a < b || c < d ) { return -1; }
  if ( a > b || c > d ) { return 1; }
  return 0;
}

export function ImageList({ type }: { type: 'input' | 'output' }) {
  const { inputImages, outputImages } = useAppStore();

  return <Grid>
  {type === 'input' && inputImages.sort((a, b) => compare(a.filename, b.filename)).map((inputImage, i) => {
    return <Item key={i}>
      <ImageWrapper>
        <Image src={URL.createObjectURL(inputImage.image.thumbnail)}/>
      </ImageWrapper>
      <Title>{inputImage.filename}</Title>
    </Item>
  })}
  {type === 'output' && outputImages.sort((a, b) => compareTwo(a.inputImageFilename, b.inputImageFilename, a.filename.value, b.filename.value)).map((outputImage, i) => {
    return <Item key={i}>
      <ImageWrapper>
        <Image src={URL.createObjectURL(outputImage.image.thumbnail)}/>
      </ImageWrapper>
      <Title>{outputImage.filename.value}</Title>
    </Item>
  })}
  </Grid>
}

const Grid = styled.div`
display: grid;
grid-template-columns: repeat(10, 1fr);
gap: 5px 10px;
padding: 20px;

@media (max-width: 1800px) {
  grid-template-columns: repeat(9, 1fr);
}

@media (max-width: 1600px) {
  grid-template-columns: repeat(8, 1fr);
}

@media (max-width: 1450px) {
  grid-template-columns: repeat(7, 1fr);
}

@media (max-width: 1350px) {
  grid-template-columns: repeat(6, 1fr);
}

@media (max-width: 1250px) {
  grid-template-columns: repeat(5, 1fr);
}

@media (max-width: 1000px) {
  grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 850px) {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 700px) {
  grid-template-columns: repeat(2, 1fr);
}
`

const Item = styled.div`
position: relative;
display: flex;
flex-direction: column;
align-items: center;
height: fit-content;
user-select: initial;
padding: 4px;

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: 5px;
    background-color:#35aeff;
    opacity: 0;
    transition: 50ms;
  }

  &:hover {
    &::before {
      opacity: 0.2;
    }
  }

  &:active {
    &::before {
      opacity: 0.4;
    }
  }
`

const ImageWrapper = styled.div`
height: 100px;
display: flex;
flex-direction: column;
justify-content: flex-end;
user-select: none;
`
const Image = styled.img`
max-height: 100px;
border-radius: 5px;
z-index: 2;
overflow-clip-margin: none;
`

const Title = styled.span`
max-width: 110px;
line-break: anywhere;
text-align: center;
user-select: none;
z-index: 2;
`