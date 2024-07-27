import styled from 'styled-components'
import { Settings } from './sections/Settings'
import { Variants } from './sections/Variants'
import { Export } from './Export'

export function RightSidebar() {

  return <Container>
    <Content>
    </Content>
  </Container>
}

export const AnimatedBackground = styled.div`
transition: background 500ms;
background: linear-gradient(45deg, #e0e0e0, ${props => props.theme.background}, ${props => props.theme.background}, ${props => props.theme.background});
background-size: 200% 100%;
background-position: 0% 50%;

&:hover {
  background-position: 100% 50%;
}
`

const Container = styled.div`
position: relative;
height: 100%;
width: 30rem;
display: flex;
flex-direction: column;
justify-content: space-between;
border-left: 1px solid ${props => props.theme.border};
overflow-y: hidden;
`

const Content = styled.div`
overflow-y: auto;
position: relative;
top: 1px;
`

