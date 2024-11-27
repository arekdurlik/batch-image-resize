import { useRef, useState } from 'react';
import { Props } from './types';
import { Select, SelectedOption, Triangle } from './styled';
import { ActionMenu } from '../../action-menu';

export function SelectInput({ value, options, align, style, onChange }: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null!);
    const currentLabel = options.find(o => o.value === value)?.label;

    function handleSelect(value: string | number) {
        return () => {
            onChange(value);
        };
    }

    return (
        <>
            <Select ref={ref} tabIndex={0} style={style} $open={open}>
                <SelectedOption>{currentLabel}</SelectedOption>
                <Triangle />
            </Select>
            <ActionMenu
                actuator={ref}
                initialHighlightIndex={options.findIndex(opt => opt.value === value) ?? 0}
                align={align}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                slideIn
            >
                {options.map(option => (
                    <ActionMenu.Item
                        key={option.label + option.value}
                        label={option.label}
                        onClick={handleSelect(option.value)}
                        check={option.value === value}
                    />
                ))}
            </ActionMenu>
        </>
    );
}
