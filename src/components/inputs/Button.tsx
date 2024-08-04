import { ButtonHTMLAttributes, CSSProperties, MouseEventHandler, ReactNode } from 'react'
import { outline } from '../../styles/mixins/outline'
import styled from 'styled-components'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { 
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement> 
  children: ReactNode, 
  style?: CSSProperties
};

export function Button({ disabled, onClick, children, style, ...props }: Props) {
  return (
    <StyledButton 
      onClick={onClick} 
      style={style} 
      disabled={disabled}
      {...props}
    >
      {children}
    </StyledButton>
  )
}

const StyledButton = styled.button`
  ${outline}

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;

  border: 1px solid var(--borderColor-default);
  border-radius: var(--borderRadius-default);
  background-color: var(--button-default-bgColor-rest);
  color: var(--button-default-fgColor-rest);
  padding: 3px 7px;
  font-weight: 500;
  min-height: 29px;
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