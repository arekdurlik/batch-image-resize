import { hasDuplicate } from '../../../helpers';
import { PicaFilter, Variant } from '../../../store/types';
import {
    defaultVariantSettings,
    SHARPEN_AMOUNT_MAX,
    SHARPEN_AMOUNT_MIN,
    SHARPEN_RADIUS_MAX,
    SHARPEN_RADIUS_MIN,
    SHARPEN_THRESHOLD_MAX,
    SHARPEN_THRESHOLD_MIN,
} from '../../../store/variants/utils';
import { DimensionMode } from '../../../types';
import { isValidAspectRatio } from './variant/settings/utils';

function isDimension(obj: unknown): obj is { mode: DimensionMode; value?: number } {
    return (
        obj !== null &&
        typeof obj === 'object' &&
        'mode' in obj &&
        typeof obj.mode === 'string' &&
        (obj.mode === 'exact' || obj.mode === 'upto') &&
        ('value' in obj ? obj.value === undefined || typeof obj.value === 'number' : true)
    );
}

function isAspectRatio(obj: unknown): obj is { enabled: boolean; value: string } {
    return (
        obj !== null &&
        typeof obj === 'object' &&
        'enabled' in obj &&
        'value' in obj &&
        typeof obj.enabled === 'boolean' &&
        typeof obj.value === 'string'
    );
}

function isPicaFilter(obj: unknown): obj is PicaFilter {
    return (
        typeof obj === 'string' &&
        ['lanczos3', 'box', 'hamming', 'lanczos2', 'mks2013'].includes(obj)
    );
}

function isVariant(obj: Record<string, unknown>): obj is Variant {
    return (
        obj !== null &&
        typeof obj === 'object' &&
        typeof obj.id === 'string' &&
        typeof obj.index === 'number' &&
        typeof obj.name === 'string' &&
        (obj.width === undefined || isDimension(obj.width)) &&
        (obj.height === undefined || isDimension(obj.height)) &&
        (obj.prefix === undefined || typeof obj.prefix === 'string') &&
        (obj.suffix === undefined || typeof obj.suffix === 'string') &&
        (obj.crop === undefined || typeof obj.crop === 'boolean') &&
        (obj.filter === undefined || isPicaFilter(obj.filter)) &&
        (obj.quality === undefined || typeof obj.quality === 'number') &&
        (obj.sharpenAmount === undefined || typeof obj.sharpenAmount === 'number') &&
        (obj.sharpenRadius === undefined || typeof obj.sharpenRadius === 'number') &&
        (obj.sharpenThreshold === undefined || typeof obj.sharpenThreshold === 'number') &&
        (obj.aspectRatio === undefined || isAspectRatio(obj.aspectRatio))
    );
}

export function validateJSONVariants(json: string): Variant[] {
    let variants;

    try {
        variants = JSON.parse(json);
    } catch {
        throw new Error(
            'The file is not valid JSON. Please upload a properly formatted JSON file.'
        );
    }

    if (!Array.isArray(variants) || !variants.length || !variants.every(isVariant)) {
        throw new Error(
            'The data in the file is invalid. Please check the variant settings and try again.'
        );
    }

    return variants;
}

export function validateVariants(variants: Variant[]): boolean {
    variants.forEach((variant, index) => {
        const intro = `Invalid data in variant No. ${index + 1}. `;

        if (hasDuplicate(variants, 'id')) {
            throw new Error(intro + 'Variant IDs must be unique.');
        }

        if (hasDuplicate(variants, 'index')) {
            throw new Error(intro + 'Variant indexes must be unique.');
        }

        if (variant.quality && (variant.quality < 0 || variant.quality > 1)) {
            throw new Error(intro + 'Quality must be between 0 and 1.');
        }

        if (
            variant.sharpenAmount &&
            (variant.sharpenAmount < SHARPEN_AMOUNT_MIN ||
                variant.sharpenAmount > SHARPEN_AMOUNT_MAX)
        ) {
            throw new Error(
                intro +
                    `Sharpen amount must be between ${SHARPEN_AMOUNT_MIN} and ${SHARPEN_AMOUNT_MAX}.`
            );
        }

        if (
            variant.sharpenRadius &&
            (variant.sharpenRadius < SHARPEN_RADIUS_MIN ||
                variant.sharpenRadius > SHARPEN_RADIUS_MAX)
        ) {
            throw new Error(
                intro +
                    `Sharpen radius must be between ${SHARPEN_RADIUS_MIN} and ${SHARPEN_RADIUS_MAX}.`
            );
        }

        if (
            variant.sharpenThreshold &&
            (variant.sharpenThreshold < SHARPEN_THRESHOLD_MIN ||
                variant.sharpenThreshold > SHARPEN_THRESHOLD_MAX)
        ) {
            throw new Error(
                intro +
                    `Sharpen threshold must be between ${SHARPEN_THRESHOLD_MIN} and ${SHARPEN_THRESHOLD_MAX}.`
            );
        }

        if (variant.width?.value !== undefined && variant.width.value < 0) {
            throw new Error(intro + 'Width must be greater than or equal to 0.');
        }

        if (variant.height?.value !== undefined && variant.height.value < 0) {
            throw new Error(intro + 'Height must be greater than or equal to 0.');
        }

        if (variant.aspectRatio?.value && !isValidAspectRatio(variant.aspectRatio.value)) {
            throw new Error(intro + 'Aspect ratio is invalid.');
        }

        if (variant.aspectRatio?.enabled) {
            if (variant.width?.value === undefined || variant.height?.value === undefined) {
                throw new Error(
                    intro +
                        'Both width and height values must be provided when aspect ratio is enabled.'
                );
            }

            if (variant.width?.mode !== variant.height?.mode) {
                throw new Error(
                    intro +
                        'Both width and height must have the same mode when aspect ratio is enabled.'
                );
            }
        }
    });

    return true;
}

export function mapToFullVariant(variant: Variant): Variant {
    return {
        ...defaultVariantSettings,
        ...variant,
        id: variant.id,
        index: variant.index,
        name: variant.name,
    };
}
