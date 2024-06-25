import styled from 'styled-components'
import { useAppStore } from '../store/appStore'
import { Button } from './styled/globals'
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import { SideBarSection } from './Sidebar'

export function AddVariant() {
  const { addVariant, variants } = useAppStore();

  function handleAdd() {
    addVariant({
      id: `v-${Date.now()}`,
      width: null,
      height: null,
      prefix: '',
      suffix: ''
    })
  }
  return <SideBarSection>
    <Flex>
    <Button onClick={handleAdd}>
      <IoMdAdd/>Add variant
    </Button>
    <Button onClick={handleAdd}>
      <IoMdTrash/>
    </Button>
    </Flex>
  </SideBarSection>
}

const Flex = styled.div`
display: flex;
gap: 10px;
justify-content: space-between;
`