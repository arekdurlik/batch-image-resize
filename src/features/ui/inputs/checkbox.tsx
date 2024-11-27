import { ChangeEventHandler, CSSProperties } from 'react';
import styled from 'styled-components';

type Props = {
    label?: string;
    checked: boolean;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    style?: CSSProperties;
};

export function Checkbox({ label, checked, onChange, style }: Props) {
    return (
        <Container style={style}>
            <Label>
                <input type="checkbox" name={label} checked={checked} onChange={onChange} />
                <span>{label}</span>
            </Label>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    align-items: center;
    gap: 7px;
    font-weight: 600;
`;

const Label = styled.label`
    font-weight: 600;
    user-select: none;
    display: flex;
    gap: 5px;
`;
