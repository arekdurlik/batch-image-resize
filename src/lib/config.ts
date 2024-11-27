export const DEBUG_LEVEL = 10;

export const DEFAULT_CROP_SETTINGS = {
    x: 0.5,
    y: 0.5,
    zoom: 1,
    minZoom: 1,
};

export const DEFAULT_SHARPEN_DATA = {
    enabled: false,
    amount: 0,
    radius: 0.5,
    threshold: 0,
};

export type CropSettings = typeof DEFAULT_CROP_SETTINGS;
