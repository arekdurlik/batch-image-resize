import styled from 'styled-components'

export const ImageWrapper = styled.div`
position: relative;
width: 100%;
aspect-ratio: 1/1;
overflow: hidden;
display: grid;
place-items: center;
background-color: var(--bgColor-muted);
border-bottom: 1px solid var(--borderColor-default);
cursor: zoom-in;
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
font-weight: 600;
`

export const Value = styled.span`
`

export const Header = styled.div`
display: flex;
gap: var(--spacing-large);
justify-content: space-between;
align-items: center;
min-height: 30px;
margin-bottom: var(--spacing-large);
`

export const Filename = styled.h3`
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
`;
