import styled from 'styled-components'

export function Navbar() {
  return <Container>

  </Container>
}

const Container = styled.div`
position: fixed;
padding: 20px;
width: 100%;
border-bottom: 1px solid ${props => props.theme.border};
backdrop-filter: blur(70px);
background-color: ${props => `${props.theme.background}` + '99'};
z-index: 1;
`