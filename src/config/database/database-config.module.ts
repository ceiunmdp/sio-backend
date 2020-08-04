import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfigService } from './database-config.service';
import databaseConfig from './database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      // isGlobal: true, // No need to import ConfigModule in other modules once it's been loaded in the root module
      // envFilePath: '.development.env',
      load: [databaseConfig],
      expandVariables: true,
      validationSchema: Joi.object({
        DB_TYPE: Joi.valid('mysql', 'postgres').default('mysql'),
        DB_HOST: Joi.alternatives(Joi.string().uri().required(), Joi.valid('localhost', 'mysql').default('localhost')),
        DB_PORT: Joi.number().min(1024).max(65535).default(3306),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
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
