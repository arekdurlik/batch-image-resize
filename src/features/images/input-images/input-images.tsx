import { DropZone } from './drop-zone';
import { SectionHeader, SectionTitle } from '../../layout/styled';
import { useInputImages } from '../../../store/input-images';
import { ProgressBar } from '../../ui/progress-bar';
import { HeaderOptions, ImageListWrapper, ProgressBarWrapper, Wrapper } from '../styled';
import { ImageList } from '../image-list';
import { MoreOptions } from './more-options';
import { UploadButton } from './upload-button';
import { ButtonGroup } from '../../ui/inputs/styled';

export function InputImages() {
    const images = useInputImages(state => state.images);
    const progress = useInputImages(state => state.progress);

    return (
        <Wrapper>
            <SectionHeader>
                <SectionTitle>Input images</SectionTitle>
                <HeaderOptions>
                    <ButtonGroup>
                        <UploadButton />
                        <MoreOptions />
                    </ButtonGroup>
                </HeaderOptions>
            </SectionHeader>
            <ImageListWrapper>
                <ProgressBarWrapper>
                    <ProgressBar value={progress.processedItems} max={progress.totalItems} />
                </ProgressBarWrapper>
                <ImageList type="input" images={images} />
                {images.length === 0 && <DropZone />}
            </ImageListWrapper>
        </Wrapper>
    );
}
