import { difference } from '../../../lib/helpers';
import { Alignment } from './types';

export function getAlignment(listRect: DOMRect, actuatorRect: DOMRect, align: Alignment) {
    let alignment = 0;

    if (align !== 'left') {
        const diff = difference(listRect.width, actuatorRect.width);

        if (align === 'center') {
            alignment -= diff / 2;
        } else {
            alignment -= diff;
        }
    }

    return alignment;
}
