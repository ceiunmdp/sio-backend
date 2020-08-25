import { registerAs } from '@nestjs/config';

export default registerAs('typeorm', () => ({
  connection: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  logging: process.env.TYPEORM_LOGGING,
  logger: process.env.TYPEORM_LOGGER,
  maxQueryExecutionTime: process.env.TYPEORM_MAX_QUERY_EXECUTION_TIME,
  synchronize: process.env.TYPEORM_SYNCHRONIZE,
  migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN,
  migrations: process.env.TYPEORM_MIGRATIONS,
  migrationsDir: process.env.TYPEORM_MIGRATIONS_DIR,
  connectionLimit: process.env.TYPEORM_CONNECTION_LIMIT,
}));
