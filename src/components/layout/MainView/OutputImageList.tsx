import styled from 'styled-components'
import { SelectInput } from '../../inputs/SelectInput'
import { useCallback, useMemo, useState } from 'react'
import { MdArrowDownward, MdArrowUpward, MdClose, MdMoreHoriz } from 'react-icons/md'
import { ImageList } from './ImageList'
import { SortDirection, SortType } from './ImageList/types'
import { Button } from '../../inputs/Button'
import { SectionHeader, SectionTitle } from '../../styled'
import { compare, removeFileExtension } from '../../../lib/helpers'
import { OutputImageData } from '../../../store/types'
import { ButtonGroup } from '../../inputs/styled'
import { TextInput } from '../../inputs/TextInput'
import { useVariants } from '../../../store/variants'
import { useOutputImages } from '../../../store/outputImages'
import { SECTION_HEADER_HEIGHT } from '../../../lib/constants'

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

export function OutputImageList() {
  const [sortOption, setSortOption] = useState<SortType>(SortType.FILENAME);
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.ASC);
  const [filter, setFilter] = useState('');
  const images = useOutputImages(state => state.images);
  const variants = useVariants(state => state.variants);

  const sortingMethod = useCallback((a: OutputImageData, b: OutputImageData) => {
    switch(sortOption) {
      case SortType.VARIANT: {
        const variantA = variants.find(v => v.id === a.variantId);
        const variantB = variants.find(v => v.id === b.variantId);

        if (!variantA || !variantB) return 0;

        return sortDirection === SortDirection.ASC
        ? compare(variantA.index, variantB.index) || collator.compare(a.filename, b.filename)
        : compare(variantB.index, variantA.index) || collator.compare(a.filename, b.filename);
      }
      case SortType.FILESIZE:
        return sortDirection === SortDirection.ASC 
        ? compare(a.image.full.size, b.image.full.size)
        : compare(b.image.full.size, a.image.full.size);
      default:
        return sortDirection === SortDirection.ASC 
        ? collator.compare(removeFileExtension(a.filename), removeFileExtension(b.filename))
        : collator.compare(removeFileExtension(b.filename), removeFileExtension(a.filename));
      }
  }, [sortOption, sortDirection, variants]);

  const sortedImages = useMemo(
    () => [...images].sort(sortingMethod),
    [images, sortingMethod]
  );

  const filteredImages = filter.length ? sortedImages.filter(img => img.filename.includes(filter)) : sortedImages;
      
  function handleChange(value: string | number) {
    setSortOption(value as SortType);
  }
  
  function flipSortDirection() {
    setSortDirection(prev => prev === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC )
  }
 
  return (
    <Wrapper>
      <FixedTitle>
        <SectionHeader>
          <SectionTitle>Output images</SectionTitle>
          <Sort>
            <span >Filter by:</span>
            <TextInput 
              value={filter}
              onChange={e => setFilter(e.target.value)}
              suffix={filter.length 
                ? <ClearFilter onClick={() => setFilter('')}/> 
                : undefined
              }
              style={{ width: 137 }}
            />
            <span style={{ marginLeft: 8 }}>Sort by:</span>
            <ButtonGroup>
              <SelectInput 
                value={sortOption} 
                onChange={handleChange}
                options={[
                  { label: 'File name', value: SortType.FILENAME },
                  { label: 'File size', value: SortType.FILESIZE },
                  { label: 'Variant', value: SortType.VARIANT },
                ]}
              />
              <Button onClick={flipSortDirection}>
                {sortDirection === SortDirection.ASC 
                  ? <MdArrowUpward/>
                  : <MdArrowDownward/>
                }
              </Button>
            </ButtonGroup>
            <Button style={{ marginLeft: 8 }}>
              <MdMoreHoriz/>
            </Button>
          </Sort>
        </SectionHeader>
      </FixedTitle>
      <ImageListWrapper>
        <ImageList 
          type='output'
          images={filteredImages} 
          sortBy={sortOption}
          />
      </ImageListWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
flex: 1;
display: flex;
flex-direction: column;
height: 100%;
border-top: 1px solid var(--borderColor-default);
`

const ImageListWrapper = styled.div`
position: relative;
height: calc(100% - ${SECTION_HEADER_HEIGHT}px);
`

const ClearFilter = styled(MdClose)`
cursor: pointer;
`

const FixedTitle = styled.div`
width: 100%;
z-index: 3;
pointer-events: none;
`

const Sort = styled.div`
display: flex;
gap: 5px;
align-items: center;

span {
  font-weight: 500;
}
`