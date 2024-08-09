import styled, { css } from 'styled-components'

export const ImageListWrapper = styled.div<{ $focused: boolean }>`
position: relative;
z-index: 3;
overflow-y: scroll;
overflow-x: hidden;
height: 100%;
container-type: inline-size;

${props => !props.$focused && css`
.list-item--active {
  &::before {
    opacity: 0.66 !important;
  }
}
`}
`

export const Grid = styled.div`
display: grid;
grid-template-columns: repeat(10, 1fr);
gap: 3px 10px;
padding: 20px;
pointer-events: none;

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

export const Item = styled.div<{ $previousActive?: boolean }>`
position: relative;
display: flex;
flex-direction: column;
align-items: center;
height: fit-content;
user-select: initial;
pointer-events: all;
padding: 4px;
z-index: -1;

&:before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: var(--borderRadius-default);
  opacity: 0;
  outline-color: var(--borderColor-default);
  outline-offset: -1px;
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

&.list-item {
  &--active {
    &::before {
      opacity: 1;
      background-color: var(--color-blue-1) !important;
    }
  }

  &--previous-active {
    &:not(.list-item--active) {
      &::before {
        opacity: 1;
        outline: 1px solid var(--borderColor-default);
      }
    }
  }
}
`

export const ImageWrapper = styled.div`
height: 100px;
display: flex;
flex-direction: column;
justify-content: flex-end;
user-select: none;
pointer-events: all;
`

export const Image = styled.img`
max-height: 100px;
width: 100px;
border-radius: var(--borderRadius-default);
z-index: 1;
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