import { create } from 'zustand'

export type ToastType = 'info' | 'success' | 'warning' | 'error';

type ToastsState = {
  id: number,
  toasts: {
    id: number,
    type: ToastType
    message: string
  }[],
  openToast: (type: ToastType, message: string) => void
  closeToast: (id: number) => void
};

export const useToastsState = create<ToastsState>((set, get) => ({
  id: 0,
  toasts: [],
  openToast: (type: ToastType, message: string) => {
    const id = get().id;

    const toasts = get().toasts;

    const lastToast = toasts[toasts.length - 1];

    
    if (lastToast?.type === type && lastToast?.message === message) {
      toasts.pop();
    }

    toasts.push({
      id,
      type,
      message
    });

    set(() => ({ id: id + 1, toasts }));

  },
  closeToast: (id: number) => {
    const toasts = get().toasts.filter(toast => toast.id !== id);
    set(() => ({ toasts }));
  }
}))