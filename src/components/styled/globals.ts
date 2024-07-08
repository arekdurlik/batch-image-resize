import styled from 'styled-components'
import { transitions } from '../../styles/shared'

export const Button = styled.button`
  border: 1px solid ${props => props.theme.border};
  border-radius: 0.4rem;
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.text};
  padding: 3px 10px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
  width: fit-content;

  transition: background-color ${transitions.button};

  &:hover {
    background-color: ${props => props.theme.inputBackgroundHover};
    cursor: pointer;
  }

  svg {
    font-size: 16px;
  }
`

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;

  padding: 10px;
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