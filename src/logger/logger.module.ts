import { Global, Module } from '@nestjs/common';
import { LoggerConfigModule } from 'src/config/logger/logger-config.module';
import { CustomLoggerService } from './custom-logger.service';

@Global()
@Module({
  imports: [LoggerConfigModule],
  providers: [CustomLoggerService],
  exports: [CustomLoggerService],
})
export class LoggerModule {}
