import { IoMdTrash } from 'react-icons/io'
import styled from 'styled-components'
import { Variant as VariantType } from '../../../../store/types'
import { useVariants } from '../../../../store/variants'
import { SectionGroup, SideBarSection } from '../../../layout/styled'
import { Button } from '../../../ui/inputs/button'
import { Filename } from './settings/filename'
import { Quality } from './settings/quality'
import { Dimensions } from './settings/dimensions'
import { AspectRatios } from './settings/aspect-ratios'
import { Rename } from './settings/rename'

export function Variant(variant: VariantType) {
  const api = useVariants(state => state.api);

  function handleDelete() {
    api.delete(variant.id);
  }

  return (
    <SectionGroup>
      <VariantHeader>
        <Rename variant={variant} />
        <Button onClick={handleDelete}>
          <IoMdTrash/>Delete
        </Button>
      </VariantHeader>
      <SideBarSection>
        <Filename variant={variant}/>
        <Quality variant={variant}/>
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
padding-bottom: 5px;
`