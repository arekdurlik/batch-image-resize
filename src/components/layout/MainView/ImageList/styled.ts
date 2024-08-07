import styled from 'styled-components'

export const Grid = styled.div`
display: grid;
grid-template-columns: repeat(10, 1fr);
gap: 5px 10px;
padding: 20px;

@container (max-width: 1260px) {
  grid-template-columns: repeat(9, 1fr);
}

@container (max-width: 1120px) {
  grid-template-columns: repeat(8, 1fr);
}

@media (max-width: 1800px) {
  grid-template-columns: repeat(9, 1fr);
}

@media (max-width: 1600px) {
  grid-template-columns: repeat(8, 1fr);
}

@media (max-width: 1450px) {
  grid-template-columns: repeat(7, 1fr);
}

@media (max-width: 1350px) {
  grid-template-columns: repeat(6, 1fr);
}

@media (max-width: 1250px) {
  grid-template-columns: repeat(5, 1fr);
}

@media (max-width: 1000px) {
  grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 850px) {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 700px) {
  grid-template-columns: repeat(2, 1fr);
}
`

export const Item = styled.div<{ $active: boolean, $previousActive?: boolean }>`
position: relative;
display: flex;
flex-direction: column;
align-items: center;
height: fit-content;
user-select: initial;
padding: 4px;


&:before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: var(--borderRadius-default);
  opacity: 0;
  transition: var(--transition-fast);
}

&:hover {
  &::before {
    opacity: 1;
    background-color: var(--color-blue-0);
  }
}

&:active {
  &::before {
    opacity: 1;
    background-color: var(--color-blue-1);
  }
}

${props => props.$active && `
&::before {
  opacity: 1;
  background-color: var(--color-blue-1) !important;
}
`} 

${props => props.$previousActive && `
&::before {
  opacity: 1;
  border: 1px solid var(--borderColor-default);
}
`} 
`

export const ImageWrapper = styled.div`
height: 100px;
display: flex;
flex-direction: column;
justify-content: flex-end;
user-select: none;
`

export const Image = styled.img`
max-height: 100px;
width: 100px;
border-radius: var(--borderRadius-default);
z-index: 2;
overflow-clip-margin: none;
object-fit: cover;
`

export const Title = styled.span`
max-width: 110px;
line-break: anywhere;
text-align: center;
user-select: none;
z-index: 2;
`