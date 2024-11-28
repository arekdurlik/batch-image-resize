import { MdEdit } from 'react-icons/md';
import { OutputImageData } from '../../store/types';
import { Details, Field, Filename, Header, Label, Value } from './styled';
import styled from 'styled-components';
import { bytesToSizeFormatted } from '../../lib/helpers';
import { Button } from '../ui/inputs/button';
import { useVariants } from '../../store/variants/variants';
import { picaFilters } from '../../lib/constants';

export function OutputImageDetails({
    image,
    onEnableEdit,
}: {
    image: OutputImageData;
    onEnableEdit: () => void;
}) {
    const inputSize = image.inputImage.size;
    const outputSize = image.image.full.file.size;
    const increase = outputSize > inputSize;
    const percentage = ((outputSize - inputSize) / inputSize) * 100;
    const percentageRounded = Math.round(percentage * 10) / 10;
    const variant = useVariants(state => state.variants).find(v => v.id === image.variantId)!;
    const quality =
        Math.round(
            (image.resampling.enabled ? image.resampling.quality : variant.quality) * 100 * 10
        ) / 10;
    const filter = image.resampling.enabled ? image.resampling.filter : variant.filter;
    const sharpening = image.sharpening.enabled
        ? image.sharpening
        : {
              amount: variant.sharpenAmount,
              radius: variant.sharpenRadius,
              threshold: variant.sharpenThreshold,
          };

    return (
        <>
            <Details>
                <Header>
                    <Filename title={image.filename}>{image.filename}</Filename>
                    <Button onClick={onEnableEdit}>
                        <MdEdit />
                        Edit
                    </Button>
                </Header>

                <Field>
                    <Label>Variant</Label>
                    <Value>{variant.name}</Value>
                </Field>

                <Field>
                    <Label>Resampling</Label>
                    <Value>
                        {picaFilters[filter]} / {quality}% quality
                    </Value>
                </Field>

                <Field>
                    <Label>Sharpening</Label>
                    <Value>
                        {sharpening.amount}% / {sharpening.radius}px / {sharpening.threshold} levels
                    </Value>
                </Field>

                <Field>
                    <Label>Dimensions</Label>
                    <Value>
                        {image.dimensions.width} x {image.dimensions.height}
                    </Value>
                </Field>

                <Field>
                    <Label>Size</Label>
                    <Value>
                        {bytesToSizeFormatted(outputSize)}
                        <PercentageChange $value={percentageRounded}>
                            {' '}
                            ({increase && '+'}
                            {percentageRounded}%)
                        </PercentageChange>
                    </Value>
                </Field>
            </Details>
        </>
    );
}

export const PercentageChange = styled.span<{ $value?: number }>`
    ${props =>
        props.$value &&
        (props.$value < 0
            ? 'color: var(--color-green-5)'
            : props.$value > 0
            ? 'color: var(--color-red-5)'
            : '')};
`;

export const Edit = styled(MdEdit)`
    fill: var(--fgColor-icon);
    font-size: 16px;
`;
