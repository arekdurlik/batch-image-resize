import styled from 'styled-components'
import { SECTION_HEADER_HEIGHT } from '../../lib/constants'

export const Wrapper = styled.div`
position: relative;
display: flex;
flex-direction: column;
height: 100%;
`

export const ProgressBarWrapper = styled.div`
position: absolute;
top: 0;
width: 100%;
z-index: 4;
`

export const ImageListWrapper = styled.div`
position: relative;
height: calc(100% - ${SECTION_HEADER_HEIGHT}px);
`