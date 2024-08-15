import { forwardRef, useRef, useEffect, MouseEvent } from 'react'
import { bytesToSizeFormatted } from '../../../lib/helpers'
import { useApp } from '../../../store/app'
import { SortOption } from '../types'
import { Item, ImageWrapper, Title, Image } from './styled'
import { ImageData } from '../../../store/types'

type Props = { 
  type: 'input' | 'output'
  image: ImageData, 
  sortBy?: SortOption, 
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
        <Image src={image.image.thumbnail.src} draggable={false}/>
      </ImageWrapper>
      <Title>
        {sortBy === SortOption.FILESIZE 
          ? bytesToSizeFormatted(image.image.full.file.size)
          : image.filename
        }
      </Title>
    </Item>
  )
});