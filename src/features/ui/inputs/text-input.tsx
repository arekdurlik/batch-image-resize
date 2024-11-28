import { ReactNode, useState, forwardRef, InputHTMLAttributes, FocusEvent } from 'react';
import styled from 'styled-components';
import { outlineRest, outlineActive } from '../../../styles/mixins';

type Props = {
    label?: string;
    value: string | number;
    prefix?: ReactNode;
    suffix?: ReactNode;
    bold?: boolean;
    align?: CanvasTextAlign;
} & InputHTMLAttributes<HTMLInputElement>;

export const TextInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const { label, value, prefix, suffix, bold, align, style, ...rest } = props;
    const [isFocused, setIsFocused] = useState(false);

    function handleBlur(event: FocusEvent<HTMLInputElement>) {
        setIsFocused(false);
        rest.onBlur?.(event);
    }

    return (
        <TextInputWrapper style={style}>
            {label && <TextInputLabel htmlFor={label}>{label}:</TextInputLabel>}
            <TextInputContainer $focused={isFocused}>
                {prefix && <Icon>{prefix}</Icon>}
                <Input
                    ref={ref}
                    name={label}
                    type="text"
                    value={value}
                    placeholder={rest.placeholder}
                    onChange={rest.onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={handleBlur}
                    spellCheck={rest.spellCheck}
                    style={{
                        ...(bold && { fontWeight: 500 }),
                        ...(align && { textAlign: align }),
                    }}
                    {...rest}
                ></Input>
                {suffix && <Icon>{suffix}</Icon>}
            </TextInputContainer>
        </TextInputWrapper>
    );
});

export const TextInputWrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-default);
    white-space: nowrap;
    width: 100%;
`;

export const TextInputLabel = styled.label`
    font-weight: 600;
`;

export const TextInputContainer = styled.div<{ $focused: boolean }>`
    ${outlineRest}
    ${props => props.$focused && outlineActive}
background-color: var(--control-default-bgColor-rest);
    border: 1px solid var(--borderColor-default);
    border-radius: var(--borderRadius-default);
    transition: border-color var(--transition-default);
    overflow: hidden;
    padding: 0 6px;

    display: flex;
    width: 100%;
    align-items: center;
    gap: var(--spacing-default);
`;

const Input = styled.input`
    font-weight: 400;
    width: 100%;
    height: 27px;
    outline: none;
    border: none;
    background-color: transparent;
`;

const Icon = styled.div`
    font-size: 16px;
    min-width: 16px;
    color: var(--fgColor-icon);

    span {
        color: var(--fgColor-icon);
    }

    svg {
        fill: var(--fgColor-icon);
    }
`;
