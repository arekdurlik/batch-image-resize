import styled from 'styled-components'

export function RightSidebar() {

  return <Container>
    <Content>
    </Content>
  </Container>
}

const Container = styled.div`
position: relative;
height: 100%;
width: 30rem;
display: flex;
flex-direction: column;
justify-content: space-between;
border-left: 1px solid var(--borderColor-default);
overflow-y: hidden;
`

const Content = styled.div`
overflow-y: auto;
position: relative;
top: 1px;
`

