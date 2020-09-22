import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { CoursesModule } from 'src/faculty-entities/courses/courses.module';
import { ParametersModule } from '../parameters/parameters.module';
import { MulterConfigService } from './multer-config.service';
import multerConfig from './multer.config';
@Module({
  imports: [
    CoursesModule,
    ParametersModule,
    ConfigModule.forRoot({
      // envFilePath: path.resolve(process.cwd(), 'env', !ENV ? '.env' : `.env.${ENV}`),
      load: [multerConfig],
      expandVariables: true,
      validationSchema: Joi.object({
        MULTER_DEST: Joi.string().default('./files'),
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
