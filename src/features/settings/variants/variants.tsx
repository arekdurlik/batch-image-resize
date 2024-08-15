import { useVariants } from '../../../store/variants'
import { SectionHeader, SectionTitle } from '../../layout/styled'
import { AddVariant } from './add-variant'
import { Variant } from './variant'

export function Variants() {
  const variants = useVariants(state => state.variants);

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



