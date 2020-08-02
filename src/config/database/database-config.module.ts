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
        DB_TYPE: Joi.string().valid('mysql', 'postgres').default('mysql'),
        DB_HOST: Joi.string().default('localhost'),
        // .uri(),
        // .default('localhost'),
        DB_PORT: Joi.number().default(3306),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_NAME: Joi.string(),
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
