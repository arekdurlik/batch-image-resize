import { bytesToSizeFormatted } from '../../../lib/helpers'
import { InputImageData } from '../../../store/types'
import { Details, Field, Filename, Label } from './styled'

export function InputImageDetails({ image }: { image: InputImageData }) {

  return (
    <>
      <Details>
        <Field>
          <Label>Filename</Label>
          <Filename>{image.filename}</Filename>
        </Field>

        <Field>
          <Label>Size</Label>
          <Filename>{bytesToSizeFormatted(image.image.full.size)}</Filename>
        </Field>

        <Field>
          <Label>Dimensions</Label>
          <Filename>{image.dimensions.width} x {image.dimensions.height}</Filename>
        </Field>
      </Details>
    </>
  )
}