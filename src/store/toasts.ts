import { create } from 'zustand';

export type Toast = {
    id: number;
    type: ToastType;
    message: string;
};

type ToastsState = {
    id: number;
    toasts: Toast[];
    api: {
        openToast: (type: ToastType, message: string) => void;
        closeToast: (id: number) => void;
    };
};

export enum ToastType {
    INFO = 'INFO',
    SUCCESS = 'SUCCESS',
    WARNING = 'WARNING',
    ERROR = 'ERROR',
}

export const useToasts = create<ToastsState>((set, get) => ({
    id: 0,
    toasts: [],
    api: {
        openToast: (type: ToastType, message: string) => {
            const id = get().id;
            const toasts = [...get().toasts];

            toasts.push({
                id,
                type,
                message,
            });

            set(() => ({ id: id + 1, toasts }));
        },
        closeToast: (id: number) => {
            const toasts = get().toasts.filter(toast => toast.id !== id);
            set(() => ({ toasts }));
        },
    },
}));

export const openToast = useToasts.getState().api.openToast;
