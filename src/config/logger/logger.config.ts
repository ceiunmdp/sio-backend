import { registerAs } from '@nestjs/config';

export default registerAs('logger', () => ({
  datePattern: process.env.LOGGER_DATE_PATTERN,
  dirname: process.env.LOGGER_DIRNAME,
  maxSize: process.env.LOGGER_FILES_MAX_SIZE,
  maxFiles: process.env.LOGGER_FILES_MAX_NUMBER,
  maxDays: process.env.LOGGER_FILES_MAX_DAYS,
  zipped: process.env.LOGGER_ZIPPED,
}));
