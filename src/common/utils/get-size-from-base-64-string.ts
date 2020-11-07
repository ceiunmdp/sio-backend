export const getSizeFromBase64String = (str: string) => ((4 * str.length) / 3 + 3) & ~3;
