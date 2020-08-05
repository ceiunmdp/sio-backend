import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Environment } from 'src/common/enums/environment';
import { DatabaseConfigService } from './database-config.service';
import databaseConfig from './database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: path.resolve(process.cwd(), 'env', !ENV ? '.env' : `.env.${ENV}`),
      load: [databaseConfig],
      expandVariables: true,
      validationSchema: Joi.object({
        TYPEORM_CONNECTION: Joi.valid('mysql', 'postgres').default('mysql'),
        TYPEORM_HOST: Joi.alternatives(
          Joi.string().uri().required(),
          Joi.valid('localhost', 'mysql').default('localhost'),
        ),
        TYPEORM_PORT: Joi.number().min(1024).max(65535).default(3306),
        TYPEORM_USERNAME: Joi.string().required(),
        TYPEORM_PASSWORD: Joi.string().required(),
        TYPEORM_DATABASE: Joi.string().required(),
        TYPEORM_SYNCHRONIZE: Joi.boolean()
          .when('NODE_ENV', {
            is: Environment.PRODUCTION,
            then: Joi.valid(false),
            otherwise: Joi.valid(true, false),
          })
          .default(false),
        TYPEORM_LOGGING: Joi.boolean().default(false),
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
