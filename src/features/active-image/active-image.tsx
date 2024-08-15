import { useApp } from '../../store/app'
import { useInputImages } from '../../store/input-images'
import { useOutputImages } from '../../store/output-images'
import { InputImageDetails } from './input-image-details'
import { OutputImageDetails } from './output-image-details'
import { PreviewPicture } from './preview-picture'

export function ActiveImage() {
  const inputImages = useInputImages(state => state.images);
  const outputImages = useOutputImages(state => state.images);
  const latestSelectedItem = useApp(state => state.latestSelectedItem);
  const activeInputImage = inputImages?.find(img => img.id === latestSelectedItem?.id);
  const activeOutputImage = outputImages?.find(img => img.id === latestSelectedItem?.id);
  const [src, thumbnailSrc] = activeInputImage 
  ? [
    activeInputImage.image.full.src, 
    activeInputImage.image.thumbnail.src
  ] : activeOutputImage 
  ? [
    activeOutputImage.image.full.src, 
    activeOutputImage.image.thumbnail.src
  ] : [undefined, undefined];

  return (
    <>
      <PreviewPicture src={src} thumbnailSrc={thumbnailSrc}/>
      {activeInputImage ? <InputImageDetails image={activeInputImage}/>
      : activeOutputImage ? <OutputImageDetails image={activeOutputImage}/>
      : null}
    </>
  )
}



