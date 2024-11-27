import { CSSProperties } from 'react';
import { Alignment } from '../../dropdown-list/types';

export type Props = {
    label?: string;
    value: string | number;
    options: Option[];
    align?: Alignment;
    style?: CSSProperties;
    onChange: (value: string | number) => void;
};

export type Option = {
    label: string;
    value: string | number;
};
