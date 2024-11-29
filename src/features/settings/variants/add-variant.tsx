import { IoMdAdd } from 'react-icons/io';
import { useVariants } from '../../../store/variants/variants';
import { Button } from '../../ui/inputs/button';
import { defaultVariantSettings } from '../../../store/variants/utils';
import { Variant } from '../../../store/types';

let index = 1;

function getNextVariantName(variants: Variant[]) {
    const defaultNameRegex = /^Variant (\d+)$/;

    let maxNumber = 0;
    let hasMatch = false;
    variants.forEach(variant => {
        const match = variant.name.match(defaultNameRegex);
        if (match) {
            hasMatch = true;
            const number = parseInt(match[1], 10);
            if (number > maxNumber) {
                maxNumber = number;
            }
        }
    });

    return hasMatch ? `Variant ${maxNumber + 1}` : `Variant ${variants.length + 1}`;
}

export function AddVariant({ onAdd }: { onAdd?: (variantId: string) => void }) {
    const api = useVariants(state => state.api);
    const variants = useVariants(state => state.variants);

    function handleAdd() {
        index++;

        const id = `v-${Date.now()}`;

        api.add({
            id,
            index,
            name: getNextVariantName(variants),
            ...defaultVariantSettings,
        });

        onAdd?.(id);
    }

    return (
        <Button onClick={handleAdd}>
            <IoMdAdd />
            Add
        </Button>
    );
}
