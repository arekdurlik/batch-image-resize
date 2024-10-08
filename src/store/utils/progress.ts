import { StoreApi, UseBoundStore } from 'zustand'

type Write<T, U> = Omit<T, keyof U> & U;
type StoreSubscribeWithSelector<T> = {
    subscribe: {
        (listener: (selectedState: T, previousSelectedState: T) => void): () => void;
        <U>(selector: (state: T) => U, listener: (selectedState: U, previousSelectedState: U) => void, options?: {
            equalityFn?: (a: U, b: U) => boolean;
            fireImmediately?: boolean;
        }): () => void;
    };
};

export type Progress = {
  totalItems: number,
  processedItems: number
};

export const initialProgress: Progress = {
  totalItems: 0,
  processedItems: 0
};

type HasProgress = { progress: Progress };
type Store = UseBoundStore<Write<StoreApi<HasProgress>, StoreSubscribeWithSelector<HasProgress>>>;

export function startProgress(store: Store, max: number) {
  let leftToProcess = max;

  store.setState(({ progress }) => ({
    progress: {
      ...progress,
      totalItems: progress.totalItems + max
    }
  }));

  const unsub = store.subscribe(state => state.progress, state => {
    if (state.processedItems >= state.totalItems) {
      setTimeout(() => {
        store.setState(({
          progress: {
            processedItems: 0,
            totalItems: 0
          }
        }));
      }, 150);
      unsub();
    }
  });

  return {
    advance: () => {
      leftToProcess--;

      store.setState(({ progress }) => ({
        progress: {
          ...progress,
          processedItems: progress.processedItems + 1
        }
      }));
    },
    cancel: () => {
      unsub();
      store.setState(({ progress }) => ({
        progress: {
          ...progress,
          totalItems: progress.totalItems - leftToProcess
        }
      }));
    }
  };
}
