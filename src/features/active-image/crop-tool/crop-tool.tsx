import { useEffect } from 'react'
import { OutputImageData } from '../../../store/types'
import { CropEditor } from './crop-editor'
import { CropSettings } from './crop-settings'
import { useCropState } from './store'
import { useInputImages } from '../../../store/input-images'
import { useOutputImages } from '../../../store/output-images'
import { SectionHeader } from '../../layout/styled'
import { ButtonGroup } from '../../ui/inputs/styled'
import { Button } from '../../ui/inputs/button'
import { MdAlignHorizontalCenter, MdAlignVerticalCenter, MdZoomIn, MdZoomOut } from 'react-icons/md'

type Props = { 
  thumbnailSrc?: string
  outputImageData: OutputImageData
  onClose: () => void 
};

export function CropTool({ thumbnailSrc, outputImageData: image, onClose }: Props) {
  const api = useCropState(state => state.api);
  const outputImagesApi = useOutputImages(state => state.api);
  const inputImages = useInputImages(state => state.images);
  const inputImage = inputImages.find(i => i.id === image.inputImage.id)!;

  useEffect(() => {
    const inputAspectRatio = image.inputImage.dimensions.width / image.inputImage.dimensions.height;
    const outputAspectRatio = image.dimensions.width / image.dimensions.height;
    const minZoom = Math.max(1, inputAspectRatio / outputAspectRatio);

    api.setMinZoom(minZoom);
    api.setX(image.crop.x);
    api.setY(image.crop.y);
    api.setZoom(Math.max(minZoom, image.crop.zoom));
  }, [api, image]);

  function handleConfirm() {
    const state = useCropState.getState();
    outputImagesApi.setCropData(image.id, { x: state.x, y: state.y, zoom: state.zoom, minZoom: state.minZoom });
  }

  return (
    <>
      
      <CropEditor
        thumbnailSrc={thumbnailSrc} 
        inputImageData={inputImage}
        outputImageData={image}
      />
      <CropSettings
        onConfirm={handleConfirm}
        onCancel={onClose}
      />
    </>
  )
}