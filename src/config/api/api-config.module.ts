import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiConfigService } from './api-config.service';
import apiRateConfig from './api-rate.config';
import apiSpeedConfig from './api-speed.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [apiRateConfig, apiSpeedConfig],
      expandVariables: true,
      validationSchema: Joi.object({
        API_LIMITER_TIMEFRAME: Joi.number().default(60 * 60 * 1000), // 60 min
        API_LIMITER_MAX_CONNECTIONS: Joi.number().default(500),
        API_SPEED_LIMITER_TIMEFRAME: Joi.number().default(30 * 60 * 1000), // 30 min
        API_SPEED_LIMITER_DELAY_AFTER: Joi.number().default(400),
        API_SPEED_LIMITER_DELAY_MS: Joi.number().max(1000).default(500),
        API_SPEED_LIMITER_MAX_DELAY_MS: Joi.number().max(30000).default(20000),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
  ],
  providers: [ApiConfigService],
  exports: [ApiConfigService],
})
export class ApiConfigModule {}
