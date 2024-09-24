import { Variant } from '../../../../../store/types'
import { VerticalInputGroup } from '../../../../ui/inputs/styled'
import { Bold } from './styled'
import { Setting } from './setting'
import { useVariants } from '../../../../../store/variants'
import { RangeInput } from '../../../../ui/inputs/range-input'

export function Sharpening({ variant }: { variant: Variant }) {
  const api = useVariants(state => state.api);

  return (
    <>
      <Bold>Sharpening</Bold>
      <VerticalInputGroup>
        <Setting label='Amount' unit='%'>
          <RangeInput 
            min={0}
            max={500}
            step={1}
            value={variant.sharpenAmount}
            onRangeChange={value => api.setSharpenAmount(variant.id, value, false)}
            onRangeChangeEnd={() => api.regenerate(variant.id)}
            onInputChange={value => api.setSharpenAmount(variant.id, value)}
            style={{ maxWidth: 98 }}
            numberInput
            numberInputStyle={{ maxWidth: 41 }}
          />
        </Setting>

        <Setting label='Radius' unit='px'>
          <RangeInput 
            min={0.5}
            max={2}
            step={0.1}
            value={variant.sharpenRadius}
            onRangeChange={value => api.setSharpenRadius(variant.id, value, false)}
            onRangeChangeEnd={() => api.regenerate(variant.id)}
            onInputChange={value => api.setSharpenRadius(variant.id, value)}
            style={{ maxWidth: 98 }}
            numberInput
            numberInputStyle={{ maxWidth: 41 }}
          />
        </Setting>

        <Setting label='Threshold' unit='lvls'>
          <RangeInput 
            min={0}
            max={255}
            step={1}
            value={variant.sharpenThreshold}
            onRangeChange={value => api.setSharpenThreshold(variant.id, value, false)}
            onRangeChangeEnd={() => api.regenerate(variant.id)}
            onInputChange={value => api.setSharpenThreshold(variant.id, value)}
            style={{ maxWidth: 98 }}
            numberInput
            numberInputStyle={{ maxWidth: 41 }}
          />
        </Setting>
      </VerticalInputGroup>
    </>
  )
}


