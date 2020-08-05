import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Environment } from 'src/common/enums/environment';
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
        GOOGLE_APPLICATION_CREDENTIALS: Joi.string().required(),
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
