import { ButtonHTMLAttributes, MouseEventHandler, ReactNode, CSSProperties, forwardRef, MouseEvent, useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'
import { outline } from '../../../styles/mixins'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { 
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement> 
  children: ReactNode, 
  style?: CSSProperties
};

export const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { disabled, onClick, children, style, ...rest } = props;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    !disabled && onClick?.(event);
  }

  return (
    <StyledButton
      tabIndex={disabled ? -1 : 0}
      ref={ref}
      onClick={handleClick} 
      style={style} 
      $disabled={disabled}
      {...rest}
    >
      {children}
    </StyledButton>
  )
});

const StyledButton = styled.button<{ $disabled?: boolean }>`
  ${outline}

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;

  border: 1px solid var(--borderColor-default);
  border-radius: var(--borderRadius-default);
  background-color: var(--control-default-bgColor-rest);
  color: var(--control-default-fgColor-rest);
  padding: 3px 7px;
  font-weight: 500;
  min-height: 29px;
  width: fit-content;
  cursor: pointer;
  transition: 
    background-color var(--transition-default), 
    outline var(--transition-fast);

  &:hover {
    background-color: var(--control-default-bgColor-hover);
  }

  &:active {
    background-color: var(--control-default-bgColor-active);
  }

  &:focus-visible {
    // button group collapsed border fix
    z-index: 1;
  }
  
  ${props => props.$disabled && css`
    cursor: not-allowed;
    background-color: transparent;
    color: var(--control-default-fgColor-disabled);
    * {
      color: var(--control-default-fgColor-disabled);
    }
  `}

  svg {
    font-size: 16px;
  }
`