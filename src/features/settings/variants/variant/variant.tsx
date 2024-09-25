import { IoMdTrash } from 'react-icons/io'
import styled from 'styled-components'
import { Variant as VariantType } from '../../../../store/types'
import { useVariants } from '../../../../store/variants'
import { SectionGroup, SideBarSection } from '../../../layout/styled'
import { Button } from '../../../ui/inputs/button'
import { Filename } from './settings/filename'
import { Resampling } from './settings/resampling'
import { Dimensions } from './settings/dimensions'
import { AspectRatios } from './settings/aspect-ratios'
import { Rename } from './settings/rename'
import { Sharpening } from './settings/sharpening'

export function Variant(variant: VariantType) {
  const api = useVariants(state => state.api);

  return (
    <SectionGroup>
      <VariantHeader>
        <Rename variant={variant} />
        <Button onClick={() => api.delete(variant.id)}>
          <IoMdTrash/>Delete
        </Button>
      </VariantHeader>
      <SideBarSection>
        <Filename variant={variant}/>
        <Resampling 
          filter={variant.filter}
          quality={variant.quality}
          onFilterChange={v => api.setFilter(variant.id, v)}
          onQualityChange={v => api.setQuality(variant.id, v / 100, false)}
          onQualityChangeEnd={v => api.setQuality(variant.id, v / 100)}
        />
        <Sharpening 
          amount={variant.sharpenAmount}
          radius={variant.sharpenRadius}
          threshold={variant.sharpenThreshold}
          onAmountChange={v => api.setSharpenAmount(variant.id, v, false)}
          onAmountChangeEnd={v => api.setSharpenAmount(variant.id, v)}
          onRadiusChange={v => api.setSharpenRadius(variant.id, v, false)}
          onRadiusChangeEnd={v => api.setSharpenRadius(variant.id, v)}
          onThresholdChange={v => api.setSharpenThreshold(variant.id, v, false)}
          onThresholdChangeEnd={v => api.setSharpenThreshold(variant.id, v)}
        />
        <Dimensions variant={variant}/>
        <AspectRatios variant={variant}/>
      </SideBarSection>
    </SectionGroup>
  )
}

const VariantHeader = styled.div`
display: flex;
font-size: inherit;
gap: 5px;
justify-content: space-between;
align-items: center;
`