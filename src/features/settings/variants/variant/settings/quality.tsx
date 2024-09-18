import { Variant } from '../../../../../store/types'
import { SelectInput } from '../../../../ui/inputs/select-input'
import { VerticalInputGroup } from '../../../../ui/inputs/styled'
import { TextInput } from '../../../../ui/inputs/text-input'
import { Bold } from './styled'
import { Setting } from './setting'
import { useState } from 'react'

export function Quality({ variant }: { variant: Variant }) {
  const [quality, setQuality] = useState(100);
  const [filter, setFilter] = useState<string | number>('lanczos3');

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
            value={filter}
            onChange={setFilter}
            style={{ maxWidth: 144 }}
          />
        </Setting>
        <Setting label='Quality' unit='%'>
          <input 
            type='range'
            value={quality}
            onChange={e => setQuality(Number(e.target.value))}
            style={{ maxWidth: 98 }}
          />
          <TextInput 
            value={quality}
            onChange={e => setQuality(Number(e.target.value))}
            align='end'
            style={{ maxWidth: 41 }} 
          />
        </Setting>
      </VerticalInputGroup>
    </>
  )
}


