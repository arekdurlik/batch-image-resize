export const presetAspectRatios = [
    ['1:1', '1:1'],
    ['5:4', '4:5'],
    ['4:3', '3:4'],
    ['16:9', '9:16'],
    ['21:9', '9:21'],
];

export function isValidAspectRatio(string: string) {
    const split = string.split(':');
    return split.length === 2 && !isNaN(Number(split[0])) && !isNaN(Number(split[1]));
}

export function aspectRatioIsHorizontal(string: string) {
    const split = string.split(':');
    if (Number(split[0]) >= Number(split[1])) {
        return true;
    } else {
        return false;
    }
}
