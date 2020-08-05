import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterConfigService } from './multer-config.service';
import multerConfig from './multer.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [multerConfig],
      expandVariables: true,
      validationSchema: Joi.object({
        MULTER_DEST: Joi.string().default('./files'),
        MULTER_LIMIT_FILE_SIZE: Joi.number() // [bytes]
          .min(1024)
          .max(209715200)
          .default(100 * 1024 ** 2), // Range = [1KB, 200MB], Default = 100 MB
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
