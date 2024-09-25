import { PicaFilter } from '../../../../../store/types'
import { SelectInput } from '../../../../ui/inputs/select-input'
import { VerticalInputGroup } from '../../../../ui/inputs/styled'
import { Bold } from './styled'
import { Setting } from './setting'
import { RangeInput } from '../../../../ui/inputs/range-input'
import { Button } from '../../../../ui/inputs/button'
import { MdRefresh } from 'react-icons/md'
import { CSSProperties } from 'react'

type Props = { 
  enabled?: boolean
  filter: PicaFilter
  quality: number
  filterWidth?: number | string
  qualityRangeWidth?: number | string
  qualityInputWidth?: number | string
  filterStyle?: CSSProperties
  qualityStyle?: CSSProperties
  onFilterChange: (value: PicaFilter) => void
  onQualityChange: (value: number) => void
  onQualityChangeEnd: (value: number) => void
  onRevert?: () => void
};

export function Resampling({ 
  enabled, 
  filter, 
  quality, 
  filterWidth = 166,
  qualityRangeWidth = 120,
  qualityInputWidth = 41,
  filterStyle,
  qualityStyle,
  onFilterChange, 
  onQualityChange, 
  onQualityChangeEnd, 
  onRevert 
}: Props) {
  const qualityPercentage = Math.round(quality * 100);

  return (
    <>
      <Bold>
        Resampling
        {enabled && (
          <Button onClick={onRevert}>
            <MdRefresh/>Use variant settings
          </Button>
        )}
      </Bold>
      <VerticalInputGroup>
        <Setting label='Filter' style={filterStyle}>
          <SelectInput 
            options={[
              { label: 'Nearest neighbor', value: 'box' },
              { label: 'Hamming', value: 'hamming' },
              { label: 'Lanczos 2', value: 'lanczos2' },
              { label: 'Lanczos 3', value: 'lanczos3' },
              { label: 'MKS 2013', value: 'mks2013' },
            ]}
            value={filter}
            onChange={v => onFilterChange(v as PicaFilter)}
            style={{ maxWidth: filterWidth }}
          />
        </Setting>
        <Setting label='Quality' unit='%' style={qualityStyle}>
          <RangeInput 
            value={qualityPercentage}
            min={0}
            max={100}
            step={1}
            onRangeChange={v => onQualityChange(v)}
            onRangeChangeEnd={v => onQualityChangeEnd(v)}
            onInputChange={v => onQualityChangeEnd(v)}
            style={{ width: '100%', maxWidth: qualityRangeWidth }}
            numberInputStyle={{ maxWidth: qualityInputWidth }}
            numberInput
          />
        </Setting>
      </VerticalInputGroup>
    </>
  )
}


