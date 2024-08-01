import { animated, useTransition } from '@react-spring/web'
import { useCallback, useMemo } from 'react'
import { MdCheckCircle, MdError, MdInfo, MdWarning } from 'react-icons/md'
import styled from 'styled-components'
import { ToastType, useToastsState } from '../store/toastsState'
import { IoMdClose } from 'react-icons/io'

export function Toasts() {
  const refMap = useMemo(() => new WeakMap(), []);
  const cancelMap = useMemo(() => new WeakMap(), []);
  const toastsState = useToastsState();

  const transitions = useTransition(toastsState.toasts, {
    from: { opacity: 0, height: 0, life: '100%' },
    enter: item => async (next, cancel) => { 
      cancelMap.set(item, cancel);
      await next({ opacity: 1, height: refMap.get(item).offsetHeight });
      await next({ life: '0%' });
    },
    leave: [{ opacity: 0 }, { height: 0 }],
    keys: item => item.id,
    onRest: (_result, _ctrl, item) => {
      toastsState.closeToast(item.id);
    },
    config: (item, _index, phase) => key => 
      phase === 'enter' && key === 'life' 
      ? { duration: 100 + item.message.trim().length * 75 } 
      : { tension: 125, friction: 20, precision: 0.1 },
  })

  const getIcon = useCallback((type: ToastType) => {
    switch (type) {
      case 'error':
        return <MdError />
      case 'success':
        return <MdCheckCircle />
      case 'warning':
        return <MdWarning />
      case'info':
        return <MdInfo />
    }
  }, []);

  return (
    <Wrapper>
      {transitions(({ life, ...style }, item) => (
        item && <animated.div key={item.id} style={style}>
          <Toast $type={item.type} ref={(ref: HTMLDivElement) => ref && refMap.set(item, ref)}>
            <Content>
              <Icon>
                {getIcon(item.type)}
              </Icon>
              {item.message}
              <Close onClick={e => {
                e.stopPropagation()
                if (cancelMap.has(item) && life.get() !== '0%') {
                  cancelMap.get(item)();
                  toastsState.closeToast(item.id);
                }
              }}>
                <IoMdClose />
              </Close>
            </Content>
            <Life style={{ right: life }} />
          </Toast>
        </animated.div>
      ))}
    </Wrapper>
  )
}

const Wrapper = styled.div`
position: absolute;
overflow: hidden;
inset: 0;
padding: 20px;
pointer-events: none;

display: flex;
flex-direction: column;
justify-content: flex-end;
align-items: flex-end;
z-index: 200;
`

const Icon = styled.span`
display: flex;
font-size: 16px;
color: #238d27;
padding-right: 10px;
`

const Toast = styled(animated.div)<{ $type: string }>`
position: relative;
padding-top: 5px;
pointer-events: all;

${({ $type }) => {
  let color = '#ccc'

  switch($type) {
    case 'success': color = '#238d27'; break
    case 'warning': color = '#a1a527'; break
    case 'error': color = '#a52727'; break
    case 'info': color = '#4f99b8'; break
  }

  return `
    svg {
      fill: ${color};
    }
  `
}}
`

const Content = styled.div`
position: relative;
background-color: var(--bgColor-default);
border: 1px solid var(--borderColor-default);
padding: 10px;
border-radius: var(--borderRadius-default);
overflow: hidden;
white-space: pre-wrap;

display: flex;
align-items: center;
justify-content: space-between;

@keyframes blur-in {
  0% {
    backdrop-filter: blur(0px);
  }
  100% {
    backdrop-filter: blur(10px);
  }
}
animation-name: blur-in;
animation-duration: 6s;
animation-fill-mode: forwards;
`

const Close = styled.span`
display: flex;
align-items: center;
font-size: 16px;
padding-left: 20px;
transition: var(--transition-default);

svg {
  fill: var(--fgColor-default);
}

&:hover {
  opacity: 1;
  cursor: pointer;
}
`

const Life = styled(animated.div)`
position: absolute;
bottom: 0;
left: 0px;
height: 6px;
background-color: var(--borderColor-default);
opacity: 0.25;
`