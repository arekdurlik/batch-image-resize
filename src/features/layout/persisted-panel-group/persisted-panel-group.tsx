import { createContext, ReactNode, useContext, useRef } from 'react';
import { PanelGroup, ImperativePanelGroupHandle } from 'react-resizable-panels';
import { useSettings, type Settings } from '../../../store/settings';

type Props = {
    id: keyof Settings['panelGroups'];
    direction: 'horizontal' | 'vertical';
    defaultLayout?: number[];
    children: ReactNode;
};

type PanelGroupContext = {
    direction: 'horizontal' | 'vertical';
    layout: number[];
    setLayout: (newLayout: number[]) => void;
    resetLayout: () => void;
    saveLayout: () => void;
};

const PanelGroupContext = createContext<PanelGroupContext | undefined>(undefined);

export const usePanelGroup = () => {
    const context = useContext(PanelGroupContext);
    if (!context) {
        throw new Error('usePanelGroup must be used within a PersistedPanelGroup');
    }
    return context;
};

export function PersistedPanelGroup({ id, direction, defaultLayout = [50, 50], children }: Props) {
    const ref = useRef<ImperativePanelGroupHandle>(null!);
    const settings = useSettings();

    function handleSetLayout(newLayout: number[]) {
        ref.current.setLayout(newLayout);
        save();
    }

    function handleResetLayout() {
        ref.current.setLayout(defaultLayout);
        save();
    }

    function save() {
        settings.api.setPanelGroup(id, ref.current.getLayout());
    }

    return (
        <PanelGroupContext.Provider
            value={{
                direction,
                layout: ref.current?.getLayout(),
                setLayout: handleSetLayout,
                resetLayout: handleResetLayout,
                saveLayout: save,
            }}
        >
            <PanelGroup ref={ref} direction={direction}>
                {children}
            </PanelGroup>
        </PanelGroupContext.Provider>
    );
}
