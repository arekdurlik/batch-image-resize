import styled from 'styled-components'

export function Header() {
  
  return <Container></Container>
}

const Container = styled.div`
padding: 20px;
width: 100%;
border-bottom: 1px solid var(--borderColor-default);
backdrop-filter: blur(70px);
background-color: var(--bgColor-default-transparent);
z-index: 10;
`
