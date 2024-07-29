export function insertSuffixToFilename(input: string, suffix: string) {
  const period = input.lastIndexOf('.');
  const filename = input.substring(0, period);
  const extension = input.substring(period);

  return filename + suffix + extension;
}

export function filenameToJpg(input: string) {
  const period = input.lastIndexOf('.');
  const filename = input.substring(0, period);

  return filename + '.jpg';
}

export function getFileExtension(filename: string) {
  const lastPeriod = filename.lastIndexOf('.');
  return filename.substring(lastPeriod + 1);
}

export function isJpg(filename: string) {
  return ['jpg', 'jpeg', 'jfif'].includes(getFileExtension(filename));
}

export function changeFilename(file: string, newFilename: string) {
  const lastPeriod = file.lastIndexOf('.');
  const extension = file.substring(lastPeriod);

  return newFilename + extension;
}

export function insertVariantDataToFilename(filename: string, prefix?: string, suffix?: string) {
  const period = filename.lastIndexOf('.');
  const newFilename = filename.substring(0, period);
  const extension = filename.substring(period);

  return prefix + newFilename + suffix + extension;
}

export function compare(a: string, b: string) {
  if ( a < b ) { return -1; }
  if ( a > b ) { return 1; }
  return 0;
}

export function compareTwo(a1: string, b1: string, a2: string, b2: string) {
  if ( a1 < b1 || a2 < b2 ) { return -1; }
  if ( a1 > b1 || a2 > b2 ) { return 1; }
  return 0;
}