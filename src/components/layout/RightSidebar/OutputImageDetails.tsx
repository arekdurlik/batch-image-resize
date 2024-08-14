import { MdEdit, MdRefresh } from 'react-icons/md'
import { OutputImageData } from '../../../store/types'
import { Details, Field, Filename, Image, ImageWrapper, Label } from './styled'
import styled from 'styled-components'
import { bytesToSizeFormatted } from '../../../lib/helpers'

export function OutputImageDetails({ image }: { image: OutputImageData }) {

  return (
    <>
      <Details>
        <Field>
          <Label>Filename<Icons><Edit/></Icons></Label>
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

        <Field>
          <Label>Quality<Edit/></Label>
          <Filename>{Math.round(image.quality * 100 * 10) / 10}%</Filename>
        </Field>
      </Details>
    </>
  )
}

const Icons = styled.div`
display: flex;
`
const Edit = styled(MdEdit)`
fill: var(--fgColor-icon);
font-size: 16px;
`

const Refresh = styled(MdRefresh)`
font-size: 16px;
fill: var(--fgColor-icon);
`