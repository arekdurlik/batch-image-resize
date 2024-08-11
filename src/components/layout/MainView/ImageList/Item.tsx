import { forwardRef, MouseEvent, useEffect, useRef } from 'react'
import { bytesToSizeFormatted } from '../../../../lib/helpers'
import { ImageData } from '../../../../store/types'
import { Image, ImageWrapper, Item, Title } from './styled'
import { SortType } from './types'
import { useApp } from '../../../../store/app'

type Props = { 
  type: 'input' | 'output'
  image: ImageData, 
  sortBy?: SortType, 
  onClick?: (e: MouseEvent) => void 
};

export const ListItem = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { image, sortBy, onClick } = props;
  const item = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    useApp.subscribe(state => ({ 
      selectedItems: state.selectedItems, 
      latestSelected: state.latestSelectedItem 
    }), ({ selectedItems, latestSelected }) => {

      const isActive = selectedItems.find(i => i.id === image.id);
      if (isActive) {
        item.current.classList.add('list-item--active');
      } else {
        item.current.classList.remove('list-item--active');
      }

      const isPreviousActive = latestSelected?.id === image.id;
      if (isPreviousActive) {
        item.current.classList.add('list-item--previous-active');
      } else {
        item.current.classList.remove('list-item--previous-active');
      }
    });
  }, [image.id]);


  return (
    <Item 
      ref={node => {
        node && (item.current = node);
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }} 
      onClick={event => onClick?.(event)}
      data-id={image.id}
    >
      <ImageWrapper>
        <Image src={URL.createObjectURL(image.image.thumbnail)}/>
      </ImageWrapper>
      <Title>
        {sortBy === SortType.FILESIZE 
          ? bytesToSizeFormatted(image.image.full.size)
          : image.filename
        }
      </Title>
    </Item>
  )
});