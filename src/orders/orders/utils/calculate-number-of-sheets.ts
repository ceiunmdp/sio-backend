export const calculateNumberOfSheets = (numberOfSheets: number, doubleSided: boolean, slidesPerSheet: number) =>
  Math.ceil(numberOfSheets / slidesPerSheet / (doubleSided ? 2 : 1));
