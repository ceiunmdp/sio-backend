import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { PASSWORD_PATTERN } from 'src/common/constants/password-pattern.constant';
import { Environment } from 'src/common/enums/environment.enum';
import { AppConfigService } from './app-config.service';
import appConfig from './app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      // isGlobal: true, // No need to import ConfigModule in other modules once it's been loaded in the root module
      // envFilePath: path.resolve(process.cwd(), 'env', !ENV ? '.env' : `.env.${ENV}`),
      load: [appConfig],
      expandVariables: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.valid(Environment.DEVELOPMENT, Environment.TESTING, Environment.PRODUCTION).default(
          Environment.DEVELOPMENT,
        ),
        APP_SCHEME: Joi.valid('http', 'https').default('http'),
        APP_HOST: Joi.alternatives(Joi.string().domain().required(), Joi.valid('localhost').default('localhost')),
        APP_PORT: Joi.number().min(1024).max(65535).default(3000),
        APP_ADMIN_DEFAULT_EMAIL: Joi.string().email().required(),
        APP_ADMIN_DEFAULT_PASSWORD: Joi.string().pattern(PASSWORD_PATTERN).required(),
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
