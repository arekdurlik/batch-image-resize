import { useRef } from 'react';
import { ImperativePanelGroupHandle, PanelGroup, Panel } from 'react-resizable-panels';
import styled from 'styled-components';
import { InputImages } from '../images/input-images';
import { OutputImages } from '../images/output-images';
import { Resizer } from '../ui/resizer';

export function MainView() {
    const panelGroup = useRef<ImperativePanelGroupHandle>(null!);

    function handleReset() {
        panelGroup.current.setLayout([50, 50]);
    }

    return (
        <Wrapper>
            <PanelGroup ref={panelGroup} direction="vertical">
                <Panel minSize={10}>
                    <InputImages />
                </Panel>
                <Resizer direction="vertical" onReset={handleReset} />
                <Panel minSize={10}>
                    <OutputImages />
                </Panel>
            </PanelGroup>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    height: 100%;
`;
