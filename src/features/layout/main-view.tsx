import { Panel } from 'react-resizable-panels';
import styled from 'styled-components';
import { InputImages } from '../images/input-images';
import { OutputImages } from '../images/output-images';
import { useStorage } from '../../store/storage';
import { PersistedPanelGroup, Resizer } from './persisted-panel-group';

export function MainView() {
    const { imageList } = useStorage(state => state.panelGroups);

    return (
        <Wrapper>
            <PersistedPanelGroup id="imageList" direction="vertical">
                <Panel minSize={10} defaultSize={imageList?.[0] ?? 50}>
                    <InputImages />
                </Panel>
                <Resizer />
                <Panel minSize={10} defaultSize={imageList?.[1] ?? 50}>
                    <OutputImages />
                </Panel>
            </PersistedPanelGroup>
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
