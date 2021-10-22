import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { PASSWORD_PATTERN } from 'src/common/constants/password-pattern.constant';
import { Database } from 'src/common/enums/database.enum';
import { Environment } from 'src/common/enums/environment.enum';
import { DatabaseConfigService } from './database-config.service';
import databaseConfig from './database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `env/${(process.env.NODE_ENV || 'local').toLowerCase()}.env`,
      load: [databaseConfig],
      expandVariables: true,
      validationSchema: Joi.object({
        TYPEORM_CONNECTION: Joi.valid(Database.MYSQL, Database.POSTGRES).default(Database.POSTGRES),
        TYPEORM_HOST: Joi.alternatives(
          Joi.string().uri().required(),
          Joi.valid('localhost', Database.MYSQL, Database.POSTGRES).default('localhost'),
        ),
        TYPEORM_PORT: Joi.number().min(1024).max(65535).default(5432),
        TYPEORM_USERNAME: Joi.string().required(),
        TYPEORM_PASSWORD: Joi.string().pattern(PASSWORD_PATTERN).required(),
        TYPEORM_DATABASE: Joi.string().required(),
        TYPEORM_SCHEMA: Joi.when('TYPEORM_CONNECTION', {
          is: Database.POSTGRES,
          then: Joi.string().required(),
          otherwise: Joi.optional(),
        }),
        TYPEORM_LOGGING: Joi.alternatives(
          Joi.boolean(),
          Joi.valid('all'),
          Joi.array()
            .items(Joi.string().valid('query', 'schema', 'error', 'warn', 'info', 'log', 'migration'))
            .min(1)
            .single(), //* Single values are wrapped in brackets (array)
        ).default(false),
        TYPEORM_LOGGER: Joi.when('TYPEORM_LOGGING', {
          is: Joi.not(false),
          then: Joi.when('NODE_ENV', {
            is: Environment.PRODUCTION,
            then: 'file',
            otherwise: Joi.valid('advanced-console', 'simple-console', 'file', 'debug').default('advanced-console'),
          }),
        }),
        TYPEORM_MAX_QUERY_EXECUTION_TIME: Joi.number().min(1000).max(5000).default(1000),
        TYPEORM_SYNCHRONIZE: Joi.boolean().when('NODE_ENV', {
          is: Environment.PRODUCTION,
          then: Joi.valid(false),
          otherwise: Joi.boolean().default(false),
        }),
        TYPEORM_MIGRATIONS_RUN: Joi.boolean().when('TYPEORM_SYNCHRONIZE', {
          is: true,
          then: Joi.valid(false),
          otherwise: Joi.boolean().default(false),
        }),
        TYPEORM_MIGRATIONS: Joi.string().when('TYPEORM_MIGRATIONS_RUN', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.string().default('database/migrations'),
        }),
        TYPEORM_MIGRATIONS_DIR: Joi.string().when('TYPEORM_MIGRATIONS_RUN', {
          is: true,
          then: Joi.required(),
          otherwise: Joi.string().default('database/migrations'),
        }),
        TYPEORM_CONNECTION_LIMIT: Joi.number().min(5).max(50).default(10),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
  ],
  providers: [DatabaseConfigService],
  exports: [DatabaseConfigService],
})
export class DatabaseConfigModule {}
