import styled from 'styled-components'
import { Export } from '../settings/export'
import { Settings } from '../settings'

export function LeftSidebar() {

  return (
    <Container>
      <Content>
        <Settings/>
      </Content>
      <Export/>
    </Container>
  )
}

export const AnimatedBackground = styled.div`
transition: background var(--transition-slow);
background: linear-gradient(45deg, #e0e0e0, var(--bgColor-default), var(--bgColor-default), var(--bgColor-default));
background-size: 200% 100%;
background-position: 0% 50%;

&:hover {
  background-position: 100% 50%;
}
`

const Container = styled.div`
position: relative;
height: 100%;
width: 305px;
min-width: 305px;
display: flex;
flex-direction: column;
justify-content: space-between;
border-right: 1px solid var(--borderColor-default);
overflow-y: hidden;
`

const Content = styled.div`
overflow-y: auto;
height: 100%;
`

