import camelcase from 'camelcase';
import { DateTime } from 'luxon';
import { extension } from 'mime-types';
import { extname } from 'path';

export const buildFilename = (filename: string, mimetype: string) => {
  filename = removeExtension(filename);
  filename = removeUnwantedCharacters(filename);
  return `${camelcase(filename)}-${DateTime.local().toMillis()}.${extension(mimetype)}`;
};

// const removeExtension = (str: string) => str.replace(/\.[^/.]+$/, '');
const removeExtension = (str: string) => str.replace(extname(str), '');

const removeUnwantedCharacters = (str: string) => str.replace(/[^a-zA-Z0-9 ]/g, '');
