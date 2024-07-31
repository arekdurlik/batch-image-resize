import { IoMdAdd } from "react-icons/io";
import { useAppStore } from '../../../../../store/appStore'
import { Button } from '../../../../styled/globals'

export function AddVariant() {
  const api = useAppStore(state => state.api);

  function handleAdd() {
    api.addVariant({
      id: `v-${Date.now()}`,
      width: undefined,
      height: undefined,
      prefix: '',
      suffix: '',
      crop: false
    })
  }
  return <Button onClick={handleAdd}><IoMdAdd/>Add</Button>
}
