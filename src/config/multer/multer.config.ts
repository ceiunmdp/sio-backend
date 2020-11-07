import { registerAs } from '@nestjs/config';

export default registerAs('multer', () => ({
  destination: process.env.MULTER_DEST,
  temporaryFilesDirectory: process.env.TEMPORARY_FILES_DIRECTORY,
}));
