import styled from 'styled-components'
import { ImperativePanelGroupHandle, Panel, PanelGroup } from 'react-resizable-panels'
import { Resizer } from './Resizer'
import { useRef } from 'react'
import { InputImageList } from './InputImageList'
import { OutputImageList } from './OutputImageList'

export function MainView() {
  const panelGroup = useRef<ImperativePanelGroupHandle>(null!);
  
  function handleReset() {
    panelGroup.current.setLayout([50, 50]);
  }

  return (
    <Wrapper>
      <PanelGroup ref={panelGroup} direction='vertical'>
        <Panel minSize={10}>
          <InputImageList/>
        </Panel>
        <Resizer direction='vertical' onReset={handleReset}/>
        <Panel minSize={10}>
          <OutputImageList/>
        </Panel>
      </PanelGroup>
    </Wrapper>
  )
}

const Wrapper = styled.div`
position: relative;
width: 100%;
display: flex;
flex-direction: column;
user-select: none;
height: 100%;
`