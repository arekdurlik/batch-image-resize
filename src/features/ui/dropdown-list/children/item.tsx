import { MouseEvent } from 'react';
import { MdCheck } from 'react-icons/md';
import styled, { css } from 'styled-components';
import { outline } from '../../../../styles/mixins';
import { IconType } from 'react-icons';

type Props = {
    check?: boolean;
    icon?: IconType | null;
    label: string;
    dangerous?: boolean;
    onClick?: (event: MouseEvent) => void;
};

export function Item({ check, icon, label, dangerous, onClick }: Props) {
    return (
        <Wrapper onClick={onClick} tabIndex={-1} $dangerous={dangerous}>
            {check !== undefined && <Check $visible={check} />}
            {icon !== undefined && <Icon $visible={icon !== null}>{icon?.({})}</Icon>}
            {label}
        </Wrapper>
    );
}

const Wrapper = styled.div<{ $dangerous?: boolean }>`
    display: flex;
    padding: var(--spacing-default) var(--spacing-large);
    border-radius: var(--borderRadius-default);
    align-items: center;
    gap: 10px;
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
