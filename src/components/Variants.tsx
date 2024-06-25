import styled from 'styled-components'
import { useAppStore } from '../store/appStore'
import { AddVariant } from './AddVariant'
import { Variant } from './Variant'
import { SideBarSection } from './Sidebar'

export function Variants() {
  const { variants } = useAppStore();

  return <>
    <>
      <Title style={{ borderBottom: 'none' }}>Variants</Title>
      <AddVariant/>
    </>
      {variants.map((variant, i) => <div key={variant.id}>
        <Title>Variant {i + 1}</Title>
        <Variant {...variant} />
      </div>)}
  </>
}

const Title = styled.h4`
padding: 10px 20px 0px 20px;
`