import { useOutputImages } from '../output-images';

let regenerateTimeout: NodeJS.Timeout;
const REGENERATE_TIMEOUT = 50;

export function regenerateVariant(variantId: string) {
    clearTimeout(regenerateTimeout);
    regenerateTimeout = setTimeout(() => {
        useOutputImages.getState().api.regenerateVariant(variantId);
    }, REGENERATE_TIMEOUT);
}
