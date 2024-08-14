import { useApp } from '../../../store/app'
import { useInputImages } from '../../../store/inputImages'
import { useOutputImages } from '../../../store/outputImages'
import { InputImageDetails } from './InputImageDetails'
import { OutputImageDetails } from './OutputImageDetails'
import { BackgroundImage, Image, ImageWrapper } from './styled'

export function ActiveItem() {
  const inputImages = useInputImages(state => state.images);
  const outputImages = useOutputImages(state => state.images);
  const latestSelectedItem = useApp(state => state.latestSelectedItem);
  const activeInputImage = inputImages?.find(img => img.id === latestSelectedItem?.id);
  const activeOutputImage = outputImages?.find(img => img.id === latestSelectedItem?.id);
  const [src, thumbnailSrc] = activeInputImage 
  ? [
    URL.createObjectURL(activeInputImage.image.full), 
    URL.createObjectURL(activeInputImage.image.thumbnail)
  ] : activeOutputImage 
  ? [
    URL.createObjectURL(activeOutputImage.image.full), 
    URL.createObjectURL(activeOutputImage.image.thumbnail)
  ] : [undefined, undefined];

  return (
    <>
      {latestSelectedItem && <ImageWrapper>
          <Image src={src}></Image>
          <BackgroundImage src={thumbnailSrc}></BackgroundImage>
      </ImageWrapper>}
      {activeInputImage ? <InputImageDetails image={activeInputImage}/>
      : activeOutputImage ? <OutputImageDetails image={activeOutputImage}/>
      : null}
    </>
  )
}



