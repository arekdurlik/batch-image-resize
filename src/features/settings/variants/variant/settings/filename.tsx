import { ChangeEvent } from 'react'
import { Variant } from '../../../../../store/types'
import { VerticalInputGroup } from '../../../../ui/inputs/styled'
import { Bold } from './styled'
import { useVariants } from '../../../../../store/variants'
import { TextInput } from '../../../../ui/inputs/text-input'
import { Setting } from './setting'

export function Filename({ variant }: { variant: Variant }) {
  const api = useVariants(state => state.api);

  function handleFilenamePart(part: 'prefix' | 'suffix', variantId: string) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      api.setFilenamePart(part, variantId, e.target.value);
    }
  }

  return (
    <>
      <Bold>Filename</Bold>
      <VerticalInputGroup>
        <Setting label='Prefix'>
          <TextInput 
            value={variant.prefix} 
            onChange={handleFilenamePart('prefix', variant.id)}
            style={{ maxWidth: 144 }}
            />
        </Setting>
        <Setting label='Suffix'>
        <TextInput 
            value={variant.suffix} 
            onChange={handleFilenamePart('suffix', variant.id)} 
            style={{ maxWidth: 144 }}
          />
        </Setting>
      </VerticalInputGroup>
    </>
  )
}