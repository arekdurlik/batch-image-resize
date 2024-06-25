import styled from 'styled-components'
import { Export } from './Export'
import { Variants } from './Variants'
import { Rename } from './Rename'

export function Sidebar() {

  return <Container>
    <SideBarSection $animate>
      <Title style={{ marginTop: 40 }}>Settings</Title>
      <Rename/>
    </SideBarSection>
    <Variants/>
    <Export/>
  </Container>
}

export const SideBarSection = styled.div<{ $animate?: boolean }>`
border-bottom: 1px solid ${props => props.theme.border};
display: flex;
flex-direction: column;
padding: 10px;

${props => props.$animate && `
transition: background 500ms;
background: linear-gradient(45deg, #e0e0e0, ${props.theme.background}, ${props.theme.background}, ${props.theme.background});
background-size: 200% 100%;
background-position: 0% 50%;

&:hover {
  background-position: 100% 50%;
}
`}
`

const Container = styled.div`
height: 100%;
width: 17rem;
display: flex;
flex-direction: column;
border-right: 1px solid ${props => props.theme.border};
overflow-y: auto;
`

const Title = styled.h2`
padding: 0px 10px 10px 10px;
`