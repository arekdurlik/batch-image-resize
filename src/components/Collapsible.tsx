import { ReactNode, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { animated, config, useSpring } from '@react-spring/web'

type Props = {
  open: boolean
  startOpen: boolean
  children: ReactNode
}

export function Collapsible({ open, startOpen, children }: Props) {
  const ref = useRef<HTMLDivElement>(null!)

  const [style, api] = useSpring(() => ({ height: startOpen ? 'auto' : 0, config: {
    tension: 500,
    friction: 50,
    bounce: 0
  } }));

  useEffect(() => {
   if (open) {
    api.start({ height: 0 })
    api.start({ height: ref.current.scrollHeight })
  } else {
    api.start({ height: ref.current.scrollHeight })
    api.start({ height: 0 })
   }
  }, [open])

  return <Container ref={ref} style={style}>{children}</Container>
}

const Container = styled(animated.div)`
overflow: hidden;
`