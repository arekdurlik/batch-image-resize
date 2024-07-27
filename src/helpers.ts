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
  return filename.substring(lastPeriod);
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