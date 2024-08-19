import { ReactNode, RefObject } from 'react'

export type Props = { 
  children: ReactNode, 
  actuator?: RefObject<HTMLElement>
  initialHighlightIndex?: number,
  align?: Alignment
  slideIn?: boolean
  margin?: number
  onClose?: () => void
};

export type Alignment = 'left' | 'center' | 'right';