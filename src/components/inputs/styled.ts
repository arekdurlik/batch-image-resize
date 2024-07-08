import styled from 'styled-components'

export const HorizontalInputGroup = styled.div`
display: flex;
gap: 10px;
`

export const VerticalInputGroup = styled(HorizontalInputGroup)`
flex-direction: column;
gap: 0;
`