import { KeyboardEvent, MouseEvent, useEffect, useRef } from 'react';
import { MdCheck } from 'react-icons/md';
import styled, { css } from 'styled-components';
import { outline } from '../../../../styles/mixins';
import { IconType } from 'react-icons';
import { useDropdownContext } from '../dropdown-list';

type Props = {
    check?: boolean;
    closeOnSelect?: boolean;
    icon?: IconType | null;
    label: string;
    dangerous?: boolean;
    onClick?: (event?: MouseEvent) => void | Promise<void>;
};

export function Item({ check, closeOnSelect, icon, label, dangerous, onClick }: Props) {
    const itemRef = useRef<HTMLLIElement>(null!);
    const [{ items }, { close, set }] = useDropdownContext();

    useEffect(() => {
        const ref = itemRef.current;
        if (ref) set(v => ({ ...v, items: [...v.items, itemRef.current] }));

        return () => set(v => ({ ...v, items: v.items.filter(i => i !== ref) }));
    }, [itemRef, set]);

    function handleKey(event: KeyboardEvent<HTMLLIElement>) {
        event.stopPropagation();
        switch (event.key) {
            case 'Enter':
            case ' ':
                event.preventDefault();
                handleClick();
                break;
            case 'ArrowDown':
            case 'ArrowUp': {
                event.preventDefault();

                const currentIndex = items.findIndex(i => i === itemRef.current);
                let newIndex = currentIndex;

                if (event.key === 'ArrowDown') {
                    newIndex = Math.min(newIndex + 1, items.length - 1);
                } else {
                    newIndex = Math.max(newIndex - 1, 0);
                }

                if (newIndex === currentIndex) return;

                items[newIndex]?.focus();

                break;
            }
            case 'Escape':
            case 'Tab':
                close();
        }
    }

    function handleClick(event?: MouseEvent) {
        event?.stopPropagation();
        const result = onClick?.(event);

        if (check == undefined || closeOnSelect) {
            if (!(result instanceof Promise)) {
                close();
            }

            if (result instanceof Promise) {
                result.finally(close);
            }
        }
    }

    return (
        <Wrapper
            ref={itemRef}
            tabIndex={0}
            $dangerous={dangerous}
            onClick={handleClick}
            onKeyDown={handleKey}
        >
            {icon !== undefined && <Icon $visible={icon !== null}>{icon?.({})}</Icon>}
            {label}
            {check !== undefined && <Check $visible={check} />}
        </Wrapper>
    );
}

const Wrapper = styled.li<{ $dangerous?: boolean }>`
    display: flex;
    padding: var(--spacing-default) var(--spacing-large);
    border-radius: var(--borderRadius-default);
    align-items: center;
    gap: var(--spacing-large);
    ${outline}

    margin-left: var(--spacing-default);
    margin-right: var(--spacing-default);

    &:first-child {
        margin-top: var(--spacing-default);
    }

    &:last-child {
        margin-bottom: var(--spacing-default);
    }

    &:hover {
        background-color: var(--control-default-bgColor-hover);
    }
    cursor: pointer;

    ${props =>
        props.$dangerous &&
        css`
            color: var(--control-danger-fgColor-rest) !important;
            * {
                color: var(--control-danger-fgColor-rest) !important;
            }

            &:hover {
                background-color: var(--control-danger-bgColor-hover);
            }
        `}
`;

const Check = styled(MdCheck)<{ $visible?: boolean }>`
    font-size: 16px;
    opacity: ${props => (props.$visible ? 1 : 0)};
    pointer-events: none;
`;

const Icon = styled.div<{ $visible?: boolean }>`
    font-size: 16px;
    min-width: 16px;
    pointer-events: none;
    ${props =>
        !props.$visible &&
        css`
            & > * {
                opacity: 0;
                pointer-events: none;
            }
        `}
`;
