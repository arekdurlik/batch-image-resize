import styled from 'styled-components'
import { Input } from './Input'
import { Output } from './Output'
import { ImperativePanelGroupHandle, Panel, PanelGroup } from 'react-resizable-panels'
import { Resizer } from './Resizer'
import { useRef } from 'react'

export function MainView() {
  const panelGroup = useRef<ImperativePanelGroupHandle>(null!);
  
  function handleReset() {
    panelGroup.current.setLayout([50, 50]);
  }

  return <Wrapper>
    <PanelGroup ref={panelGroup} direction="vertical">
      <Panel minSize={10}>
        <Input/>
      </Panel>
      <Resizer onReset={handleReset}/>
      <Panel minSize={10}>
        <Output/>
      </Panel>
    </PanelGroup>
  </Wrapper>
}

const Wrapper = styled.div`
position: relative;
width: 100%;
padding-top: 40px;
display: flex;
flex-direction: column;
user-select: none;
height: 100%;
`
