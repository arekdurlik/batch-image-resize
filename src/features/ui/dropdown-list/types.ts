import { ReactNode, RefObject } from 'react'
import { Placement } from '../types'

export type Props = { 
  children: ReactNode, 
  actuator?: RefObject<HTMLElement>
  initialHighlightIndex?: number,
  floating?: boolean
  align?: Alignment
  slideIn?: boolean
  margin?: number
  onClose?: () => void
};

export type Alignment = 'left' | 'center' | 'right';

export type RenderParams = { x: number, y: number, placement: Placement, width: string | number };