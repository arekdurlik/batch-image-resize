import { IoMdAdd } from "react-icons/io";
import { useAppStore } from '../../../../../store/appStore'
import { Button } from '../../../../inputs/Button'

let index = 0;

export function AddVariant() {
  const api = useAppStore(state => state.api);

  function handleAdd() {
    index++;

    api.addVariant({
      id: `v-${Date.now()}`,
      index,
      width: undefined,
      height: undefined,
      prefix: '',
      suffix: '',
      crop: false
    });
  }

  return <Button onClick={handleAdd}><IoMdAdd/>Add</Button>;
}
