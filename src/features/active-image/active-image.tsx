import { MdCrop } from 'react-icons/md'
import { useApp } from '../../store/app'
import { useInputImages } from '../../store/input-images'
import { useOutputImages } from '../../store/output-images'
import { Button } from '../ui/inputs/button'
import { InputImageDetails } from './input-image-details'
import { OutputImageDetails } from './output-image-details'
import { PreviewPicture } from './preview-picture'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { CropImage } from './crop-image/crop-image'
import { EditImage } from './edit-image'

export function ActiveImage() {
  const inputImages = useInputImages(state => state.images);
  const outputImages = useOutputImages(state => state.images);
  const latestSelectedItem = useApp(state => state.latestSelectedItem);
  const activeInputImage = inputImages?.find(img => img.id === latestSelectedItem?.id);
  const activeOutputImage = outputImages?.find(img => img.id === latestSelectedItem?.id);
  const hasActiveImage = activeInputImage || activeOutputImage;
  
  const [src, thumbnailSrc] = activeInputImage 
  ? [
    activeInputImage.image.full.src, 
    activeInputImage.image.thumbnail.src
  ] : activeOutputImage 
  ? [
    activeOutputImage.image.full.src, 
    activeOutputImage.image.thumbnail.src
  ] : [undefined, undefined];

  const [cropActive, setCropActive] = useState(false);
  const [editActive, setEditActive] = useState(false);

  useEffect(() => {
    if (cropActive) {
      setCropActive(false);
    }
  }, [activeInputImage, activeOutputImage]);

  return cropActive && activeOutputImage ? (
    <CropImage 
      key={activeOutputImage.id} 
      thumbnailSrc={thumbnailSrc} 
      outputImageData={activeOutputImage} 
      onClose={() => setCropActive(false)} 
    />
  ) : hasActiveImage ? (
    <>
      {!editActive && !cropActive && activeOutputImage && (
        <CropButtonWrapper>
          <Button onClick={() => setCropActive(true)}>
            <MdCrop/>Crop
          </Button>
        </CropButtonWrapper>
      )}

      <PreviewPicture 
        src={src} 
        thumbnailSrc={thumbnailSrc}
      />

      {activeInputImage ? (
        <InputImageDetails image={activeInputImage}/>
      ) : editActive && activeOutputImage ? (
        <EditImage image={activeOutputImage} onClose={() => setEditActive(false)}/>
      ) : (
        <OutputImageDetails 
          image={activeOutputImage!}
          onEnableEdit={() => setEditActive(true)} 
        /> 
      )}
    </>
  ) : <></>
}

const CropButtonWrapper = styled.div`
position: absolute;
top: 0;
right: 0;
margin: var(--spacing-large);
z-index: 2;
`