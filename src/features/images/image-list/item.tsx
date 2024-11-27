import { forwardRef, useRef, useEffect, MouseEvent, useState } from 'react';
import { bytesToSizeFormatted } from '../../../lib/helpers';
import { useApp } from '../../../store/app';
import { SortOption } from '../types';
import { Item, ImageWrapper, Title, Image } from './styled';
import { ImageData, OutputImageData } from '../../../store/types';
import { ItemContextMenu } from './item-context-menu';
import { PercentageChange } from '../../active-image/output-image-details';

type Props = {
    type: 'input' | 'output';
    image: ImageData;
    sortBy?: SortOption;
    listFocused: boolean;
    onClick?: (e: MouseEvent) => void;
};

export const ListItem = forwardRef<HTMLDivElement, Props>((props, ref) => {
    const { type, image, sortBy, listFocused } = props;
    const item = useRef<HTMLDivElement>(null!);
    const [lastSelected, setLastSelected] = useState(false);
    const getPercentageValue = () => {
        const inputImage = image as unknown as OutputImageData;
        const inputSize = inputImage.inputImage.size;
        const outputSize = inputImage.image.full.file.size;
        const increase = outputSize > inputSize;
        return increase ? 1 : undefined;
    };

    useEffect(() => {
        useApp.subscribe(
            state => ({
                selectedItems: state.selectedItems,
                latestSelected: state.latestSelectedItem,
            }),
            ({ selectedItems, latestSelected }) => {
                const isActive = selectedItems.find(i => i.id === image.id);
                if (isActive) {
                    item.current.classList.add('list-item--active');
                } else {
                    item.current.classList.remove('list-item--active');
                }

                const isPreviousActive = latestSelected?.id === image.id;
                if (isPreviousActive) {
                    item.current.focus();
                    item.current.classList.add('list-item--previous-active');
                } else {
                    if (item.current.classList.contains('list-item--previous-active')) {
                        item.current.classList.remove('list-item--previous-active');
                    }
                }

                if (
                    item.current.classList.contains('list-item--active') &&
                    item.current.classList.contains('list-item--previous-active')
                ) {
                    setLastSelected(true);
                } else {
                    if (lastSelected) {
                        setLastSelected(false);
                    }
                }
            }
        );
    }, [image.id, lastSelected]);

    return (
        <>
            <Item
                ref={node => {
                    node && (item.current = node);
                    if (typeof ref === 'function') {
                        ref(node);
                    } else if (ref) {
                        ref.current = node;
                    }
                }}
                data-id={image.id}
            >
                <ImageWrapper>
                    <Image
                        src={image.image.thumbnail.src}
                        draggable={false}
                        onDoubleClick={() => window.open(image.image.full.src, '_blank')}
                    />
                </ImageWrapper>
                <Title>
                    {sortBy === SortOption.FILESIZE ? (
                        <PercentageChange $value={getPercentageValue()}>
                            {bytesToSizeFormatted(image.image.full.file.size)}
                        </PercentageChange>
                    ) : (
                        image.filename
                    )}
                </Title>
            </Item>
            <ItemContextMenu
                actuator={item}
                type={type}
                image={image}
                lastSelected={lastSelected}
                listFocused={listFocused}
            />
        </>
    );
});
