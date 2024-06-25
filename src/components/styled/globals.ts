import styled from 'styled-components'
import { transitions } from '../../styles/shared'

export const Button = styled.button`
  border: none;
  border-radius: 0.25rem;
  background-color: #1b1b1b;
  color: #eee;
  padding: 3px 10px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  width: fit-content;

  transition: background-color ${transitions.button};

  &:hover {
    background-color: #3b3b3b;
    cursor: pointer;
  }

  svg {
    font-size: 24px;
  }
`