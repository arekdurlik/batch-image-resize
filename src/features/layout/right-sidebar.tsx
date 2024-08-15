import styled from 'styled-components'
import { ActiveImage } from '../active-image'
import { useApp } from '../../store/app'

export function RightSidebar() {
  const latestSelectedItem = useApp(state => state.latestSelectedItem);

  return <Container>
    <Content>
      {latestSelectedItem && <ActiveImage/>}
    </Content>
  </Container>
}

const Container = styled.div`
position: relative;
height: 100%;
width: 100%;
display: flex;
flex-direction: column;
justify-content: space-between;
border-left: 1px solid var(--borderColor-default);
overflow-y: hidden;
`

const Content = styled.div`
overflow-y: auto;
`