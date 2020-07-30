import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './app-config.service';
import appConfig from './app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      // isGlobal: true, // No need to import ConfigModule in other modules once it's been loaded in the root module
      // envFilePath: '.development.env',
      load: [appConfig],
      expandVariables: true,
      validationSchema: Joi.object({
        APP_ENV: Joi.string().valid('development', 'production', 'test', 'provision').default('development'),
        APP_URL: Joi.string(),
        APP_PORT: Joi.number().default(3000),
        GOOGLE_APPLICATION_CREDENTIALS: Joi.string(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
