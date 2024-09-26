import { IoMdAdd } from 'react-icons/io'
import { useVariants } from '../../../store/variants'
import { Button } from '../../ui/inputs/button'

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
      width: {
        mode: 'exact',
        value: undefined
      },
      height: {
        mode: 'exact',
        value: undefined
      },
      prefix: '',
      suffix: '',
      crop: false,
      overWriteQuality: false,
      filter: 'mks2013',
      quality: 1,
      sharpenAmount: 0,
      sharpenRadius: 0.5,
      sharpenThreshold: 0,
      aspectRatio: {
        enabled: false,
        value: '1:1'
      }
    });

    onAdd?.(id)
  }

  return <Button onClick={handleAdd}><IoMdAdd/>Add</Button>;
}
