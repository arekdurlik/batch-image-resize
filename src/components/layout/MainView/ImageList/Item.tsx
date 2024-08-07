import { forwardRef, MouseEvent, MutableRefObject, useRef } from 'react'
import { bytesToSizeFormatted } from '../../../../lib/helpers'
import { ImageData } from '../../../../store/types'
import { Image, ImageWrapper, Item, Title } from './styled'
import { SortType } from './types'

type Props = { 
  image: ImageData, 
  sortBy?: SortType, 
  isActive: boolean, 
  isPreviousActive: boolean, 
  previousActiveVisible?: boolean, 
  onClick?: (e: MouseEvent) => void 
};

export const ListItem = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { image, sortBy, isActive, isPreviousActive, previousActiveVisible = true, onClick } = props;
  
  return (
    <Item 
      ref={ref} 
      key={image.id} 
      $active={isActive} 
      $previousActive={previousActiveVisible && isPreviousActive} 
      onClick={event => onClick?.(event)}
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
})