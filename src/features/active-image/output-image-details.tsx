import { MdEdit } from 'react-icons/md'
import { OutputImageData } from '../../store/types'
import { Details, Field, Filename, Label } from './styled'
import styled from 'styled-components'
import { bytesToSizeFormatted } from '../../lib/helpers'

export function OutputImageDetails({ image }: { image: OutputImageData }) {
  const inputSize = image.inputImage.size;
  const outputSize = image.image.full.file.size;
  const increase = outputSize > inputSize;
  const percentage = (outputSize - inputSize) / inputSize * 100;
  const percentageRounded = Math.round(percentage * 10) / 10;

  return (
    <>
      <Details>
        <Field>
          <Label>Filename<Icons><Edit/></Icons></Label>
          <Filename>{image.filename}</Filename>
        </Field>

        <Field>
          <Label>Size</Label>
          <Filename>
            {bytesToSizeFormatted(outputSize)}
            <PercentageChange $value={percentageRounded}> ({increase && '+'}{percentageRounded}%)</PercentageChange>
          </Filename>
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

const PercentageChange = styled.span<{ $value: number }>`
${props => props.$value < 0 
  ? 'color: var(--color-green-4)' 
  : props.$value > 0 
  ? 'color: var(--color-red-4)' 
  : ''};
`
const Icons = styled.div`
display: flex;

`
const Edit = styled(MdEdit)`
fill: var(--fgColor-icon);
font-size: 16px;
`

/* const Refresh = styled(MdRefresh)`
font-size: 16px;
fill: var(--fgColor-icon);
` */