import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseConfigService } from './firebase-config.service';
import firebaseConfig from './firebase.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: path.resolve(process.cwd(), 'env', !ENV ? '.env' : `.env.${ENV}`),
      load: [firebaseConfig],
      expandVariables: true,
    }),
  ],
  providers: [FirebaseConfigService],
  exports: [FirebaseConfigService],
})
export class FirebaseConfigModule {}
