import { registerAs } from '@nestjs/config';

export default registerAs('typeorm', () => ({
  connection: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  synchronize: process.env.TYPEORM_SYNCHRONIZE,
  logging: process.env.TYPEORM_LOGGING,
  logger: process.env.TYPEORM_LOGGER,
  connectionLimit: process.env.TYPEORM_CONNECTION_LIMIT,
}));
