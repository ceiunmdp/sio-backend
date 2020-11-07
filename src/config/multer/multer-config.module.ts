import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { ParametersModule } from '../parameters/parameters.module';
import { MulterConfigService } from './multer-config.service';
import multerConfig from './multer.config';
@Module({
  imports: [
    ParametersModule,
    ConfigModule.forRoot({
      // envFilePath: path.resolve(process.cwd(), 'env', !ENV ? '.env' : `.env.${ENV}`),
      load: [multerConfig],
      expandVariables: true,
      validationSchema: Joi.object({
        MULTER_DEST: Joi.string().default('files'),
        TEMPORARY_FILES_DIRECTORY: Joi.string().default('temporary'),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
  ],
  providers: [MulterConfigService],
  exports: [MulterConfigService],
})
export class MulterConfigModule {}
