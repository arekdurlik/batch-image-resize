import styled, { css } from 'styled-components';
import { TextInputContainer, TextInputLabel, TextInputWrapper } from './text-input';

export const HorizontalInputGroup = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
`;

export const VerticalInputGroup = styled(HorizontalInputGroup)<{
    $labelWidth?: number;
}>`
    flex-direction: column;
    align-items: flex-end;
    gap: 5px;
    margin-left: 10px;

    ${TextInputWrapper} {
        justify-content: flex-end;
    }
    ${props =>
        props.$labelWidth &&
        css`
            ${TextInputLabel} {
                width: ${props.$labelWidth}px;
            }
        `}
`;

export const ButtonGroup = styled.div`
    display: flex;

    & > {
        &:first-child {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;

            ${TextInputContainer} {
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
            }
        }

        &:last-child {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;

            ${TextInputContainer} {
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            }
        }

        &:not(:first-child) {
            margin-left: -1px;
        }

        &:not(:first-child):not(:last-child) {
            border-radius: 0;

            ${TextInputContainer} {
                border-radius: 0;
            }
        }
    }
`;
