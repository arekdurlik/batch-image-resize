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