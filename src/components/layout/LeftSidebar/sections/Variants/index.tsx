import { useAppStore } from '../../../../../store/appStore'
import { SectionHeader, SectionTitle } from '../../../../styled'
import { AddVariant } from './AddVariant'
import { Variant } from './Variant'

export function Variants() {
  const variants = useAppStore(state => state.variants);

  return (
    <>
      <SectionHeader>
        <SectionTitle>Variants</SectionTitle>
        <AddVariant/>
      </SectionHeader>
      {variants.map((variant, i) => <Variant key={variant.id} {...variant} index={i} />)}
    </>
  )
}



