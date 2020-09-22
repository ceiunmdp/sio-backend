import camelcase from 'camelcase';
import { DateTime } from 'luxon';
import * as mime from 'mime-types';
import * as path from 'path';

export const buildFilename = (filename: string, mimetype: string) => {
  filename = removeExtension(filename);
  filename = removeUnwantedCharacters(filename);
  return `${camelcase(filename)}-${DateTime.local().toMillis()}.${mime.extension(mimetype)}`;
};

// const removeExtension = (str: string) => str.replace(/\.[^/.]+$/, '');
const removeExtension = (str: string) => str.replace(path.extname(str), '');

const removeUnwantedCharacters = (str: string) => str.replace(/[^a-zA-Z0-9 ]/g, '');
