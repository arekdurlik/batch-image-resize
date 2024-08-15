import { MouseEvent, useRef } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { OVERLAY_ID } from '../../../lib/constants'
import { PreviewImageData } from '../preview-picture'
import { Thumbnails } from './thumbnails'
import { fadeIn } from '../../../styles/mixins'

type Props = { 
  src?: string, 
  imageData: PreviewImageData 
  onClose?: (event: MouseEvent) => void
};

export function Lightbox({ src, onClose }: Props) {
  const overlay = useRef(document.querySelector(`#${OVERLAY_ID}`)!);
  const wrapper = useRef<HTMLDivElement>(null!);
  
  function handleClose(event: MouseEvent) {
    wrapper.current.style.opacity = '0';

    setTimeout(() => {
      onClose?.(event);
    }, 150);
  }
  return createPortal((
    <Wrapper ref={wrapper} onClick={handleClose}>
      <Slide>
        <Image src={src}/>
      </Slide>
      <Thumbnails/>
    </Wrapper>
  ), overlay.current);
}

const Wrapper = styled.div`
position: absolute;
inset: 0;
overflow: hidden;
cursor: zoom-out;
user-select: none;
padding: 10px;

display: flex;
flex-direction: column;
align-items: center;
gap: 5px;
transition: var(--transition-default);
background-color: var(--lightboxBgColor);
backdrop-filter: blur(20px);
${fadeIn}
`

const Slide = styled.div`
overflow: hidden;
display: flex;
align-items: center;
flex: 1;
`
const Image = styled.img`
max-width: 100%;
max-height: 100%;
`
