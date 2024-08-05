import { IoMdAdd } from "react-icons/io";
import { Button } from '../../../../inputs/Button'
import { useVariants } from '../../../../../store/variants'

let index = 0;

export function AddVariant() {
  const api = useVariants(state => state.api);

  function handleAdd() {
    index++;

    api.add({
      id: `v-${Date.now()}`,
      index,
      width: undefined,
      height: undefined,
      prefix: '',
      suffix: '',
      crop: false,
      overWriteQuality: false,
      quality: 1
    });
  }

  return <Button onClick={handleAdd}><IoMdAdd/>Add</Button>;
}
