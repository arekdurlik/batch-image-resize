import styled from 'styled-components'
import { transitions } from '../../styles/shared'

export const Button = styled.button`
  border: 1px solid ${props => props.theme.border};
  border-radius: ${props => props.theme.borderRadius};
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.text};
  padding: 3px 10px;
  font-weight: 500;
  min-height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: fit-content;
  
  &:hover {
    background-color: ${props => props.theme.inputBackgroundHover};
    cursor: pointer;
  }
  
  
    outline: 1px solid transparent;
    outline-offset: -2px;
    transition: ${transitions.button};
  &:focus {
    outline: 2px solid ${props => props.theme.blue};
    outline-offset: -2px;
  
  }
  svg {
    font-size: 16px;
  }
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

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;

  padding: 0 10px;
  height: 50px;
  border-bottom: 1px solid ${props => props.theme.border};
`

export const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  margin-top: -5px;
  margin-bottom: -5px;
`

export const SideBarSection = styled.div<{ $animate?: boolean }>`
  display: flex;
  flex-direction: column;
`

export const SectionGroup = styled.div`
  padding: 10px;
  border-bottom: 1px solid ${props => props.theme.border};
`