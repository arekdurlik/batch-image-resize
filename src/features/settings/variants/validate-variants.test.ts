import { describe, it, expect } from 'vitest';
import { validateJSONVariants, validateVariants } from './utils';
import { Variant } from '../../../store/types';
import {
    getDefaultVariantSettings,
    QUALITY_MAX,
    QUALITY_MIN,
    SHARPEN_AMOUNT_MAX,
    SHARPEN_AMOUNT_MIN,
    SHARPEN_RADIUS_MAX,
    SHARPEN_RADIUS_MIN,
    SHARPEN_THRESHOLD_MAX,
    SHARPEN_THRESHOLD_MIN,
} from '../../../store/variants/utils';

const minRequired = {
    id: '1',
    name: 'Variant A',
};

describe('validate variants json', () => {
    it('should validate a minimum valid variant JSON', () => {
        const json = JSON.stringify([{ id: '1', name: 'Variant A' }]);

        expect(() => validateJSONVariants(json)).not.toThrow();
    });

    it('should validate a maximum valid variant JSON', () => {
        const json = JSON.stringify([
            {
                ...minRequired,
                ...getDefaultVariantSettings(),
            },
        ]);

        expect(() => validateJSONVariants(json)).not.toThrow();
    });

    it('should ignore additional fields in a maximum valid variant JSON', () => {
        const json = JSON.stringify([
            {
                ...minRequired,
                ...getDefaultVariantSettings(),
                extraField: 'ignored',
            },
        ]);

        expect(() => validateJSONVariants(json)).not.toThrow();
    });

    it('should throw an error for missing required fields', () => {
        const json = JSON.stringify([{ name: 'Variant A' }]);

        expect(() => validateJSONVariants(json)).toThrow();
    });
});

describe('validate variants', () => {
    it('should throw an error if there are duplicate IDs in the array of variants', () => {
        const variants = [
            { id: 'duplicateId1', name: 'Variant 1' },
            { id: 'duplicateId1', name: 'Variant 2' },
        ] as Variant[];

        expect(() => validateVariants(variants)).toThrow();
    });

    it('should validate if all IDs in the array are unique', () => {
        const variants = [
            { id: 'uniqueId1', name: 'Variant 1' },
            { id: 'uniqueId2', name: 'Variant 2' },
        ] as Variant[];

        expect(() => validateVariants(variants)).not.toThrow();
    });

    it('should only accept quality values within range', () => {
        const valid = [{ ...minRequired, quality: QUALITY_MIN }] as Variant[];
        expect(() => validateVariants(valid)).not.toThrow();

        const tooLow = [{ ...minRequired, quality: QUALITY_MIN - 1 }] as Variant[];
        expect(() => validateVariants(tooLow)).toThrow(/quality/i);

        const tooHigh = [{ ...minRequired, quality: QUALITY_MAX + 1 }] as Variant[];
        expect(() => validateVariants(tooHigh)).toThrow(/quality/i);
    });

    it('should only accept sharpen amount values within range', () => {
        const valid = [{ ...minRequired, sharpenAmount: SHARPEN_AMOUNT_MIN }] as Variant[];
        expect(() => validateVariants(valid)).not.toThrow();

        const tooLow = [{ ...minRequired, sharpenAmount: SHARPEN_AMOUNT_MIN - 1 }] as Variant[];
        expect(() => validateVariants(tooLow)).toThrow(/sharpen amount/i);

        const tooHigh = [{ ...minRequired, sharpenAmount: SHARPEN_AMOUNT_MAX + 1 }] as Variant[];
        expect(() => validateVariants(tooHigh)).toThrow(/sharpen amount/i);
    });

    it('should only accept sharpen radius values within range', () => {
        const valid = [{ ...minRequired, sharpenRadius: SHARPEN_RADIUS_MIN }] as Variant[];
        expect(() => validateVariants(valid)).not.toThrow();

        const tooLow = [{ ...minRequired, sharpenRadius: SHARPEN_RADIUS_MIN - 1 }] as Variant[];
        expect(() => validateVariants(tooLow)).toThrow(/sharpen radius/i);

        const tooHigh = [{ ...minRequired, sharpenRadius: SHARPEN_RADIUS_MAX + 1 }] as Variant[];
        expect(() => validateVariants(tooHigh)).toThrow(/sharpen radius/i);
    });

    it('should only accept sharpen threshold values within range', () => {
        const valid = [{ ...minRequired, sharpenThreshold: SHARPEN_THRESHOLD_MIN }] as Variant[];
        expect(() => validateVariants(valid)).not.toThrow();

        const tooLow = [
            { ...minRequired, sharpenThreshold: SHARPEN_THRESHOLD_MIN - 1 },
        ] as Variant[];
        expect(() => validateVariants(tooLow)).toThrow(/sharpen threshold/i);

        const tooHigh = [
            { ...minRequired, sharpenThreshold: SHARPEN_THRESHOLD_MAX + 1 },
        ] as Variant[];
        expect(() => validateVariants(tooHigh)).toThrow(/sharpen threshold/i);
    });

    it('should require, when aspect ratio is enabled, that both dimension modes are the same and both dimension values are present', () => {
        const valid1 = [
            {
                ...minRequired,
                width: { mode: 'exact', value: 100 },
                height: { mode: 'exact', value: 100 },
                aspectRatio: { enabled: true, value: '1:1' },
            },
        ] as Variant[];
        expect(() => validateVariants(valid1)).not.toThrow();

        const valid2 = [
            {
                ...minRequired,
                width: { mode: 'upto', value: 100 },
                height: { mode: 'upto', value: 100 },
                aspectRatio: { enabled: true, value: '1:1' },
            },
        ] as Variant[];
        expect(() => validateVariants(valid2)).not.toThrow();

        const invalid1 = [
            {
                ...minRequired,
                width: { mode: 'exact', value: 100 },
                height: { mode: 'upto', value: 100 },
                aspectRatio: { enabled: true, value: '1:1' },
            },
        ] as Variant[];
        expect(() => validateVariants(invalid1)).toThrow();

        const invalid2 = [
            {
                ...minRequired,
                width: { mode: 'exact', value: 100 },
                height: { mode: 'exact' },
                aspectRatio: { enabled: true, value: '1:1' },
            },
        ] as Variant[];
        expect(() => validateVariants(invalid2)).toThrow();

        const invalid3 = [
            {
                ...minRequired,
                width: { mode: 'exact', value: 100 },
                aspectRatio: { enabled: true, value: '1:1' },
            },
        ] as Variant[];
        expect(() => validateVariants(invalid3)).toThrow();
    });

    it('should only accept valid aspect ratio values', () => {
        const valid = [
            {
                ...minRequired,
                width: { mode: 'exact', value: 100 },
                height: { mode: 'exact', value: 100 },
                aspectRatio: { enabled: true, value: '1:1' },
            },
        ] as Variant[];
        expect(() => validateVariants(valid)).not.toThrow();

        const invalid = [
            {
                ...minRequired,
                width: { mode: 'exact', value: 100 },
                height: { mode: 'exact', value: 100 },
                aspectRatio: { enabled: true, value: '12' },
            },
            {
                ...minRequired,
                width: { mode: 'exact', value: 100 },
                height: { mode: 'exact', value: 100 },
                aspectRatio: { enabled: true, value: 'x' },
            },
        ] as Variant[];
        expect(() => validateVariants(invalid)).toThrow();
    });
});
