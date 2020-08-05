import { registerAs } from '@nestjs/config';

export default registerAs('multer', () => ({
  destination: process.env.MULTER_DEST,
  fileSize: process.env.MULTER_LIMIT_FILE_SIZE,
}));
