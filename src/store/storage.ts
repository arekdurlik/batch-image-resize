import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Variant } from './types';
import { useVariants } from './variants/variants';

export type Storage = {
    panelGroups: Record<'imageList' | 'rightSidebar', number[] | undefined>;
    variants: Variant[];
    settings: {
        storeVariants: boolean;
    };
    api: {
        toggleStoreVariants: () => void;
        setVariants: (variants: Variant[]) => void;
        setPanelGroup: (key: keyof Storage['panelGroups'], value: number[]) => void;
    };
};

export const useStorage = create<Storage>()(
    persist(
        (set, get) => ({
            panelGroups: {
                imageList: undefined,
                rightSidebar: undefined,
            },
            variants: [],
            settings: {
                storeVariants: false,
            },
            api: {
                toggleStoreVariants() {
                    const newValue = !get().settings.storeVariants;
                    set({
                        settings: {
                            ...get().settings,
                            storeVariants: newValue,
                        },
                        variants: newValue ? useVariants.getState().variants : [],
                    });
                },
                setVariants(variants) {
                    set({ variants });
                },
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
