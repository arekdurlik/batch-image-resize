import { PicaFilter, Variant } from '../../../../../store/types'
import { SelectInput } from '../../../../ui/inputs/select-input'
import { VerticalInputGroup } from '../../../../ui/inputs/styled'
import { TextInput } from '../../../../ui/inputs/text-input'
import { Bold } from './styled'
import { Setting } from './setting'
import { useVariants } from '../../../../../store/variants'
import { ChangeEvent } from 'react'

export function Quality({ variant }: { variant: Variant }) {
  const api = useVariants(state => state.api);
  const qualityPercentage = Math.round(variant.quality * 100);

  function handleQuality(event: ChangeEvent<HTMLInputElement>) {
    const percentage = Number(event.target.value);

    api.setQuality(variant.id, percentage / 100);
  }

  return (
    <>
      <Bold>Resampling</Bold>
      <VerticalInputGroup>
        <Setting label='Filter'>
          <SelectInput 
            options={[
              { label: 'Nearest neighbor', value: 'box' },
              { label: 'Hamming', value: 'hamming' },
              { label: 'Lanczos 2', value: 'lanczos2' },
              { label: 'Lanczos 3', value: 'lanczos3' },
              { label: 'MKS 2013', value: 'mks2013' },
            ]}
            value={variant.filter}
            onChange={v => api.setFilter(variant.id, (v as PicaFilter))}
            style={{ maxWidth: 144 }}
          />
        </Setting>
        <Setting label='Quality' unit='%'>
          <input 
            type='range'
            value={qualityPercentage}
            onChange={handleQuality}
            style={{ maxWidth: 98 }}
          />
          <TextInput 
            value={qualityPercentage}
            onChange={handleQuality}
            align='end'
            style={{ maxWidth: 41 }} 
          />
        </Setting>
      </VerticalInputGroup>
    </>
  )
}


