import { Panel } from 'react-resizable-panels';
import { LeftSidebar } from './features/layout/left-sidebar';
import { MainView } from './features/layout/main-view';
import { RightSidebar } from './features/layout/right-sidebar';
import { AppWrapper, AppContent } from './features/layout/styled';
import { Toasts } from './features/ui/toasts';
import { GlobalStyles } from './styles/global-styles';
import { useSettings } from './store/settings';
import { PersistedPanelGroup, Resizer } from './features/layout/persisted-panel-group';

const defaultLayout = [85, 15];

function App() {
    const { rightSidebar } = useSettings(state => state.panelGroups);

    return (
        <>
            <GlobalStyles />
            <Toasts />

            <AppWrapper>
                <AppContent>
                    <LeftSidebar />

                    <PersistedPanelGroup
                        id="rightSidebar"
                        direction="horizontal"
                        defaultLayout={defaultLayout}
                    >
                        <Panel defaultSize={rightSidebar?.[0] ?? defaultLayout[0]}>
                            <MainView />
                        </Panel>
                        <Resizer />
                        <Panel
                            minSize={19}
                            maxSize={30}
                            defaultSize={rightSidebar?.[1] ?? defaultLayout[1]}
                            style={{ minWidth: 305 }}
                        >
                            <RightSidebar />
                        </Panel>
                    </PersistedPanelGroup>
                </AppContent>
            </AppWrapper>
        </>
    );
}

export default App;
