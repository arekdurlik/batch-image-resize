import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { OVERLAY_ID, OVERLAY_Z_INDEX } from '../../../lib/constants'
import styled, { css } from 'styled-components'
import { Placement } from '../types'
import { fadeIn } from '../../../styles/mixins'
import { getRenderParams } from './utils'
import { useHoverIntent } from '../../../hooks'

type Props = {
  content: ReactNode
  children: ReactNode
  placement?: Placement
  enabled?: boolean
  openDelay?: number
};

export function Tooltip({ content, children, placement = Placement.BOTTOM, enabled = true }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hoverIntended = useHoverIntent(isHovered && enabled);

  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [renderParams, setRenderParams] = useState({ x: 0, y: 0 });
  
  const contentRef = useRef<HTMLDivElement>(null);
  const overlay = useRef(document.querySelector(`#${OVERLAY_ID}`)!);
  const fadeOutTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    let timeout = fadeOutTimeout.current;

    if (hoverIntended) {
      setIsOpen(true);
    } else {
      if (contentRef.current) {
        contentRef.current.style.opacity = '0';
      }
      
      timeout = setTimeout(() => {
        setIsOpen(false);
      }, 150);
    }

    return () => clearTimeout(timeout);
  }, [enabled, hoverIntended, placement, targetElement]);

  useEffect(() => {
    if (!isOpen || !targetElement || !contentRef.current) return;
    
    const [left, top] = getRenderParams(
      targetElement.getBoundingClientRect(), 
      contentRef.current.getBoundingClientRect(), 
      placement
    );
    
    setRenderParams({ x: left, y: top });
  }, [isOpen, placement, targetElement]);
  
  function handleMouseEnter(event: MouseEvent) {
    if (event.target instanceof HTMLElement) {
      setTargetElement(event.target);
      setIsHovered(true);
    }
  }
  
  function handleMouseLeave() {
    setIsHovered(false);
  }

  const child = typeof children === 'string' 
    ? <span>{children}</span> 
    : React.Children.only(children) as JSX.Element;

  const clonedEle = React.cloneElement(child, {
      ...child.props,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
  });

  return (
    <>
      {clonedEle}
      {isOpen && (
        createPortal(
          <ContentWrapper
            ref={contentRef}
            $renderParams={renderParams}
          >
            {content}
          </ContentWrapper>,
          overlay.current
        )
      )}
    </>
  );
}

const ContentWrapper = styled.div<{ $renderParams?: { x: number, y: number }}>`
position: absolute;
transition: opacity var(--transition-default);
z-index: ${OVERLAY_Z_INDEX.TOOLTIP};

${props => props.$renderParams && css`
left: ${props.$renderParams.x}px;
top: ${props.$renderParams.y}px;
${fadeIn}
`}
`