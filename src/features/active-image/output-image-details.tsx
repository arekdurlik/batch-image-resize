import { MdEdit } from 'react-icons/md'
import { OutputImageData } from '../../store/types'
import { Details, Field, Filename, Header, Label, Value } from './styled'
import styled from 'styled-components'
import { bytesToSizeFormatted } from '../../lib/helpers'
import { Button } from '../ui/inputs/button'

export function OutputImageDetails({ image }: { image: OutputImageData }) {
  const inputSize = image.inputImage.size;
  const outputSize = image.image.full.file.size;
  const increase = outputSize > inputSize;
  const percentage = (outputSize - inputSize) / inputSize * 100;
  const percentageRounded = Math.round(percentage * 10) / 10;

  return (
    <>
      <Details>
        <Header>
          <Filename>{image.filename}</Filename>
          <Button><MdEdit/>Edit</Button>
        </Header>

        <Field>
          <Label>Quality</Label>
          <Value>{Math.round(image.quality * 100 * 10) / 10}%</Value>
        </Field>

        <Field>
          <Label>Dimensions</Label>
          <Value>{image.dimensions.width} x {image.dimensions.height}</Value>
        </Field>
        
        <Field>
          <Label>Size</Label>
          <Value>
            {bytesToSizeFormatted(outputSize)}
            <PercentageChange $value={percentageRounded}> ({increase && '+'}{percentageRounded}%)</PercentageChange>
          </Value>
        </Field>
      </Details>
    </>
  )
}

export const PercentageChange = styled.span<{ $value?: number }>`
${props => props.$value && (
  props.$value < 0 
    ? 'color: var(--color-green-5)' 
    : props.$value > 0 
      ? 'color: var(--color-red-5)' 
      : ''
)};
`


export const Edit = styled(MdEdit)`
fill: var(--fgColor-icon);
font-size: 16px;
`

