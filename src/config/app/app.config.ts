import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.APP_ENV,
  scheme: process.env.APP_SCHEME,
  host: process.env.APP_HOST,
  port: process.env.APP_PORT,
}));
