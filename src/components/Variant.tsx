import { TextInput } from './inputs/TextInput'
import { useAppStore, Variant as VariantType } from '../store/appStore'
import { SideBarSection } from './Sidebar'


export function Variant(variant: VariantType) {
  const { setVariantPrefix, setVariantSuffix, setVariantWidth, setVariantHeight } = useAppStore();

  return <SideBarSection>
    <TextInput label='Prefix' value={variant.prefix} onChange={e => setVariantPrefix(variant.id, e.target.value)} />
    <TextInput label='Suffix' value={variant.suffix} onChange={e => setVariantSuffix(variant.id, e.target.value)} />
    <div style={{ display: 'flex', gap: 10 }}>
    <TextInput label='Width' value={variant.width ?? ''} onChange={e => setVariantWidth(variant.id, Number(e.target.value))} />
    <TextInput label='Height' value={variant.height ?? ''} onChange={e => setVariantHeight(variant.id, Number(e.target.value))} />
    </div>
  </SideBarSection>
}