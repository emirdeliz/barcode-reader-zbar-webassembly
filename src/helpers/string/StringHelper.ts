export const splitStringBySegmentLength = (
  source: string,
  skipCharacterIndex = 0,
  segmentLength: number
) => {
  const chunks = [] as Array<string>;
  for (
    let i = 0, charsLength = source.length;
    i < charsLength;
    i += segmentLength + skipCharacterIndex
  ) {
    chunks.push(source.substring(i, i + segmentLength));
  }
  return chunks;
};

export const replaceByIndex = (
  target: string,
  replaceTo: string,
  startIndex: number,
  endIndex: number
) => {
  if (startIndex < 0 || endIndex > target.length) {
    return target;
  }

  return `${target.substring(0, startIndex)}${replaceTo}${target.substring(
    endIndex
  )}`;
}

export const removeSpecialCaracteres = (str: string) => {
  return (str || '')
    .replaceAll(' ', '')
    .replaceAll('.', '')
    .replaceAll(/[^a-zA-Z0-9.]/g, '');
};

export const getNumbersOfString = (str: string) => {
  return (str || '').replace(/\D/g, '');
};
