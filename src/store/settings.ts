import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Settings = {
    panelGroups: Record<'imageList' | 'rightSidebar', number[] | undefined>;
    api: {
        setPanelGroup: (key: keyof Settings['panelGroups'], value: number[]) => void;
    };
};

export const useSettings = create<Settings>()(
    persist(
        (set, get) => ({
            panelGroups: {
                imageList: undefined,
                rightSidebar: undefined,
            },
            api: {
                setPanelGroup(key, value) {
                    set({ panelGroups: { ...get().panelGroups, [key]: value } });
                },
            },
        }),
        {
            name: 'appSettings',
            partialize: state => {
                const { api, ...noApi } = state;
                return noApi;
            },
        }
    )
);
