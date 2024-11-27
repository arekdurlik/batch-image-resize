import { SelectInput } from '../../../../ui/inputs/select-input';
import { VerticalInputGroup } from '../../../../ui/inputs/styled';
import { Setting } from './setting';
import { Bold } from './styled';
import { TextInput } from '../../../../ui/inputs/text-input';
import { Variant } from '../../../../../store/types';
import { useVariants } from '../../../../../store/variants';
import { DimensionMode } from '../../../../../types';
import { ChangeEvent } from 'react';

export function Dimensions({ variant }: { variant: Variant }) {
    const api = useVariants(state => state.api);

    function handleDimensionChange(dimension: 'width' | 'height') {
        return (event: ChangeEvent<HTMLInputElement>) => {
            let value: number | undefined;

            const regex = /^[0-9]+$/;

            if (event.target.value.match(regex)) {
                value = Number(event.target.value);
            } else {
                value = undefined;
            }

            api.setDimension(dimension, variant.id, value);
        };
    }

    return (
        <>
            <Bold>Dimensions</Bold>
            <VerticalInputGroup>
                <Setting label="Width" unit="px">
                    <SelectInput
                        options={[
                            { label: 'exactly', value: 'exact' },
                            { label: 'up to', value: 'upto' },
                        ]}
                        value={variant.width.mode}
                        onChange={v => api.setWidthMode(variant.id, v as DimensionMode)}
                        style={{ maxWidth: 81 }}
                    />
                    <TextInput
                        value={variant.width.value ?? ''}
                        onChange={handleDimensionChange('width')}
                        align="end"
                        style={{ maxWidth: 81 }}
                    />
                </Setting>
                <Setting label="Height" unit="px">
                    <SelectInput
                        options={[
                            { label: 'exactly', value: 'exact' },
                            { label: 'up to', value: 'upto' },
                        ]}
                        value={variant.height.mode}
                        onChange={v => api.setHeightMode(variant.id, v as DimensionMode)}
                        style={{ maxWidth: 81 }}
                    />
                    <TextInput
                        value={variant.height.value ?? ''}
                        onChange={handleDimensionChange('height')}
                        align="end"
                        style={{ maxWidth: 81 }}
                    />
                </Setting>
            </VerticalInputGroup>
        </>
    );
}
