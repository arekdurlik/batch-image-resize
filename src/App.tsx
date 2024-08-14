import { GlobalStyles } from './styles/globalStyles'
import { Navbar } from './components/layout/Navbar'
import { MainView } from './components/layout/MainView'
import { Toasts } from './components/Toasts'
import { RightSidebar } from './components/layout/RightSidebar'
import { LeftSidebar } from './components/layout/LeftSidebar'
import { AppContent, AppWrapper } from './components/styled'
import { useRef } from 'react'
import { ImperativePanelGroupHandle, Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import styled from 'styled-components'
import { Resizer } from './components/layout/MainView/Resizer'

function App() {
  const panelGroup = useRef<ImperativePanelGroupHandle>(null!);

  function handleReset() {
    panelGroup.current.setLayout([80, 20]);
  }

  return (
    <>
      <GlobalStyles/>
      <Toasts/>

      <AppWrapper>
        <Navbar/>
        <AppContent>
          <LeftSidebar/>
          
          <StyledPanelGroup ref={panelGroup} direction='horizontal'>
          <Panel>
            <MainView/>
          </Panel>
          <Resizer direction='horizontal' onReset={handleReset}/>
          <Panel minSize={15} maxSize={30} defaultSize={20}>
            <RightSidebar/>
          </Panel>
          </StyledPanelGroup>

        </AppContent>
      </AppWrapper>
    </>
  )
}

export default App;

const StyledPanelGroup = styled(PanelGroup)`
width: 100%;
`