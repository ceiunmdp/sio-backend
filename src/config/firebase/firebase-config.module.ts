import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { FirebaseConfigService } from './firebase-config.service';
import firebaseConfig from './firebase.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `env/${(process.env.NODE_ENV || 'local').toLowerCase()}.env`,
      load: [firebaseConfig],
      expandVariables: true,
      validationSchema: Joi.object({
        FIREBASE_API_KEY: Joi.string().required(),
        GOOGLE_APPLICATION_CREDENTIALS: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
  ],
  providers: [FirebaseConfigService],
  exports: [FirebaseConfigService],
})
export class FirebaseConfigModule {}
