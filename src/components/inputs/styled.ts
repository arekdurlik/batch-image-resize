import styled from 'styled-components'

export const HorizontalInputGroup = styled.div`
display: flex;
gap: 10px;
`

export const VerticalInputGroup = styled(HorizontalInputGroup)`
flex-direction: column;
gap: 0;
`

export const ButtonGroup = styled.div`
display: flex;

& > {

  &:first-child {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0;
  }

  
  &:last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  &:not(:first-child) {
    margin-left: -1px;
  }

}
`