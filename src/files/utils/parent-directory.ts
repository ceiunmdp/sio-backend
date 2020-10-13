import { basename, dirname } from 'path';

export const parentDirectory = (path: string) => basename(dirname(path));
