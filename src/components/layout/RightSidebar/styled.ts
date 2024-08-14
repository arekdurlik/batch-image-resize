import styled from 'styled-components'

export const ImageWrapper = styled.div`
position: relative;
width: 100%;
aspect-ratio: 1/1;
max-height: 300px;
overflow: hidden;
display: grid;
place-items: center;
background-color: var(--bgColor-muted);
border-bottom: 1px solid var(--borderColor-default);
`

export const Image = styled.img`
max-height: 100%;
overflow: hidden;
z-index: 1;
`

export const BackgroundImage = styled.img`
position: absolute;
min-height: 130%;
min-width: 130%;
object-fit: cover;
overflow: hidden;
z-index: 0;
opacity: 0.15;
filter: blur(20px);
`

export const Details = styled.div`
padding: 10px;
display: flex;
flex-direction: column;
gap: 10px;
`

export const Field = styled.div`
display: flex;
flex-direction: column;
gap: 2px;
`

export const Label = styled.span`
display: flex;
gap: 5px;
align-items: center;
font-weight: 500;
`

export const Filename = styled.span`

`