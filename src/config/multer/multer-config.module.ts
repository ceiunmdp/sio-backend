import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as bytes from 'bytes';
import * as Joi from 'joi';
import { MulterConfigService } from './multer-config.service';
import multerConfig from './multer.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: path.resolve(process.cwd(), 'env', !ENV ? '.env' : `.env.${ENV}`),
      load: [multerConfig],
      expandVariables: true,
      validationSchema: Joi.object({
        MULTER_DEST: Joi.string().default('./files'),
        MULTER_LIMIT_FILE_SIZE: Joi.number() // [bytes]
          .min(bytes('1KB'))
          .max(bytes('200MB'))
          .default(bytes('100MB')),
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
