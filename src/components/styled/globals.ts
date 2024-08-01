import styled from 'styled-components'
import { outline } from '../../styles/mixins/outline'

export const Button = styled.button`
  ${outline}

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;

  border: 1px solid var(--borderColor-default);
  border-radius: var(--borderRadius-default);
  background-color: var(--button-default-bgColor-rest);
  color: var(--button-default-fgColor-rest);
  padding: 3px 10px;
  font-weight: 500;
  min-height: 30px;
  width: fit-content;
  cursor: pointer;
  transition: 
    background-color var(--transition-default), 
    outline var(--transition-fast);

  &:hover {
    background-color: var(--button-default-bgColor-hover);
  }

  &:active {
    background-color: var(--button-default-bgColor-active);
  }

  &:focus-visible {
    // button group collapsed border fix
    z-index: 1;
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
  border-bottom: 1px solid var(--borderColor-default);
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
  border-bottom: 1px solid var(--borderColor-default);
`