export const buildMapBasedOnProperty = <T>(collection: T[], property: keyof T) =>
  new Map(collection.map((element) => [element[property], element]));
