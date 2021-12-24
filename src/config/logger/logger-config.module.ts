import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { Environment } from 'src/common/enums/environment.enum';
import { AppConfigModule } from '../app/app-config.module';
import { LoggerConfigService } from './logger-config.service';
import loggerConfig from './logger.config';

@Module({
  imports: [
    AppConfigModule,
    ConfigModule.forRoot({
      envFilePath: `env/${(process.env.NODE_ENV || 'local').toLowerCase()}.env`,
      load: [loggerConfig],
      expandVariables: true,
      validationSchema: Joi.object({
        LOGGER_DATE_PATTERN: Joi.when('NODE_ENV', {
          is: Environment.PRODUCTION,
          then: Joi.string().default('YYYY-MM-DD_HH'),
        }),
        LOGGER_DIRNAME: Joi.when('NODE_ENV', { is: Environment.PRODUCTION, then: Joi.string().default('./logs') }),
        LOGGER_FILES_MAX_SIZE: Joi.when('NODE_ENV', {
          is: Environment.PRODUCTION,
          then: Joi.string()
            .pattern(/^([1-9][0-9]*([k|m|g]?)$)/)
            .default('20m'),
        }),
        LOGGER_FILES_MAX_NUMBER: Joi.when('NODE_ENV', {
          is: Environment.PRODUCTION,
          then: Joi.number().min(1).max(30), //.default(7),
        }),
        LOGGER_FILES_MAX_DAYS: Joi.when('NODE_ENV', {
          is: Environment.PRODUCTION,
          then: Joi.string()
            .pattern(/^([1-9][0-9]*d$)/)
            .min(2) // 1d
            .max(3) // 99d
            .default('7d'),
        }),
        LOGGER_ZIPPED: Joi.when('NODE_ENV', { is: Environment.PRODUCTION, then: Joi.boolean().default(true) }),
      }).xor('LOGGER_FILES_MAX_NUMBER', 'LOGGER_FILES_MAX_DAYS'),
      // .when('NODE_ENV', {
      //     is: Environment.PRODUCTION,
      //     then: Joi.xor('LOGGER_FILES_MAX_NUMBER', 'LOGGER_FILES_MAX_DAYS')}),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
  ],
  providers: [LoggerConfigService],
  exports: [LoggerConfigService],
})
export class LoggerConfigModule {}
