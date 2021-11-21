import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { MulterConfigModule } from 'src/config/multer/multer-config.module';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule, MulterConfigModule],
  controllers: [HealthController],
})
export class HealthModule {}
