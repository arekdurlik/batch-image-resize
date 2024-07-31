import { Button, SectionHeader, SectionTitle } from '../../styled/globals'
import styled from 'styled-components'
import { OutputImageList } from './ImageList/OutputImageList'
import { SelectInput } from '../../inputs/SelectInput'
import { useState } from 'react'
import { MdArrowDownward, MdArrowUpward } from 'react-icons/md'

const sortOptions = [
  { label: 'File name', value: 'name' },
  { label: 'File size', value: 'size' },
]

export function Output() {
  const [sortOption, setSortOption] = useState<string>(sortOptions[0].value);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  function handleChange(value: string | number) {

    setSortOption(value as string);
  }

  return (
    <>
      <FixedTitle>
        <SectionHeader>
          <SectionTitle>Output</SectionTitle>
          <Sort>
            <span>Sort by:</span>
            <ButtonGroup>
              <SelectInput 
                value={sortOption} 
                onChange={handleChange}
                options={sortOptions}
                rightAligned
              />
              <Button 
                onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}>{
                  sortDirection === 'asc' 
                  ? <><MdArrowUpward/></>
                  : <><MdArrowDownward/></>
                }
              </Button>
            </ButtonGroup>
          </Sort>
        </SectionHeader>
      </FixedTitle>
      <Wrapper>
        <OutputImageList sortBy={sortOption} sortDir={sortDirection}/>
      </Wrapper>
    </>
  )
}

const FixedTitle = styled.div`
position: absolute;
z-index: 3;
background: ${props => `linear-gradient(to top, ${props.theme.backgroundTransparent}, ${props.theme.background} 85%)`};
backdrop-filter: blur(15px);
width: 100%;
`

const Wrapper = styled.div`
overflow-y: scroll;
height: calc(100%);
padding-top: 40px;
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

const ButtonGroup = styled.div`
display: flex;
& > {

  &:first-child {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0;
  }

  
  &:last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  &:not(:first-child) {
    margin-left: -1px;
  }

}
`