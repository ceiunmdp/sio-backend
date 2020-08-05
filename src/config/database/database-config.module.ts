import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Environment } from 'src/common/enums/environment';
import { DatabaseConfigService } from './database-config.service';
import databaseConfig from './database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
      expandVariables: true,
      validationSchema: Joi.object({
        DB_TYPE: Joi.valid('mysql', 'postgres').default('mysql'),
        DB_HOST: Joi.alternatives(Joi.string().uri().required(), Joi.valid('localhost', 'mysql').default('localhost')),
        DB_PORT: Joi.number().min(1024).max(65535).default(3306),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNCHRONIZE: Joi.boolean()
          .when('APP_ENV', {
            is: Environment.PRODUCTION,
            then: Joi.valid(false),
            otherwise: Joi.valid(true, false),
          })
          .default(false),
        DB_CONNECTION_LIMIT: Joi.number().min(5).max(50).default(10),
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
