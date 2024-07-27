import { ReactNode, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { animated, easings, useSpring } from '@react-spring/web'

type Props = {
  open: boolean
  startOpen: boolean
  children: ReactNode
}

export function Collapsible({ open, startOpen, children }: Props) {
  const ref = useRef<HTMLDivElement>(null!)

  const [style, api] = useSpring(() => ({ height: startOpen ? 'auto' : 0, config: {
    duration: 250,
    easing: easings.easeInOutQuad
  } }));

  useEffect(() => {
   if (open) {
    api.start({ height: 0 })
    api.start({ height: ref.current.scrollHeight })
  } else {
    // set to closed if startOpen === false
    if (style.height.get() === 'auto') {
      api.set({ height: 0 });
      return;
    }

    api.start({ height: ref.current.scrollHeight })
    api.start({ height: 0 })
   }
  }, [api, open, style.height]);

  return <Container ref={ref} style={style}>{children}</Container>
}

const Container = styled(animated.div)`
overflow: hidden;
`