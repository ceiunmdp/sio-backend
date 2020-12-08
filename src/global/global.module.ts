import { Global, Module } from '@nestjs/common';
import { LoggerConfigModule } from 'src/config/logger/logger-config.module';
import { CustomLoggerService } from './custom-logger.service';
import { FirebaseErrorHandlerService } from './firebase-error-handler.service';

@Global()
@Module({
  imports: [LoggerConfigModule],
  providers: [CustomLoggerService, FirebaseErrorHandlerService],
  exports: [CustomLoggerService, FirebaseErrorHandlerService],
})
export class GlobalModule {}
