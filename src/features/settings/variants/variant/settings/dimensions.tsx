import { SelectInput } from '../../../../ui/inputs/select-input';
import { VerticalInputGroup } from '../../../../ui/inputs/styled';
import { Setting } from './setting';
import { Bold } from './styled';
import { Variant } from '../../../../../store/types';
import { useVariants } from '../../../../../store/variants/variants';
import { DimensionMode } from '../../../../../types';
import { NumberInput } from '../../../../ui/inputs/number-input';

export function Dimensions({ variant }: { variant: Variant }) {
    const api = useVariants(state => state.api);

    return (
        <>
            <Bold>Dimensions</Bold>
            <VerticalInputGroup>
                <Setting label="Width" suffix="px">
                    <SelectInput
                        options={[
                            { label: 'exactly', value: 'exact' },
                            { label: 'up to', value: 'upto' },
                        ]}
                        value={variant.width.mode}
                        onChange={v => api.setWidthMode(variant.id, v as DimensionMode)}
                        style={{ maxWidth: 81 }}
                    />
                    <NumberInput
                        min={1}
                        step={1}
                        value={variant.width.value ?? ''}
                        onChange={v => api.setDimension('width', variant.id, v)}
                        align="end"
                        style={{ maxWidth: 81 }}
                    />
                </Setting>
                <Setting label="Height" suffix="px">
                    <SelectInput
                        options={[
                            { label: 'exactly', value: 'exact' },
                            { label: 'up to', value: 'upto' },
                        ]}
                        value={variant.height.mode}
                        onChange={v => api.setHeightMode(variant.id, v as DimensionMode)}
                        style={{ maxWidth: 81 }}
                    />
                    <NumberInput
                        min={1}
                        step={1}
                        value={variant.height.value ?? ''}
                        onChange={v => api.setDimension('height', variant.id, v)}
                        align="end"
                        style={{ maxWidth: 81 }}
                    />
                </Setting>
            </VerticalInputGroup>
        </>
    );
}
