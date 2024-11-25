import { useRef } from 'react'
import { ImperativePanelGroupHandle, Panel, PanelGroup } from 'react-resizable-panels'
import styled from 'styled-components'
import { LeftSidebar } from './features/layout/left-sidebar'
import { MainView } from './features/layout/main-view'
import { RightSidebar } from './features/layout/right-sidebar'
import { AppWrapper, AppContent } from './features/layout/styled'
import { Resizer } from './features/ui/resizer'
import { Toasts } from './features/ui/toasts'
import { GlobalStyles } from './styles/global-styles'

function App() {
  const panelGroup = useRef<ImperativePanelGroupHandle>(null!);

  function handleReset() {
    panelGroup.current.setLayout([85, 15]);
  }

  return (
    <>
      <GlobalStyles/>
      <Toasts/>

      <AppWrapper>
        <AppContent>
          <LeftSidebar/>
          
          <StyledPanelGroup ref={panelGroup} direction='horizontal'>
            <Panel>
              <MainView/>
            </Panel>
            <Resizer direction='horizontal' onReset={handleReset}/>
            <Panel minSize={19} maxSize={30} defaultSize={19} style={{ minWidth: 305 }}>
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
