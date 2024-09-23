export function clamp(a: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, a));
}

/**
 * @returns a blend between x and y, based on a fraction a
 */
export function lerp(x: number, y: number, a: number) {
  return x * (1 - a) + y * a;
}

/**
 * @returns a fraction a, based on a value between x and y
 */
export function invlerp(x: number, y: number, a: number) {
  return clamp((a - x) / (y - x));
}

export function countDecimals(value: string) {
  if (value.indexOf(".") !== -1) {
    return value.split(".")[1].length || 0;
  } else {
    return 0;
  }
}
