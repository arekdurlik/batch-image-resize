import { bytesToSizeFormatted } from '../../lib/helpers';
import { InputImageData } from '../../store/types';
import { Details, Field, Filename, Header, Label, Value } from './styled';

export function InputImageDetails({ image }: { image: InputImageData }) {
    return (
        <>
            <Details>
                <Header>
                    <Filename>{image.filename}</Filename>
                </Header>

                <Field>
                    <Label>Dimensions</Label>
                    <Value>
                        {image.dimensions.width} x {image.dimensions.height}
                    </Value>
                </Field>

                <Field>
                    <Label>Size</Label>
                    <Value>
                        {bytesToSizeFormatted(image.image.full.file.size)}
                    </Value>
                </Field>
            </Details>
        </>
    );
}
