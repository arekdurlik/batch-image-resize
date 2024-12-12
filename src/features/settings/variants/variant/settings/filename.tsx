import { ChangeEvent, useState } from 'react';
import { Variant } from '../../../../../store/types';
import { VerticalInputGroup } from '../../../../ui/inputs/styled';
import { Bold } from './styled';
import { useVariants } from '../../../../../store/variants/variants';
import { TextInput } from '../../../../ui/inputs/text-input';
import { Setting } from './setting';
import { IoMdInformationCircle } from 'react-icons/io';

export function Filename({ variant }: { variant: Variant }) {
    const api = useVariants(state => state.api);
    const [pattern, setPattern] = useState('');

    function handleFilenamePart(part: 'prefix' | 'suffix', variantId: string) {
        return (e: ChangeEvent<HTMLInputElement>) => {
            api.setFilenamePart(part, variantId, e.target.value);
        };
    }

    return (
        <>
            <Bold>Filename</Bold>
            <VerticalInputGroup>
                <Setting label="Prefix" disabled={pattern.length > 0}>
                    <TextInput
                        value={variant.prefix}
                        onChange={handleFilenamePart('prefix', variant.id)}
                        style={{ maxWidth: 166 }}
                        spellCheck={false}
                    />
                </Setting>
                <Setting label="Suffix" disabled={pattern.length > 0}>
                    <TextInput
                        value={variant.suffix}
                        onChange={handleFilenamePart('suffix', variant.id)}
                        style={{ maxWidth: 166 }}
                        spellCheck={false}
                    />
                </Setting>
                <Setting label="Pattern" suffix={<IoMdInformationCircle />}>
                    <TextInput
                        value={pattern}
                        onChange={e => setPattern(e.target.value)}
                        style={{ maxWidth: 166 }}
                        spellCheck={false}
                    />
                </Setting>
            </VerticalInputGroup>
        </>
    );
}
