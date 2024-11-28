import { IoMdAdd } from 'react-icons/io';
import { useVariants } from '../../../store/variants/variants';
import { Button } from '../../ui/inputs/button';
import { defaultVariantSettings } from '../../../store/variants/utils';

let index = 1;

export function AddVariant({ onAdd }: { onAdd?: (variantId: string) => void }) {
    const api = useVariants(state => state.api);

    function handleAdd() {
        index++;

        const id = `v-${Date.now()}`;

        api.add({
            id,
            index,
            name: `Variant ${index}`,
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
