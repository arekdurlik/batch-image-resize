import { Button, ButtonGroup, SectionHeader, SectionTitle } from '../../styled/globals'
import styled from 'styled-components'
import { SelectInput } from '../../inputs/SelectInput'
import { useState } from 'react'
import { MdArrowDownward, MdArrowUpward, MdMoreHoriz } from 'react-icons/md'
import { useAppStore } from '../../../store/appStore'
import { ImageList } from './ImageList'
import { SortDirection, SortType } from './ImageList/types'

export function OutputImageList() {
  const [sortOption, setSortOption] = useState<SortType>(SortType.FILENAME);
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.ASC);
  const images = useAppStore(state => state.outputImages);

  function handleChange(value: string | number) {
    setSortOption(value as SortType);
  }

  function flipSortDirection() {
    setSortDirection(prev => prev === SortDirection.ASC  ? SortDirection.DESC  : SortDirection.ASC )
  }

  return (
    <>
      <FixedTitle>
        <SectionHeader>
          <SectionTitle>Output images</SectionTitle>
          <Sort>
            <span>Sort by:</span>
            <ButtonGroup>
              <SelectInput 
                value={sortOption} 
                onChange={handleChange}
                options={[
                  { label: 'File name', value: SortType.FILENAME },
                  { label: 'File size', value: SortType.FILESIZE },
                ]}
              />
              <Button onClick={flipSortDirection}>
                {sortDirection === SortDirection.ASC 
                  ? <MdArrowUpward/>
                  : <MdArrowDownward/>
                }
              </Button>
            </ButtonGroup>
            <Button style={{ marginLeft: 16 }}>
              <MdMoreHoriz/>
            </Button>
          </Sort>
        </SectionHeader>
      </FixedTitle>
      <Wrapper>
        <ImageList images={images} sortBy={sortOption} sortDir={sortDirection}/>
      </Wrapper>
    </>
  )
}

const FixedTitle = styled.div`
position: absolute;
z-index: 3;
background: linear-gradient(to top, var(--bgColor-default-transparent), var(--bgColor-default) 85%);
backdrop-filter: blur(15px);
width: 100%;
`

const Wrapper = styled.div`
overflow-y: scroll;
height: calc(100%);
padding-top: 50px;

&::-webkit-scrollbar {
    background-color: var(--bgColor-default);
    
}

&::-webkit-scrollbar-track {
    background-color: #efefef;
    margin-top: 50px;
  }

&::-webkit-scrollbar-thumb {
    background-color: #bbb;
    border-radius: 20px;
    border: 0.2vw solid #eee;
    transition: background-color var(--transition-default);
    
    &:hover {
      background-color: #aaa;
    }

    &:active {
      background-color: #999;
    }
}

&::-webkit-scrollbar-button {
    display:none;
}
`

const Sort = styled.div`
display: flex;
gap: 5px;
align-items: center;

span {
  font-weight: 500;
}

${Button} {
}
`