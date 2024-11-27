import {
    ButtonHTMLAttributes,
    MouseEventHandler,
    ReactNode,
    CSSProperties,
    forwardRef,
    MouseEvent,
} from 'react';
import styled, { css } from 'styled-components';
import { outline } from '../../../styles/mixins';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    disabled?: boolean;
    active?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    children: ReactNode;
    style?: CSSProperties;
};

export const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
    const { disabled, active, onClick, children, style, ...rest } = props;

    function handleClick(event: MouseEvent<HTMLButtonElement>) {
        !disabled && onClick?.(event);
    }

    return (
        <StyledButton
            tabIndex={disabled ? -1 : 0}
            ref={ref}
            onClick={handleClick}
            style={style}
            $active={active}
            $disabled={disabled}
            {...rest}
        >
            {children}
        </StyledButton>
    );
});

export const StyledButton = styled.button<{
    $disabled?: boolean;
    $active?: boolean;
}>`
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
    font-size: 14px;
    font-weight: 600;
    min-height: 29px;
    width: fit-content;
    cursor: pointer;
    transition: background-color var(--transition-default), outline var(--transition-fast);

    &:hover {
        background-color: var(--control-default-bgColor-hover);
    }

    ${props =>
        props.$active &&
        css`
            background-color: var(--control-default-bgColor-active) !important;
        `}
    &:active {
        background-color: var(--control-default-bgColor-active) !important;
    }

    &:focus-visible {
        // button group collapsed border fix
        z-index: 1;
    }

    ${props =>
        props.$disabled &&
        css`
            cursor: not-allowed;
            background-color: transparent;
            color: var(--control-default-fgColor-disabled);
            * {
                color: var(--control-default-fgColor-disabled);
            }
        `}

    svg {
        font-size: 16px;
        min-width: 16px;
    }
`;
